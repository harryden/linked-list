import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET");
const EMAIL_FROM =
  Deno.env.get("EMAIL_FROM") ?? "Linked List <system@updates.linkedlist.app>";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");

const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

serve(async (req) => {
  const authHeader = req.headers.get("Authorization");
  if (!WEBHOOK_SECRET || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      headers: { "Content-Type": "application/json" },
      status: 401,
    });
  }

  if (
    !RESEND_API_KEY ||
    !SUPABASE_URL ||
    !SUPABASE_SERVICE_ROLE_KEY ||
    !ADMIN_EMAIL
  ) {
    return new Response(JSON.stringify({ error: "Missing configuration" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  try {
    const payload = await req.json();
    const { record, type } = payload;

    if (type !== "INSERT" || !record) {
      return new Response(
        JSON.stringify({ message: "Skipping non-insert event" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", record.user_id)
      .single();

    const { data: userData } = await supabase.auth.admin.getUserById(
      record.user_id,
    );
    const userEmail = userData?.user?.email ?? "Unknown";
    const userName = profile?.full_name ?? "Unknown User";

    const feedbackType = String(record.type ?? "other").toUpperCase();
    const feedbackMessage = escapeHtml(String(record.message ?? ""));
    const pagePath = escapeHtml(String(record.page_path ?? "N/A"));

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [ADMIN_EMAIL],
        subject: `New Feedback: [${feedbackType}] from ${userName}`,
        html: `
          <div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #111;">
            <h1 style="font-size: 20px; font-weight: 600; margin-bottom: 24px; color: #7c4dc4;">New Feedback Received</h1>
            
            <div style="background-color: #f9f9f9; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #7c4dc4;">
              <p style="margin: 0 0 12px 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Type: ${feedbackType}</p>
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #111; white-space: pre-wrap;">${feedbackMessage}</p>
            </div>

            <div style="font-size: 14px; color: #444; margin-bottom: 40px; line-height: 1.8;">
              <p style="margin: 0;"><strong>From:</strong> ${userName} (${userEmail})</p>
              <p style="margin: 0;"><strong>Page:</strong> ${pagePath}</p>
              <p style="margin: 0;"><strong>Agent:</strong> <span style="font-size: 12px; color: #888;">${escapeHtml(record.user_agent ?? "N/A")}</span></p>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin-bottom: 24px;" />
            <footer style="text-align: center; font-size: 12px; color: #999;">
              &copy; ${new Date().getFullYear()} Linked List
            </footer>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend error:", res.status, errorText);
      return new Response(JSON.stringify({ error: "Email delivery failed" }), {
        headers: { "Content-Type": "application/json" },
        status: 502,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
