import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { PageHeader } from "@/components/panel/page-header";
import { SectionCard } from "@/components/section-card";
import { AddEmployeeForm } from "@/components/team/add-employee-form";
import { TeamList } from "@/components/team/team-list";
import { requireOwnerSession } from "@/lib/staff/session";
import { getTeam } from "@/lib/team/data";
import { canAddStaff } from "@/lib/team/members";

export const metadata: Metadata = { title: "Empleados" };

export default function StaffPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <PageHeader title="Empleados" description="Altas, bajas y contraseñas de tu equipo." />
      <Suspense fallback={<LoadingBlock />}>
        <StaffContent />
      </Suspense>
    </div>
  );
}

async function StaffContent() {
  const { merchant } = await requireOwnerSession();
  const team = await getTeam();

  return (
    <>
      {canAddStaff(merchant.status) ? (
        <SectionCard
          title="Agregar empleado"
          description="Le damos una contraseña temporal que va a tener que cambiar en su primer ingreso."
        >
          <AddEmployeeForm />
        </SectionCard>
      ) : (
        <p className="text-sm text-muted-foreground">
          Con el club pausado o finalizado no se pueden sumar ni reactivar empleados. Sí podés darlos de baja o
          cambiarles la contraseña.
        </p>
      )}
      <SectionCard title="Tu equipo">
        <TeamList members={team} status={merchant.status} />
      </SectionCard>
    </>
  );
}
