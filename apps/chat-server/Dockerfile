FROM node:22-alpine

# Enable pnpm via corepack
RUN corepack enable

# Set working directory to the monorepo root
WORKDIR /app

# Copy monorepo root config files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy only necessary package.json files to install workspace dependencies
COPY apps/chat-server/package.json ./apps/chat-server/
COPY packages/db/package.json ./packages/db/
COPY packages/libs/package.json ./packages/libs/
COPY packages/hooks/package.json ./packages/hooks/
COPY packages/ui/package.json ./packages/ui/
COPY tooling/typescript/package.json ./tooling/typescript/
COPY tooling/tsdown/package.json ./tooling/tsdown/

# Install dependencies with pnpm
RUN pnpm install

# Copy the full source code (now that deps are installed)
COPY . .

RUN pnpm install

# Set working directory to the app
WORKDIR /app/apps/chat-server

# Expose port
EXPOSE 3000

# Start the app
CMD ["pnpm", "run", "start:dev"]
