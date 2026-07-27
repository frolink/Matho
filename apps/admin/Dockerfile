# ─────────────────────────────────────────────────────────────
# MATHO — apps/admin (Next.js) production image
# Multi-stage build run from the MONOREPO ROOT, e.g.:
#   docker build -f apps/admin/Dockerfile -t matho-admin .
# ─────────────────────────────────────────────────────────────

FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /repo

# ---- deps: install full workspace deps (cached layer) ----
FROM base AS deps
COPY package.json package-lock.json* ./
COPY turbo.json tsconfig.base.json ./
COPY apps/admin/package.json apps/admin/package.json
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

# NEXT_PUBLIC_* vars are inlined into the browser bundle at BUILD time, not
# read at container runtime — must be passed as a build arg (see
# docker-compose.yml's `admin.build.args`), not as regular `environment:`.
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npx turbo run build --filter=@matho/admin

# ---- runner: minimal production image ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /repo/apps/admin/public ./apps/admin/public
COPY --from=builder --chown=nextjs:nodejs /repo/apps/admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/admin/.next/static ./apps/admin/.next/static

USER nextjs
EXPOSE 3002
ENV PORT=3002
CMD ["node", "apps/admin/server.js"]
