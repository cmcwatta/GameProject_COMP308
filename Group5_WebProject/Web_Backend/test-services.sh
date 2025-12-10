#!/bin/bash
# Test Script for AI-Powered Issue Tracker Backend Services
# Run this script to verify all services are functioning correctly

set -e

GATEWAY_URL="http://localhost:4000/graphql"
AUTH_URL="http://localhost:4001/graphql"
ISSUE_URL="http://localhost:4002/graphql"
AI_URL="http://localhost:4003/graphql"

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "AI-POWERED ISSUE TRACKER - SERVICE TESTS"
echo "=========================================="
echo ""

# Test health endpoints
echo -e "${YELLOW}[1/6] Testing Service Health Endpoints...${NC}"

echo "  Checking Auth Service (4001)..."
curl -s http://localhost:4001/health | jq '.' || echo -e "${RED}✗ Auth Service not responding${NC}"

echo "  Checking Issue Service (4002)..."
curl -s http://localhost:4002/health | jq '.' || echo -e "${RED}✗ Issue Service not responding${NC}"

echo "  Checking AI Service (4003)..."
curl -s http://localhost:4003/health | jq '.' || echo -e "${RED}✗ AI Service not responding${NC}"

echo "  Checking Gateway (4000)..."
curl -s http://localhost:4000/health | jq '.' || echo -e "${RED}✗ Gateway not responding${NC}"

echo -e "${GREEN}✓ Health check complete${NC}\n"

# Test User Registration
echo -e "${YELLOW}[2/6] Testing User Registration...${NC}"

REGISTER_RESPONSE=$(curl -s -X POST "$GATEWAY_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { register(email: \"test@example.com\", password: \"Test123!\", name: \"Test User\") { user { id email name role } token } }"
  }')

echo "$REGISTER_RESPONSE" | jq '.'

TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.register.token // empty')

if [ -z "$TOKEN" ]; then
  echo -e "${RED}✗ Failed to register user${NC}\n"
  exit 1
fi

echo -e "${GREEN}✓ User registered successfully${NC}"
echo -e "   Token: ${TOKEN:0:20}...${NC}\n"

# Test User Login
echo -e "${YELLOW}[3/6] Testing User Login...${NC}"

LOGIN_RESPONSE=$(curl -s -X POST "$GATEWAY_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(email: \"test@example.com\", password: \"Test123!\") { user { id email } token } }"
  }')

echo "$LOGIN_RESPONSE" | jq '.'
echo -e "${GREEN}✓ User login successful${NC}\n"

# Test Issue Creation
echo -e "${YELLOW}[4/6] Testing Issue Creation...${NC}"

ISSUE_RESPONSE=$(curl -s -X POST "$GATEWAY_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation { createIssue(title: \"Test Issue\", description: \"A test accessibility issue\", category: ACCESSIBILITY, latitude: 40.7580, longitude: -73.9855) { id title description category status location { latitude longitude } createdAt } }"
  }')

echo "$ISSUE_RESPONSE" | jq '.'

ISSUE_ID=$(echo "$ISSUE_RESPONSE" | jq -r '.data.createIssue.id // empty')

if [ -z "$ISSUE_ID" ]; then
  echo -e "${RED}✗ Failed to create issue${NC}\n"
else
  echo -e "${GREEN}✓ Issue created successfully${NC}"
  echo -e "   Issue ID: $ISSUE_ID${NC}\n"
fi

# Test Geospatial Query
echo -e "${YELLOW}[5/6] Testing Geospatial Query...${NC}"

NEARBY_RESPONSE=$(curl -s -X POST "$GATEWAY_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "query { getIssuesNearby(latitude: 40.7580, longitude: -73.9855, radius: 5) { id title category status location { latitude longitude } } }"
  }')

echo "$NEARBY_RESPONSE" | jq '.'
echo -e "${GREEN}✓ Geospatial query executed${NC}\n"

# Test Dashboard Metrics
echo -e "${YELLOW}[6/6] Testing Dashboard Metrics...${NC}"

METRICS_RESPONSE=$(curl -s -X POST "$GATEWAY_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "query { getDashboardMetrics { totalIssues resolvedIssues pendingIssues averageResolutionTime categoriesBreakdown { category count percentage } } }"
  }')

echo "$METRICS_RESPONSE" | jq '.'
echo -e "${GREEN}✓ Dashboard metrics retrieved${NC}\n"

echo "=========================================="
echo -e "${GREEN}✓ All tests completed successfully!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Open Apollo Studio at http://localhost:4000/graphql"
echo "2. Copy the token from above and add to headers:"
echo "   {\"Authorization\": \"Bearer $TOKEN\"}"
echo "3. Try more complex queries using the GraphQL explorer"
echo ""
