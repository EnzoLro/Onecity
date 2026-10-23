/** Resend REST integration. No SDK, account creation or secret is needed to review the page. */
export type ContactProgram = {
  slug: string;
  label: string;
  commercial: { commercializing?: boolean };
  editorial: { detail?: { homes: { items: readonly { id: string; type: string; area: number }[] } } };
};
export type ContactConfig = { apiKey?: string; from?: string; recipient: string };

export function isContactConfigured(config: Pick<ContactConfig, "apiKey" | "from">) {
  return Boolean(config.apiKey?.trim() && config.from?.trim());
}

const emailPattern = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
function result(message: string, status: number) {
  return Response.json({ message }, { status, headers: { "Cache-Control": "no-store" } });
}

/** Validate every client-supplied field before sending only to the configured team mailbox. */
export async function handleProjectContact(request: Request, programs: readonly ContactProgram[], config: ContactConfig, send: typeof fetch = fetch) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return result("Cette demande n’est pas autorisée.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return result("Format de demande invalide.", 415);
  // Bound streamed bodies as well as Content-Length; callers cannot bypass the limit with chunked encoding.
  const reader = request.body?.getReader();
  if (!reader) return result("Demande invalide.", 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 32768) { await reader.cancel(); return result("Votre demande est trop longue.", 413); }
    chunks.push(value);
  }
  let payload: Record<string, unknown>;
  try {
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return result("Demande invalide.", 400);
    payload = parsed;
  } catch { return result("Demande invalide.", 400); }
  const field = (name: string, max: number, required = false) => {
    const value = payload[name];
    if (typeof value !== "string" || value.length > max || (required && !value.trim())) return null;
    return value.trim();
  };
  const firstName = field("firstName", 80, true);
  const lastName = field("lastName", 80, true);
  const email = field("email", 254, true);
  const phone = field("phone", 40);
  const message = field("message", 5000);
  const interest = field("interest", 80, true);
  const website = field("website", 200);
  const project = programs.find(({ slug }) => slug === payload.project);
  const homes = project?.editorial.detail?.homes.items;
  const home = homes?.find(({ id }) => id === interest);
  if (firstName === null || lastName === null || !email || !emailPattern.test(email) || phone === null || message === null || website !== "" || payload.consent !== "yes" || !project?.commercial.commercializing || !homes || (interest !== "unsure" && !home)) {
    return result("Vérifiez les champs requis, votre e-mail, le logement choisi et votre accord de contact.", 400);
  }
  const key = request.headers.get("idempotency-key");
  if (!key || !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(key)) return result("Identifiant de demande invalide. Rechargez la page.", 400);
  if (!isContactConfigured(config)) return result("L’envoi du formulaire n’est pas encore activé. Contactez-nous par e-mail.", 503);
  try {
    const response = await send("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `project-contact/${key}` },
      body: JSON.stringify({
        from: config.from, to: [config.recipient], reply_to: email,
        subject: `Demande d’informations · ${project.label}`,
        text: [
          `Projet : ${project.label}`,
          `Logement : ${home ? `${home.type} · ${home.area} m²` : "À définir ensemble"}`,
          `Prénom : ${firstName}`, `Nom : ${lastName}`, `E-mail : ${email}`,
          `Téléphone : ${phone || "Non renseigné"}`, "", "Message :", message || "Non renseigné", "",
          "Accord de contact : accepté lors de l’envoi de cette demande.",
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return result("L’envoi a échoué. Veuillez réessayer ou nous contacter par e-mail.", 502);
    const receipt = await response.json();
    if (typeof receipt.id !== "string" || !receipt.id) return result("L’envoi n’a pas pu être confirmé. Veuillez réessayer.", 502);
    return result("Votre demande a été transmise à notre équipe.", 200);
  } catch { return result("Le service d’envoi ne répond pas. Veuillez réessayer ou nous contacter par e-mail.", 502); }
}
