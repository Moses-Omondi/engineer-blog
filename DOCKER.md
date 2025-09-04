# 🐳 Docker Setup Guide

This project includes comprehensive Docker support for both development and production environments.

## 📦 Quick Start

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB+ of available RAM for Docker

## 🚀 Running the Application

### Development Mode (with hot-reloading)

```bash
# Start the development server
docker-compose --profile development up

# Or run in detached mode
docker-compose --profile development up -d

# Access the site at http://localhost:3000
```

### Production Mode (optimized static site)

```bash
# Build and start the production server
docker-compose --profile production up --build

# Access the site at http://localhost:8080
```

### Generate Blog Posts

```bash
# Run the blog builder
docker-compose --profile builder run --rm builder

# Or if you want to watch for changes
docker-compose --profile builder run --rm builder npm run build:blog -- --watch
```

## 📁 Project Structure

```
├── Dockerfile           # Production multi-stage build
├── Dockerfile.dev       # Development environment
├── docker-compose.yml   # Service orchestration
├── .dockerignore       # Build optimization
└── nginx.conf          # Production web server config
```

## 🔧 Available Services

### 1. Development Service

- **Port**: 3000 (main app), 35729 (LiveReload)
- **Features**: Hot reloading, volume mounting, full development tooling
- **Command**: `npm run dev`

### 2. Production Service

- **Port**: 8080
- **Features**: Nginx, gzip compression, security headers, static asset caching
- **Health Check**: Every 30 seconds

### 3. Builder Service

- **Purpose**: Generate blog posts from Markdown
- **Volumes**: Mounts posts/, blog/, and src/ directories
- **Command**: `npm run build:blog`

## 📝 Common Commands

### Container Management

```bash
# View running containers
docker-compose ps

# View logs
docker-compose --profile development logs -f

# Stop all containers
docker-compose --profile development down

# Stop and remove volumes
docker-compose --profile development down -v

# Rebuild containers
docker-compose --profile development up --build
```

### Development Workflow

```bash
# Run tests in container
docker-compose --profile development exec development npm test

# Run linting
docker-compose --profile development exec development npm run lint

# Access container shell
docker-compose --profile development exec development sh

# Install new package
docker-compose --profile development exec development npm install <package-name>
```

### Production Build

```bash
# Build production image
docker build -t moses-blog:latest .

# Run production container standalone
docker run -d -p 8080:80 --name blog moses-blog:latest

# Check production health
docker inspect --format='{{.State.Health.Status}}' blog
```

## 🔍 Debugging

### View Container Logs

```bash
# Development logs
docker-compose --profile development logs -f development

# Production logs
docker-compose --profile production logs -f production
```

### Access Container Shell

```bash
# Development container
docker-compose --profile development exec development sh

# Production container (if needed)
docker-compose --profile production exec production sh
```

### Check Resource Usage

```bash
# View container stats
docker stats

# View detailed container info
docker-compose --profile development exec development ps aux
```

## ⚙️ Configuration

### Environment Variables

You can override default settings by creating a `.env` file:

```env
# Development
DEV_PORT=3000
DEV_LIVERELOAD_PORT=35729

# Production
PROD_PORT=8080

# Node environment
NODE_ENV=development
```

### Volume Mounts (Development)

The development container mounts the entire project directory, allowing real-time code changes:

- `./:/app` - Project files
- `/app/node_modules` - Isolated node_modules (prevents conflicts)

### Networking

All services use a custom bridge network `blog-network` for inter-service communication.

## 🚨 Troubleshooting

### Port Already in Use

```bash
# Change port in docker-compose.yml or use environment variable
PROD_PORT=8081 docker-compose --profile production up
```

### Permission Issues (Linux/Mac)

```bash
# Fix ownership
docker-compose --profile development exec development chown -R node:node /app
```

### Slow Performance on Windows

Enable WSL2 backend in Docker Desktop settings for better performance.

### Container Won't Start

```bash
# Check logs
docker-compose --profile development logs

# Rebuild from scratch
docker-compose --profile development down -v
docker-compose --profile development up --build
```

## 🏗️ Building for Different Environments

### Local Development

```bash
docker-compose --profile development up
```

### Staging

```bash
docker build -t moses-blog:staging --build-arg NODE_ENV=staging .
docker run -d -p 8080:80 moses-blog:staging
```

### Production

```bash
docker build -t moses-blog:production --build-arg NODE_ENV=production .
docker run -d -p 80:80 moses-blog:production
```

## 🔐 Security Notes

- Production image uses Alpine Linux for minimal attack surface
- Non-root user execution in production
- Security headers configured in nginx.conf
- No secrets or sensitive data in images
- Regular dependency updates via Dependabot

## 📊 Performance Optimization

The production Docker image is optimized for:

- **Size**: Multi-stage build (~50MB final image)
- **Speed**: Nginx with gzip compression
- **Caching**: Static assets cached for 1 year
- **Security**: Minimal Alpine base, security headers

## 🤝 Contributing with Docker

1. Fork and clone the repository
2. Start development environment: `docker-compose --profile development up`
3. Make your changes (hot-reload will show them instantly)
4. Run tests: `docker-compose --profile development exec development npm test`
5. Submit pull request

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Alpine Linux](https://alpinelinux.org/)
