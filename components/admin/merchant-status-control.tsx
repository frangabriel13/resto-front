"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormAlert } from "@/components/form/form-alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { nextMerchantStatuses, type MerchantStatus } from "@/lib/merchants/status";

const actionLabels: Record<MerchantStatus, string> = {
  DRAFT: "Volver a preparación",
  ACTIVE: "Activar",
  PAUSED: "Pausar",
  ENDED: "Finalizar",
};

export function MerchantStatusControl({
  merchantId,
  status,
}: {
  merchantId: string;
  status: MerchantStatus;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<MerchantStatus | null>(null);
  const [error, setError] = useState<string>();
  const options = nextMerchantStatuses(status);

  async function change(next: MerchantStatus) {
    setPending(next);
    setError(undefined);
    const result = await callApi(
      api.PATCH("/admin/merchants/{id}", {
        params: { path: { id: merchantId } },
        body: { status: next },
      }),
    );
    setPending(null);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.refresh();
  }

  if (options.length === 0) {
    return <p className="text-sm text-muted-foreground">Un comercio finalizado no cambia más de estado.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <FormAlert message={error} />
      <div className="flex flex-wrap gap-2">
        {options.map((next) =>
          next === "ENDED" ? (
            <ConfirmEnd key={next} pending={pending === next} onConfirm={() => change(next)} />
          ) : (
            <Button
              key={next}
              variant={next === "ACTIVE" ? "default" : "outline"}
              className="h-10"
              disabled={pending !== null}
              onClick={() => change(next)}
            >
              {pending === next && <Spinner />}
              {status === "PAUSED" && next === "ACTIVE" ? "Reactivar" : actionLabels[next]}
            </Button>
          ),
        )}
      </div>
    </div>
  );
}

function ConfirmEnd({ pending, onConfirm }: { pending: boolean; onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="h-10" disabled={pending}>
          {pending && <Spinner />}
          Finalizar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Finalizar el club?</AlertDialogTitle>
          <AlertDialogDescription>
            No se va a poder reactivar. Los clientes van a ver su historial con un aviso de club
            finalizado y el panel queda en solo lectura.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Finalizar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
