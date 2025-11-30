# LexiFlow API Testing Script
# This script tests all endpoints from the Swagger documentation

$baseUrl = "http://localhost:3001"
$results = @()

# Function to test an endpoint
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Description,
        [hashtable]$Headers = @{},
        [object]$Body = $null
    )
    
    try {
        Write-Host "Testing $Method $Url - $Description" -ForegroundColor Yellow
        
        $params = @{
            Uri = "$baseUrl$Url"
            Method = $Method
            Headers = $Headers
            ErrorAction = 'Stop'
        }
        
        if ($Body -and $Method -in @('POST', 'PUT', 'PATCH')) {
            $params.Body = $Body | ConvertTo-Json -Depth 10
            $params.ContentType = 'application/json'
        }
        
        $response = Invoke-RestMethod @params
        $statusCode = "200"
        $error = $null
        
        Write-Host "✅ SUCCESS: $statusCode" -ForegroundColor Green
        return @{
            Method = $Method
            Url = $Url
            Description = $Description
            Status = "Success"
            StatusCode = $statusCode
            Error = $null
            ResponseLength = if($response) { ($response | ConvertTo-Json).Length } else { 0 }
        }
    }
    catch {
        $statusCode = if($_.Exception.Response) { $_.Exception.Response.StatusCode } else { "Connection Error" }
        $errorMessage = $_.Exception.Message
        
        Write-Host "❌ FAILED: $statusCode - $errorMessage" -ForegroundColor Red
        return @{
            Method = $Method
            Url = $Url
            Description = $Description
            Status = "Failed"
            StatusCode = $statusCode
            Error = $errorMessage
            ResponseLength = 0
        }
    }
}

Write-Host "🚀 Starting LexiFlow API Endpoint Testing" -ForegroundColor Cyan
Write-Host "Base URL: $baseUrl" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Test Authentication Endpoints
Write-Host "`n📋 AUTHENTICATION ENDPOINTS" -ForegroundColor Magenta
$results += Test-Endpoint -Method "POST" -Url "/api/v1/auth/login" -Description "User Login" -Body @{
    email = "test@example.com"
    password = "testpassword"
}
$results += Test-Endpoint -Method "POST" -Url "/api/v1/auth/register" -Description "User Registration" -Body @{
    email = "newuser@example.com"
    password = "newpassword"
    first_name = "Test"
    last_name = "User"
    organization_id = "org-123"
}

# Test Organization Endpoints
Write-Host "`n🏢 ORGANIZATION ENDPOINTS" -ForegroundColor Magenta
$results += Test-Endpoint -Method "GET" -Url "/api/v1/organizations" -Description "Get All Organizations"
$results += Test-Endpoint -Method "POST" -Url "/api/v1/organizations" -Description "Create Organization" -Body @{
    name = "Test Law Firm"
    type = "Law Firm"
    status = "Active"
}
$results += Test-Endpoint -Method "GET" -Url "/api/v1/organizations/test-id" -Description "Get Organization by ID"
$results += Test-Endpoint -Method "PUT" -Url "/api/v1/organizations/test-id" -Description "Update Organization"
$results += Test-Endpoint -Method "DELETE" -Url "/api/v1/organizations/test-id" -Description "Delete Organization"

# Test User Endpoints
Write-Host "`n👥 USER ENDPOINTS" -ForegroundColor Magenta
$results += Test-Endpoint -Method "GET" -Url "/api/v1/users" -Description "Get All Users"
$results += Test-Endpoint -Method "POST" -Url "/api/v1/users" -Description "Create User" -Body @{
    email = "testuser@example.com"
    first_name = "Test"
    last_name = "User"
    role = "Attorney"
}
$results += Test-Endpoint -Method "GET" -Url "/api/v1/users/email/test@example.com" -Description "Get User by Email"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/users/test-id" -Description "Get User by ID"
$results += Test-Endpoint -Method "PUT" -Url "/api/v1/users/test-id" -Description "Update User"
$results += Test-Endpoint -Method "DELETE" -Url "/api/v1/users/test-id" -Description "Delete User"

# Test Case Endpoints
Write-Host "`n⚖️ CASE ENDPOINTS" -ForegroundColor Magenta
$results += Test-Endpoint -Method "GET" -Url "/api/v1/cases" -Description "Get All Cases"
$results += Test-Endpoint -Method "POST" -Url "/api/v1/cases" -Description "Create Case" -Body @{
    title = "Test Case"
    description = "Test case description"
    status = "Open"
    client_name = "Test Client"
}
$results += Test-Endpoint -Method "GET" -Url "/api/v1/cases/client/Test%20Client" -Description "Get Cases by Client"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/cases/status/Open" -Description "Get Cases by Status"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/cases/test-id" -Description "Get Case by ID"
$results += Test-Endpoint -Method "PUT" -Url "/api/v1/cases/test-id" -Description "Update Case"
$results += Test-Endpoint -Method "DELETE" -Url "/api/v1/cases/test-id" -Description "Delete Case"

