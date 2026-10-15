import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { ComingSoon } from "@/components/panel/coming-soon";
import { OwnerOnly } from "@/components/panel/owner-only";

export const metadata: Metadata = { title: "Configuración" };

export default function SettingsPage() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <OwnerOnly>
        <ComingSoon
          title="Configuración"
          description="Colores, link de reseñas y tiempo entre sellos."
        />
      </OwnerOnly>
    </Suspense>
  );
}
