# 🐳 Docker Quick Start

Get your portfolio running with Docker in 2 minutes!

## ⚡ Super Quick Start

```bash
# 1. Start development server (with hot reload)
npm run docker:dev

# 2. Visit http://localhost:3000
```

That's it! 🎉

## 🚀 Commands You Need

```bash
# Development (recommended for coding)
npm run docker:dev          # Start with hot reload
npm run docker:stop         # Stop containers

# Production (for testing production build)
npm run docker:prod         # Start production server
npm run docker:stop         # Stop containers

# Clean up
npm run docker:clean        # Stop and remove everything
```

## 🎯 What Each Mode Does

### Development Mode (`docker:dev`)
- ✅ Hot reload - changes appear instantly
- ✅ Full dev tools and error messages
- ✅ Source code mounted from your local machine
- ⚡ Fast startup
- 📁 Your changes are saved on your machine

**Use this for:** Daily development work

### Production Mode (`docker:prod`)
- ✅ Optimized for performance
- ✅ Smaller image size (~150MB)
- ✅ Production-ready build
- 🔒 Secure (non-root user)
- ⚡ Fast runtime

**Use this for:** Testing production build before deployment

## 🛠️ Interactive Helper Script

```bash
# Run the interactive menu
./docker-start.sh

# You'll see:
# 1) Development (with hot reload)
# 2) Production (optimized build)
```

## 📝 Common Tasks

### View Logs
```bash
# Follow logs in real-time
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100
```

### Restart Containers
```bash
# Stop
npm run docker:stop

# Start again
npm run docker:dev
```

### Rebuild After Changes
```bash
# Rebuild and start
docker-compose up --build app-dev
```

### Open Shell in Container
```bash
# For development container
docker-compose exec app-dev sh

# For production container
docker-compose exec app sh
```

### Install New Package
```bash
# While container is running
docker-compose exec app-dev npm install package-name

# Then rebuild
docker-compose up --build app-dev
```

## 🐛 Quick Troubleshooting

### Port 3000 Already in Use
```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>

# Or edit docker-compose.yml to use different port:
ports:
  - "8080:3000"  # Use port 8080 instead
```

### Container Won't Start
```bash
# View error logs
docker-compose logs

# Clean rebuild
npm run docker:clean
npm run docker:dev
```

### Changes Not Showing (Dev Mode)
```bash
# Restart development container
npm run docker:stop
npm run docker:dev
```

### Out of Disk Space
```bash
# Clean up Docker
docker system prune -a --volumes
```

## 📖 Need More Details?

See **[DOCKER_GUIDE.md](./DOCKER_GUIDE.md)** for:
- Advanced configuration
- Deployment strategies
- Security best practices
- CI/CD integration
- And much more!

## ✅ Quick Checklist

Before you start:
- [ ] Docker Desktop is installed and running
- [ ] You're in the `portfolio-website` directory
- [ ] Port 3000 is available

Ready to go:
```bash
npm run docker:dev
```

🎉 **Happy coding!**

