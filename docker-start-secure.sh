#!/bin/bash

# Portfolio Website - Secure Docker Start Script
# Prompts for database host and password before starting

set -e

echo "🐳 Portfolio Website - Secure Docker Start"
echo "==========================================="
echo ""

# Check if Docker is available
if ! command -v docker > /dev/null 2>&1; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker and try again"
    echo "Visit: https://docs.docker.com/engine/install/"
    exit 1
fi

# Check if Docker daemon is accessible (works on both Mac and Linux)
if ! docker ps > /dev/null 2>&1; then
    # Try with sudo on Linux
    if sudo docker ps > /dev/null 2>&1; then
        echo "⚠️  Note: Docker requires sudo on this system"
        echo "You may want to add your user to the docker group:"
        echo "  sudo usermod -aG docker \$USER"
        echo "  Then logout and login again"
        echo ""
        USE_SUDO="sudo"
    else
        echo "❌ Error: Docker daemon is not running"
        echo "Please start Docker and try again"
        exit 1
    fi
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
echo "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: 5432"
echo "  Database: portfolio-data"
echo "  User: postgres"
echo ""

# Prompt for Razorpay credentials
echo "💳 Razorpay Configuration"
echo "-------------------------"
echo "(Get keys from: https://dashboard.razorpay.com/app/keys)"
echo ""

read -p "Enter Razorpay Key ID (e.g., rzp_test_...): " RAZORPAY_KEY_ID
if [ -z "$RAZORPAY_KEY_ID" ]; then
    echo "⚠️  Warning: Razorpay Key ID is empty. Payment features will not work."
fi
echo ""

read -sp "Enter Razorpay Key Secret: " RAZORPAY_KEY_SECRET
echo ""
if [ -z "$RAZORPAY_KEY_SECRET" ]; then
    echo "⚠️  Warning: Razorpay Key Secret is empty. Payment features will not work."
fi
echo ""

read -sp "Enter Razorpay Webhook Secret (optional): " RAZORPAY_WEBHOOK_SECRET
echo ""
echo ""

# Display Razorpay configuration
echo "Razorpay Configuration:"
echo "  Key ID: ${RAZORPAY_KEY_ID:0:15}..."
echo "  Key Secret: ********"
if [ -n "$RAZORPAY_WEBHOOK_SECRET" ]; then
    echo "  Webhook Secret: ********"
fi
echo ""

# Update .env file with all configurations
echo "📝 Updating .env file..."
sed -i.bak "s/DB_HOST=.*/DB_HOST=$DB_HOST/" .env
sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
rm -f .env.bak

# Create/update .env.local with all configurations
cat > .env.local << EOF
# Database Configuration
DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@${DB_HOST}:5432/portfolio-data?connect_timeout=10&sslmode=prefer"

# Razorpay Configuration
RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
NEXT_PUBLIC_RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
RAZORPAY_WEBHOOK_SECRET=${RAZORPAY_WEBHOOK_SECRET}

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOF

echo ""
echo "✅ Configuration saved successfully!"
echo "   - Database: Connected to $DB_HOST"
echo "   - Razorpay: ${RAZORPAY_KEY_ID:0:15}..."
echo "   - Config file: .env.local"
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
        ${USE_SUDO} docker compose up app-dev
        ;;
    2)
        echo ""
        echo "🏭 Building and starting production server..."
        echo "============================================="
        ${USE_SUDO} docker compose up --build app
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

