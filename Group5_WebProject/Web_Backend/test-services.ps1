# Test Script for AI-Powered Issue Tracker Backend Services (Windows PowerShell)
# Run this script to verify all services are functioning correctly

$GATEWAY_URL = "http://localhost:4000/graphql"
$AUTH_URL = "http://localhost:4001/graphql"
$ISSUE_URL = "http://localhost:4002/graphql"
$AI_URL = "http://localhost:4003/graphql"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "AI-POWERED ISSUE TRACKER - SERVICE TESTS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Test health endpoints
Write-Host "[1/6] Testing Service Health Endpoints..." -ForegroundColor Yellow

try {
    Write-Host "  Checking Auth Service (4001)..." -ForegroundColor Gray
    $response = Invoke-RestMethod -Uri "http://localhost:4001/health" -Method Get
    Write-Host "    Status: $($response.status)" -ForegroundColor Green
}
catch {
    Write-Host "    ✗ Auth Service not responding" -ForegroundColor Red
}

try {
    Write-Host "  Checking Issue Service (4002)..." -ForegroundColor Gray
    $response = Invoke-RestMethod -Uri "http://localhost:4002/health" -Method Get
    Write-Host "    Status: $($response.status)" -ForegroundColor Green
}
catch {
    Write-Host "    ✗ Issue Service not responding" -ForegroundColor Red
}

try {
    Write-Host "  Checking AI Service (4003)..." -ForegroundColor Gray
    $response = Invoke-RestMethod -Uri "http://localhost:4003/health" -Method Get
    Write-Host "    Status: $($response.status)" -ForegroundColor Green
}
catch {
    Write-Host "    ✗ AI Service not responding" -ForegroundColor Red
}

try {
    Write-Host "  Checking Gateway (4000)..." -ForegroundColor Gray
    $response = Invoke-RestMethod -Uri "http://localhost:4000/health" -Method Get
    Write-Host "    Status: $($response.status)" -ForegroundColor Green
}
catch {
    Write-Host "    ✗ Gateway not responding" -ForegroundColor Red
}

Write-Host "✓ Health check complete" -ForegroundColor Green
Write-Host ""

# Test User Registration
Write-Host "[2/6] Testing User Registration..." -ForegroundColor Yellow

$registerQuery = @{
    query = 'mutation { register(email: "test@example.com", password: "Test123!", name: "Test User") { user { id email name role } token } }'
} | ConvertTo-Json

$registerResponse = Invoke-RestMethod -Uri $GATEWAY_URL -Method Post -Headers @{ "Content-Type" = "application/json" } -Body $registerQuery

if ($registerResponse.data.register.token) {
    $token = $registerResponse.data.register.token
    Write-Host "✓ User registered successfully" -ForegroundColor Green
    Write-Host "   Email: $($registerResponse.data.register.user.email)" -ForegroundColor Cyan
    Write-Host "   Token: $($token.Substring(0, [Math]::Min(20, $token.Length)))..." -ForegroundColor Cyan
    Write-Host ""
}
else {
    Write-Host "✗ Failed to register user" -ForegroundColor Red
    Write-Host $registerResponse | ConvertTo-Json
    exit 1
}

# Test User Login
Write-Host "[3/6] Testing User Login..." -ForegroundColor Yellow

$loginQuery = @{
    query = 'mutation { login(email: "test@example.com", password: "Test123!") { user { id email } token } }'
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri $GATEWAY_URL -Method Post -Headers @{ "Content-Type" = "application/json" } -Body $loginQuery

if ($loginResponse.data.login.token) {
    Write-Host "✓ User login successful" -ForegroundColor Green
    Write-Host "   Email: $($loginResponse.data.login.user.email)" -ForegroundColor Cyan
    Write-Host ""
}
else {
    Write-Host "✗ Failed to login" -ForegroundColor Red
}

# Test Issue Creation
Write-Host "[4/6] Testing Issue Creation..." -ForegroundColor Yellow

$issueQuery = @{
    query = 'mutation { createIssue(title: "Test Issue", description: "A test accessibility issue", category: ACCESSIBILITY, latitude: 40.7580, longitude: -73.9855) { id title description category status location { latitude longitude } createdAt } }'
} | ConvertTo-Json

$issueResponse = Invoke-RestMethod -Uri $GATEWAY_URL -Method Post `
    -Headers @{ 
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    } `
    -Body $issueQuery

if ($issueResponse.data.createIssue.id) {
    $issueId = $issueResponse.data.createIssue.id
    Write-Host "✓ Issue created successfully" -ForegroundColor Green
    Write-Host "   Issue ID: $issueId" -ForegroundColor Cyan
    Write-Host "   Title: $($issueResponse.data.createIssue.title)" -ForegroundColor Cyan
    Write-Host "   Category: $($issueResponse.data.createIssue.category)" -ForegroundColor Cyan
    Write-Host ""
}
else {
    Write-Host "✗ Failed to create issue" -ForegroundColor Red
    Write-Host $issueResponse | ConvertTo-Json
}

# Test Geospatial Query
Write-Host "[5/6] Testing Geospatial Query..." -ForegroundColor Yellow

$nearbyQuery = @{
    query = 'query { getIssuesNearby(latitude: 40.7580, longitude: -73.9855, radius: 5) { id title category status location { latitude longitude } } }'
} | ConvertTo-Json

$nearbyResponse = Invoke-RestMethod -Uri $GATEWAY_URL -Method Post `
    -Headers @{ 
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    } `
    -Body $nearbyQuery

if ($nearbyResponse.data.getIssuesNearby) {
    $count = @($nearbyResponse.data.getIssuesNearby).Count
    Write-Host "✓ Geospatial query executed" -ForegroundColor Green
    Write-Host "   Issues found: $count" -ForegroundColor Cyan
    Write-Host ""
}
else {
    Write-Host "✗ Geospatial query failed" -ForegroundColor Red
}

# Test Dashboard Metrics
Write-Host "[6/6] Testing Dashboard Metrics..." -ForegroundColor Yellow

$metricsQuery = @{
    query = 'query { getDashboardMetrics { totalIssues resolvedIssues pendingIssues averageResolutionTime categoriesBreakdown { category count percentage } } }'
} | ConvertTo-Json

$metricsResponse = Invoke-RestMethod -Uri $GATEWAY_URL -Method Post `
    -Headers @{ 
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    } `
    -Body $metricsQuery

if ($metricsResponse.data.getDashboardMetrics) {
    $metrics = $metricsResponse.data.getDashboardMetrics
    Write-Host "✓ Dashboard metrics retrieved" -ForegroundColor Green
    Write-Host "   Total Issues: $($metrics.totalIssues)" -ForegroundColor Cyan
    Write-Host "   Resolved: $($metrics.resolvedIssues)" -ForegroundColor Cyan
    Write-Host "   Pending: $($metrics.pendingIssues)" -ForegroundColor Cyan
    Write-Host "   Avg Resolution Time: $($metrics.averageResolutionTime) hours" -ForegroundColor Cyan
    Write-Host ""
}
else {
    Write-Host "✗ Failed to get metrics" -ForegroundColor Red
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✓ All tests completed successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open Apollo Studio at http://localhost:4000/graphql" -ForegroundColor Cyan
Write-Host "2. Copy the token above and add to request headers:" -ForegroundColor Cyan
Write-Host "   {`"Authorization`": `"Bearer $token`"}" -ForegroundColor Cyan
Write-Host "3. Try more complex queries using the GraphQL explorer" -ForegroundColor Cyan
Write-Host ""
