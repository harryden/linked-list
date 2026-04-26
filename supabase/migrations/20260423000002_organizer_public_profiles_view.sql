-- Replace row-level anon policy on profiles with a column-restricted view.
-- RLS policies cannot limit columns, so anonymous users were receiving full
-- profile rows (linkedin_id, headline, role) via the old policy.

DROP POLICY IF EXISTS "Anon can view organizer minimal info" ON public.profiles;

CREATE OR REPLACE VIEW public.organizer_public_profiles AS
  SELECT p.id, p.name, p.avatar_url
  FROM public.profiles p
  WHERE EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.organizer_id = p.id
      AND e.slug IS NOT NULL
  );

GRANT SELECT ON public.organizer_public_profiles TO anon;
