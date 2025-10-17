#!/usr/bin/env bash

# Emergency Disk Cleanup Script for Ubuntu Server
# Run this on the server when disk is full

echo "🚨 Emergency Disk Cleanup"
echo "========================="
echo ""

# Check current disk usage
echo "📊 Current disk usage:"
df -h /
echo ""

# 1. Clean APT cache
echo "🧹 Cleaning APT cache..."
sudo apt-get clean
sudo apt-get autoclean -y
sudo apt-get autoremove -y
echo "✅ APT cache cleaned"
echo ""

# 2. Clean journal logs (keep only 2 days)
echo "🧹 Cleaning system logs..."
sudo journalctl --vacuum-time=2d
echo "✅ Logs cleaned"
echo ""

# 3. Clean Docker (CRITICAL)
echo "🐳 Cleaning Docker..."
echo "This will remove:"
echo "  - All stopped containers"
echo "  - All unused images"
echo "  - All unused volumes"
echo "  - All build cache"
echo ""

# Stop non-essential containers first
docker ps --format "{{.Names}}" | grep -v portfolio | xargs -r docker stop 2>/dev/null || true

# Remove stopped containers
docker container prune -f

# Remove unused images
docker image prune -a -f

# Remove unused volumes (CAREFUL - only unused ones)
docker volume prune -f

# Remove build cache
docker builder prune -a -f

echo "✅ Docker cleaned"
echo ""

# 4. Remove old kernels (if any)
echo "🧹 Removing old kernels..."
sudo apt-get autoremove --purge -y
echo ""

# 5. Check for large files
echo "📊 Finding largest files..."
sudo du -h / 2>/dev/null | sort -rh | head -20 | grep -v "/proc\|/sys\|/dev"
echo ""

# Final disk usage
echo "📊 Disk usage after cleanup:"
df -h /
echo ""

echo "🎯 Space freed!"
echo ""
echo "💡 If still low on space:"
echo "  1. Increase server disk size (recommended: 20GB minimum)"
echo "  2. Remove old Docker images: docker images -a"
echo "  3. Check /var/log for large files: sudo du -sh /var/log/*"
echo "  4. Check /tmp: sudo du -sh /tmp/*"
echo ""

