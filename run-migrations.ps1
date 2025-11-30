# Run Database Migrations Manually
Write-Host "🗃️ Running Database Migrations" -ForegroundColor Cyan

# Database connection string (Neon DB)
$connectionString = "host=ep-crimson-mud-a5f3sxpg.us-east-2.aws.neon.tech;port=5432;database=neondb;user=neondb_owner;password=bVDaGkwjqJL9;sslmode=require"

# Install PostgreSQL PowerShell module if not available
try {
    Import-Module -Name Npgsql -ErrorAction Stop
}
catch {
    Write-Host "Installing PostgreSQL PowerShell support..." -ForegroundColor Yellow
    Install-Package -Name Npgsql -Force -Scope CurrentUser
}

# Function to execute SQL file
function Execute-SqlFile {
    param(
        [string]$FilePath,
        [string]$ConnectionString
    )
    
    Write-Host "Executing: $FilePath" -ForegroundColor Yellow
    
    try {
        $sqlContent = Get-Content -Path $FilePath -Raw
        
        # Use psql if available, otherwise try with .NET
        $env:PGPASSWORD = "bVDaGkwjqJL9"
        $psqlCommand = "psql -h ep-crimson-mud-a5f3sxpg.us-east-2.aws.neon.tech -p 5432 -U neondb_owner -d neondb -f `"$FilePath`""
        
        $result = Invoke-Expression $psqlCommand
        Write-Host "✅ Successfully executed $FilePath" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Failed to execute $FilePath`: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Execute migrations in order
$migrationPath = "c:\temp\lexiflow-ai\nestjs\src\database\migrations"
$migrationFiles = @(
    "000_enable_extensions.sql",
    "001_initial_schema.sql", 
    "002_create_indexes.sql"
)

foreach ($file in $migrationFiles) {
    $fullPath = Join-Path $migrationPath $file
    if (Test-Path $fullPath) {
        Execute-SqlFile -FilePath $fullPath -ConnectionString $connectionString
    }
    else {
        Write-Host "⚠️ Migration file not found: $fullPath" -ForegroundColor Yellow
    }
}

# Also run the main schema
$schemaPath = "c:\temp\lexiflow-ai\nestjs\src\database\schema.sql"
if (Test-Path $schemaPath) {
    Execute-SqlFile -FilePath $schemaPath -ConnectionString $connectionString
}

Write-Host "🎉 Database migration complete!" -ForegroundColor Cyan