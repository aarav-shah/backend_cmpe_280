#!/bin/bash

echo "🚀 Starting Multi-AI Agent Services..."

# Check if Redis container exists
if [ "$(docker ps -a -q -f name=multi-ai-redis)" ]; then
    echo "Starting existing Redis container..."
    docker start multi-ai-redis
else
    echo "Creating new Redis container..."
    docker run -d \
      --name multi-ai-redis \
      -p 6379:6379 \
      -v redis_data:/data \
      redis:7-alpine redis-server --appendonly yes
fi

# Check if Qdrant container exists
if [ "$(docker ps -a -q -f name=multi-ai-qdrant)" ]; then
    echo "Starting existing Qdrant container..."
    docker start multi-ai-qdrant
else
    echo "Creating new Qdrant container..."
    docker run -d \
      --name multi-ai-qdrant \
      -p 6333:6333 \
      -p 6334:6334 \
      -v qdrant_data:/qdrant/storage \
      qdrant/qdrant:latest
fi

echo "✅ Services started!"
echo ""
echo "Verification:"
echo "Redis:   $(docker exec multi-ai-redis redis-cli ping 2>&1)"
echo "Qdrant:  $(curl -s http://localhost:6333/health | grep -o '"title":"healthz"' || echo 'Starting...')"
