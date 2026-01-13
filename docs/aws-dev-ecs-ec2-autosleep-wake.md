# Dev: ECS on EC2 with Auto-Sleep + On-Demand Wake

Goal: Keep a dev Magento backend cheap by running it on **ECS (EC2 launch type)**, scaling to **0** when idle, and “waking” it on demand.

## Key idea

- **Static frontend (S3/CloudFront)** cannot start AWS resources by itself.
- It *can* call a **public API endpoint** (API Gateway → Lambda) that has IAM permissions to:
  - set **Auto Scaling Group desired capacity** to 1 (launch an ECS instance)
  - set **ECS service desired count** to 1 (start the task/containers)

This is the standard pattern for “wake on first load”.

## Components

### 1) ECS on EC2
- ECS Cluster
- Capacity Provider backed by an Auto Scaling Group
- One ECS Service (dev) with desired count 0/1

For dev-cost, it’s simplest to run a **single task** that contains multiple containers:
- `magento` (nginx/php-fpm)
- `db` (mariadb/mysql)
- `search` (opensearch)

…and use **host volumes** (EBS on the instance) for persistence.

> This is *not* production architecture, but it’s a practical dev-cost pattern.

### 2) Auto-sleep
Two common approaches:

- **Scheduled scaling** via EventBridge Scheduler / CloudWatch Events:
  - night/weekends set ASG `min=0, desired=0`, ECS service `desired=0`
  - morning set ASG `min=1, desired=1`, ECS service `desired=1`

- **Idle-based sleep** (more complex): stop after X minutes of no traffic.
  - Requires metrics/log-based detection + Lambda.

### 3) Wake endpoint (API Gateway → Lambda)
A small Lambda handler:
- validates a shared secret (e.g. `X-Dev-Wake-Token`)
- updates:
  - `autoscaling:SetDesiredCapacity`
  - `ecs:UpdateService`

Return JSON like `{ status: "waking" }`.

### 4) Frontend behavior (S3)
- On app load, the frontend calls `POST https://<api>/dev/wake`.
- Then it polls `https://<magento-host>/health` until it becomes healthy.
- While waiting, show a “Warming up backend…” UI.

## Security
Do **not** make a wake endpoint unauthenticated.

Minimal dev approach:
- a random token stored in Secrets Manager or SSM Parameter Store
- frontend sends it as a header

Note: any secret embedded into a public frontend is still discoverable, so prefer:
- IP allow-list (your office/home IPs), **or**
- CloudFront signed cookies/headers, **or**
- Cognito auth (heavier)

For dev, IP allow-list + token is usually sufficient.

## Reality check on costs
Even with ECS on EC2, you must avoid these to stay cheap:
- ALB (hourly cost)
- NAT Gateway (hourly cost)
- RDS (monthly baseline)
- OpenSearch Service (monthly baseline)

The cheapest dev setup is typically:
- one small EC2 instance (spot if acceptable)
- everything else inside containers on that instance
- scheduled stop/start

## Recommended next step in this repo

If you want, we can implement a Terraform “dev-lite” path that:
- adds an ECS cluster + capacity provider
- runs a single service for the Magento stack
- adds an API Gateway route + Lambda to wake it
- adds an EventBridge schedule to sleep/wake automatically

