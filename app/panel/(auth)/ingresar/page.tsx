import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/staff/login-form";
import { staffRoutes } from "@/lib/staff/routes";
import { ensureStaffRoute } from "@/lib/staff/session";

export const metadata: Metadata = { title: "Ingresar" };

export default function LoginPage() {
  return (
    <AuthCard
      title="Ingresá al panel"
      description="Usá el email y la contraseña que te dio tu comercio."
    >
      <Suspense fallback={<LoadingBlock />}>
        <LoginGate />
      </Suspense>
    </AuthCard>
  );
}

async function LoginGate() {
  await ensureStaffRoute(staffRoutes.login);
  return <LoginForm />;
}
