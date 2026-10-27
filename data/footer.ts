// Coordinates from Figma 4037:1610, confirmed by Enzo for ENZ-51.
// Social destinations supplied by Enzo; legal content requires One City validation under ENZ-77.
export const footer = {
  address: ["2 Rue du Carrefour", "78930 Breuil-Bois-Robert"],
  phone: { label: "+33 7 85 01 04 57", href: "tel:+33785010457" },
  socialLinks: [
    { label: "Instagram", href: "https://www.instagram.com/onecityimmobilier?xtok=ZjhhYmJscXFyMmYx", icon: "instagram" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/carlos-louro-19b922188", icon: "linkedin" },
  ],
  legalLinks: [
    { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Paramètres des cookies", href: "/parametres-cookies" },
  ],
} as const;
