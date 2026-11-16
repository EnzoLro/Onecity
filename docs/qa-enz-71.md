# ENZ-71 — QA formulaire et scénarios d’erreur

Date : 2026-11-16  
Branche : `codex/enz-71-contact-qa`  
Preview : https://onecity-9bjuoexc0-enzos-projects-9848f4b8.vercel.app

## Résultat

Aucun bug bloquant restant sur le parcours de contact testé.

## Correctif issu de la QA

Un risque de double soumission très rapide a été identifié : deux événements `submit` pouvaient théoriquement intervenir avant le rerender React qui applique l’état `pending`.

Correction :
- ajout d’un verrou synchrone `submitting.current`
- maintien du bouton désactivé pendant `pending`
- conservation de l’idempotence serveur/Resend via `Idempotency-Key`

## Recette API sur Preview

| Scénario | Attendu | Résultat |
| --- | --- | --- |
| Soumission valide | 200 | PASS |
| Prénom requis manquant | 400 | PASS |
| E-mail invalide | 400 | PASS |
| Token Turnstile absent | 400 | PASS |
| Logement fabriqué/non autorisé | 400 | PASS |
| Honeypot rempli | 400 | PASS |
| Deux requêtes identiques avec même Idempotency-Key | Réponse stable, pas de nouvel identifiant d’envoi | PASS |
| Contexte programme/logement | C’Premium + T4 98 m² dans le mail | PASS via tests serveur |
| Échec Turnstile | Resend non appelé | PASS via tests serveur |
| Échec Resend / réponse provider incomplète / erreur réseau | 502, détail provider non exposé | PASS via tests serveur |

## Validation technique

- `npm run lint` : PASS
- `node --experimental-strip-types --test tests/*.test.mjs` : PASS
- `npm run build` : PASS
- Preview Vercel : READY
- Logs runtime Preview après recette : aucune erreur remontée

## Mobile

Vérification de l’implémentation responsive :
- lignes prénom/nom et e-mail/téléphone passent en colonne aux breakpoints prévus
- options logement passent en colonne sur mobile
- bouton principal prend toute la largeur
- Turnstile utilise `compact` sous 380 px et `flexible` au-delà
- aucun élément interactif n’utilise une largeur fixe incompatible avec le viewport

Une inspection visuelle exhaustive multi-device restera incluse dans ENZ-78, qui couvre la QA globale du site.

## Navigation clavier / accessibilité

Vérification structurelle :
- champs natifs `input`, `textarea`, `button`
- labels associés par imbrication
- groupe logement via `fieldset` + `legend`
- focus visible explicite pour champs, radios et liens
- consentement accessible au clavier
- retours d’état via `role="status"` + `aria-live="polite"`
- formulaire signale `aria-busy` pendant l’envoi
- honeypot retiré de la navigation clavier

## Notes

Les Preview/Development utilisent les clés de test Cloudflare ; la Production utilise les vraies clés Vercel. Le comportement d’échec Turnstile est donc couvert par tests serveur plutôt que par la clé Preview "always pass".

La réception visuelle du mail avait déjà été confirmée lors d’ENZ-69.