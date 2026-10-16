"use client";

import { useLayoutEffect, useState } from "react";
import { callApi, type ApiResult } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { CodeStep } from "@/components/otp/code-step";
import { requestOtp, type OtpRequest } from "@/components/otp/request-otp";
import { DetailsStep } from "./details-step";
import type { DetailsValues } from "./schemas";

type Step =
  | { kind: "details"; details: DetailsValues }
  | { kind: "code"; details: DetailsValues; request: OtpRequest };

const emptyDetails: DetailsValues = { name: "", phone: "", marketingConsent: false };

type JoinWithPhoneProps = {
  merchantName: string;
  join: (marketingConsent: boolean) => Promise<ApiResult<unknown>>;
};

export function JoinWithPhone({ merchantName, join }: JoinWithPhoneProps) {
  const [step, setStep] = useState<Step>({ kind: "details", details: emptyDetails });

  // Al volver a la página se arranca de cero: nunca queda un código a medio cargar.
  useLayoutEffect(() => () => setStep({ kind: "details", details: emptyDetails }), []);

  async function requestCode(details: DetailsValues) {
    const result = await requestOtp(details.phone);
    if (result.ok) setStep({ kind: "code", details, request: result.data });
    return result;
  }

  if (step.kind === "details") {
    return (
      <DetailsStep
        merchantName={merchantName}
        defaultValues={step.details}
        onSubmit={requestCode}
      />
    );
  }

  const { details } = step;
  return (
    <CodeStep
      phone={details.phone}
      resendAt={step.request.resendAt}
      alreadySent={step.request.alreadySent}
      onChangePhone={() => setStep({ kind: "details", details })}
      onResend={() => requestCode(details)}
      onVerify={async (code) => {
        const verified = await callApi(
          api.POST("/auth/customer/otp/verify", {
            body: { phone: details.phone, code, name: details.name },
          }),
        );
        return verified.ok ? join(details.marketingConsent) : verified;
      }}
    />
  );
}
