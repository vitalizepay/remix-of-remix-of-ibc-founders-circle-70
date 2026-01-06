import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

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

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

interface MonkRegistrationRequest {
  full_name: string;
  email: string;
  phone_number: string;
  company_name: string;
  company_website?: string;
  role_designation: string;
  is_ibc_member: boolean;
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-monk-registration-email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   req.headers.get("cf-connecting-ip") || 
                   "unknown";
  
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
    const data: MonkRegistrationRequest = await req.json();
    
    // Server-side validation
    if (!data.full_name || typeof data.full_name !== 'string' || data.full_name.length > 200) {
      throw new Error("Invalid full name");
    }
    if (!data.email || !isValidEmail(data.email)) {
      throw new Error("Invalid email address");
    }
    if (!data.phone_number || typeof data.phone_number !== 'string' || data.phone_number.length > 30) {
      throw new Error("Invalid phone number");
    }
    if (!data.company_name || typeof data.company_name !== 'string' || data.company_name.length > 200) {
      throw new Error("Invalid company name");
    }
    
    console.log("Received Monk registration for:", escapeHtml(data.full_name));

    const pricingInfo = data.is_ibc_member ? "467 AED (IBC Member)" : "550 AED (Standard)";

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a4d3e 0%, #2d5a4a 100%); padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 28px;">The Monk</h1>
          <p style="color: #d4af37; margin: 10px 0 0 0; font-size: 18px;">Exponential Leadership</p>
        </div>
        
        <div style="padding: 30px; background: #f9f7f4;">
          <h2 style="color: #1a4d3e; margin-top: 0;">New Registration Received</h2>
          
          <table style="border-collapse: collapse; width: 100%; background: #fff; border-radius: 8px; overflow: hidden;">
            <tr style="background: #1a4d3e;">
              <td colspan="2" style="padding: 12px 16px; color: #fff; font-weight: bold;">Registrant Details</td>
            </tr>
            <tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-weight: 600; width: 40%;">Full Name</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee;">${escapeHtml(data.full_name)}</td></tr>
            <tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-weight: 600;">Email</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee;">${escapeHtml(data.email)}</td></tr>
            <tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-weight: 600;">Phone</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee;">${escapeHtml(data.phone_number)}</td></tr>
            <tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-weight: 600;">Company</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee;">${escapeHtml(data.company_name)}</td></tr>
            <tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-weight: 600;">Website</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee;">${escapeHtml(data.company_website) || 'N/A'}</td></tr>
            <tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-weight: 600;">Role</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee;">${escapeHtml(data.role_designation)}</td></tr>
            <tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-weight: 600;">IBC Member</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee;">${data.is_ibc_member ? '<span style="color: #1a4d3e; font-weight: bold;">Yes</span>' : 'No'}</td></tr>
            <tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-weight: 600;">Applicable Price</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-weight: bold; color: #d4af37;">${pricingInfo}</td></tr>
            <tr><td style="padding: 12px 16px; font-weight: 600;">Notes/Expectations</td><td style="padding: 12px 16px;">${escapeHtml(data.notes) || 'None provided'}</td></tr>
          </table>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This registration was submitted via the IBC event registration page.
          </p>
        </div>
        
        <div style="background: #1a4d3e; padding: 20px; text-align: center;">
          <p style="color: #fff; margin: 0; font-size: 14px;">Indian Business Circle (IBC) – Dubai</p>
          <p style="color: #d4af37; margin: 5px 0 0 0; font-size: 12px;">+971 58 557 0593</p>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "The Monk Event <praveen@ibcgulf.com>",
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
    console.error("Error sending registration email:", error);
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
