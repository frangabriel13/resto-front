"use client";

import { useId, useState } from "react";
import { FormAlert } from "@/components/form/form-alert";
import { Switch } from "@/components/ui/switch";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";

// Se guarda al tocarlo. Si falla, vuelve a como estaba.
export function MarketingConsent({
  membershipId,
  merchantName,
  initial,
}: {
  membershipId: string;
  merchantName: string;
  initial: boolean;
}) {
  const id = useId();
  const [consent, setConsent] = useState(initial);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<{ ok: true } | { ok: false; message: string } | null>(null);

  async function change(next: boolean) {
    setConsent(next);
    setPending(true);
    setStatus(null);
    const result = await callApi(
      api.PATCH("/me/memberships/{id}/consent", {
        params: { path: { id: membershipId } },
        body: { marketingConsent: next },
      }),
    );
    setPending(false);
    if (!result.ok) {
      setConsent(!next);
      return setStatus({ ok: false, message: result.message });
    }
    setStatus({ ok: true });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-4">
        <label htmlFor={id} className="flex flex-col gap-0.5">
          <span className="font-medium">Quiero recibir novedades de {merchantName}</span>
          <span className="text-sm text-muted-foreground">Es opcional y lo podés cambiar cuando quieras.</span>
        </label>
        <Switch id={id} checked={consent} disabled={pending} onCheckedChange={change} className="mt-1" />
      </div>
      {status?.ok && (
        <p role="status" className="text-sm text-emerald-700">
          {consent ? "Listo, te van a llegar sus novedades." : "Listo, no te van a llegar más novedades."}
        </p>
      )}
      {status && !status.ok && <FormAlert message={status.message} />}
    </div>
  );
}
