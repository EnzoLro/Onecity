import { Inter, Parkinsans } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const parkinsans = Parkinsans({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-parkinsans",
});
