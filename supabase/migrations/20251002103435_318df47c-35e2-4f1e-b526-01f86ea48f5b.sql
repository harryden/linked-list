-- Add location column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS location TEXT;

-- Update the existing event with a location
UPDATE events 
SET location = 'TechHub Conference Center, San Francisco'
WHERE slug = 'summer-tech-meetup-2025-abc123';

-- Fix the infinite recursion issue in attendances RLS policy
-- Drop the problematic policy
DROP POLICY IF EXISTS "Attendees can view event attendances" ON attendances;

-- Create a simpler, non-recursive policy
CREATE POLICY "Users can view attendances for events they attend or organize"
ON attendances
FOR SELECT
USING (
  user_id = auth.uid() 
  OR event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);