# Test Document Endpoints
Write-Host "`n📄 DOCUMENT ENDPOINTS" -ForegroundColor Magenta
$results += Test-Endpoint -Method "GET" -Url "/api/v1/documents" -Description "Get All Documents"
$results += Test-Endpoint -Method "POST" -Url "/api/v1/documents" -Description "Create Document" -Body @{
    name = "Test Document"
    type = "Contract"
    content = "Test document content"
}
$results += Test-Endpoint -Method "GET" -Url "/api/v1/documents/type/Contract" -Description "Get Documents by Type"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/documents/test-id" -Description "Get Document by ID"
$results += Test-Endpoint -Method "PUT" -Url "/api/v1/documents/test-id" -Description "Update Document"
$results += Test-Endpoint -Method "DELETE" -Url "/api/v1/documents/test-id" -Description "Delete Document"

# Test Evidence Endpoints
Write-Host "`n🔍 EVIDENCE ENDPOINTS" -ForegroundColor Magenta
$results += Test-Endpoint -Method "GET" -Url "/api/v1/evidence" -Description "Get All Evidence"
$results += Test-Endpoint -Method "POST" -Url "/api/v1/evidence" -Description "Create Evidence" -Body @{
    name = "Test Evidence"
    type = "Document"
    description = "Test evidence description"
}
$results += Test-Endpoint -Method "GET" -Url "/api/v1/evidence/test-id" -Description "Get Evidence by ID"
$results += Test-Endpoint -Method "PUT" -Url "/api/v1/evidence/test-id" -Description "Update Evidence"
$results += Test-Endpoint -Method "DELETE" -Url "/api/v1/evidence/test-id" -Description "Delete Evidence"

# Test Message Endpoints
Write-Host "`n💬 MESSAGE ENDPOINTS" -ForegroundColor Magenta
$results += Test-Endpoint -Method "GET" -Url "/api/v1/messages/conversations" -Description "Get All Conversations"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/messages" -Description "Get All Messages"
$results += Test-Endpoint -Method "POST" -Url "/api/v1/messages" -Description "Create Message" -Body @{
    content = "Test message"
    sender_id = "user-123"
    recipient_id = "user-456"
}
$results += Test-Endpoint -Method "GET" -Url "/api/v1/messages/conversations/test-id" -Description "Get Conversation by ID"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/messages/conversations/test-id/messages" -Description "Get Messages in Conversation"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/messages/test-id" -Description "Get Message by ID"

# Test Workflow Endpoints
Write-Host "`n🔄 WORKFLOW ENDPOINTS" -ForegroundColor Magenta
$results += Test-Endpoint -Method "GET" -Url "/api/v1/workflow/stages" -Description "Get All Workflow Stages"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/workflow/tasks" -Description "Get All Workflow Tasks"
$results += Test-Endpoint -Method "POST" -Url "/api/v1/workflow/stages" -Description "Create Workflow Stage" -Body @{
    name = "Test Stage"
    description = "Test stage description"
}
$results += Test-Endpoint -Method "POST" -Url "/api/v1/workflow/tasks" -Description "Create Workflow Task" -Body @{
    title = "Test Task"
    description = "Test task description"
}
$results += Test-Endpoint -Method "GET" -Url "/api/v1/workflow/stages/test-id" -Description "Get Workflow Stage by ID"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/workflow/tasks/test-id" -Description "Get Workflow Task by ID"

# Test Motion Endpoints
Write-Host "`n📋 MOTION ENDPOINTS" -ForegroundColor Magenta
$results += Test-Endpoint -Method "GET" -Url "/api/v1/motions" -Description "Get All Motions"
$results += Test-Endpoint -Method "POST" -Url "/api/v1/motions" -Description "Create Motion" -Body @{
    title = "Test Motion"
    type = "Summary Judgment"
    status = "Draft"
}
$results += Test-Endpoint -Method "GET" -Url "/api/v1/motions/status/Draft" -Description "Get Motions by Status"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/motions/test-id" -Description "Get Motion by ID"

# Test Billing Endpoints
Write-Host "`n💰 BILLING ENDPOINTS" -ForegroundColor Magenta
$results += Test-Endpoint -Method "GET" -Url "/api/v1/billing/time-entries" -Description "Get All Time Entries"
$results += Test-Endpoint -Method "POST" -Url "/api/v1/billing/time-entries" -Description "Create Time Entry" -Body @{
    description = "Test time entry"
    hours = 2.5
    rate = 150.00
}
$results += Test-Endpoint -Method "GET" -Url "/api/v1/billing/stats" -Description "Get Billing Statistics"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/billing/time-entries/test-id" -Description "Get Time Entry by ID"

