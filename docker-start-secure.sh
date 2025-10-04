#!/bin/bash

# Portfolio Website - Secure Docker Start Script
# Prompts for database host and password before starting

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
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio-data
DB_USER=postgres
DB_PASSWORD=

# Node Environment
NODE_ENV=development
EOF
fi

# Prompt for database connection details
echo "🔐 Database Connection Setup"
echo "----------------------------"
echo ""

# Prompt for host
read -p "Enter database host (default: localhost): " DB_HOST_INPUT
DB_HOST=${DB_HOST_INPUT:-localhost}
echo ""

# Prompt for password
read -sp "Enter PostgreSQL password: " DB_PASSWORD
echo ""
echo ""

# Validate password is not empty
if [ -z "$DB_PASSWORD" ]; then
    echo "❌ Error: Password cannot be empty"
    exit 1
fi

# Display configuration
echo "Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: 5432"
echo "  Database: portfolio-data"
echo "  User: postgres"
echo ""

# Update .env file with host and password
echo "📝 Updating .env file..."
sed -i.bak "s/DB_HOST=.*/DB_HOST=$DB_HOST/" .env
sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
rm -f .env.bak

# Also update .env.local for local development
echo "DATABASE_URL=\"postgresql://postgres:${DB_PASSWORD}@${DB_HOST}:5432/portfolio-data?connect_timeout=10&sslmode=prefer\"" > .env.local

echo ""
echo "✅ Database configuration saved successfully!"
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
        docker compose up app-dev
        ;;
    2)
        echo ""
        echo "🏭 Building and starting production server..."
        echo "============================================="
        docker compose up --build app
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

