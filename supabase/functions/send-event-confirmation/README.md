# send-event-confirmation

This Edge Function sends a confirmation email to the event organizer whenever a new event is created.

## Setup

1. **Get a Resend API Key:** Sign up at [resend.com](https://resend.com).
2. **Add Secret to Supabase:**
   ```bash
   supabase secrets set RESEND_API_KEY=your_key_here
   ```
3. **Configure database settings** (run once per environment in the Supabase SQL editor):
   ```sql
   ALTER DATABASE postgres SET "app.supabase_url" = 'https://<project-ref>.supabase.co';
   ALTER DATABASE postgres SET "app.settings.service_role_key" = '<service-role-key>';
   ```
4. **Deploy the Function:**
   ```bash
   supabase functions deploy send-event-confirmation
   ```

## Trigger

This function is triggered by a database SQL trigger on the `events` table, defined in `supabase/migrations/20260404000000_add_event_email_trigger.sql`.

## Security

The trigger authenticates requests using the `service_role_key` stored in a database-level setting. This key has admin access to your Supabase project. Treat it with the same care as an environment secret:

- Rotate it immediately if the database is compromised.
- Do not expose it via RLS or `current_setting()` in public-facing queries.
- Any `SECURITY DEFINER` function can read it — audit all such functions before granting execute permissions to untrusted roles.
