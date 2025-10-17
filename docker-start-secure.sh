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

# Create .env.production file for server deployment
cat > .env.production << EOF
# Database Configuration
DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@${DB_HOST}:5432/portfolio-data?connect_timeout=10&sslmode=prefer"

# Razorpay Configuration
RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
NEXT_PUBLIC_RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
RAZORPAY_WEBHOOK_SECRET=${RAZORPAY_WEBHOOK_SECRET}

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=production
EOF

echo "✅ .env.production created for server deployment"
echo ""

# Ask user which mode to run
echo "Select mode:"
echo "1) Development (with hot reload)"
echo "2) Production (optimized build)"
echo "3) Deploy to server (builds and uploads)"
read -p "Enter choice (1, 2, or 3): " choice

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
    3)
        echo ""
        echo "🌐 Deploy to Server"
        echo "==================="
        read -p "Enter server address (e.g., 210.79.128.171): " SERVER_IP
        read -p "Enter server user (default: ubuntu): " SERVER_USER
        SERVER_USER=${SERVER_USER:-ubuntu}
        read -p "Enter SSH key path (default: ssh-secret/ai-experiment): " SSH_KEY
        SSH_KEY=${SSH_KEY:-ssh-secret/ai-experiment}
        
        echo ""
        echo "📤 Uploading files to server..."
        
        # Upload .env.production
        scp -i "$SSH_KEY" .env.production "${SERVER_USER}@${SERVER_IP}:~/portfolio-project/" || {
            echo "❌ Failed to upload .env.production"
            echo "Creating remote directory and retrying..."
            ssh -i "$SSH_KEY" "${SERVER_USER}@${SERVER_IP}" "mkdir -p ~/portfolio-project"
            scp -i "$SSH_KEY" .env.production "${SERVER_USER}@${SERVER_IP}:~/portfolio-project/"
        }
        
        # Upload docker-compose.yml
        scp -i "$SSH_KEY" docker-compose.yml "${SERVER_USER}@${SERVER_IP}:~/portfolio-project/"
        
        # Sync entire project (excluding large directories)
        echo "📦 Syncing project files..."
        rsync -avz --progress \
            --exclude 'node_modules' \
            --exclude '.next' \
            --exclude '.git' \
            --exclude '*.log' \
            --exclude '.env.local' \
            -e "ssh -i $SSH_KEY" \
            ./ "${SERVER_USER}@${SERVER_IP}:~/portfolio-project/" || {
            echo "⚠️  Rsync not available, using tar method..."
            tar czf - --exclude='node_modules' --exclude='.next' --exclude='.git' . | \
            ssh -i "$SSH_KEY" "${SERVER_USER}@${SERVER_IP}" "cd ~/portfolio-project && tar xzf -"
        }
        
        echo ""
        echo "🐳 Deploying on server..."
        ssh -i "$SSH_KEY" "${SERVER_USER}@${SERVER_IP}" << 'ENDSSH'
cd ~/portfolio-project

echo "🛑 Stopping current containers..."
docker compose down 2>/dev/null || true

echo "🧹 Cleaning old images..."
docker image prune -f

echo "🏗️  Building production image..."
docker compose build app

echo "🚀 Starting production server..."
docker compose up -d app

echo "⏳ Waiting for app to start..."
sleep 5

echo "✅ Checking status..."
docker ps | grep portfolio

echo ""
echo "📊 Recent logs:"
docker logs portfolio-app --tail=20

echo ""
echo "🔍 Verifying environment variables..."
docker exec portfolio-app env | grep -E '(DATABASE|RAZORPAY)' | sed 's/=.*/=***/'

ENDSSH
        
        echo ""
        echo "✅ Deployment complete!"
        echo ""
        echo "🌐 Your app should be accessible at:"
        echo "   http://${SERVER_IP}:3000"
        if [ "$DB_HOST" != "localhost" ] && [ "$DB_HOST" != "127.0.0.1" ]; then
            echo "   or http://pkmai.duckdns.org (if DNS is configured)"
        fi
        echo ""
        echo "📊 View logs:"
        echo "   ssh -i $SSH_KEY ${SERVER_USER}@${SERVER_IP} 'docker logs portfolio-app -f'"
        echo ""
        echo "🔄 Restart app:"
        echo "   ssh -i $SSH_KEY ${SERVER_USER}@${SERVER_IP} 'cd ~/portfolio-project && docker compose restart app'"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

