# MATHO

**One Live. Global Market.**

MATHO is an AI-powered global live social commerce platform for the Pi ecosystem —
merchants, creators, and buyers interact through live commerce without language
barriers. This repository is the **Phase 1 foundation**: a production-grade
monorepo skeleton with no business logic yet. Every app builds, lints, and tests
successfully; feature work starts on top of this.

> 📄 See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for diagrams and design
> rationale, [`docs/DEVELOPER_GUIDE.md`](docs/DEVELOPER_GUIDE.md) for day-to-day
> workflows, and [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) for how to
> contribute.

## Stack

| Layer          | Choice                                            |
| -------------- | -------------------------------------------------- |
| Frontend       | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Zustand, React Query |
| Backend        | Node.js, NestJS 10, Prisma ORM                    |
| Database       | PostgreSQL                                        |
| Cache          | Redis                                             |
| Storage        | S3-compatible object storage                      |
| Auth           | Pi SDK (placeholder) + JWT                        |
| Streaming      | Provider-agnostic interface (`packages/sdk/streaming`) |
| Monorepo tool  | npm workspaces + Turborepo                        |
| Deployment     | Docker, Docker Compose, GitHub Actions, Vercel, Railway |

## Monorepo layout

```
matho/
├── apps/
│   ├── web/        Next.js buyer/creator/merchant app  (port 3000)
│   ├── admin/       Next.js internal admin console      (port 3002)
│   └── api/          NestJS backend API                   (port 4000)
├── packages/
│   ├── ui/           Shared React + Tailwind design system
│   ├── config/       Shared Tailwind/tsconfig/lint presets
│   ├── types/         Shared TypeScript domain + API types
│   ├── sdk/           Pi SDK placeholders + streaming provider interface
│   ├── shared/        Framework-agnostic utils, constants, zod schemas
│   └── database/      Prisma schema, generated client, seed script
├── docs/              Architecture, contributing, developer guides
├── infrastructure/    Postgres/Redis local config
├── scripts/           Repo maintenance scripts
└── .github/workflows/ CI pipeline
```

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Start Postgres + Redis
docker compose -f docker-compose.dev.yml up -d

# 4. Generate the Prisma client and run migrations
npm run db:generate
npm run db:migrate
npm run db:seed

# 5. Start every app in parallel (web:3000, admin:3002, api:4000)
npm run dev
```

Or run everything containerized:

```bash
docker compose up --build
```

## Common scripts

| Command              | What it does                                    |
| --------------------- | ------------------------------------------------ |
| `npm run dev`         | Run web, admin, and api in parallel (Turborepo)  |
| `npm run build`       | Build every app/package                          |
| `npm run lint`        | ESLint across the whole workspace                |
| `npm run typecheck`   | `tsc --noEmit` across the whole workspace         |
| `npm run test`        | Unit tests (Vitest for web/ui/packages, Jest for api) |
| `npm run test:e2e`    | Playwright e2e tests for apps/web                |
| `npm run format`      | Prettier write                                    |
| `npm run db:studio`   | Open Prisma Studio                                |

## Phase 1 scope

This foundation intentionally ships **no business logic**. Every module,
page, and endpoint is a typed, working scaffold:

- ✅ Routing for all 14 buyer/creator/merchant surfaces
- ✅ 10 NestJS modules (Auth, Users, Merchant, Products, Orders, Payments,
  Live, Affiliate, Notifications, Admin) with health-check endpoints
- ✅ Full Prisma schema (16 entities) — no queries beyond seeding reference data
- ✅ 16 reusable UI components shared by web and admin
- ✅ Pi SDK auth/payment placeholders (throw until Phase 2 wiring)
- ✅ Provider-agnostic streaming interface (no vendor hardcoded)
- ✅ Docker, Docker Compose, GitHub Actions CI, testing, linting, git hooks

Business logic — real authentication, checkout, live streaming, affiliate
payouts — is out of scope until this foundation is reviewed and approved.

## License

Proprietary — all rights reserved, MATHO project.
