-- Refresh delete_event_cascade to ensure auth helpers are available during execution.

DROP FUNCTION IF EXISTS public.delete_event_cascade(uuid);

CREATE OR REPLACE FUNCTION public.delete_event_cascade(target_event_id uuid)
RETURNS TABLE (
  id uuid,
  slug text,
  organizer_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  event_record public.events%ROWTYPE;
BEGIN
  SELECT *
    INTO event_record
  FROM public.events
  WHERE id = target_event_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found' USING ERRCODE = 'P0002';
  END IF;

  IF auth.uid() IS NULL OR auth.uid() <> event_record.organizer_id THEN
    RAISE EXCEPTION 'Not authorized to delete this event' USING ERRCODE = '42501';
  END IF;

  DELETE FROM public.attendances
  WHERE event_id = target_event_id;

  DELETE FROM public.events
  WHERE id = target_event_id;

  RETURN QUERY
    SELECT event_record.id, event_record.slug, event_record.organizer_id;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_event_cascade(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_event_cascade(uuid) TO authenticated;
