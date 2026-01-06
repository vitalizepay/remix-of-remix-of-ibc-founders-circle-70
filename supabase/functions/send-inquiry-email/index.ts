import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting (per IP, resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour window

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  entry.count++;
  return true;
}

// HTML escape function to prevent XSS
function escapeHtml(text: string | number | boolean | null | undefined): string {
  if (text === null || text === undefined) {
    return '';
  }
  const str = String(text);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

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

const handler = async (req: Request): Promise<Response> => {
  console.log("send-inquiry-email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client IP for rate limiting
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   req.headers.get("cf-connecting-ip") || 
                   "unknown";
  
  // Check rate limit
  if (!checkRateLimit(clientIp)) {
    console.log("Rate limit exceeded for IP:", clientIp);
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const data: InquiryEmailRequest = await req.json();
    
    // Server-side validation
    if (!data.full_name || typeof data.full_name !== 'string' || data.full_name.length > 200) {
      throw new Error("Invalid full name");
    }
    if (!data.email || !isValidEmail(data.email)) {
      throw new Error("Invalid email address");
    }
    if (!data.mobile_number || typeof data.mobile_number !== 'string' || data.mobile_number.length > 20) {
      throw new Error("Invalid mobile number");
    }
    if (!data.company_name || typeof data.company_name !== 'string' || data.company_name.length > 200) {
      throw new Error("Invalid company name");
    }
    
    console.log("Received inquiry data for:", escapeHtml(data.full_name));

    // Build email HTML with escaped user input
    const emailHtml = `
      <h1>New IBC Membership Inquiry</h1>
      
      <h2>Personal &amp; Business Details</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Full Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.full_name)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.email)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Mobile</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.mobile_number)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Company</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.company_name)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Role</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.role_designation)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Industry</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.industry)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Years in Business</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.years_in_business)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Website/LinkedIn</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.website_or_linkedin) || 'N/A'}</td></tr>
      </table>

      <h2>Business Overview</h2>
      <p><strong>Description:</strong> ${escapeHtml(data.business_description)}</p>
      <p><strong>Stage:</strong> ${escapeHtml(data.business_stage)}</p>

      <h2>Community Fit</h2>
      <p><strong>Reason to Join:</strong> ${escapeHtml(data.reason_to_join)}</p>
      <p><strong>Expected Gain:</strong> ${escapeHtml(data.expected_gain)}</p>
      <p><strong>Contribution:</strong> ${escapeHtml(data.contribution_to_community)}</p>

      <h2>Membership</h2>
      <p><strong>Type:</strong> ${escapeHtml(data.membership_type)}</p>

      <h2>Engagement</h2>
      <p><strong>Participate in Events:</strong> ${data.participate_in_events ? 'Yes' : 'No'}</p>
      <p><strong>Understands Curation:</strong> ${data.understands_curation ? 'Yes' : 'No'}</p>
      <p><strong>IBC Stories Interest:</strong> ${escapeHtml(data.ibc_stories_interest) || 'Not specified'}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "IBC Membership <onboarding@resend.dev>",
        to: ["applications@ibcgulf.com"],
        subject: "New Application Received – IBC Gulf",
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend API error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const emailResponse = await res.json();
    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending inquiry email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
