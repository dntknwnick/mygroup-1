-- Migration to add 'USER' role to the existing role check constraint
-- Run this script to update the existing database

-- Drop the existing check constraint
ALTER TABLE my_group_user DROP CONSTRAINT IF EXISTS my_group_user_role_check;

-- Add the new check constraint with 'USER' role included
ALTER TABLE my_group_user ADD CONSTRAINT my_group_user_role_check 
CHECK (role IN ('SUPER_ADMIN', 'CORPORATE', 'BRANCH', 'USER'));
