# Multi-stage Dockerfile for Turborepo (pnpm) + Next.js + Prisma
# - Uses turbo prune to minimize install/build context
# - Builds the Next.js app (apps/web)
# - Generates Prisma Client in build stage and copies it into the runtime
# - Runs the production server with `pnpm -C apps/web start`

########################################
# Base image
########################################
FROM node:20-slim AS base

ENV PNPM_HOME=/pnpm \
	NEXT_TELEMETRY_DISABLED=1
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# Enable corepack (ships with Node >= 16) and prepare pnpm
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

########################################
# Prune stage (reduce context to just web + deps)
########################################
FROM base AS prune

# Turbo is used to compute a minimal workspace graph for the target app
RUN npm i -g turbo@2.5.5

# Root manifests
COPY turbo.json pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# App/package manifests required for prune
COPY apps/web/package.json ./apps/web/package.json
COPY packages/data/package.json ./packages/data/package.json
COPY packages/randomizer/package.json ./packages/randomizer/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json

# Compute pruned workspace into /app/out
RUN turbo prune --scope=web --scope=@codrandom/randomizer --scope=@codrandom/data --docker

########################################
# Builder stage (install + build)
########################################
FROM base AS builder

# Install only pruned dependencies first (better cache)
COPY --from=prune /app/out/json/ ./
RUN pnpm install --frozen-lockfile

# Now bring in the actual source files
COPY --from=prune /app/out/full/ ./

# Explicitly copy sources that Next needs at build time (safety if prune omits files)
COPY apps/web ./apps/web
COPY apps/web/next.config.mjs ./apps/web/next.config.mjs
COPY packages/ui ./packages/ui
COPY packages/randomizer ./packages/randomizer
COPY packages/data ./packages/data
COPY packages/typescript-config ./packages/typescript-config

# System dependencies required by Prisma during generate
RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Prisma schema is part of the copied data package; ensure it's present

# Generate Prisma Client (schema lives in packages/data/prisma)
# Keep it in builder and copy into runner later so we don't need prisma CLI in prod
RUN pnpm -w -F @codrandom/data prisma:generate

# Build the Next.js app
RUN pnpm -C apps/web build

# Prune dev dependencies to production-only for runtime
RUN pnpm prune --prod

########################################
# Runtime stage (lean image)
########################################
FROM node:20-slim AS runner

ENV NODE_ENV=production \
	NEXT_TELEMETRY_DISABLED=1 \
	PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

# System dependencies required by Prisma at runtime
RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Use the already pruned production node_modules from builder (contains generated Prisma client)
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/web/node_modules /app/apps/web/node_modules

# Copy the built Next.js output and necessary app files
COPY --from=builder /app/apps/web/.next/ /app/apps/web/.next/
COPY --from=builder /app/apps/web/next.config.mjs /app/apps/web/next.config.mjs
# Provide package.json so `pnpm -C apps/web start` can find the script
COPY --from=builder /app/apps/web/package.json /app/apps/web/package.json

# Include workspace manifests so pnpm resolves binaries from the root installation
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-lock.yaml
# public directory is optional; omit copy to avoid build failures if absent

EXPOSE 3000

# Start the Next.js server
CMD ["pnpm", "-C", "apps/web", "start"]

