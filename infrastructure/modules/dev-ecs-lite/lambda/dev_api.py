import base64
import json
import os
import time
import urllib.request

import boto3

REGION = os.environ["AWS_REGION"]
EC2_INSTANCE_ID = os.environ["EC2_INSTANCE_ID"]
ECS_CLUSTER_ARN = os.environ["ECS_CLUSTER_ARN"]
ECS_SERVICE_NAME = os.environ["ECS_SERVICE_NAME"]
DDB_TABLE_NAME = os.environ["DDB_TABLE_NAME"]
IDLE_TIMEOUT_SEC = int(os.environ.get("IDLE_TIMEOUT_SEC", "3600"))
ELASTIC_IP = os.environ.get("ELASTIC_IP", "")
WAKE_USER = os.environ.get("WAKE_USER", "admin")
WAKE_PASS = os.environ.get("WAKE_PASS", "1q2w3e4r")

_ec2 = boto3.client("ec2", region_name=REGION)
_ecs = boto3.client("ecs", region_name=REGION)
_ddb = boto3.client("dynamodb", region_name=REGION)


def _resp(status_code: int, body: dict, headers: dict | None = None):
    h = {
        "content-type": "application/json",
        "cache-control": "no-store",
    }
    if headers:
        h.update(headers)

    return {
        "statusCode": status_code,
        "headers": h,
        "body": json.dumps(body),
    }


def _unauthorized():
    return _resp(
        401,
        {"error": "Unauthorized"},
        {"www-authenticate": 'Basic realm="dev-wake"'},
    )


def _parse_basic_auth(headers: dict) -> tuple[str, str] | None:
    auth = headers.get("authorization") or headers.get("Authorization")
    if not auth:
        return None
    parts = auth.split(" ", 1)
    if len(parts) != 2:
        return None
    scheme, value = parts
    if scheme.lower() != "basic":
        return None
    try:
        decoded = base64.b64decode(value).decode("utf-8")
        if ":" not in decoded:
            return None
        user, pw = decoded.split(":", 1)
        return user, pw
    except Exception:
        return None


def _get_instance_state() -> str:
    resp = _ec2.describe_instances(InstanceIds=[EC2_INSTANCE_ID])
    reservations = resp.get("Reservations", [])
    instance = (reservations[0].get("Instances") or [None])[0] if reservations else None
    state = ((instance or {}).get("State") or {}).get("Name")
    return state or "unknown"


def _get_service() -> dict:
    resp = _ecs.describe_services(cluster=ECS_CLUSTER_ARN, services=[ECS_SERVICE_NAME])
    svc = (resp.get("services") or [None])[0] or {}
    return {
        "desiredCount": int(svc.get("desiredCount", 0) or 0),
        "runningCount": int(svc.get("runningCount", 0) or 0),
        "status": svc.get("status", "UNKNOWN"),
    }


def _touch():
    now = int(time.time())
    _ddb.put_item(
        TableName=DDB_TABLE_NAME,
        Item={
            "id": {"S": "dev"},
            "last_access": {"N": str(now)},
        },
    )


def _get_last_access() -> int:
    resp = _ddb.get_item(
        TableName=DDB_TABLE_NAME,
        Key={"id": {"S": "dev"}},
        ConsistentRead=True,
    )
    item = resp.get("Item")
    if not item:
        return 0
    last = item.get("last_access", {}).get("N")
    return int(last) if last else 0


def _start_backend():
    state = _get_instance_state()
    if state in ("stopped", "stopping"):
        _ec2.start_instances(InstanceIds=[EC2_INSTANCE_ID])

    # Start ECS service (task will place when instance is ready)
    _ecs.update_service(cluster=ECS_CLUSTER_ARN, service=ECS_SERVICE_NAME, desiredCount=1)
    _touch()


