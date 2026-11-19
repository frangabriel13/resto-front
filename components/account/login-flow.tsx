"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { joinCodeClasses } from "@/components/join/styles";
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

function heading(step: Step): { title: string; detail: React.ReactNode } {
  if (step.kind === "phone") {
    return { title: "Ingresá a tu cuenta", detail: "Con tu celular ves tus tarjetas de todos los clubes." };
  }
  if (step.kind === "name") {
    return { title: "Creá tu cuenta", detail: "No encontramos una cuenta con ese celular. Decinos tu nombre y la creamos." };
  }
  return {
    title: "Ingresá el código",
    detail: (
      <>
        {step.request.alreadySent ? "Ya te mandamos un código por WhatsApp al " : "Te lo mandamos por WhatsApp al "}
        <span className="font-medium whitespace-nowrap text-foreground">{step.phone}</span>. Abrí el mensaje de Clubsy,
        copiá el código y volvé acá.
      </>
    ),
  };
}

export function LoginFlow({ returnTo }: { returnTo: string }) {
  const [step, setStep] = useState<Step>(start);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => () => setStep(start), []);

  // Al cambiar de paso, el foco va al título nuevo (sin esto, queda en un botón que ya no está).
  function go(next: Step) {
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  async function requestCode(phone: string) {
    const result = await requestOtp(phone);
    if (result.ok) go({ kind: "code", phone, request: result.data });
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
      go({ kind: "name", phone, code });
      return { ok: true as const, data: undefined };
    }
    return result;
  }

  const { title, detail } = heading(step);
  return (
    <div className="flex flex-col">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="font-heading text-2xl leading-tight font-semibold tracking-tight outline-none"
      >
        {title}
      </h1>
      <p className="mt-1.5 text-sm leading-normal text-neutral-600">{detail}</p>
      <div className="mt-5">{renderStep()}</div>
    </div>
  );

  function renderStep() {
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
        showNote={false}
        submitLabel="Ingresar"
        classNames={joinCodeClasses}
        onChangePhone={() => go({ kind: "phone", phone: step.phone })}
        onResend={() => requestCode(step.phone)}
        onVerify={(code) => verify(step.phone, code)}
      />
    );
  }
}
