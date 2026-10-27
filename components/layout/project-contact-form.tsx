"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button, Text } from "@/components/ui";
import { contact } from "@/data/navigation";
import type { ProjectDetail } from "@/data/programs";

export function ProjectContactForm({ projectSlug, projectLabel, homes, sendingEnabled }: { projectSlug: string; projectLabel: string; homes: ProjectDetail["homes"]["items"]; sendingEnabled: boolean }) {
  const [interest, setInterest] = useState("unsure");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const requestKey = useRef<{ payload: string; key: string } | null>(null);

  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get("logement");
    if (homes.some(({ id }) => id === selected)) setInterest(selected!);
  }, [homes]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!sendingEnabled || status === "pending") return;
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    const serialized = JSON.stringify(payload);
    if (requestKey.current?.payload !== serialized) requestKey.current = { payload: serialized, key: crypto.randomUUID() };
    setStatus("pending");
    setFeedback("");
    try {
      const response = await fetch("/api/project-contact", {
        method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": requestKey.current!.key },
        body: serialized,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Votre demande n’a pas pu être envoyée. Veuillez réessayer ou nous contacter par e-mail.");
      setStatus("success");
      setFeedback("Votre demande a été transmise à notre équipe.");
      form.reset();
      setInterest("unsure");
      requestKey.current = null;
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "L’envoi a échoué. Veuillez réessayer ou nous contacter par e-mail.");
    }
  }

  return (
    <form className="project-contact" onSubmit={submit} aria-label={`Demande d’informations ${projectLabel}`} aria-busy={status === "pending"}>
      <div className="project-contact__title"><Text variant="label">Votre demande · {projectLabel}</Text><Text variant="small">* Champs requis</Text></div>
      <Text variant="small" className="project-detail__muted">Laissez-nous vos coordonnées et dites-nous ce que vous recherchez.</Text>
      {!sendingEnabled && <Text variant="small" className="project-contact__notice">L’envoi du formulaire n’est pas encore activé. Vous pouvez nous écrire à <a href={`${contact.href}?subject=${encodeURIComponent(`Demande d’informations · ${projectLabel}`)}`}>{contact.href.replace("mailto:", "")}</a>.</Text>}
      <input type="hidden" name="project" value={projectSlug} />
      <div className="project-contact__row"><label>Prénom *<input name="firstName" autoComplete="given-name" required pattern=".*\S.*" title="Saisissez au moins un caractère autre qu’une espace." maxLength={80} placeholder="Votre prénom" /></label><label>Nom *<input name="lastName" autoComplete="family-name" required pattern=".*\S.*" title="Saisissez au moins un caractère autre qu’une espace." maxLength={80} placeholder="Votre nom" /></label></div>
      <div className="project-contact__row"><label>E-mail *<input type="email" name="email" autoComplete="email" required maxLength={254} placeholder="vous@exemple.fr" /></label><label>Téléphone<input type="tel" name="phone" autoComplete="tel" maxLength={40} placeholder="Votre numéro" /></label></div>
      <fieldset><legend>Je suis intéressé(e) par</legend><div className="project-contact__options">{[...homes.map(({ id, type, area }) => ({ value: id, label: `${type} · ${area} m²` })), { value: "unsure", label: "À définir ensemble" }].map(({ value, label }) => <label key={value}><input type="radio" name="interest" value={value} checked={interest === value} onChange={() => setInterest(value)} /><span>{label}</span></label>)}</div></fieldset>
      <label>Votre message<textarea name="message" maxLength={5000} rows={4} placeholder="Dites-nous en quelques mots ce que vous recherchez…" /></label>
      <div className="project-contact__trap" aria-hidden="true"><label>Site internet<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="project-contact__consent"><input type="checkbox" name="consent" value="yes" required /><span>J’accepte que One City Immobilier utilise ces informations pour me recontacter au sujet de ma demande. *</span></label>
      <Button type="submit" size="large" disabled={!sendingEnabled || status === "pending"}>{status === "pending" ? "Envoi en cours…" : "Envoyer ma demande"}</Button>
      <p role="status" aria-live="polite" className="onecity-text-small">{feedback}</p>
      <Text variant="small" className="project-detail__muted">Vos informations sont destinées au traitement de votre demande. Consultez notre <a href="/politique-de-confidentialite">politique de confidentialité</a> pour en savoir plus.</Text>
    </form>
  );
}
