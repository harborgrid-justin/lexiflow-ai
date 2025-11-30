# Check Database Tables and Connection
$baseUrl = "http://localhost:3001"

Write-Host "🔍 Checking Database Health" -ForegroundColor Cyan

# Test health endpoint
Write-Host "Testing health endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Health: $($health.status)" -ForegroundColor Green
    Write-Host "Database: $($health.info.database.status)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test swagger docs
Write-Host "Testing Swagger docs..." -ForegroundColor Yellow
try {
    $swagger = Invoke-RestMethod -Uri "$baseUrl/api/docs-json" -Method GET
    Write-Host "✅ Swagger docs available - $($swagger.paths.Count) endpoints" -ForegroundColor Green
}
catch {
    Write-Host "❌ Swagger docs failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test any simple GET endpoint
Write-Host "Testing simple endpoints..." -ForegroundColor Yellow
$simpleEndpoints = @(
    "/api/v1/ping",
    "/api/v1/status", 
    "/api/v1/info",
    "/api/v1/organizations",
    "/api/v1/cases",
    "/api/v1/users"
)

foreach ($endpoint in $simpleEndpoints) {
    try {
        $result = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method GET -ErrorAction Stop
        Write-Host "✅ $endpoint - Success" -ForegroundColor Green
        break
    }
    catch {
        Write-Host "❌ $endpoint - $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host "🔍 Database check complete!" -ForegroundColor Cyan