# Setup Guide - Ubuntu Self-Hosted Server

This guide will help you deploy the Couples App backend on your Ubuntu home server.

## Prerequisites

- Ubuntu 20.04 or later
- Docker and Docker Compose installed
- At least 2GB RAM
- 10GB free disk space

## Step 1: Install Docker

```bash
# Update package index
sudo apt update

# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker compose version
```

## Step 2: Clone and Configure

```bash
# Clone the repository (or copy files to your server)
cd /home/your-user
git clone <repository-url> Dating
cd Dating

# Copy environment file
cp env.example .env

# Edit .env with your configuration
nano .env
```

### Required .env Configuration

```env
# Database Configuration
DATABASE_NAME=couples_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_secure_password_here
DB_PORT=5432

# Backend Configuration
SERVER_PORT=8080
JWT_SECRET=your-very-long-secret-key-minimum-256-bits-for-production-use

# Upload Directory
UPLOAD_DIR=/home/your-user/couples-app/uploads
```

**Important**: 
- Use a strong password for `DATABASE_PASSWORD`
- Generate a secure `JWT_SECRET` (at least 32 characters, random)
- Create the upload directory: `mkdir -p /home/your-user/couples-app/uploads`

## Step 3: Start Services

```bash
# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f backend
```

## Step 4: Initialize Database

```bash
# Wait for database to be ready (about 10 seconds)
sleep 10

# Initialize schema
docker exec -i couples_db psql -U postgres -d couples_db < database/schema.sql

# Verify tables were created
docker exec -it couples_db psql -U postgres -d couples_db -c "\dt"
```

## Step 5: Configure Firewall

```bash
# Allow HTTP/HTTPS (if using reverse proxy)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Or allow direct backend access (not recommended for production)
sudo ufw allow 8080/tcp

# Enable firewall
sudo ufw enable
```

## Step 6: Test Backend

```bash
# Test health (should return 401 - expected, means server is running)
curl http://localhost:8080/api/couple/status

# Test from another machine (replace with your server IP)
curl http://YOUR_SERVER_IP:8080/api/couple/status
```

## Step 7: Configure Mobile App

1. Find your server's IP address:
   ```bash
   hostname -I
   ```

2. Edit `mobile/src/config/api.ts`:
   ```typescript
   BASE_URL: 'http://YOUR_SERVER_IP:8080/api',
   ```

3. For production, consider using a domain name with SSL:
   ```typescript
   BASE_URL: 'https://your-domain.com/api',
   ```

## Step 8: Production Considerations

### Reverse Proxy (Recommended)

Use Nginx as a reverse proxy for SSL and better security:

```bash
# Install Nginx
sudo apt install nginx

# Create configuration
sudo nano /etc/nginx/sites-available/couples-app
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/couples-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

### Auto-start on Boot

Docker Compose services should auto-start, but verify:

```bash
# Check if services are set to restart
docker compose ps

# If not, update docker-compose.yml to include:
# restart: unless-stopped
```

## Maintenance

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f postgres
```

### Backup Database
```bash
# Create backup
docker exec couples_db pg_dump -U postgres couples_db > backup_$(date +%Y%m%d).sql

# Restore backup
docker exec -i couples_db psql -U postgres couples_db < backup_20240101.sql
```

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Monitor Resources
```bash
# Check container resource usage
docker stats

# Check disk usage
df -h
docker system df
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if database is running
docker compose ps postgres

# Check database logs
docker compose logs postgres

# Test connection
docker exec -it couples_db psql -U postgres -d couples_db
```

### Backend Won't Start
```bash
# Check logs
docker compose logs backend

# Check if port is in use
sudo netstat -tulpn | grep 8080

# Restart service
docker compose restart backend
```

### Image Upload Issues
```bash
# Check upload directory permissions
ls -la /home/your-user/couples-app/uploads

# Fix permissions if needed
sudo chown -R $USER:$USER /home/your-user/couples-app/uploads
chmod -R 755 /home/your-user/couples-app/uploads
```

### Out of Disk Space
```bash
# Clean up Docker
docker system prune -a

# Remove old images
docker image prune -a

# Check upload directory size
du -sh /home/your-user/couples-app/uploads
```

## Security Checklist

- [ ] Changed default database password
- [ ] Generated strong JWT secret (32+ characters)
- [ ] Configured firewall (UFW)
- [ ] Set up SSL/HTTPS (Let's Encrypt)
- [ ] Restricted database port (only accessible from backend)
- [ ] Regular backups configured
- [ ] Updated system packages
- [ ] Limited SSH access
- [ ] Set up monitoring/logging

## Support

For issues:
1. Check logs: `docker compose logs`
2. Verify configuration: `.env` file
3. Test connectivity: `curl` commands
4. Check system resources: `docker stats`

## Next Steps

1. Set up automated backups
2. Configure monitoring (e.g., Prometheus, Grafana)
3. Set up log aggregation
4. Configure domain name and SSL
5. Test mobile app connection
6. Create user accounts and test pairing

