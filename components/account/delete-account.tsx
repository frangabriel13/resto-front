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
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { deleteConfirmWord, deleteConfirmed } from "@/lib/customer/privacy";
import { customerRoutes } from "@/lib/customer/routes";
import { joinInputClass } from "@/components/join/styles";
import { AccountRowContent, accountRowButtonClass } from "./account-row";

// En el celular, una hoja que sube desde abajo; en pantallas grandes, el diálogo centrado.
const sheetClass =
  "top-auto bottom-0 left-0 translate-x-0 translate-y-0 gap-4 rounded-none rounded-t-[1.625rem] p-5 pb-6 data-[size=default]:max-w-none sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:data-[size=default]:max-w-sm";

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
    <AlertDialog open={open} onOpenChange={changeOpen}>
      <AlertDialogTrigger asChild>
        <button type="button" className={accountRowButtonClass}>
          <AccountRowContent icon={Trash2Icon} label="Borrar mi cuenta" detail="Salís de todos tus clubes" danger />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className={sheetClass}>
        <AlertDialogHeader className="place-items-start text-left">
          <AlertDialogTitle className="text-xl font-semibold">¿Borrar tu cuenta?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <ul className="list-disc space-y-1.5 pl-5 text-left text-pretty text-sm leading-normal text-neutral-700 marker:text-destructive">
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
            className={joinInputClass}
          />
        </div>
        <FormAlert message={error} />
        <AlertDialogFooter className="mx-0 mb-0 flex-col gap-1 rounded-none border-0 bg-transparent p-0 sm:flex-col sm:justify-start">
          <Button
            disabled={!deleteConfirmed(typed) || pending}
            onClick={remove}
            className="h-12.5 rounded-[0.625rem] bg-destructive text-[0.9375rem] font-medium text-white hover:bg-destructive/90"
          >
            {pending && <Spinner />}
            Borrar mi cuenta
          </Button>
          <AlertDialogCancel disabled={pending} variant="ghost" className="h-11 font-medium">
            Cancelar
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
      </AlertDialog>
  );
}
