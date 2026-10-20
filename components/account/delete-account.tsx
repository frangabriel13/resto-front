"use client";

import { useId, useState } from "react";
import { FormAlert } from "@/components/form/form-alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { deleteConfirmWord, deleteConfirmed } from "@/lib/customer/privacy";
import { customerRoutes } from "@/lib/customer/routes";

export function DeleteAccount() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  function changeOpen(next: boolean) {
    if (pending) return;
    setOpen(next);
    setTyped("");
    setError(undefined);
  }

  async function remove() {
    setPending(true);
    setError(undefined);
    const result = await callApi(api.DELETE("/me"));
    if (!result.ok) {
      setPending(false);
      return setError(result.message);
    }
    // Recarga completa: la sesión ya no existe y la cookie se borró.
    window.location.assign(customerRoutes.accountNotice("cuenta-borrada"));
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-destructive/30 p-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading font-semibold">Borrar mi cuenta</h2>
        <p className="text-sm text-muted-foreground">
          Salís de todos tus clubes y borramos tu nombre y tu teléfono. No se puede deshacer.
        </p>
      </div>
      <AlertDialog open={open} onOpenChange={changeOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="h-11 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive">
            Borrar mi cuenta
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Borrar tu cuenta?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <ul className="list-disc space-y-1 pl-5 text-left">
                <li>Salís de todos tus clubes y perdés tus sellos.</li>
                <li>Borramos tu nombre y tu teléfono, y cerramos tu sesión.</li>
                <li>No se puede deshacer: si te registrás otra vez con el mismo número, empezás de cero.</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor={id}>Para confirmar, escribí {deleteConfirmWord}</Label>
            <Input
              id={id}
              value={typed}
              autoComplete="off"
              autoCapitalize="characters"
              onChange={(event) => setTyped(event.target.value)}
              className="h-11"
            />
          </div>
          <FormAlert message={error} />
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
            <Button variant="destructive" disabled={!deleteConfirmed(typed) || pending} onClick={remove}>
              {pending && <Spinner />}
              Borrar mi cuenta
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
