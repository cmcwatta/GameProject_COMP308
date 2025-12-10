# AI-Powered Issue Tracker - PowerShell Startup Script
# Run from Group5_WebProject directory: .\start-all.ps1

param(
    [switch]$NoInstall
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AI-Powered Local Issue Tracker" -ForegroundColor Cyan
Write-Host "Starting All Services..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check .env file
if (-not (Test-Path "Web_Backend\.env")) {
    Write-Host "ERROR: Web_Backend\.env not found!" -ForegroundColor Red
    Write-Host "Please copy Web_Backend\.env.example to Web_Backend\.env" -ForegroundColor Yellow
    exit 1
}

Write-Host "Starting services..." -ForegroundColor Yellow
Write-Host ""

# Create logs directory
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
}

# Start a service
function Start-ServiceJob {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [string]$Port
    )
    
    Write-Host "  Starting $ServiceName on port $Port..." -ForegroundColor Gray
    
    $job = Start-Job -ScriptBlock {
        param($path, $noInstall)
        Set-Location $path
        if (-not $noInstall -and -not (Test-Path "node_modules")) {
            npm install 2>&1 | Out-Null
        }
        npm run dev
    } -ArgumentList $ServicePath, $NoInstall
    
    Write-Host "  ✓ $ServiceName started" -ForegroundColor Green
    return $job
}

# Start backend services
Write-Host "Backend Services:" -ForegroundColor Cyan
$jobs = @()
$jobs += Start-ServiceJob "auth-service" "Web_Backend\auth-service" "4001"
$jobs += Start-ServiceJob "issue-service" "Web_Backend\issue-service" "4002"
$jobs += Start-ServiceJob "ai-service" "Web_Backend\ai-service" "4003"
$jobs += Start-ServiceJob "notification-service" "Web_Backend\notification-service" "4005"
$jobs += Start-ServiceJob "gateway" "Web_Backend\gateway" "4000"

Write-Host ""
Write-Host "Frontend Applications:" -ForegroundColor Cyan
$jobs += Start-ServiceJob "auth-frontend" "Web_Frontend\auth_frontend" "5173"
$jobs += Start-ServiceJob "issue-frontend" "Web_Frontend\issue_frontend" "5174"
$jobs += Start-ServiceJob "analytics-frontend" "Web_Frontend\analytics_frontend" "5173+"
$jobs += Start-ServiceJob "chatbot-frontend" "Web_Frontend\chatbot_frontend" "5175"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ All services started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Access your applications:" -ForegroundColor Cyan
Write-Host "  Auth Frontend:      http://localhost:5173" -ForegroundColor White
Write-Host "  Issue Frontend:     http://localhost:5174" -ForegroundColor White
Write-Host "  Analytics Frontend: http://localhost:5173 (adjust port)" -ForegroundColor White
Write-Host "  Chatbot Frontend:   http://localhost:5175" -ForegroundColor White
Write-Host ""

Write-Host "Backend APIs:" -ForegroundColor Cyan
Write-Host "  Apollo Gateway:     http://localhost:4000/graphql" -ForegroundColor White
Write-Host "  Auth Service:       http://localhost:4001/graphql" -ForegroundColor White
Write-Host "  Issue Service:      http://localhost:4002/graphql" -ForegroundColor White
Write-Host "  AI Service:         http://localhost:4003/graphql" -ForegroundColor White
Write-Host ""

Write-Host "Running $($jobs.Count) services (Job IDs: $($jobs.Id -join ', '))" -ForegroundColor Yellow
Write-Host ""
Write-Host "Commands:" -ForegroundColor Cyan
Write-Host "  Stop all:  Get-Job | Stop-Job" -ForegroundColor White
Write-Host "  Remove all: Get-Job | Remove-Job" -ForegroundColor White
Write-Host "  View logs: Get-Job | Receive-Job" -ForegroundColor White
Write-Host ""

Write-Host "Press Ctrl+C to stop monitoring (services will continue running)" -ForegroundColor Yellow
Write-Host ""

# Monitor jobs
while ($true) {
    $runningJobs = @(Get-Job -State Running)
    Write-Host "Active services: $($runningJobs.Count)" -ForegroundColor Gray
    Start-Sleep -Seconds 5
}
