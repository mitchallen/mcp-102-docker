# Use Node.js LTS Alpine image for smaller size
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S mcp -u 1001

# Change ownership of app directory
RUN chown -R mcp:nodejs /app
USER mcp

# Expose port (optional, for HTTP endpoints)
EXPOSE 3000

# Set entrypoint
ENTRYPOINT ["node", "dist/index.js"]
