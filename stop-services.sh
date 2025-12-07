#!/bin/bash

echo "🛑 Stopping Multi-AI Agent Services..."

docker stop multi-ai-redis multi-ai-qdrant 2>/dev/null

echo "✅ Services stopped!"
