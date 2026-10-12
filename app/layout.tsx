import type { Metadata } from "next";
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
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
