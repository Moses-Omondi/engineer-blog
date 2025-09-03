# Multi-stage build for optimal image size
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install Node.js for blog generation
RUN apk add --no-cache nodejs npm

# Copy build artifacts
COPY --from=builder /app/dist /usr/share/nginx/html/
COPY --from=builder /app/*.html /usr/share/nginx/html/
COPY --from=builder /app/css /usr/share/nginx/html/css/
COPY --from=builder /app/js /usr/share/nginx/html/js/
COPY --from=builder /app/images /usr/share/nginx/html/images/
COPY --from=builder /app/blog /usr/share/nginx/html/blog/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
