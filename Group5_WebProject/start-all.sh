#!/bin/bash

# AI-Powered Issue Tracker - Unified Startup Script
# This script starts all 9 services in the background with proper logging

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}AI-Powered Local Issue Tracker${NC}"
echo -e "${BLUE}Starting All Services...${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if MongoDB is running
echo -e "${YELLOW}[1/10] Checking MongoDB...${NC}"
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${YELLOW}MongoDB not running. Please start it separately:${NC}"
    echo "  mongod"
    echo ""
fi

# Create logs directory
mkdir -p logs

# Function to start a service
start_service() {
    local service=$1
    local port=$2
    local dir=$3
    
    echo -e "${YELLOW}Starting ${service} on port ${port}...${NC}"
    
    cd "$dir"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        npm install > "../logs/${service}.install.log" 2>&1 &
    fi
    
    # Start service
    npm run dev > "../logs/${service}.log" 2>&1 &
    local pid=$!
    echo -e "${GREEN}✓ ${service} started (PID: $pid)${NC}"
    
    cd - > /dev/null
}

# Start Backend Services
echo ""
echo -e "${BLUE}Starting Backend Services...${NC}"

start_service "auth-service" "4001" "Web_Backend/auth-service"
sleep 2

start_service "issue-service" "4002" "Web_Backend/issue-service"
sleep 2

start_service "ai-service" "4003" "Web_Backend/ai-service"
sleep 2

start_service "notification-service" "4005" "Web_Backend/notification-service"
sleep 2

start_service "gateway" "4000" "Web_Backend/gateway"
sleep 3

# Start Frontend Services
echo ""
echo -e "${BLUE}Starting Frontend Applications...${NC}"

start_service "auth-frontend" "5173" "Web_Frontend/auth_frontend"
sleep 1

start_service "issue-frontend" "5174" "Web_Frontend/issue_frontend"
sleep 1

start_service "analytics-frontend" "5173+" "Web_Frontend/analytics_frontend"
sleep 1

start_service "chatbot-frontend" "5175" "Web_Frontend/chatbot_frontend"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ All services started!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Services Running:${NC}"
echo "  Auth Frontend:      http://localhost:5173"
echo "  Issue Frontend:     http://localhost:5174"
echo "  Analytics Frontend: http://localhost:5173+"
echo "  Chatbot Frontend:   http://localhost:5175"
echo ""
echo "  GraphQL API:        http://localhost:4000/graphql"
echo "  Apollo Studio:      https://studio.apollographql.com"
echo ""
echo -e "${BLUE}Logs saved to: ./logs/${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop monitoring${NC}"
echo -e "${YELLOW}Services will continue running in background${NC}"
echo ""

# Monitor services (optional)
wait
