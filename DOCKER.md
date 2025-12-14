# 🐳 Docker Deployment Guide

This guide explains how to run the Breadzy application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### 1. Configure Environment Variables

Copy the Docker environment template:

```bash
cp .env.docker .env
```

**IMPORTANT**: Edit `.env` and change the `JWT_SECRET` to a strong random string (minimum 64 characters).

### 2. Build and Run

Start all services (MongoDB, Backend, Frontend):

```bash
docker-compose up -d
```

This will:
- Pull MongoDB 7.0 image
- Build the backend Docker image
- Build the frontend Docker image
- Start all services with health checks

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5050
- **API Documentation**: http://localhost:5050/api-docs
- **MongoDB**: localhost:27017

### 4. Check Service Status

```bash
docker-compose ps
```

View logs:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

## Development vs Production

### Development Mode

For local development with hot-reload, use the regular npm commands:

```bash
# Backend
cd be
npm install
npm run dev

# Frontend
cd fe
npm install
npm start
```

### Production Mode

Use Docker Compose for production deployment:

```bash
docker-compose up -d
```

## Docker Commands

### Build Services

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend

# Build without cache
docker-compose build --no-cache
```

### Start/Stop Services

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### View Logs

```bash
# Follow all logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f backend
```

### Execute Commands in Containers

```bash
# Backend shell
docker-compose exec backend sh

# MongoDB shell
docker-compose exec mongodb mongosh breadzy

# Frontend shell
docker-compose exec frontend sh
```

## Architecture

### Services

1. **MongoDB** (Port 27017)
   - Database service
   - Persistent volume: `mongodb_data`
   - Health check: mongosh ping

2. **Backend** (Port 5050)
   - Node.js/Express API
   - Connects to MongoDB
   - Persistent volume: `backend_uploads`
   - Health check: /health endpoint

3. **Frontend** (Port 3000)
   - Angular 20 application
   - Served by nginx
   - Proxies API requests to backend
   - Health check: wget localhost

### Volumes

- `mongodb_data`: MongoDB database files
- `mongodb_config`: MongoDB configuration
- `backend_uploads`: User uploaded files

### Network

All services communicate through the `breadzy-network` bridge network.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT tokens | (must change in production) |
| `NODE_ENV` | Environment mode | production |
| `PORT` | Backend port | 5050 |
| `MONGO_URL` | MongoDB connection string | mongodb://mongodb:27017/breadzy |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `COOKIE_SECURE` | Use secure cookies | false |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | 10 |
| `MAX_FILE_SIZE` | Max upload file size | 5242880 (5MB) |

## Troubleshooting

### Services won't start

Check logs:
```bash
docker-compose logs
```

### MongoDB connection failed

Ensure MongoDB is healthy:
```bash
docker-compose ps
docker-compose logs mongodb
```

### Port already in use

Change ports in `docker-compose.yml`:
```yaml
ports:
  - "5051:5050"  # Backend
  - "3001:80"    # Frontend
  - "27018:27017" # MongoDB
```

### Reset everything

```bash
# Stop and remove all containers, networks, volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```

## Production Deployment

### Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string (64+ characters)
- [ ] Set `NODE_ENV=production`
- [ ] Set `COOKIE_SECURE=true` if using HTTPS
- [ ] Update `CORS_ORIGIN` to your production domain
- [ ] Use environment-specific `.env` file
- [ ] Enable MongoDB authentication
- [ ] Use Docker secrets for sensitive data
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up log aggregation
- [ ] Configure automated backups

### Recommended Production Setup

1. Use Docker Swarm or Kubernetes for orchestration
2. Set up reverse proxy (nginx/Traefik) with SSL
3. Configure MongoDB replica set
4. Use external volumes for data persistence
5. Implement monitoring (Prometheus/Grafana)
6. Set up automated backups
7. Use Docker secrets instead of environment variables

## Backup and Restore

### Backup MongoDB

```bash
# Create backup
docker-compose exec mongodb mongodump --out=/data/backup

# Copy backup to host
docker cp breadzy-mongodb:/data/backup ./mongodb-backup
```

### Restore MongoDB

```bash
# Copy backup to container
docker cp ./mongodb-backup breadzy-mongodb:/data/backup

# Restore
docker-compose exec mongodb mongorestore /data/backup
```

## Performance Optimization

### Multi-stage Builds

Both Dockerfiles use multi-stage builds to:
- Reduce final image size
- Separate build dependencies from runtime
- Improve build caching

### Nginx Caching

Frontend nginx is configured with:
- Gzip compression
- Static asset caching (1 year)
- No caching for index.html
- Security headers

### Health Checks

All services have health checks to ensure:
- Proper startup order
- Automatic restart on failure
- Load balancer integration

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
