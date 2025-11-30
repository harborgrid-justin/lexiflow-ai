# Simple Database Connection Test
$baseUrl = "http://localhost:3001"

Write-Host "🔍 Testing Basic Endpoints" -ForegroundColor Cyan

# Test simple health check endpoints that might not require database
$endpoints = @(
    @{ Method = "GET"; Path = "/api/docs"; Description = "Swagger Documentation" },
    @{ Method = "GET"; Path = "/api/docs-json"; Description = "Swagger JSON" },
    @{ Method = "GET"; Path = "/"; Description = "Root Endpoint" }
)

foreach ($endpoint in $endpoints) {
    try {
        Write-Host "Testing $($endpoint.Method) $($endpoint.Path)" -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "$baseUrl$($endpoint.Path)" -Method $endpoint.Method -ErrorAction Stop
        Write-Host "✅ SUCCESS" -ForegroundColor Green
    }
    catch {
        $statusCode = if($_.Exception.Response) { $_.Exception.Response.StatusCode } else { "Connection Error" }
        Write-Host "❌ FAILED: $statusCode" -ForegroundColor Red
    }
}

# Test a simple authenticated endpoint
Write-Host "`nTesting Authentication Endpoint:" -ForegroundColor Cyan
try {
    $loginData = @{
        email = "admin@example.com"
        password = "admin123"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/login" -Method POST -Body $loginData -ContentType "application/json" -ErrorAction Stop
    Write-Host "✅ LOGIN SUCCESS" -ForegroundColor Green
    $token = $response.access_token
    Write-Host "Token received: $($token.Substring(0,20))..." -ForegroundColor Green
    
    # Test with token
    $headers = @{ Authorization = "Bearer $token" }
    $orgResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/organizations" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "✅ AUTHENTICATED REQUEST SUCCESS" -ForegroundColor Green
}
catch {
    $statusCode = if($_.Exception.Response) { $_.Exception.Response.StatusCode } else { "Connection Error" }
    Write-Host "❌ LOGIN FAILED: $statusCode" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}