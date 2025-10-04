UPDATE public.events
SET ends_at = starts_at
WHERE ends_at IS NULL;

ALTER TABLE public.events
ALTER COLUMN ends_at SET NOT NULL;
