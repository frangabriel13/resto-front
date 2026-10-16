"use client";

import { ClockIcon, GiftIcon } from "lucide-react";
import { FormAlert } from "@/components/form/form-alert";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { balanceAfterStamp, timeAgo } from "@/lib/stamps/scan";
import type { ScanResult } from "@/lib/stamps/types";

type ConfirmViewProps = {
  scan: ScanResult;
  checkedAt: number;
  pending: boolean;
  error?: string;
  onConfirm: (cooldownOverride: boolean) => void;
  onCancel: () => void;
};

export function ConfirmView({ scan, checkedAt, pending, error, onConfirm, onCancel }: ConfirmViewProps) {
  const { membership, cooldown } = scan;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 rounded-2xl border p-5">
        <span className="text-sm text-muted-foreground">Cliente</span>
        <span className="font-heading text-2xl font-semibold break-words text-primary">
          {membership.customer.name ?? "Cliente sin nombre"}
        </span>
        {membership.customer.phone && (
          <span className="text-sm text-muted-foreground">{membership.customer.phone}</span>
        )}
        <span className="mt-2 text-base">
          Tiene {membership.balance} de {membership.stampsRequired} · queda en{" "}
          <span className="font-semibold">
            {balanceAfterStamp(membership.balance, membership.stampsRequired)}
          </span>
        </span>
      </div>

      {membership.canRedeem && (
        <Alert className="border-brand/40 bg-brand/10">
          <GiftIcon className="text-brand" />
          <AlertTitle>¡Ya puede canjear su premio!</AlertTitle>
          <AlertDescription>Si sumás este sello, pasa a la próxima tarjeta.</AlertDescription>
        </Alert>
      )}
      {cooldown.active && cooldown.lastStampAt && (
        <Alert className="border-brand/40 bg-brand/10">
          <ClockIcon className="text-brand" />
          <AlertTitle>Recibió un sello {timeAgo(cooldown.lastStampAt, checkedAt)}</AlertTitle>
          <AlertDescription>¿Es otro consumo? Si es así, podés sumarlo igual.</AlertDescription>
        </Alert>
      )}

      <FormAlert message={error} />

      <Button
        size="lg"
        className="h-14 text-lg"
        disabled={pending}
        onClick={() => onConfirm(cooldown.active)}
      >
        {pending && <Spinner />}
        {cooldown.active ? "Sí, es otro consumo: sumar sello" : "Sumar sello"}
      </Button>
      <Button variant="outline" size="lg" className="h-12" disabled={pending} onClick={onCancel}>
        Cancelar
      </Button>
    </div>
  );
}
