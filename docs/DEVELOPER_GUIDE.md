# MATHO — Developer Guide

## Prerequisites

- Node.js ≥ 20, npm ≥ 10
- Docker + Docker Compose (for Postgres/Redis)
- A Pi Browser / Pi SDK sandbox account, once Phase 2 wires real Pi auth

## First-time setup

```bash
git clone <repo-url> matho && cd matho
npm install
cp .env.example .env
docker compose -f docker-compose.dev.yml up -d
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Running apps individually

```bash
npm run dev:web      # http://localhost:3000
npm run dev:admin    # http://localhost:3002
npm run dev:api      # http://localhost:4000/api/v1  (Swagger: /api/docs)
```

Or all at once with `npm run dev` (Turborepo runs them in parallel).

## Working with the database

- Schema lives in `packages/database/prisma/schema.prisma`.
- After editing the schema: `npm run db:migrate` (creates + applies a
  migration) then `npm run db:generate` (regenerates the typed client).
- `npm run db:studio` opens Prisma Studio against your local database.
- `npm run db:seed` re-runs `packages/database/prisma/seed.ts` (currently
  seeds only the `Language` reference table — no demo business data).

## Working with the design system (`packages/ui`)

- Every component is plain React + Tailwind; none import Next.js or Nest.
- Add a component under `packages/ui/src/components/`, export it from
  `packages/ui/src/index.ts`, and add a Vitest + Testing Library test under
  `packages/ui/src/__tests__/`.
- `apps/web` and `apps/admin` both consume `@matho/ui` directly from source
  (`transpilePackages` in `next.config.mjs`) — no separate build step needed
  during development.

## Adding a new NestJS module

Each of the 10 existing modules under `apps/api/src/modules/<name>/` follows
the same shape: `*.module.ts`, `*.controller.ts`, `*.service.ts`, and a
`*.service.spec.ts`. To add a new one:

1. Scaffold the four files following an existing module as a template.
2. Register the module in `apps/api/src/app.module.ts`.
3. Add real DTOs (`class-validator`) and wire `PrismaService` once you're
   past Phase 1 scaffolding into real business logic.

## Environment variables

See `.env.example` for the full list. Notably:

- `DATABASE_URL` — PostgreSQL connection string used by Prisma.
- `PI_*` — Pi Network placeholders; not yet consumed by real network calls.
- `STREAMING_PROVIDER` — selects the active `StreamingProvider` in
  `packages/sdk/src/streaming/provider.ts`; only `placeholder` exists today.

## Testing

| Scope                    | Tool                | Command              |
| ------------------------- | -------------------- | --------------------- |
| `packages/*`, `apps/web`  | Vitest + Testing Library | `npm run test`   |
| `apps/api`                | Jest                 | `npm run test --workspace=@matho/api` |
| `apps/web` e2e            | Playwright           | `npm run test:e2e`   |

## Linting & formatting

```bash
npm run lint         # ESLint across the workspace
npm run format       # Prettier — writes changes
npm run format:check # Prettier — CI-mode, no writes
npm run typecheck    # tsc --noEmit everywhere
```

Husky runs `lint-staged` on every commit (ESLint + Prettier on staged files)
and `commitlint` on every commit message (Conventional Commits format, e.g.
`feat(products): add variant selector`).

## Troubleshooting

- **`Cannot find module '@matho/...'`** — run `npm install` from the repo
  root, not from inside an individual `apps/*` or `packages/*` folder.
- **Prisma client type errors** — run `npm run db:generate` after any schema
  change or after a fresh clone.
- **Port already in use** — web/admin/api default to 3000/3002/4000; override
  with `PORT` env vars or stop the conflicting process.
