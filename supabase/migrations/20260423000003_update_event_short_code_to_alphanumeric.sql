-- Migration to update short_code from 6-digit numeric to 6-char alphanumeric
-- This ensures consistency with the rebranding and the logic in src/lib/events.ts

-- 1. Update the function to use alphanumeric logic (first 6 chars of UUID, uppercase)
CREATE OR REPLACE FUNCTION derive_event_short_code(event_id uuid)
RETURNS text AS $$
BEGIN
  RETURN UPPER(SUBSTRING(REPLACE(event_id::text, '-', ''), 1 for 6));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Update existing records
UPDATE public.events SET short_code = derive_event_short_code(id);

-- 3. The unique constraint already exists, so we don't need to add it, 
-- but we should ensure it remains valid for the new alphanumeric space.
