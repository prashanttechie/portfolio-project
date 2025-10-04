# 🐳 Docker Guide - Portfolio Website

Complete guide for running your portfolio website using Docker.

## 📋 Prerequisites

- **Docker Desktop** installed ([Download here](https://www.docker.com/products/docker-desktop))
- **Docker Compose** (included with Docker Desktop)
- Basic understanding of Docker (optional but helpful)

## 🚀 Quick Start

### Option 1: Development Mode (with hot reload)

```bash
# Start development server
docker-compose up app-dev

# Or run in background
docker-compose up -d app-dev

# View logs
docker-compose logs -f app-dev
```

Access at: **http://localhost:3000**

### Option 2: Production Mode

```bash
# Build and start production server
docker-compose up app

# Or run in background
docker-compose up -d app

# View logs
docker-compose logs -f app
```

Access at: **http://localhost:3000**

## 📦 Docker Configuration Files

### 1. `Dockerfile` (Production)

Multi-stage build optimized for production:
- **Stage 1 (deps)**: Install dependencies only
- **Stage 2 (builder)**: Build the application
- **Stage 3 (runner)**: Minimal runtime image

**Features:**
- ✅ Optimized layer caching
- ✅ Minimal image size (~150MB)
- ✅ Non-root user for security
- ✅ Standalone output for fast startup

### 2. `Dockerfile.dev` (Development)

Single-stage build for development:
- Hot module replacement (HMR)
- Source code mounted as volume
- Fast rebuilds
- Development dependencies included

### 3. `docker-compose.yml`

Orchestration file with two services:
- `app`: Production build
- `app-dev`: Development build with hot reload

### 4. `.dockerignore`

Excludes unnecessary files from Docker builds:
- node_modules
- .next cache
- Environment files
- Documentation
- Git files

## 🔧 Detailed Commands

### Build Images

```bash
# Build production image
docker-compose build app

# Build development image
docker-compose build app-dev

# Build with no cache (force rebuild)
docker-compose build --no-cache app
```

### Start Services

```bash
# Start development server (foreground)
docker-compose up app-dev

# Start production server (background)
docker-compose up -d app

# Start and rebuild if needed
docker-compose up --build app
```

### Stop Services

```bash
# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop a specific service
docker-compose stop app-dev
```

### View Logs

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs app-dev

# Last 100 lines
docker-compose logs --tail=100 app
```

### Execute Commands in Container

```bash
# Open shell in running container
docker-compose exec app-dev sh

# Run a specific command
docker-compose exec app-dev npm run lint

# Install new package
docker-compose exec app-dev npm install package-name
```

### Inspect Containers

```bash
# List running containers
docker-compose ps

# View container details
docker inspect portfolio-app-dev

# View resource usage
docker stats portfolio-app-dev
```

## 🛠️ Advanced Usage

### Using Docker CLI (without docker-compose)

#### Production

```bash
# Build
docker build -t portfolio-app:latest .

# Run
docker run -d -p 3000:3000 --name portfolio portfolio-app:latest

# Stop
docker stop portfolio

# Remove
docker rm portfolio
```

#### Development

```bash
# Build
docker build -f Dockerfile.dev -t portfolio-app:dev .

# Run with volume mounting
docker run -d \
  -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -v /app/.next \
  --name portfolio-dev \
  portfolio-app:dev

# Stop and remove
docker stop portfolio-dev && docker rm portfolio-dev
```

### Environment Variables

Create a `.env` file:

```bash
# .env
NODE_ENV=production
PORT=3000
```

Use in docker-compose:

```yaml
services:
  app:
    env_file:
      - .env
```

### Custom Port Mapping

```bash
# Run on different port (e.g., 8080)
docker run -p 8080:3000 portfolio-app:latest

# With docker-compose, edit docker-compose.yml:
ports:
  - "8080:3000"
```

### Multi-Container Setup

If you add a database or other services later:

```yaml
services:
  app:
    # ... existing config
    depends_on:
      - db
    
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 📊 Image Size Optimization

Current production image: **~150MB**

Tips to reduce further:
1. Use `alpine` base images (already done ✅)
2. Multi-stage builds (already done ✅)
3. Remove unnecessary dependencies
4. Use `.dockerignore` properly (already done ✅)

## 🔒 Security Best Practices

Already implemented:
- ✅ Non-root user in production
- ✅ Minimal base image (Alpine)
- ✅ No secrets in Dockerfile
- ✅ Latest security patches

Additional recommendations:
- Use Docker secrets for sensitive data
- Scan images with `docker scan`
- Keep base images updated
- Use specific version tags (not `latest`)

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
docker-compose up app -p 8080:3000
```

### Container Won't Start

```bash
# Check logs
docker-compose logs app

# Rebuild without cache
docker-compose build --no-cache app

# Remove old containers
docker-compose down -v
docker-compose up app
```

### Hot Reload Not Working (Development)

```bash
# Ensure volumes are mounted correctly
docker-compose down
docker-compose up app-dev

# Check volume mounts
docker inspect portfolio-app-dev | grep Mounts -A 20
```

### Build Errors

```bash
# Clear Docker cache
docker system prune -a

# Clear Next.js cache locally
rm -rf .next node_modules
npm install

# Rebuild
docker-compose build --no-cache app
```

### Out of Disk Space

```bash
# Remove unused containers, images, and volumes
docker system prune -a --volumes

# Check disk usage
docker system df
```

## 📈 Performance Optimization

### Use BuildKit

Enable BuildKit for faster builds:

```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1

# Or permanently in ~/.bash_profile or ~/.zshrc
echo 'export DOCKER_BUILDKIT=1' >> ~/.zshrc
```

### Use Build Cache

```bash
# Use cache from previous builds
docker-compose build app

# Share cache between machines
docker buildx build --cache-to type=local,dest=/tmp/cache .
docker buildx build --cache-from type=local,src=/tmp/cache .
```

### Prewarm Cache

```bash
# Pull base images before building
docker pull node:18-alpine
```

## 🚢 Deployment

### Docker Hub

```bash
# Login
docker login

# Tag image
docker tag portfolio-app:latest yourusername/portfolio-app:latest

# Push
docker push yourusername/portfolio-app:latest

# Pull on server
docker pull yourusername/portfolio-app:latest
docker run -d -p 80:3000 yourusername/portfolio-app:latest
```

### GitHub Container Registry

```bash
# Login
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Tag
docker tag portfolio-app:latest ghcr.io/username/portfolio-app:latest

# Push
docker push ghcr.io/username/portfolio-app:latest
```

### Deploy to Cloud

**AWS ECS / Fargate**
- Push to ECR
- Create ECS task definition
- Deploy to Fargate

**Google Cloud Run**
```bash
gcloud run deploy portfolio \
  --image gcr.io/PROJECT-ID/portfolio-app \
  --platform managed
```

**Azure Container Instances**
```bash
az container create \
  --resource-group myResourceGroup \
  --name portfolio-app \
  --image yourusername/portfolio-app:latest \
  --ports 3000
```

**DigitalOcean App Platform**
- Connect GitHub repository
- Detect Dockerfile automatically
- Deploy

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t portfolio-app:latest .
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push portfolio-app:latest
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices for Node.js in Docker](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

## ✅ Checklist

Before deploying:
- [ ] Test both development and production builds
- [ ] Verify hot reload works in development
- [ ] Check image size is reasonable
- [ ] Ensure no secrets in images
- [ ] Test on clean environment
- [ ] Document environment variables
- [ ] Set up health checks
- [ ] Configure logging
- [ ] Plan backup strategy (if using volumes)

---

**Need Help?** Check the troubleshooting section or open an issue!

Happy Dockerizing! 🐳

