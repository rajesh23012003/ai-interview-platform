#!/bin/bash
# ==============================================================================
# PrepMind AI Interview Platform - 1-Click AWS EC2 Deployment Script
# Supports: Ubuntu 22.04 LTS / Ubuntu 24.04 LTS (Amazon EC2)
# ==============================================================================

set -e

echo "🚀 [1/6] Updating System Packages..."
sudo apt update -y && sudo apt upgrade -y

echo "📦 [2/6] Installing Node.js 20 LTS, Git, and Build Tools..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential nginx

echo "🛠️ [3/6] Installing Global Process Manager (PM2)..."
sudo npm install -g pm2

echo "📂 [4/6] Installing Project Dependencies & Building Frontend..."
# Install backend dependencies
cd backend && npm install --omit=dev
cd ..

# Install frontend dependencies and build production dist
cd frontend && npm install
npm run build
cd ..

echo "🌐 [5/6] Configuring Nginx Reverse Proxy (Port 80 -> Port 5050)..."
sudo tee /etc/nginx/sites-available/default > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    client_max_body_size 25M;

    location / {
        proxy_pass http://127.0.0.1:5050;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "⚡ [6/6] Launching Application with PM2..."
pm2 stop prepmind-ai || true
pm2 delete prepmind-ai || true
PORT=5050 pm2 start backend/server.js --name "prepmind-ai"
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME || true

PUBLIC_IP=$(curl -s http://checkip.amazonaws.com || curl -s ifconfig.me || echo "<YOUR-EC2-PUBLIC-IP>")

echo "=============================================================================="
echo "🎉 DEPLOYMENT COMPLETE! PrepMind AI is LIVE!"
echo "👉 Open in your browser: http://${PUBLIC_IP}"
echo "=============================================================================="
