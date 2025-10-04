#!/usr/bin/env bash

# Nginx Reverse Proxy Setup for Portfolio
# Maps port 80 -> port 3000

set -e

echo "🔧 Setting up Nginx Reverse Proxy"
echo "================================="
echo ""

# Check if running on Ubuntu/Debian
if ! command -v apt-get > /dev/null 2>&1; then
    echo "❌ Error: This script is for Ubuntu/Debian systems"
    exit 1
fi

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt-get update -qq
sudo apt-get install -y nginx

# Create Nginx configuration
echo "📝 Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/portfolio > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    
    server_name pkmai.duckdns.org;

    # Increase buffer sizes for large requests
    client_max_body_size 10M;
    
    # Logging
    access_log /var/log/nginx/portfolio-access.log;
    error_log /var/log/nginx/portfolio-error.log;

    # Proxy settings
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        
        # WebSocket support (for Next.js hot reload)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Forward real client IP
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Enable the site
echo "✅ Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
if sudo nginx -t; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration test failed"
    exit 1
fi

# Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Configure firewall
echo "🔥 Configuring firewall..."
if command -v ufw > /dev/null 2>&1; then
    sudo ufw allow 'Nginx Full'
    sudo ufw allow 80/tcp
    sudo ufw status
fi

echo ""
echo "🎉 Nginx setup complete!"
echo ""
echo "📊 Status:"
sudo systemctl status nginx --no-pager | head -5
echo ""
echo "✅ Your site should now be accessible at:"
echo "   http://pkmai.duckdns.org"
echo ""
echo "📝 Configuration file:"
echo "   /etc/nginx/sites-available/portfolio"
echo ""
echo "📊 View logs:"
echo "   sudo tail -f /var/log/nginx/portfolio-access.log"
echo "   sudo tail -f /var/log/nginx/portfolio-error.log"
echo ""
echo "🔧 Useful commands:"
echo "   sudo systemctl status nginx    # Check status"
echo "   sudo systemctl restart nginx   # Restart"
echo "   sudo nginx -t                  # Test config"
echo ""

