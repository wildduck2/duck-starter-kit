FROM node:22-alpine

# Set working directory for monorepo root
WORKDIR /app

# Enable pnpm via Corepack
RUN corepack enable

# Copy monorepo root config
COPY package.json pnpm-workspace.yaml ./

# Copy package.json files for dependency graph resolution
COPY apps/document-server/package.json ./apps/document-server/
COPY tooling/typescript/package.json ./packages/typescript-config/ 

# Install all dependencies
RUN pnpm install 

# Copy full monorepo
COPY . .

# Set working dir to app
WORKDIR /app/apps/document-server

# Install all dependencies
RUN pnpm install 

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]

