/** Addresses supplied by Enzo, geocoded by IGN / BAN. Station: SNCF UIC 87381509. Sources archived in geography/c-premium.json. */
export type ProjectMapPoint = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  description: string;
  access?: string;
  sections?: readonly { title: string; items: readonly string[] }[];
  note?: string;
};
export const cPremiumMapPoints: readonly ProjectMapPoint[] = [
  {
    id: "project", label: "C’Premium",
    latitude: 48.945889, longitude: 1.716278,
    description: "15 route de Mantes, 78930 Breuil-Bois-Robert. Deux logements T4 avec terrasse, espace vert privatif, garage et parking par logement.",
  },
  {
    id: "express", label: "Bus Express 78",
    latitude: 48.944136, longitude: 1.717669,
    description: "3 rue d’Arnouville, 78930 Breuil-Bois-Robert.",
    access: "Environ 2 min à pied",
    sections: [{ title: "En direction de", items: ["Gare de Mantes-la-Jolie", "Saint-Quentin-en-Yvelines", "Montigny-le-Bretonneux"] }],
  },
  {
    id: "school", label: "Bus scolaire",
    latitude: 48.94462, longitude: 1.716543,
    description: "3 place des Alliés, 78930 Breuil-Bois-Robert.",
    access: "Environ 2 min à pied",
    sections: [{ title: "Établissements desservis", items: ["Collège La Vaucouleurs", "Lycée Camille Claudel"] }],
  },
  {
    id: "gare", label: "Gare SNCF de Mantes-la-Jolie",
    latitude: 48.989327970210304, longitude: 1.70413070360608,
    description: "Place du 8 mai 1945, Mantes-la-Jolie.",
    access: "Environ 10 min en voiture",
    sections: [{ title: "Liaisons", items: ["Trains directs vers Paris Saint-Lazare : environ 40 min selon les trains", "Ligne J", "Bus express 7820 (ancien A14) vers La Défense", "RER E (EOLE) : prolongement jusqu’à Mantes-la-Jolie prévu en 2027"] }],
    note: "Durées indicatives, selon les horaires et les conditions de circulation.",
  },
  {
    id: "motorway", label: "Accès A13 · Mantes Est",
    latitude: 48.9755266, longitude: 1.7177955,
    description: "Accès par le rond-point Clé des Champs, à proximité du Buffalo Grill de Mantes-la-Ville. Échangeur de Mantes Est (n°11).",
    access: "Environ 5 min en voiture",
    sections: [{ title: "En direction de", items: ["Paris : environ 56 km · 50 min", "Rouen : environ 85 km · 50 min"] }],
    note: "Distances et durées indicatives, selon l’itinéraire et les conditions de circulation.",
  },
];