def _stop_backend():
    _ecs.update_service(cluster=ECS_CLUSTER_ARN, service=ECS_SERVICE_NAME, desiredCount=0)

    state = _get_instance_state()
    if state in ("running", "pending"):
        _ec2.stop_instances(InstanceIds=[EC2_INSTANCE_ID])


def _is_healthy() -> bool:
    if not ELASTIC_IP:
        return False
    try:
        req = urllib.request.Request(f"http://{ELASTIC_IP}:3000/", method="GET")
        with urllib.request.urlopen(req, timeout=3) as resp:
            return 200 <= resp.status < 400
    except Exception:
        return False


def _handle_wake(headers: dict):
    auth = _parse_basic_auth(headers)
    if not auth or auth[0] != WAKE_USER or auth[1] != WAKE_PASS:
        return _unauthorized()

    _start_backend()
    return _resp(202, {"status": "waking"})


def _handle_touch():
    _touch()
    return _resp(200, {"ok": True})


def _handle_status():
    state = _get_instance_state()
    service = _get_service()
    healthy = False
    if state == "running" and service.get("runningCount", 0) > 0:
        healthy = _is_healthy()

    return _resp(
        200,
        {
            "instanceState": state,
            "service": service,
            "elasticIp": ELASTIC_IP,
            "healthy": healthy,
        },
    )


def _handle_magento_graphql(event):
    # Requirement: do NOT auto-wake here
    state = _get_instance_state()
    service = _get_service()
    if state != "running" or service.get("runningCount", 0) < 1:
        return _resp(503, {"error": "Backend sleeping", "wake": True})

    _touch()

    if not ELASTIC_IP:
        return _resp(500, {"error": "Missing ELASTIC_IP"})

    upstream = f"http://{ELASTIC_IP}/graphql"
    body = (event.get("body") or "").encode("utf-8")

    headers_in = event.get("headers") or {}
    headers_out = {"content-type": "application/json"}
    for key in ("authorization", "Authorization", "store", "Store"):
        if key in headers_in:
            headers_out[key] = headers_in[key]

    req = urllib.request.Request(upstream, data=body, method="POST", headers=headers_out)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read().decode("utf-8")
            return {
                "statusCode": resp.status,
                "headers": {
                    "content-type": resp.headers.get("content-type", "application/json"),
                    "cache-control": "no-store",
                },
                "body": data,
            }
    except urllib.error.HTTPError as e:
        data = e.read().decode("utf-8") if e.fp else ""
        return {
            "statusCode": e.code,
            "headers": {"content-type": "application/json", "cache-control": "no-store"},
            "body": data or json.dumps({"error": "Upstream error"}),
        }


def _handle_autosleep():
    state = _get_instance_state()
    if state != "running":
        return

    last = _get_last_access()
    now = int(time.time())

    # If we have no record yet, set one now and wait until next interval.
    if last == 0:
        _touch()
        return

    if now - last < IDLE_TIMEOUT_SEC:
        return

    _stop_backend()


def lambda_handler(event, context):
    # EventBridge invokes with {"action": "autosleep"}
    if isinstance(event, dict) and event.get("action") == "autosleep":
        _handle_autosleep()
        return

    raw_path = event.get("rawPath", "")
    # API Gateway HTTP API includes stage prefix in rawPath (e.g. /dev/status)
    # Strip stage prefix for routing
    stage = ((event.get("requestContext") or {}).get("stage") or "")
    path = raw_path
    if stage and path.startswith(f"/{stage}"):
        path = path[len(f"/{stage}"):]
    if not path:
        path = "/"

    method = ((event.get("requestContext") or {}).get("http") or {}).get("method")
    headers = event.get("headers") or {}

    if method == "POST" and path == "/wake":
        return _handle_wake(headers)
    if method == "POST" and path == "/touch":
        return _handle_touch()
    if method == "GET" and path == "/status":
        return _handle_status()
    if method == "POST" and path == "/magento/graphql":
        return _handle_magento_graphql(event)

    return _resp(404, {"error": "Not found", "path": path, "method": method})
