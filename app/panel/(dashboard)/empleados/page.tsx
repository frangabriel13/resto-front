import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { ComingSoon } from "@/components/panel/coming-soon";
import { OwnerOnly } from "@/components/panel/owner-only";

export const metadata: Metadata = { title: "Empleados" };

export default function StaffPage() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <OwnerOnly>
        <ComingSoon
          title="Empleados"
          description="Altas, bajas y contraseñas de tu equipo."
        />
      </OwnerOnly>
    </Suspense>
  );
}
