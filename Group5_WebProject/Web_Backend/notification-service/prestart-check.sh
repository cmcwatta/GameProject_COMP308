#!/bin/bash
# Notification Service - Pre-Start Checklist
# Use this to verify everything is ready before starting the service

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Notification Service - Pre-Start Checklist              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

PASS="✅"
FAIL="❌"
INFO="ℹ️ "

checks_passed=0
checks_total=0

# Function to check command
check_command() {
    checks_total=$((checks_total + 1))
    if command -v $1 &> /dev/null; then
        echo "$PASS $2"
        checks_passed=$((checks_passed + 1))
    else
        echo "$FAIL $2 (not found, install required)"
    fi
}

# Function to check file
check_file() {
    checks_total=$((checks_total + 1))
    if [ -f "$1" ]; then
        echo "$PASS $2"
        checks_passed=$((checks_passed + 1))
    else
        echo "$FAIL $2 (file not found)"
    fi
}

# Function to check directory
check_dir() {
    checks_total=$((checks_total + 1))
    if [ -d "$1" ]; then
        echo "$PASS $2"
        checks_passed=$((checks_passed + 1))
    else
        echo "$FAIL $2 (directory not found)"
    fi
}

echo "📦 Checking Prerequisites..."
check_command "node" "Node.js installed"
check_command "npm" "npm installed"
check_command "mongosh" "MongoDB CLI installed (optional)"

echo ""
echo "📁 Checking Project Files..."
check_file "package.json" "package.json exists"
check_file ".env" ".env file exists"
check_dir "node_modules" "node_modules directory exists"
check_dir "graphql" "GraphQL directory exists"
check_dir "models" "Models directory exists"
check_dir "services" "Services directory exists"
check_dir "config" "Config directory exists"

echo ""
echo "🔐 Checking Environment Configuration..."
if [ -f ".env" ]; then
    if grep -q "PORT=4005" .env; then
        echo "$PASS PORT configured (4005)"
        checks_passed=$((checks_passed + 1))
    else
        echo "$FAIL PORT not configured"
    fi
    checks_total=$((checks_total + 1))
    
    if grep -q "WS_PORT=8080" .env; then
        echo "$PASS WebSocket port configured (8080)"
        checks_passed=$((checks_passed + 1))
    else
        echo "$FAIL WebSocket port not configured"
    fi
    checks_total=$((checks_total + 1))
    
    if grep -q "NOTIFICATION_MONGO_URI" .env; then
        echo "$PASS MongoDB URI configured"
        checks_passed=$((checks_passed + 1))
    else
        echo "$FAIL MongoDB URI not configured"
    fi
    checks_total=$((checks_total + 1))
fi

echo ""
echo "🗄️  Checking MongoDB..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        echo "$PASS MongoDB is running"
        checks_passed=$((checks_passed + 1))
    else
        echo "$FAIL MongoDB is not running"
    fi
    checks_total=$((checks_total + 1))
else
    echo "$INFO MongoDB CLI not installed (but service might still work)"
    echo "   To check MongoDB is running: mongosh"
    echo "   Or start with Docker: docker run -d -p 27017:27017 mongo:latest"
fi

echo ""
echo "📦 Checking NPM Scripts..."
if grep -q '"dev"' package.json; then
    echo "$PASS npm run dev script configured"
    checks_passed=$((checks_passed + 1))
else
    echo "$FAIL npm run dev script not found"
fi
checks_total=$((checks_total + 1))

if grep -q '"verify"' package.json; then
    echo "$PASS npm run verify script configured"
    checks_passed=$((checks_passed + 1))
else
    echo "$FAIL npm run verify script not found"
fi
checks_total=$((checks_total + 1))

echo ""
echo "📚 Checking Documentation..."
check_file "README.md" "README.md exists"
check_file "SETUP.md" "SETUP.md exists"
check_file "CONFIGURATION.md" "CONFIGURATION.md exists"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📊 Checklist Summary: $checks_passed/$checks_total checks passed"
echo "═══════════════════════════════════════════════════════════════"
echo ""

if [ $checks_passed -eq $checks_total ]; then
    echo "✅ All checks passed! Service is ready to start."
    echo ""
    echo "Next steps:"
    echo "  1. npm run verify    (Verify configuration)"
    echo "  2. npm run dev       (Start service)"
    echo "  3. npm run test:health  (Test in another terminal)"
    echo ""
    exit 0
else
    echo "⚠️  Some checks failed. Please review the issues above."
    echo ""
    echo "Common fixes:"
    echo "  • MongoDB not running? Start with: docker run -d -p 27017:27017 mongo:latest"
    echo "  • Dependencies missing? Run: npm install"
    echo "  • .env file missing? Run: npm run verify"
    echo ""
    exit 1
fi
