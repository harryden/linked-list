import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const EMAIL_FROM =
  Deno.env.get("EMAIL_FROM") ?? "Linked List <events@updates.linkedlist.app>";
const APP_URL = Deno.env.get("APP_URL")?.replace(/\/+$/, "");

const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

serve(async (req) => {
  const authHeader = req.headers.get("Authorization");
  if (
    !SUPABASE_SERVICE_ROLE_KEY ||
    authHeader !== `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
  ) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      headers: { "Content-Type": "application/json" },
      status: 401,
    });
  }

  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ error: "RESEND_API_KEY is not configured" }),
      { headers: { "Content-Type": "application/json" }, status: 500 },
    );
  }

  if (!SUPABASE_URL) {
    return new Response(
      JSON.stringify({ error: "SUPABASE_URL is not configured" }),
      { headers: { "Content-Type": "application/json" }, status: 500 },
    );
  }

  if (!APP_URL) {
    return new Response(
      JSON.stringify({ error: "APP_URL is not configured" }),
      { headers: { "Content-Type": "application/json" }, status: 500 },
    );
  }

  try {
    const payload = await req.json();
    const { record, type } = payload;

    if (type !== "INSERT" || !record) {
      return new Response(
        JSON.stringify({ message: "Skipping non-insert event" }),
        { headers: { "Content-Type": "application/json" }, status: 200 },
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(record.organizer_id);

    if (userError || !userData.user?.email) {
      console.error("Error fetching user email:", userError);
      return new Response(
        JSON.stringify({ error: "Could not find organizer email" }),
        { headers: { "Content-Type": "application/json" }, status: 400 },
      );
    }

    const email = userData.user.email;
    const eventName = escapeHtml(String(record.name ?? ""));
    const shortCode = escapeHtml(String(record.short_code ?? ""));
    const eventSlug = encodeURIComponent(String(record.slug ?? ""));
    const dashboardUrl = `${APP_URL}/event/${eventSlug}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [email],
        subject: `Event Live: ${eventName}`,
        html: `
          <div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; color: #111;">
            <h1 style="font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 8px;">Event Created</h1>
            <p style="font-size: 14px; line-height: 1.5; color: #666; margin-bottom: 32px;">
              Your event <strong>${eventName}</strong> is now live and ready for check-ins.
            </p>
            
            <div style="border: 1px solid #eee; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 32px;">
              <p style="margin: 0; font-size: 11px; font-family: ui-monospace, monospace; color: #999; text-transform: uppercase; letter-spacing: 0.1em;">Check-in Code</p>
              <p style="margin: 12px 0 0 0; font-size: 32px; font-weight: 700; color: #000; letter-spacing: 0.2em; font-family: ui-monospace, monospace;">${shortCode}</p>
            </div>

            <div style="margin-bottom: 40px;">
              <a href="${dashboardUrl}" style="display: block; background-color: #000; color: #fff; padding: 14px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500; text-align: center;">View Roster</a>
            </div>

            <hr style="margin-bottom: 24px; border: 0; border-top: 1px solid #eee;" />
            
            <footer style="text-align: center;">
              <p style="font-size: 12px; color: #999; margin: 0;">
                &copy; 2025 Linked List
              </p>
            </footer>
          </div>
        `,
      }),
    });

    const resText = await res.text();

    if (!res.ok) {
      console.error("Resend error:", res.status, resText);
      return new Response(
        JSON.stringify({ error: `Email delivery failed: ${res.status}` }),
        { headers: { "Content-Type": "application/json" }, status: 502 },
      );
    }

    const data = JSON.parse(resText);
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
