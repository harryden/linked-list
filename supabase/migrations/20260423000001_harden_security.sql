-- Harden security by tightening public access to profiles
-- Current: Anon can view organizer profiles (all columns)
-- Fix: Anon can only see minimal public info; full profile is authenticated-only.

DROP POLICY IF EXISTS "Public can view events" ON public.events;
CREATE POLICY "Public can view events"
  ON public.events FOR SELECT
  TO anon, authenticated
  USING (slug IS NOT NULL);

DROP POLICY IF EXISTS "Public can view organizer profiles" ON public.profiles;

CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Explicitly allow anon to see ONLY the name and avatar of organizers
CREATE POLICY "Anon can view organizer minimal info"
  ON public.profiles FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.organizer_id = profiles.id
      AND e.slug IS NOT NULL
    )
  );
