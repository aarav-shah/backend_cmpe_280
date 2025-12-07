# Multi-AI Agent Backend - Quick Command Reference

## 🚀 Start Services

### Start All Docker Services
```bash
./start-services.sh
```

### Start Individual Services
```bash
# Redis
docker run -d --name multi-ai-redis -p 6379:6379 -v redis_data:/data redis:7-alpine redis-server --appendonly yes

# Qdrant
docker run -d --name multi-ai-qdrant -p 6333:6333 -p 6334:6334 -v qdrant_data:/qdrant/storage qdrant/qdrant:latest
```

---

## 🛑 Stop Services

```bash
# Stop all
./stop-services.sh

# Stop individual
docker stop multi-ai-redis
docker stop multi-ai-qdrant
```

---

## ✅ Check Status

```bash
# Run health check
./check-services.sh

# Check running containers
docker ps

# Test Redis
docker exec multi-ai-redis redis-cli ping

# Test Qdrant
curl http://localhost:6333/health
```

---

## 📊 View Logs

```bash
# Redis logs
docker logs multi-ai-redis
docker logs -f multi-ai-redis  # Follow

# Qdrant logs
docker logs multi-ai-qdrant
docker logs -f multi-ai-qdrant  # Follow
```

---

## 🔄 Restart Services

```bash
docker restart multi-ai-redis
docker restart multi-ai-qdrant
```

---

## 🗄️ Database Commands

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE multi_ai_db;"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

---

## 🧹 Cleanup

```bash
# Remove containers
docker stop multi-ai-redis multi-ai-qdrant
docker rm multi-ai-redis multi-ai-qdrant

# Remove volumes (⚠️ deletes data)
docker volume rm redis_data qdrant_data
```

---

## 🔧 Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

---

## 🔑 Environment Setup

1. Update `.env` with your credentials:
   - `DATABASE_URL` - MySQL connection
   - `JINA_API_KEY` - Get from https://jina.ai/
   - `GROQ_API_KEY` - Get from https://console.groq.com/
   - `JWT_SECRET` - Generate with: `openssl rand -base64 32`
   - Email settings for OTP

2. Generate JWT secret:
```bash
openssl rand -base64 32
```

---

## 🎯 Complete Startup

```bash
# 1. Start Docker services
./start-services.sh

# 2. Check health
./check-services.sh

# 3. Make sure database exists
mysql -u root -p -e "SHOW DATABASES;" | grep multi_ai_db

# 4. Run migrations (first time only)
npx prisma generate
npx prisma migrate dev

# 5. Start backend
npm run dev
```

---

## 🐛 Troubleshooting

### Port already in use
```bash
lsof -i :6379  # Find process using port
docker stop <container>  # Stop container
```

### Container already exists
```bash
docker start multi-ai-redis  # Start existing
# OR
docker rm multi-ai-redis  # Remove and recreate
```

### Redis not responding
```bash
docker logs multi-ai-redis
docker restart multi-ai-redis
```

### Qdrant not responding
```bash
docker logs multi-ai-qdrant
docker restart multi-ai-qdrant
```
