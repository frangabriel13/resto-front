"use client";

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
import { customerRoutes } from "@/lib/customer/routes";

export function LeaveClub({ membershipId, merchantName }: { membershipId: string; merchantName: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function leave() {
    setPending(true);
    setError(undefined);
    const result = await callApi(api.DELETE("/me/memberships/{id}", { params: { path: { id: membershipId } } }));
    if (!result.ok) {
      setPending(false);
      return setError(result.message);
    }
    window.location.assign(customerRoutes.accountNotice("salida"));
  }

  return (
    <div className="flex flex-col gap-2">
      <FormAlert message={error} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="h-11 w-full" disabled={pending}>
            {pending && <Spinner />}
            Salir del club
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Salir del club de {merchantName}?</AlertDialogTitle>
            <AlertDialogDescription>
              Deja de aparecer en tus clubes y no te llegan más sus novedades. Tus sellos quedan guardados: si
              volvés a sumarte desde el local, seguís donde estabas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={leave}>
              Salir del club
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
