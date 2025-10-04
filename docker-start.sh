#!/bin/bash

# Portfolio Website - Docker Start Script
# Simple script to start the application with Docker

set -e

echo "🐳 Portfolio Website - Docker Start"
echo "=================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running"
    echo "Please start Docker Desktop and try again"
    exit 1
fi

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

