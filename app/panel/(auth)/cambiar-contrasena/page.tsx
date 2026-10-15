import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { AuthCard } from "@/components/auth/auth-card";
import { ChangePasswordForm } from "@/components/staff/change-password-form";
import { staffRoutes } from "@/lib/staff/routes";
import { ensureStaffRoute } from "@/lib/staff/session";

export const metadata: Metadata = { title: "Cambiar contraseña" };

export default function ChangePasswordPage() {
  return (
    <AuthCard
      title="Elegí tu contraseña"
      description="Estás usando una contraseña temporal. Cambiala para seguir."
    >
      <Suspense fallback={<LoadingBlock />}>
        <ChangePasswordGate />
      </Suspense>
    </AuthCard>
  );
}

async function ChangePasswordGate() {
  await ensureStaffRoute(staffRoutes.changePassword);
  return <ChangePasswordForm />;
}
