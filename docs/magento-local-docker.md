# Local Magento (Docker) Setup

This project’s frontend supports a pluggable backend. While Magento is not installed yet, keep using the `mock` provider. Once Magento is running locally, switch `NEXT_PUBLIC_API_PROVIDER` to `magento`.

## Recommended local setup (macOS arm64)

On Apple Silicon (arm64), the most reliable path is to use a purpose-built Magento docker dev environment that already includes the required supporting services (DB + search, etc.).

A common choice is `markshust/docker-magento`.

### 1) Prerequisites

- Docker Desktop running
- Enough Docker resources (Magento is heavy):
  - Memory: 6–10 GB
  - CPU: 4+ cores
  - Disk: 30+ GB free
- Magento Marketplace (Adobe Commerce Marketplace) **authentication keys** (public/private) to install Magento via Composer.

### 2) Install Magento via docker-magento

Follow the upstream README for the exact commands (they evolve over time):

- Repo: https://github.com/markshust/docker-magento

Typical flow is:

1. Clone the repo into a sibling directory (recommended so it doesn’t bloat this repo):
   - `mkdir -p ../magento-local && cd ../magento-local`
   - `git clone https://github.com/markshust/docker-magento.git`
2. Run their bootstrap/download/setup scripts per their README.
3. Confirm Magento is reachable in a browser and GraphQL responds at:
   - `https://<your-magento-host>/graphql`

### 3) Verify GraphQL works

You should be able to POST a simple query:

- Query: `{ storeConfig { store_code } }`

If that returns a JSON response with `data.storeConfig.store_code`, you’re good.

## Wiring the frontend to Magento

Update `frontend/.env.local`:

```dotenv
# Switch provider
NEXT_PUBLIC_API_PROVIDER=magento

# Upstream Magento GraphQL endpoint (server-only, used by Next.js proxy)
MAGENTO_UPSTREAM_GRAPHQL_URL=https://<your-magento-host>/graphql

# Used by server components/health fallback
NEXT_PUBLIC_MAGENTO_GRAPHQL_URL=https://<your-magento-host>/graphql

# Browser uses same-origin proxy (avoids CORS)
NEXT_PUBLIC_MAGENTO_GRAPHQL_PROXY_PATH=/api/magento/graphql

# Optional store view
MAGENTO_STORE_CODE=default
```

Then:

- `cd frontend && npm run dev`

The browser will call `http://localhost:3000/api/magento/graphql`, and Next.js will forward to `MAGENTO_UPSTREAM_GRAPHQL_URL`.

## AWS cost question: “same container as frontend?”

- **Same container (single image/process)**: not recommended for production. Magento needs multiple services and stateful components; combining everything into one container makes upgrades, scaling, and reliability much worse.
- **Same compute host**: yes, you can run **multiple containers on the same EC2 instance** to reduce costs (frontend + Magento + reverse proxy), but it’s still better to keep them as separate containers.
- **Cheapest architecture** (typical):
  - Frontend as static assets on S3 + CloudFront (very cheap)
  - Magento on its own EC2/Lightsail (or ECS on EC2)
  - DB on RDS (or self-managed DB on the same EC2 for dev/staging only)

If you tell me whether you want *dev/staging* on a single EC2 box or a more production-ready split (EC2 + RDS + OpenSearch/Redis), I can propose an AWS deployment layout that matches your Terraform setup.
