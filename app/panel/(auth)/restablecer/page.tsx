import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { LoadingBlock } from "@/components/loading-block";
import { InvalidLink, ResetPasswordForm } from "@/components/staff/reset-password-form";

// El token va en la URL: que no viaje a otros sitios en el Referer.
export const metadata: Metadata = { title: "Elegí tu contraseña", referrer: "no-referrer" };

export default function ResetPasswordPage({ searchParams }: PageProps<"/panel/restablecer">) {
  return (
    <AuthCard title="Elegí tu contraseña nueva" description="Después vas a ingresar con ella.">
      <Suspense fallback={<LoadingBlock />}>
        <ResetGate searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}

async function ResetGate({ searchParams }: Pick<PageProps<"/panel/restablecer">, "searchParams">) {
  const { token } = await searchParams;
  if (typeof token !== "string" || token === "") return <InvalidLink />;
  return <ResetPasswordForm token={token} />;
}
