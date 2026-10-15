import type { Metadata } from "next";
import { ComingSoon } from "@/components/panel/coming-soon";

export const metadata: Metadata = { title: "Actividad" };

export default function ActivityPage() {
  return (
    <ComingSoon
      title="Actividad"
      description="Sellos, canjes e inscripciones del comercio."
    />
  );
}
