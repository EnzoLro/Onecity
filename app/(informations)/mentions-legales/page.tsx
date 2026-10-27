import { createPageMetadata } from "@/lib/seo";
import { LegalDetails, LegalPage } from "@/components/layout/legal-page";
import { organization } from "@/data/organization";
import { footer } from "@/data/footer";
import { contact } from "@/data/navigation";
import { legalIdentity } from "@/data/legal-identity";

export const metadata = createPageMetadata({ path: "/mentions-legales", title: "Mentions légales | One City Immobilier", description: "Éditeur, hébergement et informations légales du site One City Immobilier. Document en attente de validation.", indexable: false });
const pending = "À confirmer par One City";

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
      <p>Mentions professionnelles applicables selon l’activité exercée (carte professionnelle, autorité de délivrance, assurance, garantie financière) : {pending}.</p>
    </> },
    { id: "publication", title: "Directeur de publication", content: <LegalDetails rows={[["Nom et prénom", legalIdentity.president], ["Qualité / fonction", `Président de ${organization.legalName}`], ["Conception et gestion technique du site", <a href="https://www.enzolouro.fr/">Enzo Louro</a>]]} /> },
    { id: "hebergement", title: "Hébergement", content: <>
      <LegalDetails rows={[["Service utilisé pour ce site", "Vercel"], ["Raison sociale", "Vercel Inc."], ["Adresse publiée par Vercel", "440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis"], ["Téléphone de l’hébergeur", "À vérifier auprès de Vercel"]]} />
      <p>Coordonnées issues de la <a href="https://vercel.com/legal/privacy-notice">notice officielle de Vercel</a>. Les coordonnées contractuelles applicables à l’hébergement restent à confirmer.</p>
    </> },
    { id: "propriete-intellectuelle", title: "Propriété intellectuelle", content: <>
      <p>Les textes, marques, logos, photographies, plans et autres contenus du site sont susceptibles d’être protégés par des droits de propriété intellectuelle.</p>
      <p>La cession des droits sur les créations d’Enzo Louro au bénéfice de {organization.legalName}, son périmètre et les crédits des autres contenus restent à faire valider. Aucune cession définitive de l’ensemble des contenus n’est affirmée dans ce document de travail.</p>
      <LegalDetails rows={[["Titulaires des droits et crédits", pending], ["Conditions d’utilisation et demandes d’autorisation", pending]]} />
    </> },
    { id: "responsabilite", title: "Responsabilité", content: <>
      <p>La portée contractuelle des informations relatives aux programmes, visuels, plans et prestations, ainsi que leurs conditions d’actualisation, restent à préciser par One City.</p>
      <LegalDetails rows={[["Informations et documents contractuels", pending], ["Conditions d’accès, interruptions et liens tiers", pending]]} />
    </> },
  ]} />;
}
