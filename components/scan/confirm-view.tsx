"use client";

import { ClockIcon, GiftIcon, PauseIcon } from "lucide-react";
import { FormAlert } from "@/components/form/form-alert";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { balanceAfterStamp, balanceText, scanActions, timeAgo } from "@/lib/stamps/scan";
import type { ScanResult } from "@/lib/stamps/types";

export type PendingAction = "stamp" | "redeem" | null;

type ConfirmViewProps = {
  scan: ScanResult;
  checkedAt: number;
  pending: PendingAction;
  error?: string;
  stampsAllowed?: boolean;
  onConfirm: (cooldownOverride: boolean) => void;
  // Sin esto (sello manual desde la ficha) no se ofrece canjear.
  onRedeem?: () => void;
  onCancel: () => void;
};

export function ConfirmView({
  scan,
  checkedAt,
  pending,
  error,
  stampsAllowed = true,
  onConfirm,
  onRedeem,
  onCancel,
}: ConfirmViewProps) {
  const { membership, cooldown } = scan;
  const actions = scanActions(scan, { stampsAllowed, redeemAvailable: Boolean(onRedeem) });
  const busy = pending !== null;

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
          Tiene {balanceText(membership.balance, membership.stampsRequired)}
          {actions.stamp && !actions.redeem && (
            <>
              {" "}
              · queda en{" "}
              <span className="font-semibold">
                {balanceAfterStamp(membership.balance, membership.stampsRequired)}
              </span>
            </>
          )}
        </span>
      </div>

      {membership.canRedeem && <RedeemNotice redeemHere={actions.redeem} stampsAllowed={stampsAllowed} />}
      {!actions.stamp && !actions.redeem && (
        <Alert>
          <PauseIcon />
          <AlertTitle>El club está pausado</AlertTitle>
          <AlertDescription>No se pueden sumar sellos. Solo se canjean tarjetas completas.</AlertDescription>
        </Alert>
      )}
      {actions.stamp === "override" && cooldown.lastStampAt && (
        <Alert className="border-brand/40 bg-brand/10">
          <ClockIcon className="text-brand" />
          <AlertTitle>Recibió un sello {timeAgo(cooldown.lastStampAt, checkedAt)}</AlertTitle>
          <AlertDescription>¿Es otro consumo? Si es así, podés sumarlo igual.</AlertDescription>
        </Alert>
      )}

      <FormAlert message={error} />

      {actions.redeem && (
        <Button size="lg" className="h-14 text-lg" disabled={busy} onClick={onRedeem}>
          {pending === "redeem" ? <Spinner /> : <GiftIcon />}
          Canjear premio
        </Button>
      )}
      {actions.stamp && (
        <Button
          variant={actions.redeem ? "outline" : "default"}
          size="lg"
          className={actions.redeem ? "h-12" : "h-14 text-lg"}
          disabled={busy}
          onClick={() => onConfirm(actions.stamp === "override")}
        >
          {pending === "stamp" && <Spinner />}
          {stampLabel(actions.stamp, actions.redeem)}
        </Button>
      )}
      <Button
        variant={actions.stamp || actions.redeem ? "ghost" : "outline"}
        size="lg"
        className="h-12"
        disabled={busy}
        onClick={onCancel}
      >
        {actions.stamp || actions.redeem ? "Cancelar" : "Escanear otro"}
      </Button>
    </div>
  );
}

function RedeemNotice({ redeemHere, stampsAllowed }: { redeemHere: boolean; stampsAllowed: boolean }) {
  const text = redeemHere
    ? stampsAllowed
      ? "Si en vez de canjear sumás un sello, pasa a la próxima tarjeta."
      : null
    : "Para canjear, escaneá el QR de su tarjeta. Si sumás este sello, pasa a la próxima tarjeta.";
  return (
    <Alert className="border-brand/40 bg-brand/10">
      <GiftIcon className="text-brand" />
      <AlertTitle>¡Ya puede canjear su premio!</AlertTitle>
      {text && <AlertDescription>{text}</AlertDescription>}
    </Alert>
  );
}

function stampLabel(stamp: "normal" | "override", redeem: boolean): string {
  if (stamp === "override") return redeem ? "Es otro consumo: sumar sello igual" : "Sí, es otro consumo: sumar sello";
  return redeem ? "Sumar sello igual" : "Sumar sello";
}
