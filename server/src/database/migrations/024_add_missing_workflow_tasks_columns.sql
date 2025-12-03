-- Add missing columns to workflow_tasks table to match Sequelize model

-- Add missing columns that exist in the model but not in the database
ALTER TABLE workflow_tasks ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES cases(id) ON DELETE SET NULL;
ALTER TABLE workflow_tasks ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'medium';
ALTER TABLE workflow_tasks ADD COLUMN IF NOT EXISTS sla_warning BOOLEAN DEFAULT false;
ALTER TABLE workflow_tasks ADD COLUMN IF NOT EXISTS automated_trigger VARCHAR(255);
ALTER TABLE workflow_tasks ADD COLUMN IF NOT EXISTS related_module VARCHAR(255);
ALTER TABLE workflow_tasks ADD COLUMN IF NOT EXISTS action_label VARCHAR(255);
ALTER TABLE workflow_tasks ADD COLUMN IF NOT EXISTS owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

-- Fix assigned_to column name (currently assignee_id in DB, should be assigned_to)
ALTER TABLE workflow_tasks RENAME COLUMN assignee_id TO assigned_to;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_case_id ON workflow_tasks(case_id);
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_priority ON workflow_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_owner_org_id ON workflow_tasks(owner_org_id);
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_related_module ON workflow_tasks(related_module);