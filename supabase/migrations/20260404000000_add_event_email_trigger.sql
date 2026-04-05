-- Enable the net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "net" WITH SCHEMA "extensions";

-- Create the trigger function
-- Requires app.supabase_url and app.settings.service_role_key to be configured:
--   ALTER DATABASE postgres SET "app.supabase_url" = 'https://<project-ref>.supabase.co';
--   ALTER DATABASE postgres SET "app.settings.service_role_key" = '<service-role-key>';
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
        'record', row_to_json(new)
      )
    );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_event_created_send_email
  AFTER INSERT ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_event_email();
