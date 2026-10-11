import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RestPulse — Gym & Rest Timer Assistant",
  description:
    "Analog rest timer, smart exercise form guides, and workout logging. Feel the pulse of every set.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RestPulse",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0E14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
