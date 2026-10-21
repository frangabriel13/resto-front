import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { customerApp } from "@/lib/pwa/manifest";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Clubsy", template: "%s · Clubsy" },
  description: "Tu tarjeta de sellos digital",
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
  manifest: customerApp.manifestUrl,
  appleWebApp: { capable: true, title: customerApp.shortName, statusBarStyle: "default" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
