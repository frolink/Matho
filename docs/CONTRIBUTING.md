# Contributing to MATHO

## Ground rules

- **Phase 1 (current):** foundation only — no business logic. PRs against
  this phase should stick to scaffolding, configuration, tests, and docs.
- **Clean Architecture / DDD boundaries are not optional.** Controllers stay
  thin; business rules belong in services; services depend on interfaces
  (`packages/sdk`, `PrismaService`), never on concrete vendor SDKs directly.
- **Apps never import from other apps.** Shared code belongs in `packages/*`.

## Branching & commits

- Branch from `develop`: `feat/<short-description>`, `fix/<short-description>`.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/):
  `feat(products): add category filter`, `fix(api): correct order status enum`.
  This is enforced by commitlint on every commit.

## Before opening a PR

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
```

All five must pass locally — CI re-runs them plus Playwright e2e tests.

## Pull request checklist

- [ ] Scoped to one concern (one module, one component, one fix)
- [ ] Tests added/updated for any new logic
- [ ] No business logic added outside the current phase's scope
- [ ] `packages/types` updated if the Prisma schema changed
- [ ] Docs (`docs/ARCHITECTURE.md` or `docs/DEVELOPER_GUIDE.md`) updated if
      the change affects structure or workflows

## Code style

- TypeScript strict mode is on everywhere — avoid `any`; prefer explicit
  types from `@matho/types`.
- Prettier + ESLint are enforced via `lint-staged` on commit; don't fight the
  formatter — configure it instead (`.prettierrc.json`).
- Components in `packages/ui` must not import `next/*` or Nest decorators.

## Reporting issues

Include: what you expected, what happened, exact steps to reproduce, and the
output of `node -v && npm -v`.
