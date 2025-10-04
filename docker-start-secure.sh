#!/bin/bash

# Portfolio Website - Secure Docker Start Script
# Prompts for database password before starting

set -e

echo "🐳 Portfolio Website - Secure Docker Start"
echo "==========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running"
    echo "Please start Docker Desktop and try again"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env 2>/dev/null || cat > .env << 'EOF'
# Database Configuration
DB_HOST=210.79.129.8
DB_PORT=5432
DB_NAME=portfolio-data
DB_USER=postgres
DB_PASSWORD=

# Node Environment
NODE_ENV=development
EOF
fi

# Prompt for password
echo "🔐 Database Connection Setup"
echo "----------------------------"
echo "Host: 210.79.129.8"
echo "Database: portfolio-data"
echo "User: postgres"
echo ""
read -sp "Enter PostgreSQL password: " DB_PASSWORD
echo ""

# Validate password is not empty
if [ -z "$DB_PASSWORD" ]; then
    echo "❌ Error: Password cannot be empty"
    exit 1
fi

# Update .env file with password
echo "📝 Updating .env file..."
sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
rm -f .env.bak

# Also update .env.local for local development
echo "DATABASE_URL=\"postgresql://postgres:${DB_PASSWORD}@210.79.129.8:5432/portfolio-data?connect_timeout=10&sslmode=prefer\"" > .env.local

echo ""
echo "✅ Password configured successfully!"
echo ""

# Ask user which mode to run
echo "Select mode:"
echo "1) Development (with hot reload)"
echo "2) Production (optimized build)"
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting development server..."
        echo "=================================="
        docker-compose up app-dev
        ;;
    2)
        echo ""
        echo "🏭 Building and starting production server..."
        echo "============================================="
        docker-compose up --build app
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

