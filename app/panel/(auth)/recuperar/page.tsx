import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { RecoveryRequestForm } from "@/components/staff/recovery-request-form";

export const metadata: Metadata = { title: "Recuperar contraseña" };

export default function RecoveryRequestPage() {
  return (
    <AuthCard
      title="Recuperá tu contraseña"
      description="Si sos dueño, te mandamos un link a tu email. Si sos empleado, pedile al dueño que te dé una contraseña nueva desde el panel."
    >
      <RecoveryRequestForm />
    </AuthCard>
  );
}
