-- Enable the net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "net" WITH SCHEMA "extensions";

-- Create the trigger function
-- SECURITY NOTE: This trigger reads app.settings.webhook_secret from a database setting
-- to authenticate calls to the edge function. Any SECURITY DEFINER function or role with
-- access to current_setting() can read this value. Treat it as a shared secret and rotate
-- it immediately if the database is ever compromised.
--
-- Setup: run these once per environment before deploying:
--   ALTER DATABASE postgres SET "app.supabase_url" = 'https://<project-ref>.supabase.co';
--   ALTER DATABASE postgres SET "app.settings.webhook_secret" = '<webhook-secret>';
CREATE OR REPLACE FUNCTION public.handle_new_event_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_supabase_url text;
  v_webhook_secret text;
BEGIN
  -- Read settings without masking unexpected runtime errors
  v_supabase_url := current_setting('app.supabase_url', true);
  v_webhook_secret := current_setting('app.settings.webhook_secret', true);

  IF v_supabase_url IS NULL OR v_webhook_secret IS NULL THEN
    -- If settings are missing (e.g. after restart), log and skip to prevent INSERT failure
    RAISE WARNING 'Email trigger skipped: Supabase settings (app.supabase_url or app.settings.webhook_secret) are not configured.';
    RETURN NEW;
  END IF;

  PERFORM
    net.http_post(
      url := v_supabase_url || '/functions/v1/send-event-confirmation',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_webhook_secret
      ),
      body := jsonb_build_object(
        'type', 'INSERT',
        'record', row_to_json(new)
      )
    );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_event_created_send_email
  AFTER INSERT ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_event_email();
