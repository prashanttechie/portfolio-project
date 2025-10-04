# 🚀 Quick Start Guide

Get your portfolio running in under 5 minutes!

## ⚡ Super Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npm run db:generate

# 3. Start development server
npm run dev

# Visit: http://localhost:3000
```

## 🐳 Docker Quick Start

```bash
# Start with password prompt
npm run docker:dev

# Enter password when prompted:
# ik9EaxvPAipIKxRD

# Visit: http://localhost:3000
```

## 🐛 Common Issues & Fixes

### ❌ Error: `Module not found: Can't resolve '@prisma/client'`

**Solution:**
```bash
# Generate Prisma client
npm run db:generate

# Clear Next.js cache and restart
rm -rf .next
npm run dev
```

**Why this happens:**
- Prisma client needs to be generated after installation
- Next.js caches the old module resolution

### ❌ Error: `source: no such file or directory: .env.local`

**Solution:**
```bash
# You're in the wrong directory
cd portfolio-website

# Then run dev
npm run dev
```

### ❌ Error: `DATABASE_URL not found`

**Solution:**
```bash
# Check if .env.local exists
cat .env.local

# If not, create it:
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://postgres:ik9EaxvPAipIKxRD@210.79.129.8:5432/portfolio-data?connect_timeout=10&sslmode=prefer"
EOF

# Then run dev
npm run dev
```

### ❌ Error: `Port 3000 already in use`

**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### ❌ Error: `Docker is not running`

**Solution:**
1. Start Docker Desktop
2. Wait for it to fully start
3. Run `npm run docker:dev` again

### ❌ Error: `Permission denied: ./docker-start-secure.sh`

**Solution:**
```bash
# Make script executable
chmod +x docker-start-secure.sh

# Run again
npm run docker:dev
```

## 📋 Pre-requisites Checklist

Before starting, ensure you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Docker Desktop (for Docker mode only)
- [ ] You're in the `portfolio-website` directory

## 🔄 Fresh Install Steps

If nothing works, try a clean install:

```bash
# 1. Remove everything
rm -rf node_modules package-lock.json .next

# 2. Install fresh
npm install

# 3. Generate Prisma
npm run db:generate

# 4. Start dev
npm run dev
```

## 🎯 What Each Command Does

| Command | Purpose |
|---------|---------|
| `npm install` | Installs all dependencies |
| `npm run db:generate` | Creates Prisma client from schema |
| `npm run db:push` | Syncs schema to database |
| `npm run db:studio` | Opens database GUI |
| `npm run dev` | Starts local dev server |
| `npm run build` | Builds for production |
| `npm run docker:dev` | Starts Docker dev mode |
| `npm run docker:prod` | Starts Docker prod mode |

## ✅ Success Indicators

You'll know it's working when you see:

```
▲ Next.js 15.5.4
- Local:        http://localhost:3000
- Environments: .env.local

✓ Starting...
✓ Ready in 2.3s
```

Then open: **http://localhost:3000**

## 📊 Testing Features

Once running, test these features:

1. **Home Page** - http://localhost:3000
   - Should show profile and about sections

2. **Blog** - http://localhost:3000/blog
   - Should show blog posts

3. **Write Blog** - http://localhost:3000/blog/write
   - Create a test post
   - Check if it saves to database

4. **Courses** - http://localhost:3000/courses
   - Should show course catalog

5. **Prisma Studio** - Run `npm run db:studio`
   - Opens http://localhost:5555
   - View database tables

## 🔧 Development Workflow

Typical workflow:

```bash
# Morning routine
cd portfolio-website
npm run dev
# Start coding!

# Need to check database?
npm run db:studio

# Made schema changes?
npm run db:push

# End of day
# Just close terminal (dev server stops)
```

## 💡 Pro Tips

1. **Keep terminal open** - Leave `npm run dev` running while you code
2. **Hot reload works** - Changes appear instantly
3. **Check console** - Browser console shows errors
4. **Use Prisma Studio** - Easier than pgAdmin for quick checks
5. **Commit often** - Your `.env` is gitignored (safe!)

## 📚 Documentation Links

- **[SECURE_SETUP.md](./SECURE_SETUP.md)** - Password security
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Database config
- **[DOCKER_GUIDE.md](./DOCKER_GUIDE.md)** - Docker commands
- **[README.md](./README.md)** - Full documentation

## 🆘 Still Having Issues?

1. **Check you're in the right directory**:
   ```bash
   pwd
   # Should show: .../portfolio-website
   ```

2. **Check Node version**:
   ```bash
   node --version
   # Should be 18.0.0 or higher
   ```

3. **Check dependencies installed**:
   ```bash
   ls node_modules/@prisma
   # Should show 'client' folder
   ```

4. **Try the nuclear option**:
   ```bash
   rm -rf node_modules package-lock.json .next
   npm install
   npm run db:generate
   npm run dev
   ```

## ✨ You're Ready!

That's it! You should now have a running portfolio application.

**Happy coding! 🚀**

---

**Need Help?** Check the troubleshooting section above or review the full docs.

