# ─────────────────────────────────────────────────────────────
# MATHO — apps/web (Next.js) production image
# Multi-stage build run from the MONOREPO ROOT, e.g.:
#   docker build -f apps/web/Dockerfile -t matho-web .
# ─────────────────────────────────────────────────────────────

FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /repo

# ---- deps: install full workspace deps (cached layer) ----
FROM base AS deps
COPY package.json package-lock.json* ./
COPY turbo.json tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY apps/api/package.json apps/api/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/sdk/package.json packages/sdk/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/config/package.json packages/config/package.json
RUN npm ci

# ---- builder: generate Prisma client + build the web app ----
FROM base AS builder
COPY --from=deps /repo/node_modules ./node_modules
COPY . .
RUN npm run db:generate
RUN npx turbo run build --filter=@matho/web

# ---- runner: minimal production image ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /repo/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "apps/web/server.js"]
