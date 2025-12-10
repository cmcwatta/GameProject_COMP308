@echo off
REM Notification Service Installation Script (Windows)
REM Run this from the Web_Backend directory

echo.
echo 🚀 Notification Service Installation
echo ======================================
echo.

REM Navigate to notification service
cd notification-service

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    (
        echo # Notification Service Configuration
        echo PORT=4005
        echo WS_PORT=8080
        echo NODE_ENV=development
        echo.
        echo # Database
        echo NOTIFICATION_MONGO_URI=mongodb://localhost:27017/notification_service_db
        echo.
        echo # CORS Configuration
        echo CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175
        echo.
        echo # Email Service ^(optional - configure with your provider^)
        echo EMAIL_SERVICE=gmail
        echo EMAIL_USER=your-email@gmail.com
        echo EMAIL_PASSWORD=your-app-password
        echo EMAIL_FROM=noreply@civicplatform.com
        echo.
        echo # Other Services
        echo AUTH_SERVICE_URL=http://localhost:4001/graphql
        echo ISSUE_SERVICE_URL=http://localhost:4003/graphql
        echo ENGAGEMENT_SERVICE_URL=http://localhost:4004/graphql
        echo AI_SERVICE_URL=http://localhost:4002/graphql
    ) > .env
    echo ✅ .env file created. Please update with your configuration.
) else (
    echo ✅ .env file already exists
)

echo.
echo ✅ Installation complete!
echo.
echo 📋 Next steps:
echo 1. Update .env with your database URI and email settings
echo 2. Run: npm run dev
echo 3. Service will start on port 4005
echo 4. GraphQL endpoint: http://localhost:4005/graphql
echo 5. WebSocket: ws://localhost:8080
echo.
echo 📚 See README.md for full documentation
echo.
pause
