-- Create the trigger function for feedback notifications
CREATE OR REPLACE FUNCTION public.handle_new_feedback_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_supabase_url text;
  v_webhook_secret text;
BEGIN
  v_supabase_url := current_setting('app.supabase_url', true);
  v_webhook_secret := current_setting('app.settings.webhook_secret', true);

  IF v_supabase_url IS NULL OR v_webhook_secret IS NULL THEN
    RAISE WARNING 'Feedback email trigger skipped: Supabase settings (app.supabase_url or app.settings.webhook_secret) are not configured.';
    RETURN NEW;
  END IF;

  PERFORM
    net.http_post(
      url := v_supabase_url || '/functions/v1/notify-feedback',
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

-- Create the trigger on the feedback table
CREATE TRIGGER on_feedback_created_send_email
  AFTER INSERT ON public.feedback
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_feedback_email();
