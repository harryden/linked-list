-- Migration to add short_code to events for faster lookups
-- This mirrors the logic in src/lib/events.ts: eventCodeFromId

-- NOTE: short_code is a 6-digit value derived deterministically from the event UUID.
-- The space is 1,000,000 slots. The birthday problem applies: expect ~1 collision per
-- ~1,000 events. Collisions will surface as a unique constraint violation on INSERT,
-- which is caught by the event creation error handler. Monitor for 23505 errors in
-- production if event volume exceeds ~500 events.

-- 1. Add the column
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS short_code text;

-- 2. Create a function to derive the code from ID
CREATE OR REPLACE FUNCTION derive_event_short_code(event_id uuid)
RETURNS text AS $$
BEGIN
  -- Replicates: Math.abs(parseInt(id.replace(/-/g, "").substring(0, 8), 16) % 1000000).toString().padStart(6, "0")
  RETURN LPAD((('x' || substring(replace(event_id::text, '-', '') from 1 for 8))::bit(32)::bigint % 1000000)::text, 6, '0');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Backfill existing records
UPDATE public.events SET short_code = derive_event_short_code(id) WHERE short_code IS NULL;

-- 4. Make it NOT NULL and UNIQUE
ALTER TABLE public.events ALTER COLUMN short_code SET NOT NULL;
ALTER TABLE public.events ADD CONSTRAINT events_short_code_key UNIQUE (short_code);

-- 5. Create a trigger to auto-populate on insert
CREATE OR REPLACE FUNCTION populate_event_short_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.short_code IS NULL THEN
    NEW.short_code := derive_event_short_code(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_populate_event_short_code
BEFORE INSERT ON public.events
FOR EACH ROW
EXECUTE FUNCTION populate_event_short_code();
