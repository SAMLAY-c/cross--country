-- ============================================
-- Fix learning_notes.tags column type
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Drop the existing tags column (table is empty, so no data loss)
ALTER TABLE learning_notes DROP COLUMN IF EXISTS tags;

-- Step 2: Add tags column with correct jsonb type
ALTER TABLE learning_notes ADD COLUMN tags jsonb DEFAULT '[]'::jsonb;

-- Step 3: Add comment for documentation
COMMENT ON COLUMN learning_notes.tags IS 'Array of tags stored as JSONB (e.g. ["AI", "LLM", "Tutorial"])';

-- Verify the change
SELECT
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_name = 'learning_notes'
  AND column_name = 'tags';
