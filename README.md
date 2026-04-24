# ShopFlow — E-Commerce Order Processing Platform

> A production-grade microservices system built with Node.js, Apache Kafka, Elasticsearch, and React. Demonstrates real-world event-driven architecture with full observability stack.

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Kafka](https://img.shields.io/badge/Apache-Kafka-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF)

---

## Overview

ShopFlow is a full-stack e-commerce platform that processes orders through an event-driven pipeline. A user places an order → payment is simulated → delivery progresses through stages → the entire state is indexed in Elasticsearch for real-time search. All inter-service communication happens exclusively through Apache Kafka.

**Live flow:**
```
React Frontend
    │
    ▼
API Gateway (JWT auth, routing)
    │
    ▼
Order Service ──(orders)──▶ Payment Service ──(payments)──▶ Delivery Service
    │◀────────────────── (order.status.updated) ───────────────────────────┘
    │
    └──── all topics ──▶ Search Service ──▶ Elasticsearch
                    └──▶ Analytics Service ──▶ Prometheus + Grafana
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+, TypeScript 5+ |
| Message Broker | Apache Kafka (kafkajs) |
| Search & Analytics | Elasticsearch 8.x |
| Database | PostgreSQL 16 + Prisma ORM |
| Cache / Sessions | Redis 7 |
| Frontend | React 18, Zustand, React Router, Recharts, Tailwind CSS |
| Monitoring | Prometheus + Grafana |
| Infrastructure | Docker, Docker Compose |
| CI/CD | GitHub Actions + EC2 Self-hosted Runner |

---

## Architecture

### Services

| Service | Port | Description |
|---|---|---|
| `api-gateway` | 8000 | JWT verification, request routing to all services |
| `auth-service` | 3006 | Registration, login, JWT + Redis refresh tokens |
| `order-service` | 3001 | REST API, Kafka producer, SSE for real-time status |
| `payment-service` | 3002 | Consumes orders, simulates 80% success / 20% failure |
| `delivery-service` | 3003 | Consumes payments, progresses PREPARING→SHIPPED→DELIVERED |
| `analytics-service` | 3004 | Sliding window aggregation, Prometheus metrics |
| `search-service` | 3005 | Indexes all Kafka events into Elasticsearch |
| `product-service` | 3007 | CRUD for products, admin-only write access |

### Infrastructure

| Service | Port | Description |
|---|---|---|
| `frontend` | 80 | React SPA served by nginx |
| `kafka` | 9092 | Apache Kafka broker |
| `kafka-ui` | 8080 | Visual Kafka management UI |
| `elasticsearch` | 9200 | Full-text search engine |
| `kibana` | 5601 | Elasticsearch Dev Tools |
| `prometheus` | 9090 | Metrics collection |
| `grafana` | 3000 | Observability dashboards |
| `postgres` | 5432 | Shared PostgreSQL database |
| `redis` | 6379 | Refresh token storage |

### Kafka Topics

| Topic | Partitions | Flow |
|---|---|---|
| `orders` | 3 | Order Service → Payment Service |
| `payments` | 1 | Payment Service → Delivery Service |
| `order.status.updated` | 1 | Delivery Service → Order Service |
| `orders.DLQ` | 1 | Dead Letter Queue for failed payments |
| `order-stats` | 1 | Analytics Service → Dashboard |

---

## User Roles

| Role | Capabilities |
|---|---|
| **user** | Browse shop, manage cart, place orders, track own orders, search products |
| **admin** | View all orders, analytics dashboard, search all orders, manage products (CRUD) |

Default admin credentials (seeded on first deploy):
- Email: `admin@shopflow.com`
- Password: `admin123`

---

## Project Structure

```
e-comerce-kafka-es/
├── shared/                          # Shared npm package (@ecommerce/shared)
│   ├── prisma/schema.prisma         # Single Prisma schema (User, Order, Product)
│   ├── generated/prisma/            # Generated Prisma client
│   └── src/
│       ├── types/events.ts          # Kafka event interfaces
│       ├── types/topics.ts          # Topic name constants
│       ├── kafka/client.ts          # createProducer, createConsumer, DLQ logic
│       ├── kafka/metrics.ts         # Prometheus counters
│       └── prisma.ts                # Shared PrismaClient instance
├── services/
│   ├── auth-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── delivery-service/
│   ├── analytics-service/
│   ├── search-service/
│   ├── product-service/
│   └── api-gateway/
├── frontend/                        # React 18 SPA
│   ├── src/
│   │   ├── store/                   # Zustand stores (auth, cart, orders, analytics)
│   │   ├── api/                     # Axios API clients
│   │   ├── components/              # Reusable UI components
│   │   └── pages/                   # Route-level page components
│   ├── Dockerfile
│   └── nginx.conf
├── docker/
│   ├── kafka/create-topics.sh
│   ├── grafana/provisioning/
│   └── prometheus/prometheus.yml
├── infrastructure/terraform/        # AWS infrastructure as code
├── .github/workflows/deploy.yml     # CI/CD pipeline
├── docker-compose.yml
└── .env.example
```

---

## Getting Started

### Prerequisites

- Docker 24+ and Docker Compose v2
- Node.js 20+ (for local development)
- Git

### Quick Start (Docker)

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/e-comerce-kafka-es.git
cd e-comerce-kafka-es

# 2. Copy environment file
cp .env.example .env

# 3. Start everything
docker compose up --build -d

# 4. Wait ~60 seconds for all services to become healthy
docker compose ps

# 5. Open the app
open http://localhost
```

That's it. One command starts all 28 containers.

### Seed Initial Data

On first run, seed the admin user and products:

```bash
# Admin user (admin@shopflow.com / admin123)
docker exec auth-service node -e "require('./dist/seed')"

# Sample products (10 Apple products)
docker exec product-service node -e "require('./dist/seed')"
```

Or use the scripts directly:

```bash
cd services/auth-service && npm run seed
cd services/product-service && npx ts-node src/seed.ts
```

### Local Development (without Docker)

```bash
# Start infrastructure only
docker compose up -d postgres redis kafka zookeeper elasticsearch kafka-ui

# Install dependencies
npm install

# Build shared package
cd shared && npx prisma generate && npm run build && cd ..

# Start services (separate terminals)
cd services/auth-service     && npm run dev  # :3006
cd services/order-service    && npm run dev  # :3001
cd services/payment-service  && npm run dev  # :3002
cd services/delivery-service && npm run dev  # :3003
cd services/analytics-service&& npm run dev  # :3004
cd services/search-service   && npm run dev  # :3005
cd services/product-service  && npm run dev  # :3007
cd services/api-gateway      && npm run dev  # :8000
cd frontend                  && npm run dev  # :5173
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Key variables:

```env
# Database
DATABASE_URL=postgresql://ecommerce:ecommerce@localhost:5432/ecommerce

# Auth
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=604800

# Kafka
KAFKA_BROKERS=kafka:29092
KAFKA_CLIENT_ID=ecommerce

# Elasticsearch
ES_NODE=http://elasticsearch:9200
ES_INDEX=orders

# Redis
REDIS_URL=redis://redis:6379
```

See `.env.example` for the full list.

---

## API Reference

### Auth Service (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create new account |
| POST | `/api/auth/login` | — | Login, returns JWT + refresh token |
| POST | `/api/auth/refresh` | — | Refresh access token |
| POST | `/api/auth/logout` | — | Invalidate refresh token |
| GET | `/api/auth/me` | ✓ | Get current user |

### Order Service (`/api/orders`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | ✓ | Create order, publishes to Kafka |
| GET | `/api/orders` | ✓ | List orders (admin: all, user: own) |
| GET | `/api/orders/:id` | ✓ | Get order by ID |
| GET | `/api/events` | ✓ | SSE stream for real-time status updates |

### Product Service (`/api/products`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | ✓ | List/search products |
| GET | `/api/products/:id` | ✓ | Get product by ID |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Search Service (`/api/search`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/search?q=&status=&page=&limit=` | Admin | Full-text order search |
| GET | `/api/search/orders/:id` | Admin | Order details from Elasticsearch |
| GET | `/api/search/stats` | ✓ | Aggregated statistics |

### Analytics Service (`/api/analytics`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/analytics` | Admin | Current sliding window stats |

---

## Kafka Event Schemas

### `OrderCreatedEvent` (topic: `orders`)
```json
{
  "orderId": "uuid",
  "userId": "uuid",
  "items": [{ "productId": "string", "quantity": 2, "price": 99.99 }],
  "totalAmount": 199.98,
  "createdAt": "ISO timestamp"
}
```

### `PaymentProcessedEvent` (topic: `payments`)
```json
{
  "paymentId": "uuid",
  "orderId": "uuid",
  "status": "SUCCESS | FAILED",
  "processedAt": "ISO timestamp",
  "failureReason": "string | null"
}
```

### `OrderStatusUpdatedEvent` (topic: `order.status.updated`)
```json
{
  "orderId": "uuid",
  "status": "PREPARING | SHIPPED | DELIVERED",
  "courier": "string",
  "updatedAt": "ISO timestamp"
}
```

### `OrderStatsEvent` (topic: `order-stats`)
```json
{
  "windowStart": "ISO timestamp",
  "ordersCount": 42,
  "totalRevenue": 8499.58,
  "successRate": 0.81,
  "avgProcessingMs": 1840
}
```

---

## Monitoring

### Prometheus Metrics

Each service exposes `/metrics` in Prometheus format. Key metrics:

| Metric | Type | Description |
|---|---|---|
| `kafka_messages_produced_total` | Counter | Messages published per topic |
| `kafka_messages_consumed_total` | Counter | Messages consumed per topic/group |
| `kafka_consumer_errors_total` | Counter | Consumer errors |
| `order_processing_duration_seconds` | Histogram | End-to-end order processing time |
| `payment_success_total` | Counter | Successful payments |
| `payment_failure_total` | Counter | Failed payments |
| `http_requests_total` | Counter | HTTP requests per route |

### Grafana Dashboard

Access at `http://localhost:3000` (admin/admin).

The **ShopFlow — E-Commerce Platform** dashboard includes:
- Kafka messages produced by topic (time series)
- Consumer errors by topic and group
- Order processing duration heatmap
- Payment success vs failure (time series)
- HTTP request rate by service
- 24-hour stats counters

---

## CI/CD

### GitHub Actions + EC2 Self-hosted Runner

The deployment pipeline runs on a self-hosted GitHub Actions runner installed on the EC2 instance.

**Trigger:** Push to `main` branch

**Pipeline steps:**
1. Checkout code on the EC2 runner
2. Write `.env` from GitHub Secrets
3. `docker compose down --remove-orphans`
4. `docker compose up --build -d`
5. Health check via `docker compose ps`
6. Seed admin user and products (idempotent)

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `ENV_FILE` | Full contents of your `.env` file |

### Setting Up the Runner

```bash
# On your EC2 instance
mkdir ~/actions-runner && cd ~/actions-runner

# Download runner (get exact URL from GitHub Settings → Actions → Runners)
curl -o actions-runner-linux-x64-2.x.x.tar.gz -L <URL>
tar xzf ./actions-runner-linux-x64-2.x.x.tar.gz

# Configure
./config.sh --url https://github.com/YOUR_USERNAME/YOUR_REPO --token YOUR_TOKEN

# Install and start as a service
sudo ./svc.sh install
sudo ./svc.sh start
```

---

## Development Notes

### Shared Prisma Schema

All services that use PostgreSQL (`auth-service`, `order-service`, `product-service`) share a single Prisma schema located in `shared/prisma/schema.prisma`. After any schema change:

```bash
cd shared
npx prisma db push      # sync database
npx prisma generate     # regenerate client
npm run build           # rebuild shared package
```

### Adding a New Service

1. Create `services/new-service/` with `src/index.ts`, `package.json`, `tsconfig.json`, `.env`
2. Add `Dockerfile` following the pattern in existing services
3. Add to `docker-compose.yml`
4. Add proxy route in `services/api-gateway/src/index.ts`
5. Add `ENV_SERVICE_URL` to gateway environment variables

### Dead Letter Queue

Failed payments (after 3 retries) are published to `orders.DLQ`. The Search Service listens to this topic and marks affected orders with `status: "payment_failed"` in Elasticsearch.

---

