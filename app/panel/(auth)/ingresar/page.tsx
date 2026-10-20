import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/staff/login-form";
import { recoveryRoutes, staffRoutes } from "@/lib/staff/routes";
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
      <Link
        href={recoveryRoutes.request}
        className="mt-4 block text-center text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
      >
        ¿Te olvidaste la contraseña?
      </Link>
    </AuthCard>
  );
}

async function LoginGate() {
  await ensureStaffRoute(staffRoutes.login);
  return <LoginForm />;
}
