"use client";

import { useLayoutEffect, useState } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import type { RedemptionResult } from "@/lib/redemptions/types";
import type { ScanResult, StampResult } from "@/lib/stamps/types";
import { ConfirmView, type PendingAction } from "./confirm-view";
import { cooldownFromError, grantStamp, newStampKeys, type StampKeys } from "./grant-stamp";
import { QrCamera, type CameraProblem } from "./qr-camera";
import { redeemReward } from "./redeem";
import { CameraProblemView, DoneView, ErrorView, RedeemedView } from "./result-views";

type Step =
  | { kind: "scanning" }
  | { kind: "checking" }
  | {
      kind: "confirm";
      token: string;
      scan: ScanResult;
      checkedAt: number;
      keys: StampKeys;
      redeemKey: string;
      pending: PendingAction;
      error?: string;
    }
  | { kind: "done"; result: StampResult }
  | { kind: "redeemed"; result: RedemptionResult }
  | { kind: "error"; title: string; message: string }
  | { kind: "camera"; problem: CameraProblem };

const scanning: Step = { kind: "scanning" };

// Con el club pausado solo se canjea.
export function ScanFlow({ stampsAllowed }: { stampsAllowed: boolean }) {
  const [step, setStep] = useState<Step>(scanning);

  // Al volver a la pantalla, arranca escaneando de nuevo.
  useLayoutEffect(() => () => setStep(scanning), []);

  async function check(token: string) {
    setStep({ kind: "checking" });
    const result = await callApi(api.POST("/panel/scans", { body: { stampToken: token } }));
    if (!result.ok) return setStep({ kind: "error", title: "No se pudo leer la tarjeta", message: result.message });
    setStep({
      kind: "confirm",
      token,
      scan: result.data,
      checkedAt: Date.now(),
      keys: newStampKeys(),
      redeemKey: crypto.randomUUID(),
      pending: null,
    });
  }

  async function confirm(cooldownOverride: boolean) {
    if (step.kind !== "confirm") return;
    const current = { ...step, pending: "stamp" as const, error: undefined };
    setStep(current);
    const result = await grantStamp({ stampToken: step.token }, step.keys, cooldownOverride);
    if (result.ok) return setStep({ kind: "done", result: result.data });

    const cooldown = cooldownFromError(result.error);
    if (cooldown) {
      return setStep({ ...current, pending: null, checkedAt: Date.now(), scan: { ...step.scan, cooldown } });
    }
    if (!result.error) {
      // Sin conexión: se puede reintentar con la misma clave, sin riesgo de duplicar.
      return setStep({ ...current, pending: null, error: result.message });
    }
    setStep({ kind: "error", title: "No se pudo sumar el sello", message: result.message });
  }

  async function redeem() {
    if (step.kind !== "confirm") return;
    const current = { ...step, pending: "redeem" as const, error: undefined };
    setStep(current);
    const result = await redeemReward(step.token, step.redeemKey);
    if (result.ok) return setStep({ kind: "redeemed", result: result.data });
    if (!result.error) return setStep({ ...current, pending: null, error: result.message });
    setStep({ kind: "error", title: "No se pudo canjear", message: result.message });
  }

  switch (step.kind) {
    case "scanning":
      return (
        <div className="flex flex-col gap-3">
          <QrCamera onDetect={check} onProblem={(problem) => setStep({ kind: "camera", problem })} />
          <p className="text-center text-muted-foreground">
            {stampsAllowed
              ? "Apuntá al QR de la tarjeta del cliente."
              : "El club está pausado: solo se canjean tarjetas completas."}
          </p>
        </div>
      );
    case "checking":
      return <LoadingBlock />;
    case "confirm":
      return (
        <ConfirmView
          scan={step.scan}
          checkedAt={step.checkedAt}
          pending={step.pending}
          error={step.error}
          stampsAllowed={stampsAllowed}
          onConfirm={confirm}
          onRedeem={redeem}
          onCancel={() => setStep(scanning)}
        />
      );
    case "done":
      return <DoneView result={step.result} onNext={() => setStep(scanning)} />;
    case "redeemed":
      return <RedeemedView result={step.result} onNext={() => setStep(scanning)} />;
    case "error":
      return <ErrorView title={step.title} message={step.message} onRetry={() => setStep(scanning)} />;
    case "camera":
      return <CameraProblemView problem={step.problem} onRetry={() => setStep(scanning)} />;
  }
}
