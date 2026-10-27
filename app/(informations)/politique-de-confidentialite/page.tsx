import { createPageMetadata } from "@/lib/seo";
import { LegalDetails, LegalPage } from "@/components/layout/legal-page";
import { organization } from "@/data/organization";
import { footer } from "@/data/footer";
import { contact } from "@/data/navigation";
import { legalIdentity } from "@/data/legal-identity";
import { consentKey } from "@/lib/analytics";

export const metadata = createPageMetadata({ path: "/politique-de-confidentialite", title: "Politique de confidentialité | One City Immobilier", description: "Informations sur les données, la mesure d’audience, les cookies et les droits. Document en attente de validation par One City.", indexable: false });
const pending = "À confirmer par One City";

export default function PrivacyPage() {
  return <LegalPage title="Politique de confidentialité" path="/politique-de-confidentialite" description="Retrouvez les informations relatives au traitement de vos données personnelles." introduction="Cette page décrit le fonctionnement technique vérifié du site. Les pratiques internes et les informations juridiques restent à faire valider par One City." sections={[
    { id: "responsable", title: "Responsable du traitement", content: <LegalDetails rows={[
      ["Responsable du traitement", <>{organization.legalName}<br />{footer.address.join(", ")}</>],
      ["Contact données personnelles", <a href={contact.href}>{contact.href.replace("mailto:", "")}</a>], ["Délégué à la protection des données", "Désignation éventuelle et coordonnées à confirmer par One City"],
    ]} /> },
    { id: "donnees", title: "Données collectées", content: <>
      <p>Le formulaire prévoit prénom, nom, e-mail, téléphone facultatif, programme, préférence de logement et message facultatif. Les champs marqués d’un astérisque sont requis pour une demande via ce formulaire. Son envoi n’est actuellement pas activé ; les champs saisis ne sont pas transmis à Resend. Les échanges par e-mail ou téléphone sont distincts.</p>
      <p>Après accord, Google Analytics mesure les pages consultées et les interactions avec les programmes, les logements et les moyens de contact. Le code de mesure ne reprend pas les informations saisies dans le formulaire, les paramètres libres d’URL ni les fragments. Google reçoit aussi les informations techniques nécessaires aux requêtes vers ses serveurs, notamment l’adresse IP ; cela ne permet pas de qualifier l’ensemble des données d’anonymes.</p>
      <p>L’hébergement et le chargement des fonds de carte impliquent des requêtes techniques. Leurs modalités de journalisation et de conservation restent à confirmer avec les prestataires.</p>
    </> },
    { id: "finalites", title: "Finalités et bases légales", content: <>
      <LegalDetails rows={[
        ["Mesurer l’audience et les interactions", "Google Analytics, facultatif, uniquement après consentement. Aucun outil publicitaire n’est activé par ce site."],
        ["Répondre aux demandes de contact", "Traitement par e-mail pour répondre à la demande du visiteur, sans prospection. L’envoi du formulaire reste désactivé. Base légale à confirmer par One City."],
        ["Fonctionnement du site et de la carte", "Hébergement Vercel et fonds OpenStreetMap. Base légale et conditions applicables à confirmer par One City."],
      ]} />
      <p>Les demandes de contact servent uniquement à répondre à votre demande. Elles ne sont pas utilisées pour la prospection commerciale. Aucun abonnement à une newsletter n’est proposé par ce site.</p>
    </> },
    { id: "destinataires", title: "Destinataires et transferts", content: <>
      <p>Les services identifiés dans le site sont Vercel pour l’hébergement, Google Analytics pour la mesure d’audience après accord et OpenStreetMap pour le fond de carte. Resend est préparé pour l’envoi des demandes à l’équipe One City, mais cet envoi reste désactivé. Les liens Instagram et LinkedIn ouvrent des sites tiers ; aucun module social intégré n’est chargé.</p>
      <p>La carte charge des images depuis tile.openstreetmap.org lorsqu’elle approche de la zone visible. Ces requêtes communiquent au fournisseur l’adresse IP et les informations techniques habituelles du navigateur. Aucune géolocalisation du visiteur ni recherche d’adresse distante n’est utilisée.</p>
      <p>Des traitements hors de l’Union européenne sont possibles avec les prestataires utilisés. L’entité contractuelle de chaque prestataire, les pays concernés, les garanties de transfert et les moyens d’en obtenir copie restent à vérifier avant publication définitive.</p>
      <LegalDetails rows={[["Traitement des demandes", `${legalIdentity.president}, pour ${organization.legalName}, par e-mail à ${contact.href.replace("mailto:", "")}.`], ["Prestataire de messagerie et autres accès éventuels", pending], ["Sous-traitants et garanties de transfert applicables", pending]]} />
      <p>Informations des fournisseurs : <a href="https://vercel.com/legal/privacy-notice">Vercel</a>, <a href="https://policies.google.com/privacy?hl=fr">Google</a> et <a href="https://osmfoundation.org/wiki/Privacy_Policy">OpenStreetMap Foundation</a>.</p>
    </> },
    { id: "conservation", title: "Durées de conservation", content: <>
      <LegalDetails rows={[
        ["Choix de consentement", "Six mois sur ce navigateur lorsque le stockage local est disponible."],
        ["Cookies Google Analytics", "180 jours configurés dans le site, sans prolongation à chaque visite."],
        ["Données enregistrées dans GA4", "Durée de conservation de la propriété à vérifier dans Google Analytics ; elle est distincte de la durée des cookies."],
        ["Demandes de contact et échanges par e-mail", "Aucune suppression automatique à la clôture n’est prévue. La durée maximale et les critères de conservation ou d’archivage restent à définir par One City avant publication définitive."], ["Journaux techniques et archives", pending],
      ]} />
      <p>Vous pouvez demander l’effacement de vos données en écrivant au contact indiqué ci-dessous. Cette possibilité ne remplace pas la définition d’une durée de conservation par One City. La présente version de travail ne fixe pas une conservation illimitée jusqu’à une demande d’effacement.</p>
    </> },
    { id: "cookies", title: "Cookies et autres traceurs", content: <>
      <LegalDetails rows={[
        [consentKey, "Stockage local One City : mémorise uniquement le choix accepté/refusé, sa version, sa date et son expiration pendant six mois. Si le stockage est indisponible, le choix vaut pour le document courant."],
        ["_ga et _ga_*", "Cookies Google Analytics destinés à la mesure des visites et sessions, uniquement après accord. Durée configurée : 180 jours."],
      ]} />
      <p>Avant accord ou après refus, aucun script Google Analytics n’est chargé et aucun événement n’est conservé pour un envoi ultérieur. La mesure est désactivée en pré-production, même après acceptation.</p>
      <p>Vous pouvez accepter ou refuser depuis le bandeau et modifier votre choix à tout moment dans les <a href="/parametres-cookies">paramètres des cookies</a>, accessibles aussi en pied de page. Le refus conserve l’accès au site. Le retrait arrête la mesure, supprime les cookies Analytics accessibles au site et recharge la page pour retirer le script. Il ne supprime pas les données déjà reçues par Google.</p>
      <p>Le choix de mesure d’audience est indépendant de l’accord demandé dans le formulaire de contact.</p>
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
