import { requireOwnerSession } from "@/lib/staff/session";

// Un empleado que entra a una sección del dueño vuelve a Inicio. Va dentro de un <Suspense>.
export async function OwnerOnly({ children }: { children: React.ReactNode }) {
  await requireOwnerSession();
  return children;
}
