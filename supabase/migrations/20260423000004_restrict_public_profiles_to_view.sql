DROP POLICY IF EXISTS "Anon can view organizer minimal info" ON public.profiles;

DROP VIEW IF EXISTS public.public_organizer_profiles;

CREATE VIEW public.public_organizer_profiles AS
SELECT DISTINCT
  profiles.id,
  profiles.name,
  profiles.avatar_url
FROM public.profiles
INNER JOIN public.events ON events.organizer_id = profiles.id
WHERE events.slug IS NOT NULL;

GRANT SELECT ON public.public_organizer_profiles TO anon, authenticated;
