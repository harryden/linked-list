-- Enable the net extension if not already enabled
create extension if not exists "net" with schema "extensions";

-- Create the trigger function
-- Requires app.supabase_url and app.settings.service_role_key to be configured:
--   ALTER DATABASE postgres SET "app.supabase_url" = 'https://<project-ref>.supabase.co';
--   ALTER DATABASE postgres SET "app.settings.service_role_key" = '<service-role-key>';
create or replace function public.handle_new_event_email()
returns trigger
language plpgsql
security definer
as $$
begin
  perform
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
  return new;
end;
$$;

-- Create the trigger
create trigger on_event_created_send_email
  after insert on public.events
  for each row execute function public.handle_new_event_email();
