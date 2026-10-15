import type { Metadata } from "next";
import { ComingSoon } from "@/components/panel/coming-soon";

export const metadata: Metadata = { title: "Escanear" };

export default function ScanPage() {
  return (
    <ComingSoon
      title="Escanear"
      description="Escaneá el QR de la tarjeta del cliente para sumar un sello o canjear el premio."
    />
  );
}
