"use client";

import { Trash2Icon } from "lucide-react";
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
import { confirmsName, deletePiecesWarning, hasCustomersMessage } from "@/lib/admin/archive";
import { adminRoutes } from "@/lib/admin/routes";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";

type DeleteMerchantDialogProps = { merchantId: string; name: string; pieceCount: number };

export function DeleteMerchantDialog({ merchantId, name, pieceCount }: DeleteMerchantDialogProps) {
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
    const result = await callApi(
      api.DELETE("/admin/merchants/{id}", {
        params: { path: { id: merchantId }, query: { confirmName: typed } },
      }),
    );
    if (!result.ok) {
      setPending(false);
      setError(
        result.error?.code === "MERCHANT_HAS_CUSTOMERS"
          ? hasCustomersMessage(result.error.details)
          : result.message,
      );
      return;
    }
    // Recarga completa: el listado guardado de la navegación anterior todavía lo muestra.
    window.location.assign(adminRoutes.merchants);
  }

  return (
    <AlertDialog open={open} onOpenChange={changeOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="h-10 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2Icon />
          Borrar comercio
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Borrar {name}?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <ul className="list-disc space-y-1 pl-5 text-left">
              <li>
                Se borra todo: la ficha, las piezas, los escaneos, el historial y los usuarios del
                panel que no estén en otro comercio.
              </li>
              {pieceCount > 0 && (
                <li className="font-medium text-foreground">{deletePiecesWarning(pieceCount)}</li>
              )}
              <li>Solo se puede si nunca tuvo clientes. No se puede deshacer.</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor={id}>Para confirmar, escribí el nombre del comercio</Label>
          <Input
            id={id}
            value={typed}
            placeholder={name}
            autoComplete="off"
            onChange={(event) => setTyped(event.target.value)}
            className="h-11"
          />
        </div>
        <FormAlert message={error} />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
          <Button variant="destructive" disabled={!confirmsName(typed, name) || pending} onClick={remove}>
            {pending && <Spinner />}
            Borrar comercio
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
