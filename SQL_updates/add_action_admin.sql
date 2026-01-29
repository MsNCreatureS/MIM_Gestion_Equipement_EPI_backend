-- Add action_admin column to remontees table
-- Note: TEXT columns cannot have a DEFAULT value in strict MySQL mode
ALTER TABLE remontees ADD COLUMN action_admin TEXT;
