import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  try {
    const payload = await req.json();
    const { record, type } = payload;

    // Only handle new event insertions
    if (type !== "INSERT" || !record) {
      return new Response(JSON.stringify({ message: "Skipping non-insert event" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the organizer's email from auth.users
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
      record.organizer_id
    );

    if (userError || !userData.user?.email) {
      console.error("Error fetching user email:", userError);
      return new Response(JSON.stringify({ error: "Could not find organizer email" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    const email = userData.user.email;
    const eventName = record.name;
    const shortCode = record.short_code;
    const dashboardUrl = `https://linked-list-nine.vercel.app/event/${record.slug}`;

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LinkBack <events@updates.linkback.com>",
        to: [email],
        subject: `Your event is live: ${eventName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #0077b5; margin-bottom: 24px;">Event Created Successfully!</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Hi there, your event <strong>${eventName}</strong> is now live and ready for check-ins.
            </p>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 24px 0; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Event Access Code</p>
              <p style="margin: 8px 0 0 0; font-size: 32px; font-weight: bold; color: #000; letter-spacing: 4px;">${shortCode}</p>
            </div>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Attendees can scan your QR code or enter the 6-digit code above to check in with their LinkedIn profile.
            </p>
            <div style="margin-top: 32px; text-align: center;">
              <a href="${dashboardUrl}" style="background-color: #0077b5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold;">View Event Dashboard</a>
            </div>
            <hr style="margin: 40px 0 20px 0; border: 0; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #999; text-align: center;">
              &copy; 2025 LinkBack. Powered by LinkedIn.
            </p>
          </div>
        `,
      }),
    });

    const data = await res.json();

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
