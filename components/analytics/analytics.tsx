"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { analyticsEnabled, linkEvents, readConsent, type ProgramAnalytics } from "@/lib/analytics";
import { chooseConsent, consentSnapshot, startAnalytics, stopAnalytics, subscribeConsent, track, trackPage } from "@/lib/analytics-client";
import { Button } from "@/components/ui/button";
import "./analytics.css";

const serverSnapshot = () => null;

export function Analytics({ environment, programs }: { environment?: string; programs: ProgramAnalytics[] }) {
  const path = usePathname();
  const raw = useSyncExternalStore(subscribeConsent, consentSnapshot, serverSnapshot);
  const choice = readConsent(raw);
  const settings = path === "/parametres-cookies";

  useEffect(() => {
    const active = analyticsEnabled(environment, location.hostname);
    if (choice !== "accepted") { stopAnalytics(); return; }
    if (!active) return;
    startAnalytics(programs);
    trackPage(path);
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || !(event.target instanceof Element)) return;
      const link = event.target.closest("a[href]");
      if (!link || link.getAttribute("aria-disabled") === "true") return;
      for (const event of linkEvents(link.getAttribute("href")!, location.origin, location.pathname, programs)) track(event.name, event.params);
    };
    document.addEventListener("click", click);
    const expires = JSON.parse(raw!).expires;
    let expiryTimer: number;
    const checkExpiry = () => {
      if (Date.now() >= expires) stopAnalytics();
      else expiryTimer = window.setTimeout(checkExpiry, Math.min(expires - Date.now(), 2_147_483_647));
    };
    checkExpiry();
    return () => { document.removeEventListener("click", click); window.clearTimeout(expiryTimer); };
  }, [choice, environment, path, programs, raw]);

  // Server snapshot avoids hydration mismatch; preferences are read after hydration.
  const hydrated = useSyncExternalStore(subscribeConsent, () => true, () => false);
  if (!hydrated || settings || choice !== null) return null;
  return <ConsentPanel choice={choice} />;
}

export function CookiePreferences() {
  const raw = useSyncExternalStore(subscribeConsent, consentSnapshot, serverSnapshot);
  return <ConsentPanel choice={readConsent(raw)} settings />;
}

function ConsentPanel({ choice, settings = false }: { choice: ReturnType<typeof readConsent>; settings?: boolean }) {
  return (
    <section className={`analytics-consent${settings ? " analytics-consent--settings" : ""}`} aria-labelledby="analytics-consent-title" role="region">
      <h2 id="analytics-consent-title" className="onecity-text-label">Mesure d’audience</h2>
      <p className="onecity-text-small">Avec votre accord, One City Immobilier utilise Google Analytics pour mesurer les visites et les interactions avec ses programmes et ses moyens de contact. Vous pouvez refuser et continuer à naviguer, ou modifier votre choix à tout moment dans les paramètres des cookies. Aucun outil publicitaire n’est activé.</p>
      {settings && <p role="status" className="onecity-text-small">Votre choix : {choice === "accepted" ? "mesure d’audience acceptée" : choice === "refused" ? "mesure d’audience refusée" : "aucun accord donné"}. Il est mémorisé pendant six mois sur ce navigateur lorsque le stockage est disponible.</p>}
      <div className="analytics-consent__actions">
        <Button variant="secondary" onClick={() => chooseConsent("accepted")}>Accepter</Button>
        <Button variant="secondary" onClick={() => chooseConsent("refused")}>Refuser</Button>
        {!settings && <a href="/parametres-cookies" className="onecity-text-small">Paramètres des cookies</a>}
      </div>
      <a href="https://policies.google.com/privacy?hl=fr" className="onecity-text-small" rel="noreferrer">Confidentialité chez Google</a>

    </section>
  );
}
