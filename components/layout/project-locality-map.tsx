import { ProjectInteractiveMap } from "./project-interactive-map";
import { cPremiumLocationMap as map } from "@/data/c-premium-location-map";
import { StyledLink, Text } from "@/components/ui";

/** Geographic overview and interactive map, using the confirmed development address. */
export function ProjectLocalityMap() {
  const [x, y] = map.marker;
  const [lon, lat] = map.coordinates;
  return (
    <figure className="project-locality-map">
      <ProjectInteractiveMap fallback={<svg viewBox={`0 0 ${map.width} ${map.height}`} role="img" aria-labelledby="locality-map-title locality-map-description" className="project-locality-map__drawing">
        <title id="locality-map-title">C’Premium à Breuil-Bois-Robert, dans les Yvelines</title>
        <desc id="locality-map-description">Le département des Yvelines, numéro 78, est mis en évidence parmi les départements voisins. Le point situe C’Premium au 15 route de Mantes à Breuil-Bois-Robert, dans le nord du département.</desc>
        <rect width={map.width} height={map.height} className="project-locality-map__background" />
        {map.paths.filter(({ code }) => code !== "78").map(({ code, name, path }) => <path key={code} d={path} className="project-locality-map__neighbor"><title>{`${name} (${code})`}</title></path>)}
        {map.paths.filter(({ code }) => code === "78").map(({ code, path }) => <path key={code} d={path} className="project-locality-map__department" />)}
        <text x="300" y="305" textAnchor="middle" className="project-locality-map__number">78</text>
        <text x="300" y="332" textAnchor="middle" className="project-locality-map__name">YVELINES</text>
        <circle cx={x} cy={y} r="14" className="project-locality-map__halo" />
        <circle cx={x} cy={y} r="6" className="project-locality-map__marker" />
        <path d={`M${x},${y - 14}v-24h-22`} className="project-locality-map__leader" />
        <rect x={x - 227} y={y - 60} width="210" height="40" rx="0" className="project-locality-map__label-background" />
        <text x={x - 122} y={y - 35} textAnchor="middle" className="project-locality-map__label">C’Premium</text>
      </svg>} />
      <figcaption className="project-locality-map__caption">
        <Text variant="small">C’Premium · 15 route de Mantes, Breuil-Bois-Robert.</Text>
        <a href="https://www.data.gouv.fr/datasets/contours-administratifs" target="_blank" rel="noreferrer" className="onecity-text-small">Contours IGN / Etalab · Licence Ouverte</a>
      </figcaption>
      <StyledLink href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=13/${lat}/${lon}`} variant="secondary" target="_blank" rel="noreferrer">Explorer les alentours<span className="sr-only"> sur OpenStreetMap (nouvel onglet)</span></StyledLink>
    </figure>
  );
}
