import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AuthCard } from "@/components/auth/auth-card";
import { LoadingBlock } from "@/components/loading-block";
import { redirectIfAdminSession } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Admin" };

export default function AdminLoginPage() {
  return (
    <AuthCard title="Admin de Clubsy" description="Acceso interno del equipo de FullSync.">
      <Suspense fallback={<LoadingBlock />}>
        <AdminLoginGate />
      </Suspense>
    </AuthCard>
  );
}

async function AdminLoginGate() {
  await redirectIfAdminSession();
  return <AdminLoginForm />;
}
