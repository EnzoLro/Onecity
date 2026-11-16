import { programs } from "@/data/programs";
import { handleProjectContact } from "@/lib/project-contact";

export const runtime = "nodejs";

const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

export async function POST(request: Request) {
  const production = process.env.VERCEL_ENV === "production";
  return handleProjectContact(request, programs, {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.RESEND_FROM,
    recipient: process.env.CONTACT_TO_EMAIL,
    turnstileSecret: production ? process.env.TURNSTILE_SECRET_KEY : TURNSTILE_TEST_SECRET,
    enforceTurnstileAction: production,
  });
}
