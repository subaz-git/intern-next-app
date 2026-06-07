-- Migration: Add unique constraint on votes table
-- Purpose: Ensure only 1 vote per browser per question

-- Add unique constraint (if not already exists)
ALTER TABLE votes 
ADD CONSTRAINT unique_browser_question_vote 
UNIQUE(question_id, browser_id);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_votes_browser_id ON votes(browser_id);
CREATE INDEX IF NOT EXISTS idx_votes_question_id ON votes(question_id);
