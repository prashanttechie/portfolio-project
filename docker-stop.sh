#!/bin/bash

# Portfolio Website - Docker Stop Script
# Simple script to stop running containers

set -e

echo "🛑 Stopping Portfolio Website Containers"
echo "========================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running"
    exit 1
fi

# Stop all services
echo "Stopping all containers..."
docker-compose down

echo ""
echo "✅ All containers stopped successfully!"
echo ""
echo "To remove volumes as well, run:"
echo "  docker-compose down -v"

