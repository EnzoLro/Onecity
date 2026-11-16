import { createPageMetadata } from "@/lib/seo";
import { LegalDetails, LegalPage } from "@/components/layout/legal-page";
import { organization } from "@/data/organization";
import { footer } from "@/data/footer";
import { contact } from "@/data/navigation";
import { legalIdentity } from "@/data/legal-identity";
import { consentKey } from "@/lib/analytics";

export const metadata = createPageMetadata({ path: "/politique-de-confidentialite", title: "Politique de confidentialité | One City Immobilier", description: "Informations sur les données personnelles, la mesure d’audience, les cookies et vos droits." });
export default function PrivacyPage() {
  return <LegalPage title="Politique de confidentialité" path="/politique-de-confidentialite" description="Retrouvez les informations relatives au traitement de vos données personnelles." introduction="Cette politique explique comment One City Immobilier traite les données personnelles et utilise les services nécessaires au fonctionnement du site." sections={[
    { id: "responsable", title: "Responsable du traitement", content: <LegalDetails rows={[
      ["Responsable du traitement", <>{organization.legalName}<br />{footer.address.join(", ")}</>],
      ["Contact données personnelles", <a href={contact.href}>{contact.href.replace("mailto:", "")}</a>], ["Délégué à la protection des données", "Aucun délégué à la protection des données n’est désigné à ce jour."],
    ]} /> },
    { id: "donnees", title: "Données collectées", content: <>
      <p>Le formulaire prévoit prénom, nom, e-mail, téléphone facultatif, programme, préférence de logement et message facultatif. Les champs marqués d’un astérisque sont requis pour une demande via ce formulaire. Lors de l’envoi, ces informations sont transmises au serveur One City puis à Resend afin d’acheminer la demande vers l’adresse de contact de One City. Les échanges ultérieurs par e-mail ou téléphone sont distincts.</p>
      <p>Après accord, Google Analytics mesure les pages consultées et les interactions avec les programmes, les logements et les moyens de contact. Le code de mesure ne reprend pas les informations saisies dans le formulaire, les paramètres libres d’URL ni les fragments. Google reçoit aussi les informations techniques nécessaires aux requêtes vers ses serveurs, notamment l’adresse IP ; cela ne permet pas de qualifier l’ensemble des données d’anonymes.</p>
      <p>L’hébergement, la protection anti-spam et le chargement des fonds de carte impliquent des requêtes techniques. Cloudflare Turnstile traite les signaux techniques nécessaires à la détection des robots ; il ne reçoit pas le contenu des champs du formulaire. Les modalités de journalisation et de conservation propres aux prestataires restent décrites par leurs politiques et contrats applicables.</p>
    </> },
    { id: "finalites", title: "Finalités et bases légales", content: <>
      <LegalDetails rows={[
        ["Mesurer l’audience et les interactions", "Google Analytics, facultatif, uniquement après consentement. Aucun outil publicitaire n’est activé par ce site."],
        ["Répondre aux demandes de contact", "Mesures précontractuelles prises à la demande du visiteur afin de répondre à sa demande concernant un programme immobilier."],
        ["Fonctionnement et sécurité du site", "Intérêt légitime de One City à fournir, sécuriser et maintenir le site, notamment via Vercel, Cloudflare Turnstile et les fonds OpenStreetMap."],
      ]} />
      <p>Les demandes de contact servent uniquement à répondre à votre demande. Elles ne sont pas utilisées pour la prospection commerciale. Aucun abonnement à une newsletter n’est proposé par ce site.</p>
    </> },
    { id: "destinataires", title: "Destinataires et transferts", content: <>
      <p>Les services identifiés dans le site sont Vercel pour l’hébergement, Resend pour l’acheminement des demandes de contact, Cloudflare Turnstile pour la protection anti-spam, Google Analytics pour la mesure d’audience après accord et OpenStreetMap pour le fond de carte. Les liens Instagram et LinkedIn ouvrent des sites tiers ; aucun module social intégré n’est chargé.</p>
      <p>La carte charge des images depuis tile.openstreetmap.org lorsqu’elle approche de la zone visible. Ces requêtes communiquent au fournisseur l’adresse IP et les informations techniques habituelles du navigateur. Aucune géolocalisation du visiteur ni recherche d’adresse distante n’est utilisée.</p>
      <p>Des traitements hors de l’Union européenne sont possibles avec certains prestataires. Vercel et Resend publient des avenants de traitement des données incluant des clauses contractuelles types pour les transferts concernés. Google et Cloudflare publient également leurs propres engagements et mécanismes de transfert. Les traitements sont réalisés conformément aux conditions contractuelles applicables à chaque service.</p>
      <LegalDetails rows={[["Traitement des demandes", `${legalIdentity.president}, pour ${organization.legalName}, par e-mail à ${contact.href.replace("mailto:", "")}.`], ["Acheminement du formulaire", "Resend (Plus Five Five, Inc.)"], ["Protection anti-spam", "Cloudflare Turnstile"], ["Hébergement", "Vercel Inc."], ["Mesure d’audience après consentement", "Google Analytics"]]} />
      <p>Informations des fournisseurs : <a href="https://vercel.com/legal/privacy-notice">Vercel</a>, <a href="https://resend.com/legal/dpa">Resend</a>, <a href="https://www.cloudflare.com/fr-fr/turnstile-privacy-policy/">Cloudflare Turnstile</a>, <a href="https://policies.google.com/privacy?hl=fr">Google</a> et <a href="https://osmfoundation.org/wiki/Privacy_Policy">OpenStreetMap Foundation</a>.</p>
    </> },
    { id: "conservation", title: "Durées de conservation", content: <>
      <LegalDetails rows={[
        ["Choix de consentement", "Six mois sur ce navigateur lorsque le stockage local est disponible."],
        ["Cookies Google Analytics", "180 jours configurés dans le site, sans prolongation à chaque visite."],
        ["Données enregistrées dans GA4", "14 mois. Cette durée est distincte de la durée des cookies Analytics configurés sur le site."],
        ["Demandes de contact et échanges par e-mail", "Trois ans maximum à compter du dernier contact émanant du prospect, sauf conservation plus longue nécessaire au respect d’une obligation légale ou à la constatation, l’exercice ou la défense de droits."], ["Journaux techniques", "Conservés par les prestataires techniques selon leurs politiques applicables, pendant la durée nécessaire à la sécurité, au diagnostic et au fonctionnement des services."],
      ]} />
      <p>Vous pouvez demander l’effacement de vos données en écrivant au contact indiqué ci-dessous. Une demande d’effacement est appréciée selon les obligations légales applicables et les éventuels besoins de constatation, d’exercice ou de défense de droits.</p>
    </> },
    { id: "cookies", title: "Cookies et autres traceurs", content: <>
      <LegalDetails rows={[
        [consentKey, "Stockage local One City : mémorise uniquement le choix accepté/refusé, sa version, sa date et son expiration pendant six mois. Si le stockage est indisponible, le choix vaut pour le document courant."],
        ["_ga et _ga_*", "Cookies Google Analytics destinés à la mesure des visites et sessions, uniquement après accord. Durée configurée : 180 jours."],
      ]} />
      <p>Avant accord ou après refus, aucun script Google Analytics n’est chargé et aucun événement n’est conservé pour un envoi ultérieur. La mesure est désactivée en pré-production, même après acceptation.</p>
      <p>Vous pouvez accepter ou refuser depuis le bandeau et modifier votre choix à tout moment dans les <a href="/parametres-cookies">paramètres des cookies</a>, accessibles aussi en pied de page. Le refus conserve l’accès au site. Le retrait arrête la mesure, supprime les cookies Analytics accessibles au site et recharge la page pour retirer le script. Il ne supprime pas les données déjà reçues par Google.</p>
      <p>Le choix de mesure d’audience est indépendant de l’accord demandé dans le formulaire de contact. Cloudflare Turnstile est utilisé pour la sécurité du formulaire et ne dépend pas du choix Analytics.</p>
    </> },
    { id: "droits", title: "Vos droits", content: <>
      <p>Dans les conditions prévues par la réglementation, vous pouvez demander l’accès à vos données, leur rectification ou leur effacement, la limitation du traitement et, lorsque cela s’applique, leur portabilité. Vous pouvez également vous opposer à certains traitements.</p>
      <p>Lorsqu’un traitement repose sur votre consentement, vous pouvez le retirer sans remettre en cause les traitements déjà effectués. Pour exercer vos droits auprès de One City, écrivez à <a href={contact.href}>{contact.href.replace("mailto:", "")}</a>, en précisant votre demande.</p>
    </> },
    { id: "contact-reclamation", title: "Contact et réclamation", content: <>
      <LegalDetails rows={[["E-mail pour exercer vos droits", <a href={contact.href}>{contact.href.replace("mailto:", "")}</a>], ["Adresse postale", <>{organization.legalName}<br />{footer.address.join(", ")}</>]]} />
      <p>Vous pouvez adresser une réclamation à la <a href="https://www.cnil.fr/fr/plaintes">CNIL</a> si vous estimez que vos droits sur vos données ne sont pas respectés.</p>
    </> },
  ]} />;
}
