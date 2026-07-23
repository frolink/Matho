# ─────────────────────────────────────────────────────────────
# MATHO — apps/api (NestJS) production image
# Multi-stage build run from the MONOREPO ROOT, e.g.:
#   docker build -f apps/api/Dockerfile -t matho-api .
# ─────────────────────────────────────────────────────────────

FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /repo

# ---- deps ----
FROM base AS deps
COPY package.json package-lock.json* ./
COPY turbo.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/sdk/package.json packages/sdk/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/config/package.json packages/config/package.json
RUN npm ci

# ---- builder ----
FROM base AS builder
COPY --from=deps /repo/node_modules ./node_modules
COPY . .
RUN npm run db:generate
RUN npx turbo run build --filter=@matho/api

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs

COPY --from=builder /repo/apps/api/dist ./dist
COPY --from=builder /repo/apps/api/package.json ./package.json
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/packages/database/generated ./packages/database/generated

USER nestjs
EXPOSE 4000
ENV PORT=4000
CMD ["node", "dist/main.js"]
