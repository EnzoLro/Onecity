import type { Metadata } from "next";
import { Inter, Parkinsans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const parkinsans = Parkinsans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-parkinsans",
});

export const metadata: Metadata = {
  title: "OneCity",
  description: "Technical foundation for the OneCity website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${parkinsans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
