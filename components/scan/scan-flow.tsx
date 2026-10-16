"use client";

import { useLayoutEffect, useState } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import type { ScanResult, StampResult } from "@/lib/stamps/types";
import { ConfirmView } from "./confirm-view";
import { cooldownFromError, grantStamp, newStampKeys, type StampKeys } from "./grant-stamp";
import { QrCamera, type CameraProblem } from "./qr-camera";
import { CameraProblemView, DoneView, ErrorView } from "./result-views";

type Step =
  | { kind: "scanning" }
  | { kind: "checking" }
  | {
      kind: "confirm";
      token: string;
      scan: ScanResult;
      checkedAt: number;
      keys: StampKeys;
      pending: boolean;
      error?: string;
    }
  | { kind: "done"; result: StampResult }
  | { kind: "error"; message: string }
  | { kind: "camera"; problem: CameraProblem };

const scanning: Step = { kind: "scanning" };

export function ScanFlow() {
  const [step, setStep] = useState<Step>(scanning);

  // Al volver a la pantalla, arranca escaneando de nuevo.
  useLayoutEffect(() => () => setStep(scanning), []);

  async function check(token: string) {
    setStep({ kind: "checking" });
    const result = await callApi(api.POST("/panel/scans", { body: { stampToken: token } }));
    if (!result.ok) return setStep({ kind: "error", message: result.message });
    setStep({
      kind: "confirm",
      token,
      scan: result.data,
      checkedAt: Date.now(),
      keys: newStampKeys(),
      pending: false,
    });
  }

  async function confirm(cooldownOverride: boolean) {
    if (step.kind !== "confirm") return;
    const current = { ...step, pending: true, error: undefined };
    setStep(current);
    const result = await grantStamp({ stampToken: step.token }, step.keys, cooldownOverride);
    if (result.ok) return setStep({ kind: "done", result: result.data });

    const cooldown = cooldownFromError(result.error);
    if (cooldown) {
      return setStep({ ...current, pending: false, checkedAt: Date.now(), scan: { ...step.scan, cooldown } });
    }
    if (!result.error) {
      // Sin conexión: se puede reintentar con la misma clave, sin riesgo de duplicar.
      return setStep({ ...current, pending: false, error: result.message });
    }
    setStep({ kind: "error", message: result.message });
  }

  switch (step.kind) {
    case "scanning":
      return (
        <div className="flex flex-col gap-3">
          <QrCamera onDetect={check} onProblem={(problem) => setStep({ kind: "camera", problem })} />
          <p className="text-center text-muted-foreground">Apuntá al QR de la tarjeta del cliente.</p>
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
          onConfirm={confirm}
          onCancel={() => setStep(scanning)}
        />
      );
    case "done":
      return <DoneView result={step.result} onNext={() => setStep(scanning)} />;
    case "error":
      return <ErrorView message={step.message} onRetry={() => setStep(scanning)} />;
    case "camera":
      return <CameraProblemView problem={step.problem} onRetry={() => setStep(scanning)} />;
  }
}
