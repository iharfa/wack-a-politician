import type { Metadata, Viewport } from "next";
import { Archivo, Big_Shoulders } from "next/font/google";
import "../tokens.css";
import "./globals.css";

const display = Big_Shoulders({ subsets: ["latin"], variable: "--font-bsd", adjustFontFallback: false });
const body = Archivo({ subsets: ["latin"], variable: "--font-archivo" });

export const metadata: Metadata = {
  title: "Whack-a-Politician",
  description: "A fast, silly civic-satire arcade game. Bonk the spin before it spins you.",
  manifest: "/manifest.json",
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Whack-a-Politician" },
};

export const viewport: Viewport = {
  themeColor: "#1b3f66",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
