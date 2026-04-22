-- 1. Restrict the email-trigger function
--    a) Revoke PUBLIC execute so anon cannot call it directly
--    b) Replace row_to_json(new) with an explicit payload to avoid over-sharing data

CREATE OR REPLACE FUNCTION public.handle_new_event_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  PERFORM
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/send-event-confirmation',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object(
        'type', 'INSERT',
        'record', jsonb_build_object(
          'id', new.id,
          'name', new.name,
          'slug', new.slug,
          'organizer_id', new.organizer_id,
          'starts_at', new.starts_at,
          'ends_at', new.ends_at,
          'location', new.location
        )
      )
    );
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_event_email() FROM PUBLIC;

-- 2. Column-level security for anon on profiles
--    The existing RLS policy already restricts which rows anon can see (organizer rows only).
--    This additionally restricts which columns anon can read so that headline, email,
--    linkedin_id, and other private fields are never exposed to unauthenticated requests.

REVOKE SELECT ON public.profiles FROM anon;
GRANT SELECT (id, name, avatar_url) ON public.profiles TO anon;

-- 3. Feedback hardening
--    a) Cap message length to prevent abuse
--    b) Add a SELECT policy so authenticated users can retrieve their own submissions

ALTER TABLE public.feedback
  ADD CONSTRAINT feedback_message_length CHECK (char_length(message) <= 2000);

CREATE POLICY "Users can view own feedback"
  ON public.feedback FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
