import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import { customerApp } from "@/lib/pwa/manifest";
import "./globals.css";

// Sans geométrica de la base visual (etapa 12). No es variable: hay que pedir cada peso que se usa.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
