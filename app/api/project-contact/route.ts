import { programs } from "@/data/programs";
import { contact } from "@/data/navigation";
import { handleProjectContact } from "@/lib/project-contact";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleProjectContact(request, programs, {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.RESEND_FROM,
    recipient: contact.href.replace("mailto:", ""),
  });
}
