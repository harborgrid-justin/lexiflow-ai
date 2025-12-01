# LexiFlow AI Database Setup Script for Windows
# This PowerShell script sets up the PostgreSQL database with all necessary extensions, schemas, indexes, and sample data

param(
    [string]$DBName = "lexiflow_ai",
    [string]$DBUser = "lexiflow_user",
    [string]$DBPassword = "lexiflow_password",
    [string]$DBHost = "localhost",
    [string]$DBPort = "5432",
    [switch]$SkipSampleData
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

Write-ColorOutput "🚀 Starting LexiFlow AI Database Setup" "Green"

# Check if PostgreSQL is installed and running
Write-ColorOutput "📋 Checking PostgreSQL service..." "Yellow"
try {
    $pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    if (-not $pgService -or $pgService.Status -ne "Running") {
        Write-ColorOutput "❌ PostgreSQL service is not running" "Red"
        Write-ColorOutput "💡 Please start PostgreSQL service and try again" "Yellow"
        exit 1
    }
    Write-ColorOutput "✅ PostgreSQL is running" "Green"
}
catch {
    Write-ColorOutput "❌ Error checking PostgreSQL service: $($_.Exception.Message)" "Red"
    exit 1
}

# Function to run SQL file
function Invoke-SQLFile {
    param(
        [string]$FilePath,
        [string]$Description
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-ColorOutput "❌ File not found: $FilePath" "Red"
        exit 1
    }
    
    Write-ColorOutput "📄 $Description..." "Yellow"
    
    try {
        $env:PGPASSWORD = $DBPassword
        & psql -h $DBHost -p $DBPort -U $DBUser -d $DBName -f $FilePath 2>&1 | Out-Null
        Write-ColorOutput "✅ $Description completed successfully" "Green"
    }
    catch {
        Write-ColorOutput "❌ Failed to execute: $Description" "Red"
        Write-ColorOutput "💡 Please check the file and try again: $FilePath" "Yellow"
        exit 1
    }
    finally {
        Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
    }
}

# Function to check if database exists
function Test-DatabaseExists {
    try {
        $env:PGPASSWORD = $DBPassword
        $result = & psql -h $DBHost -p $DBPort -U $DBUser -lqt 2>$null | Select-String $DBName
        Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
        return $null -ne $result
    }
    catch {
        Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
        return $false
    }
}

# Function to check if user exists
function Test-UserExists {
    try {
        $env:PGPASSWORD = $DBPassword
        $result = & psql -h $DBHost -p $DBPort -U "postgres" -tc "SELECT 1 FROM pg_roles WHERE rolname='$DBUser'" 2>$null
        Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
        return $result -match "1"
    }
    catch {
        Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
        return $false
    }
}

# Create database user if it doesn't exist (requires superuser access)
Write-ColorOutput "👤 Checking database user..." "Yellow"
if (-not (Test-UserExists)) {
    Write-ColorOutput "➕ Creating database user: $DBUser" "Yellow"
    try {
        $env:PGPASSWORD = $DBPassword
        & psql -h $DBHost -p $DBPort -U "postgres" -c "CREATE USER $DBUser WITH PASSWORD '$DBPassword' CREATEDB CREATEROLE;" 2>&1 | Out-Null
        Write-ColorOutput "✅ Database user created" "Green"
    }
    catch {
        Write-ColorOutput "❌ Failed to create database user. Make sure you have superuser access." "Red"
        exit 1
    }
    finally {
        Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
    }
}
else {
    Write-ColorOutput "✅ Database user exists" "Green"
}

# Create database if it doesn't exist
Write-ColorOutput "🗄️ Checking database..." "Yellow"
if (-not (Test-DatabaseExists)) {
    Write-ColorOutput "➕ Creating database: $DBName" "Yellow"
    try {
        $env:PGPASSWORD = $DBPassword
        & createdb -h $DBHost -p $DBPort -U $DBUser $DBName 2>&1 | Out-Null
        Write-ColorOutput "✅ Database created" "Green"
    }
    catch {
        Write-ColorOutput "❌ Failed to create database" "Red"
        exit 1
    }
    finally {
        Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
    }
}
else {
    Write-ColorOutput "✅ Database exists" "Green"
}

# Get the directory of this script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$MigrationsDir = Join-Path $ScriptDir "..\migrations"
$SeedersDir = Join-Path $ScriptDir "..\seeders"

# Run migrations in order
Write-ColorOutput "🔧 Running database migrations..." "Green"

# 1. Enable extensions
Invoke-SQLFile (Join-Path $MigrationsDir "000_enable_extensions.sql") "Enabling PostgreSQL extensions"

# 2. Create initial schema
Invoke-SQLFile (Join-Path $MigrationsDir "001_initial_schema.sql") "Creating initial database schema"

# 3. Create indexes
Invoke-SQLFile (Join-Path $MigrationsDir "002_create_indexes.sql") "Creating database indexes"

# Run seeders (optional)
if (-not $SkipSampleData) {
    $response = Read-Host "🌱 Do you want to populate the database with sample data? (y/N)"
    if ($response -match "^[Yy]$") {
        Write-ColorOutput "🌱 Populating database with sample data..." "Green"
        Invoke-SQLFile (Join-Path $SeedersDir "003_sample_data.sql") "Inserting sample data"
    }
    else {
        Write-ColorOutput "⏭️ Skipping sample data population" "Yellow"
    }
}
else {
    Write-ColorOutput "⏭️ Skipping sample data population (SkipSampleData flag set)" "Yellow"
}

# Verify setup
Write-ColorOutput "🔍 Verifying database setup..." "Green"

try {
    $env:PGPASSWORD = $DBPassword
    
    # Check if vector extension is enabled
    $vectorCheck = & psql -h $DBHost -p $DBPort -U $DBUser -d $DBName -tc "SELECT count(*) FROM pg_extension WHERE extname='vector'" 2>$null
    if ($vectorCheck -match "1") {
        Write-ColorOutput "✅ Vector extension is enabled" "Green"
    }
    else {
        Write-ColorOutput "❌ Vector extension is not enabled" "Red"
    }
    
    # Count tables
    $tableCount = & psql -h $DBHost -p $DBPort -U $DBUser -d $DBName -tc "SELECT count(*) FROM information_schema.tables WHERE table_schema='public'" 2>$null
    Write-ColorOutput "✅ Created $($tableCount.Trim()) database tables" "Green"
    
    # Count indexes
    $indexCount = & psql -h $DBHost -p $DBPort -U $DBUser -d $DBName -tc "SELECT count(*) FROM pg_indexes WHERE schemaname='public'" 2>$null
    Write-ColorOutput "✅ Created $($indexCount.Trim()) database indexes" "Green"
}
catch {
    Write-ColorOutput "❌ Error during verification: $($_.Exception.Message)" "Red"
}
finally {
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}

Write-ColorOutput "🎉 LexiFlow AI Database Setup Complete!" "Green"
Write-ColorOutput "📋 Database Details:" "Yellow"
Write-Host "   Database: $DBName"
Write-Host "   Host: $DBHost`:$DBPort"
Write-Host "   User: $DBUser"
Write-Host ""
Write-ColorOutput "🔗 Connection String:" "Green"
Write-Host "   postgresql://$DBUser`:$DBPassword@$DBHost`:$DBPort/$DBName"
Write-Host ""
Write-ColorOutput "💡 Next Steps:" "Yellow"
Write-Host "   1. Update your .env file with the database connection details"
Write-Host "   2. Start your NestJS application"
Write-Host "   3. Test the API endpoints"
Write-Host ""