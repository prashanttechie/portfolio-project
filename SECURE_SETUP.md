# 🔐 Secure Database Setup Guide

This guide shows you how to run the portfolio application with secure password handling.

## 🎯 Overview

Instead of hardcoding the PostgreSQL password in files, we now:
- ✅ Prompt for password when starting Docker
- ✅ Store password in `.env` (gitignored)
- ✅ Never commit passwords to git
- ✅ Use environment variables for all connections

## 🚀 Quick Start

### Method 1: Using npm scripts (Recommended)

```bash
# Start development or production mode
npm run docker:dev

# You'll be prompted:
# 🔐 Database Connection Setup
# Enter PostgreSQL password: ********
```

The script will:
1. Ask for your PostgreSQL password (hidden input)
2. Update `.env` file with the password
3. Start Docker containers with the password

### Method 2: Direct script execution

```bash
# Run the secure start script
./docker-start-secure.sh

# Follow the prompts
```

### Method 3: Manual setup

```bash
# 1. Copy .env.example to .env
cp .env.example .env

# 2. Edit .env and add your password
nano .env
# Change DB_PASSWORD= to DB_PASSWORD=your_actual_password

# 3. Start Docker
docker-compose up app-dev
```

## 📁 File Structure

### `.env` (Local, gitignored)
Contains your actual password:
```bash
DB_HOST=210.79.129.8
DB_PORT=5432
DB_NAME=portfolio-data
DB_USER=postgres
DB_PASSWORD=XG8FCW5Y8ASDvoOV  # Your actual password
```

### `.env.example` (Committed to git)
Template without sensitive data:
```bash
DB_HOST=210.79.129.8
DB_PORT=5432
DB_NAME=portfolio-data
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD_HERE  # Placeholder
```

### `.env.local` (Local, gitignored)
Used for local development (non-Docker):
```bash
DATABASE_URL="postgresql://postgres:password@210.79.129.8:5432/portfolio-data?..."
```

## 🔒 Security Features

### What's Protected

1. **Password never in git**
   - `.env` is gitignored
   - `.env.local` is gitignored
   - Only `.env.example` template is committed

2. **Password input is hidden**
   - Uses `read -sp` for secure password entry
   - Password characters don't appear on screen

3. **Environment variable isolation**
   - Each container gets its own environment
   - Password is only in memory, not in Docker image

4. **Backup files cleaned**
   - Script removes `.env.bak` automatically
   - No temporary files with passwords left behind

## 🛠️ Commands

### Start with Password Prompt
```bash
# Development mode
npm run docker:dev

# Production mode  
npm run docker:prod
```

### Start Without Prompt (if .env already configured)
```bash
# Start development
docker-compose up app-dev

# Start production
docker-compose up app

# Start in background
docker-compose up -d app-dev
```

### Stop Containers
```bash
npm run docker:stop
# or
docker-compose down
```

### View Environment Variables (for debugging)
```bash
# Show what Docker will use
docker-compose config

# Show .env file content (be careful!)
cat .env
```

## 🔧 Troubleshooting

### Password Not Working

1. **Check .env file exists**:
   ```bash
   ls -la .env
   ```

2. **Verify password in .env**:
   ```bash
   grep DB_PASSWORD .env
   ```

3. **Manually set password**:
   ```bash
   echo 'DB_PASSWORD=XG8FCW5Y8ASDvoOV' >> .env
   ```

4. **Test connection**:
   ```bash
   # Load .env and test
   export $(cat .env | xargs)
   psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME
   ```

### Script Permission Denied

```bash
# Make script executable
chmod +x docker-start-secure.sh

# Run again
./docker-start-secure.sh
```

### Environment Variables Not Loading

```bash
# Check docker-compose reads .env
docker-compose config | grep DATABASE_URL

# If empty, manually export and run
export DB_PASSWORD=your_password
docker-compose up app-dev
```

### Password Has Special Characters

If your password contains special characters (`$`, `@`, `!`, etc.), you may need to:

