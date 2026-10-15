import type { Metadata } from "next";
import { ComingSoon } from "@/components/panel/coming-soon";

export const metadata: Metadata = { title: "Clientes" };

export default function CustomersPage() {
  return (
    <ComingSoon
      title="Clientes"
      description="Buscá clientes por nombre o teléfono y mirá su tarjeta."
    />
  );
}
