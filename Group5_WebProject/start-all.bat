@echo off
REM AI-Powered Issue Tracker - Windows Unified Startup
REM This script starts all 9 services in separate windows

setlocal enabledelayedexpansion

cls
echo.
echo ========================================
echo AI-Powered Local Issue Tracker
echo Starting All Services...
echo ========================================
echo.

REM Check if .env exists
if not exist "Web_Backend\.env" (
    echo ERROR: Web_Backend\.env not found!
    echo Please copy Web_Backend\.env.example to Web_Backend\.env
    echo and configure the MongoDB URI
    pause
    exit /b 1
)

REM Create logs directory
if not exist logs mkdir logs

echo [1/10] Starting Backend Services...
echo.

REM Start Auth Service
echo Starting Auth Service on port 4001...
start "Auth Service (4001)" cmd /k "cd Web_Backend\auth-service && npm install > nul && npm run dev"
timeout /t 2 /nobreak > nul

REM Start Issue Service
echo Starting Issue Service on port 4002...
start "Issue Service (4002)" cmd /k "cd Web_Backend\issue-service && npm install > nul && npm run dev"
timeout /t 2 /nobreak > nul

REM Start AI Service
echo Starting AI Service on port 4003...
start "AI Service (4003)" cmd /k "cd Web_Backend\ai-service && npm install > nul && npm run dev"
timeout /t 2 /nobreak > nul

REM Start Notification Service
echo Starting Notification Service on port 4005...
start "Notification Service (4005)" cmd /k "cd Web_Backend\notification-service && npm install > nul && npm run dev"
timeout /t 2 /nobreak > nul

REM Start Gateway
echo Starting Apollo Gateway on port 4000...
start "Apollo Gateway (4000)" cmd /k "cd Web_Backend\gateway && npm install > nul && npm run dev"
timeout /t 3 /nobreak > nul

echo.
echo [6/10] Starting Frontend Applications...
echo.

REM Start Auth Frontend
echo Starting Auth Frontend on port 5173...
start "Auth Frontend (5173)" cmd /k "cd Web_Frontend\auth_frontend && npm install > nul && npm run dev"
timeout /t 1 /nobreak > nul

REM Start Issue Frontend
echo Starting Issue Frontend on port 5174...
start "Issue Frontend (5174)" cmd /k "cd Web_Frontend\issue_frontend && npm install > nul && npm run dev"
timeout /t 1 /nobreak > nul

REM Start Analytics Frontend
echo Starting Analytics Frontend...
start "Analytics Frontend" cmd /k "cd Web_Frontend\analytics_frontend && npm install > nul && npm run dev"
timeout /t 1 /nobreak > nul

REM Start Chatbot Frontend
echo Starting Chatbot Frontend on port 5175...
start "Chatbot Frontend (5175)" cmd /k "cd Web_Frontend\chatbot_frontend && npm install > nul && npm run dev"

echo.
echo ========================================
echo ^! All services started in separate windows!
echo ========================================
echo.
echo Services Running:
echo   Auth Frontend:      http://localhost:5173
echo   Issue Frontend:     http://localhost:5174
echo   Analytics Frontend: http://localhost:5173 (check port)
echo   Chatbot Frontend:   http://localhost:5175
echo.
echo   GraphQL API:        http://localhost:4000/graphql
echo   Apollo Studio:      https://studio.apollographql.com
echo.
echo Close individual windows to stop specific services.
echo.
pause
