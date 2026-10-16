"use client";

import { useLayoutEffect, useState } from "react";
import { CodeStep } from "@/components/otp/code-step";
import { requestOtp, type OtpRequest } from "@/components/otp/request-otp";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { NameStep } from "./name-step";
import { PhoneStep } from "./phone-step";

type Step =
  | { kind: "phone"; phone: string }
  | { kind: "code"; phone: string; request: OtpRequest }
  | { kind: "name"; phone: string; code: string };

const start: Step = { kind: "phone", phone: "" };

export function LoginFlow({ returnTo }: { returnTo: string }) {
  const [step, setStep] = useState<Step>(start);

  useLayoutEffect(() => () => setStep(start), []);

  async function requestCode(phone: string) {
    const result = await requestOtp(phone);
    if (result.ok) setStep({ kind: "code", phone, request: result.data });
    return result;
  }

  async function verify(phone: string, code: string, name?: string) {
    const result = await callApi(
      api.POST("/auth/customer/otp/verify", { body: { phone, code, name } }),
    );
    if (result.ok) {
      // Recarga completa: las pantallas del servidor leen la sesión nueva.
      window.location.assign(returnTo);
    } else if (result.error?.code === "NAME_REQUIRED") {
      setStep({ kind: "name", phone, code });
      return { ok: true as const, data: undefined };
    }
    return result;
  }

  if (step.kind === "phone") {
    return <PhoneStep defaultPhone={step.phone} onSubmit={requestCode} />;
  }
  if (step.kind === "name") {
    return <NameStep onSubmit={(name) => verify(step.phone, step.code, name)} />;
  }
  return (
    <CodeStep
      phone={step.phone}
      resendAt={step.request.resendAt}
      alreadySent={step.request.alreadySent}
      onChangePhone={() => setStep({ kind: "phone", phone: step.phone })}
      onResend={() => requestCode(step.phone)}
      onVerify={(code) => verify(step.phone, code)}
    />
  );
}
