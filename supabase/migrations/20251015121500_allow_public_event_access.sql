-- Restore public read access needed for QR-based event lookups
DROP POLICY IF EXISTS "Public can view events" ON public.events;

CREATE POLICY "Public can view events"
  ON public.events
  FOR SELECT
  TO anon
  USING (slug IS NOT NULL);

-- Allow public access to organizer profiles (but not general attendee data)
DROP POLICY IF EXISTS "Public can view organizer profiles" ON public.profiles;

CREATE POLICY "Public can view organizer profiles"
  ON public.profiles
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.organizer_id = profiles.id
    )
  );
