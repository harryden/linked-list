# send-event-confirmation

Edge function. Sends confirmation email on event creation.

## Setup

```bash
supabase secrets set RESEND_API_KEY=<key>
supabase secrets set APP_URL=<url>
supabase secrets set EMAIL_FROM=<from>
```

```sql
ALTER DATABASE postgres SET "app.supabase_url" = '<url>';
ALTER DATABASE postgres SET "app.settings.service_role_key" = '<key>';
```

Note: `service_role_key` has admin access; rotate if compromised.

```bash
supabase functions deploy send-event-confirmation
```

## Trigger

SQL trigger on `events` table. Migration: `supabase/migrations/20260404000000_add_event_email_trigger.sql`
