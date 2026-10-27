"use client";

import { consentKey, measurementId, readConsent, serializeConsent, type Consent, type ProgramAnalytics, safePath } from "./analytics";

type GoogleWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
let sessionChoice: string | null = null;
let configured = false;
let programs: ProgramAnalytics[] = [];
let lastPath: string | null = null;
const changeEvent = "onecity:consent-change";

export function consentSnapshot() {
  try { return localStorage.getItem(consentKey) ?? sessionChoice; } catch { return sessionChoice; }
}

export function subscribeConsent(callback: () => void) {
  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(changeEvent, callback); window.removeEventListener("storage", callback); };
}

function google() { return window as GoogleWindow; }

export function clearAnalyticsCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    for (const domain of ["", location.hostname, `.${location.hostname}`, ".onecityimmobilier.fr"]) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}

export function stopAnalytics() {
  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = true;
  if (google().dataLayer) google().dataLayer!.length = 0;
  clearAnalyticsCookies();
  // A fresh document removes the loaded third-party runtime and queued requests.
  if (configured) location.reload();
}

export function chooseConsent(choice: Consent) {
  const serialized = serializeConsent(choice);
  try { localStorage.setItem(consentKey, serialized); sessionChoice = null; } catch { sessionChoice = serialized; }
  if (choice === "refused") stopAnalytics();
  window.dispatchEvent(new Event(changeEvent));
}

export function track(name: string, params: Record<string, string> = {}) {
  if (!configured || readConsent(consentSnapshot()) !== "accepted") return false;
  const path = safePath(location.pathname, programs);
  if (!path) return false;
  google().gtag?.("event", name, { ...params, page_location: `${location.origin}${path}`, page_referrer: "", page_title: path, send_to: measurementId });
  return true;
}

export function trackForm(name: "form_start" | "generate_lead", program: string, home?: string) {
  const record = programs.find(({ slug }) => slug === program);
  if (!record) return false;
  return track(name, { form_id: "project_contact", program_id: record.slug, ...(home && record.homes.includes(home) ? { home_id: home } : {}) });
}

export function trackPage(path: string) {
  if (!safePath(path, programs) || lastPath === path) return;
  if (!track("page_view", { page_path: path })) return;
  lastPath = path;
  const program = programs.find(({ slug }) => path === `/projets/${slug}`);
  if (program) track("view_project", { program_id: program.slug, page_path: path });
}

export function startAnalytics(records: ProgramAnalytics[]) {
  programs = records;
  if (configured || readConsent(consentSnapshot()) !== "accepted" || !safePath(location.pathname, records)) return;
  configured = true;
  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = false;
  const target = google();
  target.dataLayer = [];
  // gtag expects an Arguments object, as in Google’s official bootstrap snippet.
  // eslint-disable-next-line prefer-rest-params
  target.gtag = function () { target.dataLayer!.push(arguments); };
  target.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  target.gtag("consent", "update", { analytics_storage: "granted" });
  target.gtag("js", new Date());
  target.gtag("config", measurementId, { send_page_view: false, page_location: `${location.origin}${location.pathname}`, page_referrer: "", page_title: location.pathname, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 60 * 60 * 24 * 180, cookie_update: false });
  const script = document.createElement("script");
  script.id = "onecity-ga4";
  script.async = true;
  script.referrerPolicy = "no-referrer";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.append(script);
}
