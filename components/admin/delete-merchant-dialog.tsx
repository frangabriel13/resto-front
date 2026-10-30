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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  confirmsName,
  deletePiecesWarning,
  deletionItems,
  hasCustomersMessage,
  type DeletionSummary,
} from "@/lib/admin/archive";
import { adminRoutes } from "@/lib/admin/routes";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { ExportMerchantCustomers } from "./export-merchant-customers";

type DeleteMerchantDialogProps = { merchantId: string; name: string; summary: DeletionSummary };

export function DeleteMerchantDialog({ merchantId, name, summary }: DeleteMerchantDialogProps) {
  const nameId = useId();
  const ackId = useId();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  function changeOpen(next: boolean) {
    if (pending) return;
    setOpen(next);
    setTyped("");
    setAcknowledged(false);
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
          className="h-10 self-start border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2Icon />
          Borrar comercio
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Borrar {name}?</AlertDialogTitle>
          <AlertDialogDescription>Se borra para siempre:</AlertDialogDescription>
        </AlertDialogHeader>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {deletionItems(summary).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {summary.pieces > 0 && (
          <p className="text-sm font-medium">{deletePiecesWarning(summary.pieces)}</p>
        )}
        {summary.customers > 0 && (
          <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-3">
            <p className="text-sm">
              Antes, bajá la planilla de clientes: después de borrarlo no se puede recuperar.
            </p>
            <ExportMerchantCustomers merchantId={merchantId} />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor={nameId}>Para confirmar, escribí el nombre del comercio</Label>
          <Input
            id={nameId}
            value={typed}
            placeholder={name}
            autoComplete="off"
            onChange={(event) => setTyped(event.target.value)}
            className="h-11"
          />
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            id={ackId}
            checked={acknowledged}
            onCheckedChange={(checked) => setAcknowledged(checked === true)}
            className="mt-0.5 size-5"
          />
          <Label htmlFor={ackId} className="font-normal leading-snug">
            Entiendo que no se puede deshacer
          </Label>
        </div>
        <FormAlert message={error} />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={!confirmsName(typed, name) || !acknowledged || pending}
            onClick={remove}
          >
            {pending && <Spinner />}
            Borrar comercio
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
