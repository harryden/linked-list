-- Ensure row level security is enabled and enforced on key tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events FORCE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances FORCE ROW LEVEL SECURITY;

-- Refresh profile policies so only authenticated users may read or modify records
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Refresh event policies to keep access minimal but functional
DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can view events" ON public.events;
DROP POLICY IF EXISTS "Users can create events" ON public.events;
DROP POLICY IF EXISTS "Organizers can update own events" ON public.events;
DROP POLICY IF EXISTS "Organizers can manage own events" ON public.events;

CREATE POLICY "Authenticated users can view events"
  ON public.events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create events"
  ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own events"
  ON public.events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

-- Refresh attendance policies to only expose relevant rows
DROP POLICY IF EXISTS "Users can view attendances for events they attend or organize" ON public.attendances;
DROP POLICY IF EXISTS "Attendees can view event attendances" ON public.attendances;
DROP POLICY IF EXISTS "Users can create attendance" ON public.attendances;

CREATE POLICY "Users can view event attendance"
  ON public.attendances
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR event_id IN (
      SELECT id FROM public.events WHERE organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can create attendance"
  ON public.attendances
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Ensure unique constraints are present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'events_slug_key'
      AND conrelid = 'public.events'::regclass
  ) THEN
    ALTER TABLE public.events
      ADD CONSTRAINT events_slug_key UNIQUE (slug);
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'attendances_event_id_user_id_key'
      AND conrelid = 'public.attendances'::regclass
  ) THEN
    ALTER TABLE public.attendances
      ADD CONSTRAINT attendances_event_id_user_id_key UNIQUE (event_id, user_id);
  END IF;
END;
$$;

-- Add supporting indexes for frequent attendance lookups
CREATE INDEX IF NOT EXISTS attendances_event_id_idx
  ON public.attendances (event_id);

CREATE INDEX IF NOT EXISTS attendances_user_id_idx
  ON public.attendances (user_id);
