#!/bin/bash
# Notification Service Installation Script
# Run this from the Web_Backend directory

echo "🚀 Notification Service Installation"
echo "======================================"

# Navigate to notification service
cd notification-service

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Notification Service Configuration
PORT=4005
WS_PORT=8080
NODE_ENV=development

# Database
NOTIFICATION_MONGO_URI=mongodb://localhost:27017/notification_service_db

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175

# Email Service (optional - configure with your provider)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@civicplatform.com

# Other Services
AUTH_SERVICE_URL=http://localhost:4001/graphql
ISSUE_SERVICE_URL=http://localhost:4003/graphql
ENGAGEMENT_SERVICE_URL=http://localhost:4004/graphql
AI_SERVICE_URL=http://localhost:4002/graphql
EOF
    echo "✅ .env file created. Please update with your configuration."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env with your database URI and email settings"
echo "2. Run: npm run dev"
echo "3. Service will start on port 4005"
echo "4. GraphQL endpoint: http://localhost:4005/graphql"
echo "5. WebSocket: ws://localhost:8080"
echo ""
echo "📚 See README.md for full documentation"
