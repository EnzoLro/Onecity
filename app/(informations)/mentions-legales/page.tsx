import { createPageMetadata } from "@/lib/seo";
import { LegalDetails, LegalPage } from "@/components/layout/legal-page";
import { organization } from "@/data/organization";
import { footer } from "@/data/footer";
import { contact } from "@/data/navigation";
import { legalIdentity } from "@/data/legal-identity";

export const metadata = createPageMetadata({ path: "/mentions-legales", title: "Mentions légales | One City Immobilier", description: "Éditeur, hébergement et informations légales du site One City Immobilier. Document en attente de validation.", indexable: false });

export default function LegalNoticesPage() {
  return <LegalPage title="Mentions légales" path="/mentions-legales" description="Retrouvez les informations relatives à l’édition du site." introduction="Cette partie identifie l’éditeur du site et précise les conditions d’utilisation de ses contenus." sections={[
    { id: "editeur", title: "Éditeur du site", content: <>
      <p>Le site est édité par {organization.legalName}, sous la marque One City Immobilier.</p>
      <LegalDetails rows={[
        ["Dénomination sociale", organization.legalName],
        ["Forme juridique et capital social", `${legalIdentity.legalForm} au capital de ${legalIdentity.capital}`],
        ["Siège social", footer.address.join(", ")],
        ["RCS / ville d’immatriculation", legalIdentity.rcs],
        ["SIREN", organization.siren],
        ["SIRET du siège", legalIdentity.siret],
        ["Numéro de TVA intracommunautaire", legalIdentity.vat],
        ["Président", legalIdentity.president],
        ["Activité déclarée", legalIdentity.activity],
        ["E-mail et téléphone", <><a href={contact.href}>{contact.href.replace("mailto:", "")}</a><br /><a href={footer.phone.href}>{footer.phone.label}</a></>],
      ]} />
      <p>Identité juridique : <a href={legalIdentity.source}>fiche Pappers fournie par One City</a>, consultée le 27 octobre 2026. Coordonnées : <a href="https://www.onecityimmobilier.fr/">site actuel de One City Immobilier</a>.</p>
      <p>One City Immobilier intervient uniquement dans le cadre de ses propres opérations immobilières et n’exerce pas d’activité d’intermédiation sur les biens de tiers.</p>
    </> },
    { id: "publication", title: "Directeur de publication", content: <LegalDetails rows={[["Nom et prénom", legalIdentity.president], ["Qualité / fonction", `Président de ${organization.legalName}`], ["Conception et gestion technique du site", <a href="https://www.enzolouro.fr/">Enzo Louro</a>]]} /> },
    { id: "hebergement", title: "Hébergement", content: <>
      <LegalDetails rows={[["Service utilisé pour ce site", "Vercel"], ["Raison sociale", "Vercel Inc."], ["Adresse publiée par Vercel", "440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis"], ["Téléphone public communiqué par Vercel", "+1 559 288 7060 (coordonnée publiée pour son agent DMCA)"], ["Support", <a href="https://vercel.com/contact">vercel.com/contact</a>]]} />
      <p>Adresse issue de la <a href="https://vercel.com/legal/privacy-notice">notice officielle de Vercel</a>. Vercel ne publie pas de numéro général de support ; le numéro indiqué ci-dessus est celui publiquement communiqué pour son agent DMCA.</p>
    </> },
    { id: "propriete-intellectuelle", title: "Propriété intellectuelle", content: <>
      <p>Les textes, marques, logos, photographies, plans et autres contenus du site sont susceptibles d’être protégés par des droits de propriété intellectuelle.</p>
      <p>Sauf mention contraire, {organization.legalName} détient les droits nécessaires à l’utilisation des contenus publiés sur ce site ou dispose des autorisations correspondantes.</p>
      <p>Toute reproduction, représentation, adaptation ou exploitation de tout ou partie du site sans autorisation préalable du titulaire des droits est interdite, sauf exceptions prévues par la loi.</p>
    </> },
    { id: "responsabilite", title: "Responsabilité", content: <>
      <p>Les informations, visuels, plans et prestations présentés sur le site sont fournis à titre informatif et sont susceptibles d’évoluer. Seuls les documents contractuels signés dans le cadre d’une opération immobilière font foi.</p>
      <p>{organization.legalName} s’efforce de maintenir les informations du site à jour, sans garantir l’absence totale d’erreur ou d’interruption. Les sites accessibles par des liens externes restent sous la responsabilité de leurs éditeurs respectifs.</p>
    </> },
  ]} />;
}
