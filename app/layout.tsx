import type { Metadata } from "next";
import { inter, parkinsans } from "./fonts";
import "./globals.css";

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
