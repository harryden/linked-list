# send-event-confirmation

This Edge Function sends a confirmation email to the event organizer whenever a new event is created.

## Setup

1.  **Get a Resend API Key:** Sign up at [resend.com](https://resend.com).
2.  **Add Secret to Supabase:**
    ```bash
    supabase secrets set RESEND_API_KEY=your_key_here
    ```
3.  **Deploy the Function:**
    ```bash
    supabase functions deploy send-event-confirmation
    ```

## Trigger

This function is triggered by a database webhook (SQL Trigger) on the `events` table. The trigger is defined in the migration: `supabase/migrations/20260404000000_add_event_email_trigger.sql`.