1. **URL encode the password** in DATABASE_URL:
   - `@` becomes `%40`
   - `$` becomes `%24`
   - `!` becomes `%21`
   - `#` becomes `%23`

2. **Or use the component approach** in docker-compose.yml (already done):
   ```yaml
   environment:
     - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}...
   ```

## 📝 For Local Development (Without Docker)

### Setup
```bash
# 1. Run the secure script once to create .env.local
./docker-start-secure.sh
# (Then Ctrl+C to exit)

# 2. Start local dev server
npm run dev
```

### Or manually:
```bash
# Create .env.local with your password
echo 'DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@210.79.129.8:5432/portfolio-data?connect_timeout=10&sslmode=prefer"' > .env.local

# Start dev server
npm run dev
```

## 🔄 Updating Password

If you need to change the password:

### Option 1: Re-run setup script
```bash
./docker-start-secure.sh
# Enter new password when prompted
```

### Option 2: Edit .env manually
```bash
nano .env
# Update DB_PASSWORD=new_password
# Save and exit

# Update .env.local too
nano .env.local
# Update password in DATABASE_URL
```

### Option 3: Use sed command
```bash
# Update .env
sed -i '' 's/DB_PASSWORD=.*/DB_PASSWORD=new_password/' .env

# Update .env.local
sed -i '' 's/:.*@/:new_password@/' .env.local
```

## 🎓 Best Practices

### DO ✅
- Always use the secure script for first-time setup
- Keep `.env` and `.env.local` in `.gitignore`
- Use different passwords for dev/staging/production
- Rotate passwords regularly
- Use strong passwords (20+ characters)
- Document password location in team password manager

### DON'T ❌
- Never commit `.env` or `.env.local` to git
- Don't share passwords in plain text (Slack, email)
- Don't hardcode passwords in source code
- Don't use simple passwords like "password123"
- Don't reuse passwords across environments
- Don't store passwords in Docker images

## 🌍 Environment-Specific Configs

### Development
```bash
# .env
NODE_ENV=development
DB_PASSWORD=dev_password_here
```

### Staging
```bash
# .env.staging
NODE_ENV=staging
DB_PASSWORD=staging_password_here
```

### Production
```bash
# .env.production
NODE_ENV=production
DB_PASSWORD=prod_password_here

# Use stronger production password!
# Example: xK9#mN$pQ2@wR7vL5&tY3
```

## 📊 Testing Database Connection

### Test with script
```bash
# Test PostgreSQL connection
./test-db-connection.sh
```

### Test manually
```bash
# Load environment
export $(cat .env | xargs)

# Test with psql
psql "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# Test with Prisma
npx prisma db push
```

## 🔐 Password Management Tips

### For Teams
1. **Use a password manager**:
   - 1Password
   - LastPass
   - Bitwarden

2. **Share securely**:
   - Use team password vault
   - Use encrypted channels
   - Never via email/Slack

3. **Document location**:
   - "DB password in 1Password under 'Portfolio DB'"
   - "See team vault for credentials"

### For Solo Developers
1. Store in system keychain
2. Use environment manager (direnv)
3. Keep backup in secure location

## ✅ Security Checklist

Before going to production:
- [ ] `.env` and `.env.local` are gitignored
- [ ] Strong password (20+ chars, mixed case, special chars)
- [ ] Different password for production
- [ ] Password stored securely (not in code)
- [ ] Team knows where to find password
- [ ] SSL enabled for production (`sslmode=require`)
- [ ] Connection timeout set appropriately
- [ ] Database firewall configured
- [ ] Regular password rotation scheduled

## 🎉 Summary

You now have secure password handling with:
- ✅ Interactive password prompts
- ✅ No hardcoded passwords
- ✅ Git-safe configuration
- ✅ Easy team onboarding
- ✅ Environment isolation

**To start your app securely:**
```bash
npm run docker:dev
# Enter password when prompted
```

That's it! 🚀

---

**Security Status**: ✅ Password Protected  
**Last Updated**: October 4, 2025

