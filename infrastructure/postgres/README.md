# PostgreSQL (local development)

The `postgres` service in `docker-compose.yml` / `docker-compose.dev.yml`
uses the stock `postgres:16-alpine` image with no custom init scripts —
Prisma migrations (`npm run db:migrate`) own the schema.

Drop any one-off bootstrap SQL (extensions, roles) into this folder and
mount it via `docker-compose.yml`'s `postgres.volumes` if a future phase
needs it; none is required for Phase 1.
