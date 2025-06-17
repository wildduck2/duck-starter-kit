# ---------- Stage 1: Build ----------
FROM node:22-alpine AS builder
WORKDIR /repo

RUN corepack enable

# Copy everything from the monorepo root
COPY ../../ ./

# Change context to the app directory inside the container
WORKDIR /repo/apps/document-server

# Install all dependencies across the monorepo
RUN pnpm install --no-lockfile --ignore-scripts

# Build the app
RUN pnpm build

# ---------- Stage 2: Production ----------
FROM node:20-alpine
WORKDIR /app

RUN corepack enable

# Copy compiled app and package.json only
COPY --from=builder /repo/apps/document-server/dist ./dist
COPY --from=builder /repo/apps/document-server/package.json ./

# Install only production deps
RUN pnpm install --prod --no-lockfile --ignore-scripts

ENV NODE_ENV=production
CMD ["node", "dist/main"]