# Test Discovery Endpoints
Write-Host "`n🔍 DISCOVERY ENDPOINTS" -ForegroundColor Magenta
$results += Test-Endpoint -Method "GET" -Url "/api/v1/discovery" -Description "Get All Discovery Requests"
$results += Test-Endpoint -Method "POST" -Url "/api/v1/discovery" -Description "Create Discovery Request" -Body @{
    title = "Test Discovery"
    type = "Document Request"
    status = "Pending"
}
$results += Test-Endpoint -Method "GET" -Url "/api/v1/discovery/test-id" -Description "Get Discovery Request by ID"

# Test Client Endpoints
Write-Host "`n👤 CLIENT ENDPOINTS" -ForegroundColor Magenta
$results += Test-Endpoint -Method "GET" -Url "/api/v1/clients" -Description "Get All Clients"
$results += Test-Endpoint -Method "POST" -Url "/api/v1/clients" -Description "Create Client" -Body @{
    name = "Test Client"
    email = "client@example.com"
    company = "Test Company"
}
$results += Test-Endpoint -Method "GET" -Url "/api/v1/clients/name/Test%20Client" -Description "Get Client by Name"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/clients/test-id" -Description "Get Client by ID"

# Test Analytics Endpoints
Write-Host "`n📊 ANALYTICS ENDPOINTS" -ForegroundColor Magenta
$results += Test-Endpoint -Method "GET" -Url "/api/v1/analytics" -Description "Get All Analytics"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/analytics/case-prediction/test-case-id" -Description "Get Case Prediction"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/analytics/judge/Judge%20Smith" -Description "Get Judge Analytics"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/analytics/counsel/Counsel%20Jones" -Description "Get Counsel Analytics"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/analytics/test-id" -Description "Get Analytics by ID"

# Test Search Endpoints
Write-Host "`n🔍 SEARCH ENDPOINTS" -ForegroundColor Magenta
$results += Test-Endpoint -Method "POST" -Url "/api/v1/search/semantic" -Description "Semantic Search" -Body @{
    query = "test search query"
    limit = 10
}
$results += Test-Endpoint -Method "POST" -Url "/api/v1/search/hybrid" -Description "Hybrid Search" -Body @{
    query = "test search query"
    limit = 10
}
$results += Test-Endpoint -Method "GET" -Url "/api/v1/search/similar-documents/test-doc-id" -Description "Find Similar Documents"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/search/legal-citations" -Description "Search Legal Citations"
$results += Test-Endpoint -Method "GET" -Url "/api/v1/search/query-history" -Description "Get Search Query History"

Write-Host "`n📋 GENERATING SUMMARY REPORT" -ForegroundColor Cyan

# Generate Summary
$totalTests = $results.Count
$successfulTests = ($results | Where-Object { $_.Status -eq "Success" }).Count
$failedTests = ($results | Where-Object { $_.Status -eq "Failed" }).Count
$successRate = [math]::Round(($successfulTests / $totalTests) * 100, 2)

Write-Host "`n" + "=" * 60 -ForegroundColor Cyan
Write-Host "📊 TEST SUMMARY REPORT" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "Total Endpoints Tested: $totalTests" -ForegroundColor White
Write-Host "Successful Tests: $successfulTests" -ForegroundColor Green
Write-Host "Failed Tests: $failedTests" -ForegroundColor Red
Write-Host "Success Rate: $successRate%" -ForegroundColor $(if($successRate -gt 70) {"Green"} else {"Red"})

# Show Failed Tests
if ($failedTests -gt 0) {
    Write-Host "`n❌ FAILED ENDPOINTS:" -ForegroundColor Red
    $results | Where-Object { $_.Status -eq "Failed" } | ForEach-Object {
        Write-Host "  • $($_.Method) $($_.Url) - $($_.Error)" -ForegroundColor Red
    }
}

# Show Successful Tests
if ($successfulTests -gt 0) {
    Write-Host "`n✅ SUCCESSFUL ENDPOINTS:" -ForegroundColor Green
    $results | Where-Object { $_.Status -eq "Success" } | ForEach-Object {
        Write-Host "  • $($_.Method) $($_.Url)" -ForegroundColor Green
    }
}

# Export detailed results to CSV
$csvPath = "C:\temp\lexiflow-ai\api-test-results.csv"
$results | Export-Csv -Path $csvPath -NoTypeInformation
Write-Host "`n📄 Detailed results exported to: $csvPath" -ForegroundColor Yellow

Write-Host "`n🎉 API Testing Complete!" -ForegroundColor Cyan