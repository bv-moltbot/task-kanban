#!/bin/bash

echo "📦 Task Kanban - Starting deployment..."

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci --production=false
fi

# Build Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Start production server
echo "🚀 Starting production server..."
npm run start
