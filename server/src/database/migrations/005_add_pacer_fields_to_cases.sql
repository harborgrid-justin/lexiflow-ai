-- Migration: Add PACER fields to cases table
-- Description: Adds docket_number, originating_case_number, nature_of_suit, case_type, 
-- date fields, fee_status, and judge fields to support PACER integration

ALTER TABLE cases 
ADD COLUMN IF NOT EXISTS docket_number VARCHAR(255),
ADD COLUMN IF NOT EXISTS originating_case_number VARCHAR(255),
ADD COLUMN IF NOT EXISTS nature_of_suit VARCHAR(255),
ADD COLUMN IF NOT EXISTS case_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS date_order_judgment TIMESTAMP,
ADD COLUMN IF NOT EXISTS date_noa_filed TIMESTAMP,
ADD COLUMN IF NOT EXISTS date_recv_coa TIMESTAMP,
ADD COLUMN IF NOT EXISTS fee_status VARCHAR(100),
ADD COLUMN IF NOT EXISTS presiding_judge VARCHAR(255),
ADD COLUMN IF NOT EXISTS ordering_judge VARCHAR(255);

-- Add index on docket_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_cases_docket_number ON cases(docket_number);

-- Add index on originating_case_number for case relationships
CREATE INDEX IF NOT EXISTS idx_cases_originating_case_number ON cases(originating_case_number);
