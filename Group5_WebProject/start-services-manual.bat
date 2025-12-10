@echo off
REM Manual startup script - opens each service in its own terminal window
REM Run from Group5_WebProject directory

setlocal enabledelayedexpansion

if not exist "Web_Backend\.env" (
    echo ERROR: Web_Backend\.env not found!
    echo Please copy Web_Backend\.env.example to Web_Backend\.env
    pause
    exit /b 1
)

echo.
echo ========================================
echo AI-Powered Local Issue Tracker
echo Manual Service Startup
echo ========================================
echo.

REM Backend Services
echo Opening Backend Services...
start "Auth Service (4001)" cmd /k "cd Web_Backend\auth-service && npm install && npm run dev"
timeout /t 2 /nobreak

start "Issue Service (4002)" cmd /k "cd Web_Backend\issue-service && npm install && npm run dev"
timeout /t 2 /nobreak

start "AI Service (4003)" cmd /k "cd Web_Backend\ai-service && npm install && npm run dev"
timeout /t 2 /nobreak

start "Notification Service (4005)" cmd /k "cd Web_Backend\notification-service && npm install && npm run dev"
timeout /t 2 /nobreak

start "Apollo Gateway (4000)" cmd /k "cd Web_Backend\gateway && npm install && npm run dev"
timeout /t 2 /nobreak

REM Frontend Applications
echo Opening Frontend Applications...
start "Auth Frontend (5173)" cmd /k "cd Web_Frontend\auth_frontend && npm install && npm run dev"
timeout /t 2 /nobreak

start "Issue Frontend (5174)" cmd /k "cd Web_Frontend\issue_frontend && npm install && npm run dev"
timeout /t 2 /nobreak

start "Analytics Frontend (5173+)" cmd /k "cd Web_Frontend\analytics_frontend && npm install && npm run dev"
timeout /t 2 /nobreak

start "Chatbot Frontend (5175)" cmd /k "cd Web_Frontend\chatbot_frontend && npm install && npm run dev"

echo.
echo ========================================
echo All services opened in separate windows
echo ========================================
echo.
echo Frontend URLs:
echo   Auth:      http://localhost:5173
echo   Issue:     http://localhost:5174
echo   Analytics: http://localhost:5173 (check port)
echo   Chatbot:   http://localhost:5175
echo.
echo Backend GraphQL:
echo   Gateway: http://localhost:4000/graphql
echo.
echo Close any window to stop that service
echo.
pause
