/** Addresses supplied by Enzo, geocoded by IGN / BAN. Station: SNCF UIC 87381509. Sources archived in geography/c-premium.json. */
export type ProjectMapPoint = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  description: string;
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
    description: "3 rue d’Arnouville, 78930 Breuil-Bois-Robert. Repère de l’arrêt Express 78, à environ 2 minutes à pied du programme.",
  },
  {
    id: "school", label: "Bus scolaire",
    latitude: 48.94462, longitude: 1.716543,
    description: "3 place des Alliés, 78930 Breuil-Bois-Robert. Arrêt de bus scolaire à environ 2 minutes à pied du programme.",
  },
  {
    id: "gare", label: "Gare SNCF de Mantes-la-Jolie",
    latitude: 48.989327970210304, longitude: 1.70413070360608,
    description: "Place du 8 mai 1945, Mantes-la-Jolie. Environ 10 minutes en voiture depuis le programme, selon les conditions de circulation.",
  },
];
