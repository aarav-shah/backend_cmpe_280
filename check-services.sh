#!/bin/bash

echo "📊 Service Health Check"
echo "======================="

# Redis
echo -n "Redis:   "
if docker exec multi-ai-redis redis-cli ping &> /dev/null; then
    echo "✅ Running"
else
    echo "❌ Down"
fi

# Qdrant
echo -n "Qdrant:  "
if curl -s http://localhost:6333/health &> /dev/null; then
    echo "✅ Running"
else
    echo "❌ Down"
fi

# MySQL
echo -n "MySQL:   "
if mysqladmin ping -h localhost &> /dev/null 2>&1; then
    echo "✅ Running"
elif command -v mysql &> /dev/null; then
    echo "⚠️  Needs credentials"
else
    echo "❌ Not installed"
fi

echo ""
echo "Docker Containers:"
docker ps --filter "name=multi-ai" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
