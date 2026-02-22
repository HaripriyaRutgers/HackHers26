import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LIFE.EXE",
  description: "Choose. Play. Reflect.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&family=Playfair+Display:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
