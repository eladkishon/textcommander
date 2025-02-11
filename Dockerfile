# Builder Stage
FROM node:22-slim AS builder

# Set the working directory
WORKDIR /app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends chromium && \
    npm install -g pnpm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy only package files first for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Runtime Stage
FROM node:22-slim

# Set the working directory
WORKDIR /app

# Install Chromium only for runtime
RUN apt-get update && \
    apt-get install -y --no-install-recommends chromium && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium


# Copy the build artifacts from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the lockfile and node_modules from the builder stage for runtime
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
RUN mkdir -p data


# Set the default command
CMD ["node", "dist/main.js"]
