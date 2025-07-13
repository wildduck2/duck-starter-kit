FROM node:22-alpine

# Enable pnpm via corepack
RUN corepack enable

# Set working directory to the monorepo root
WORKDIR /app

# Copy monorepo root config files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy only necessary package.json files to install workspace dependencies
COPY packages/db/package.json ./packages/db/
COPY tooling/typescript/package.json ./tooling/typescript/
COPY tooling/tsdown/package.json ./tooling/tsdown/

# Install dependencies with pnpm
RUN pnpm install

COPY ./ .

# Set working directory to the app
WORKDIR /app/packages/db

# Expose port
EXPOSE 3000
