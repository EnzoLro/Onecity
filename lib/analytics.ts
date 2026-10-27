/** Public measurement ID supplied by Enzo for ENZ-76. Never enabled on Preview. */
export const measurementId = "G-R3PX4X46C9";
export const consentKey = "onecity.analytics-consent.v1";
export type Consent = "accepted" | "refused";
export type ProgramAnalytics = { slug: string; homes: string[] };
export type AnalyticsEvent = { name: string; params: Record<string, string> };

export function readConsent(raw: string | null, now = Date.now()): Consent | null {
  try {
    const value = JSON.parse(raw ?? "null");
    return value?.version === 1 && (value.choice === "accepted" || value.choice === "refused") && Number.isFinite(value.expires) && value.expires > now && Number.isFinite(value.created) && value.created <= now ? value.choice : null;
  } catch { return null; }
}

export function serializeConsent(choice: Consent, now = new Date()) {
  const expires = new Date(now);
  expires.setMonth(expires.getMonth() + 6);
  return JSON.stringify({ version: 1, choice, created: now.getTime(), expires: expires.getTime() });
}

export function analyticsEnabled(environment: string | undefined, hostname: string) {
  return environment === "production" && hostname === "www.onecityimmobilier.fr";
}

export function safePath(path: string, programs: ProgramAnalytics[]) {
  return ["/", "/contact", "/mentions-legales", "/politique-de-confidentialite", "/parametres-cookies", ...programs.map(({ slug }) => `/projets/${slug}`)].includes(path) ? path : null;
}

/** URL values and link text are never copied to event parameters. */
export function linkEvents(href: string, origin: string, path: string, programs: ProgramAnalytics[]): AnalyticsEvent[] {
  const page = safePath(path, programs);
  if (!page) return [];
  const current = programs.find(({ slug }) => path === `/projets/${slug}`);
  const params = { page_path: page, ...(current ? { program_id: current.slug } : {}) };
  if (href.startsWith("tel:")) return [{ name: "click_phone", params }];
  if (href.startsWith("mailto:")) return [{ name: "click_email", params }];
  let url: URL;
  try { url = new URL(href, origin); } catch { return []; }
  if (url.origin !== origin) return [];
  const project = programs.find(({ slug }) => url.pathname === `/projets/${slug}`);
  if (project && url.pathname !== path) return [{ name: "discover_project", params: { page_path: page, program_id: project.slug } }];
  if (url.pathname !== "/contact") return [];
  const target = programs.find(({ slug }) => slug === url.searchParams.get("projet")) ?? current;
  if (!target) return [];
  const context = { page_path: page, program_id: target.slug };
  const events: AnalyticsEvent[] = [{ name: "project_contact_click", params: context }];
  const home = url.searchParams.get("logement");
  if (home && target.homes.includes(home)) events.push({ name: "select_home", params: { ...context, home_id: home } });
  return events;
}
