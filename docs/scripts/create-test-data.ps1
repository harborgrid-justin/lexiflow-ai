# Test API with Sample Data Creation
$baseUrl = "http://localhost:3001"

Write-Host "🚀 Creating Test Data via API" -ForegroundColor Cyan

# First, let's try to create an organization
Write-Host "Creating test organization..." -ForegroundColor Yellow
try {
    $orgData = @{
        name = "Test Law Firm"
        type = "Law Firm" 
        status = "Active"
        address = "123 Legal St, Law City, LC 12345"
        phone = "+1-555-0123"
        email = "info@testlawfirm.com"
    } | ConvertTo-Json

    $org = Invoke-RestMethod -Uri "$baseUrl/api/v1/organizations" -Method POST -Body $orgData -ContentType "application/json"
    Write-Host "✅ Organization created: $($org.name)" -ForegroundColor Green
    $orgId = $org.id
}
catch {
    Write-Host "❌ Failed to create organization: $($_.Exception.Message)" -ForegroundColor Red
    # Use a dummy org ID for testing
    $orgId = "test-org-id"
}

# Try to register a new user
Write-Host "Creating test user..." -ForegroundColor Yellow
try {
    $userData = @{
        first_name = "Test"
        last_name = "Admin"
        name = "Test Admin"
        email = "admin@testlawfirm.com"
        password = "admin123"
        role = "Admin"
        organization_id = $orgId
        status = "Active"
    } | ConvertTo-Json

    $user = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/register" -Method POST -Body $userData -ContentType "application/json"
    Write-Host "✅ User created: $($user.email)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to create user: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

# Try to login with the created user
Write-Host "Testing login..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = "admin@testlawfirm.com"
        password = "admin123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Login successful!" -ForegroundColor Green
    $token = $loginResponse.access_token
    Write-Host "Token: $($token.Substring(0,20))..." -ForegroundColor Green
    
    # Test authenticated endpoint
    $headers = @{ Authorization = "Bearer $token" }
    $orgs = Invoke-RestMethod -Uri "$baseUrl/api/v1/organizations" -Method GET -Headers $headers
    Write-Host "✅ Authenticated request successful! Found $($orgs.Count) organizations" -ForegroundColor Green
    
}
catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🎉 Test data creation complete!" -ForegroundColor Cyan