import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

/* ================================
   ENV
================================ */
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

/* ================================
   CORS
================================ */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/* ================================
   RATE LIMITING
================================ */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;

  entry.count++;
  return true;
}

/* ================================
   UTILITIES
================================ */
function escapeHtml(
  text: string | number | boolean | null | undefined
): string {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
}

/* ================================
   TYPES
================================ */
interface InquiryEmailRequest {
  full_name: string;
  email: string;
  mobile_number: string;
  company_name: string;
  role_designation: string;
  industry: string;
  years_in_business: number;
  website_or_linkedin?: string;
  business_description: string;
  business_stage: string;
  reason_to_join: string;
  expected_gain: string;
  contribution_to_community: string;
  membership_type: string;
  participate_in_events: boolean;
  understands_curation: boolean;
  ibc_stories_interest?: string;
}

/* ================================
   HANDLER
================================ */
const handler = async (req: Request): Promise<Response> => {
  console.log("📩 send-inquiry-email called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  /* ---- HARD ENV GUARD (CRITICAL) ---- */
  if (!RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is missing at runtime");
    return new Response(
      JSON.stringify({ error: "Email service not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({ error: "Too many requests" }),
      {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const data: InquiryEmailRequest = await req.json();

    /* ---- VALIDATION ---- */
    if (!data.full_name || data.full_name.length > 200)
      throw new Error("Invalid full name");

    if (!isValidEmail(data.email))
      throw new Error("Invalid email address");

    if (!data.mobile_number || data.mobile_number.length > 20)
      throw new Error("Invalid mobile number");

    if (!data.company_name || data.company_name.length > 200)
      throw new Error("Invalid company name");

    console.log("✅ Valid inquiry from:", data.full_name);

    /* ---- EMAIL HTML ---- */
    const emailHtml = `
      <h1>New IBC Membership Inquiry</h1>

      <h3>Applicant Details</h3>
      <ul>
        <li><b>Name:</b> ${escapeHtml(data.full_name)}</li>
        <li><b>Email:</b> ${escapeHtml(data.email)}</li>
        <li><b>Mobile:</b> ${escapeHtml(data.mobile_number)}</li>
        <li><b>Company:</b> ${escapeHtml(data.company_name)}</li>
        <li><b>Role:</b> ${escapeHtml(data.role_designation)}</li>
        <li><b>Industry:</b> ${escapeHtml(data.industry)}</li>
        <li><b>Years in Business:</b> ${escapeHtml(data.years_in_business)}</li>
        <li><b>Website / LinkedIn:</b> ${escapeHtml(
          data.website_or_linkedin || "N/A"
        )}</li>
      </ul>

      <h3>Business Overview</h3>
      <p>${escapeHtml(data.business_description)}</p>

      <h3>Why IBC</h3>
      <p><b>Reason:</b> ${escapeHtml(data.reason_to_join)}</p>
      <p><b>Expected Gain:</b> ${escapeHtml(data.expected_gain)}</p>
      <p><b>Contribution:</b> ${escapeHtml(
        data.contribution_to_community
      )}</p>

      <h3>Engagement</h3>
      <p>Participate in Events: ${
        data.participate_in_events ? "Yes" : "No"
      }</p>
      <p>Understands Curation: ${
        data.understands_curation ? "Yes" : "No"
      }</p>
    `;

    /* ---- SEND VIA RESEND ---- */
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "IBC Membership <onboarding@resend.dev>",
        to: ["applications@ibcgulf.com"],
        reply_to: "applications@ibcgulf.com",
        subject: "New Application Received – IBC Gulf",
        html: emailHtml,
      }),
    });

    console.log("📨 Resend status:", res.status);

    const resText = await res.text();
    console.log("📨 Resend response:", resText);

    if (!res.ok) {
      throw new Error(`Resend failed ${res.status}: ${resText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    console.error("🔥 Function error:", err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
