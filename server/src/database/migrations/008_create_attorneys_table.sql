-- Migration: Create attorneys table
-- Description: Creates table to store attorney information for parties
-- Note: Foreign key to parties table will be added in migration 012 after parties table is created

CREATE TABLE IF NOT EXISTS attorneys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    party_id UUID,  -- FK constraint added in later migration
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    generation VARCHAR(50),
    suffix VARCHAR(50),
    firm VARCHAR(255),
    title VARCHAR(255),
    email VARCHAR(255),
    office_phone VARCHAR(50),
    mobile_phone VARCHAR(50),
    fax VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(50),
    zip VARCHAR(20),
    country VARCHAR(100) DEFAULT 'USA',
    bar_number VARCHAR(100),
    bar_state VARCHAR(50),
    is_lead BOOLEAN DEFAULT false,
    pro_hac_vice BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'active',
    termination_date TIMESTAMP,
    termination_notice_date TIMESTAMP,
    notice_to_name VARCHAR(255),
    notice_to_address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_attorneys_party_id ON attorneys(party_id);
CREATE INDEX IF NOT EXISTS idx_attorneys_last_name ON attorneys(last_name);
CREATE INDEX IF NOT EXISTS idx_attorneys_firm ON attorneys(firm);
CREATE INDEX IF NOT EXISTS idx_attorneys_bar_number ON attorneys(bar_number);
CREATE INDEX IF NOT EXISTS idx_attorneys_status ON attorneys(status);
