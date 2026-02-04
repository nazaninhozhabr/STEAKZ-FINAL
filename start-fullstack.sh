#!/bin/bash

# MIS Project - Full Stack Startup Script
# This script starts both the backend and frontend servers

set -e  # Exit on error

echo "🚀 Starting MIS Project Full Stack..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_ROOT="/Users/nazanin/Desktop/MIS-FINAL"
BACKEND_DIR="$PROJECT_ROOT/steakz-backend"
FRONTEND_DIR="$PROJECT_ROOT/MIS-PROJECT"

# Check if backend and frontend directories exist
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Backend directory not found: $BACKEND_DIR${NC}"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}❌ Frontend directory not found: $FRONTEND_DIR${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Starting Backend Server...${NC}"
cd "$BACKEND_DIR"

# Check if node_modules exists for backend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚙️  Installing backend dependencies...${NC}"
    npm install
fi

# Start backend in background
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
echo -e "   📍 http://localhost:3001${NC}"
echo ""

# Wait a moment for backend to start
sleep 3

echo -e "${BLUE}📋 Starting Frontend Server...${NC}"
cd "$FRONTEND_DIR"

# Check if node_modules exists for frontend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚙️  Installing frontend dependencies...${NC}"
    npm install
fi

# Start frontend in background
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
echo -e "   📍 http://localhost:5176${NC}"
echo ""

echo -e "${GREEN}✅ Both servers are running!${NC}"
echo ""
echo -e "${YELLOW}📝 Instructions:${NC}"
echo "   - Backend: http://localhost:3001"
echo "   - Frontend: http://localhost:5176"
echo "   - Press Ctrl+C to stop all servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}✅ Servers stopped${NC}"
}

# Setup cleanup trap
trap cleanup EXIT

# Wait for both processes
wait
