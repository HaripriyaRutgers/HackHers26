import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindQuest",
  description: "Choose. Play. Reflect.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/*
          Font pairings:
          - "Syne" — geometric, futuristic, great for LIFE.EXE title + headings
          - "Cormorant Garamond" — elegant editorial serif for dialogue/reflection text
          - "DM Mono" — clean monospace for the typewriter effect + UI labels
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-display: 'Syne', sans-serif;
            --font-serif:   'Cormorant Garamond', serif;
            --font-mono:    'DM Mono', monospace;
          }

          /* Apply globally */
          body {
            font-family: var(--font-display);
            cursor: none; /* hide default cursor since we have FluidCursor */
          }

          /* Dialogue + reflection text — elegant serif */
          .font-serif {
            font-family: var(--font-serif) !important;
          }

          /* Typewriter, episode counter, labels */
          .font-mono {
            font-family: var(--font-mono) !important;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}