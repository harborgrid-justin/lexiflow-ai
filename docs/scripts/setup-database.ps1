# Simple Database Setup Script
# Create tables manually using SQL via backend endpoint

$baseUrl = "http://localhost:3001"

Write-Host "🗃️ Setting up Database Tables" -ForegroundColor Cyan

# Create a simple SQL execution endpoint test
$sql = @"
-- Create Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    license_number VARCHAR(100),
    bar_number VARCHAR(100),
    jurisdiction VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    position VARCHAR(255),
    bar_admission VARCHAR(100),
    bar_number VARCHAR(100),
    phone VARCHAR(50),
    expertise TEXT,
    status VARCHAR(50) DEFAULT 'active',
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Cases table
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    opposing_counsel VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    filing_date TIMESTAMP,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium',
    estimated_value DECIMAL(15,2),
    actual_value DECIMAL(15,2),
    owner_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    assigned_attorney_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert test organization
INSERT INTO organizations (id, name, type, email, phone, address) 
VALUES (
    gen_random_uuid(),
    'Test Law Firm', 
    'Law Firm',
    'info@testlawfirm.com',
    '+1-555-0123',
    '123 Legal St, Law City, LC 12345'
) ON CONFLICT DO NOTHING;

-- Get the org ID for user insertion
INSERT INTO users (first_name, last_name, name, email, password_hash, role, organization_id)
SELECT 
    'Test',
    'Admin', 
    'Test Admin',
    'admin@testlawfirm.com',
    '$2b$10$rOHQwGvbAKFhHQmJKQzF2..QVhV4xKRWlhOVh3r4xHZtVpzjKzz8G', -- "admin123" hashed
    'admin',
    o.id
FROM organizations o 
WHERE o.name = 'Test Law Firm'
ON CONFLICT (email) DO NOTHING;
"@

Write-Host "Generated SQL for table creation" -ForegroundColor Green
Write-Host $sql -ForegroundColor Gray

Write-Host "📝 Tables should be created by Sequelize sync. Checking if sync is working..." -ForegroundColor Yellow

# Try to restart the server to force sync
cd "c:\temp\lexiflow-ai\nestjs"
Write-Host "Restarting NestJS server to force database sync..." -ForegroundColor Yellow