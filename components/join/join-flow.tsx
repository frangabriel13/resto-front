"use client";

import { GiftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { StampTicket } from "@/components/club/stamp-card-preview";
import { CodeStep } from "@/components/otp/code-step";
import { requestOtp, type OtpRequest } from "@/components/otp/request-otp";
import { useCountdown } from "@/components/otp/use-countdown";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { joinDraftKey, parseJoinDraft, type JoinDraft } from "@/lib/customer/join-draft";
import { customerRoutes } from "@/lib/customer/routes";
import { stampCount } from "@/lib/text";
import { cn } from "@/lib/utils";
import { DetailsStep } from "./details-step";
import { JoinAsCustomer } from "./join-as-customer";
import { JoinHeader, type JoinMerchant } from "./join-header";
import type { DetailsValues } from "./schemas";
import { joinBottomBarClass, joinButtonClass, joinCodeClasses } from "./styles";

type CodeStepState = { kind: "code"; details: DetailsValues; request: OtpRequest };
type Step =
  | { kind: "details"; details: DetailsValues }
  | CodeStepState
  | { kind: "welcome"; name: string };

const start: Step = { kind: "details", details: { name: "", phone: "", marketingConsent: false } };

// El paso del código tiene su propia entrada en el historial, así el "atrás" del celular vuelve a
// los datos en vez de salir del alta.
const codeSearch = "?paso=codigo";
const onCodeUrl = () => window.location.search === codeSearch;

// sessionStorage puede no estar disponible (modo privado, almacenamiento bloqueado): el alta sigue
// funcionando, solo sin el borrador.
function readDraft(pieceCode: string): JoinDraft | null {
  try {
    return parseJoinDraft(window.sessionStorage.getItem(joinDraftKey(pieceCode)), Date.now());
  } catch {
    return null;
  }
}

function writeDraft(pieceCode: string, draft: JoinDraft | null) {
  try {
    if (draft) window.sessionStorage.setItem(joinDraftKey(pieceCode), JSON.stringify(draft));
    else window.sessionStorage.removeItem(joinDraftKey(pieceCode));
  } catch {
    // Sin almacenamiento, no hay borrador.
  }
}

type JoinFlowProps = {
  merchant: JoinMerchant & { id: string; slug: string };
  pieceCode: string;
  customerName: string | null;
  reward: { stampsRequired: number; rewardDescription: string } | null;
  // El premio, cómo se suman los sellos y las condiciones: lo arma el servidor y va arriba de los datos.
  children: React.ReactNode;
};

// Premio y datos en la misma hoja → código por WhatsApp → bienvenida. Con sesión iniciada, el alta
// es un solo toque.
export function JoinFlow({ merchant, pieceCode, customerName, reward, children }: JoinFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(start);
  const [joinError, setJoinError] = useState<string | null>(null);
  const lastCode = useRef<CodeStepState | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Al volver a la página se arranca de cero: nunca queda un código a medio cargar.
  useLayoutEffect(() => () => setStep(start), []);

  useEffect(() => {
    if (onCodeUrl()) {
      // Recargada en el paso del código: si quedó el borrador, sigue ahí; si no, vuelve a los datos.
      const draft = readDraft(pieceCode);
      if (draft) {
        const restored: CodeStepState = {
          kind: "code",
          details: draft.details,
          request: { resendAt: draft.resendAt, alreadySent: true },
        };
        lastCode.current = restored;
        // sessionStorage solo existe en el navegador: el borrador se lee después de hidratar.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStep(restored);
      } else {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }

    function onPopState() {
      setStep((current) => {
        if (!onCodeUrl() && current.kind === "code") return { kind: "details", details: current.details };
        if (onCodeUrl() && current.kind === "details" && lastCode.current) return lastCode.current;
        return current;
      });
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [pieceCode]);

  // Al cambiar de paso, el foco va al título nuevo y la hoja vuelve arriba.
  useEffect(() => {
    if (step.kind === "details") return;
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, [step.kind]);

  async function join(marketingConsent: boolean, name: string) {
    const result = await callApi(
      api.POST("/me/memberships", {
        body: { merchantId: merchant.id, marketingConsent, pieceCode },
      }),
    );
    writeDraft(pieceCode, null);
    if (onCodeUrl()) window.history.replaceState(null, "", window.location.pathname);
    if (result.ok) {
      setStep({ kind: "welcome", name });
      return result;
    }
    // Si ya validó el código tiene sesión, pero el código quedó usado: vuelve a los datos y, al
    // recargar, la pantalla lo reconoce y ofrece "Sumarme como …" para reintentar.
    setJoinError(result.message);
    setStep(start);
    router.refresh();
    return { ok: true as const, data: undefined };
  }

  async function requestCode(details: DetailsValues) {
    const result = await requestOtp(details.phone);
    if (result.ok) {
      const next: CodeStepState = { kind: "code", details, request: result.data };
      lastCode.current = next;
      writeDraft(pieceCode, { details, resendAt: result.data.resendAt, savedAt: Date.now() });
      // Un reenvío desde el paso del código no suma otra entrada al historial.
      if (!onCodeUrl()) window.history.pushState(null, "", codeSearch);
      setStep(next);
    }
    return result;
  }

  const back =
    step.kind === "code" ? { onClick: () => window.history.back() } : { href: customerRoutes.piece(pieceCode) };

  return (
    <div className="flex flex-1 flex-col">
      <JoinHeader merchant={merchant} back={back} />
      <div className="flex flex-1 flex-col rounded-t-[1.625rem] bg-background">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          {step.kind === "details" && (
            <>
              <div className="px-5 pt-5">{children}</div>
              {customerName ? (
                <JoinAsCustomer
                  customerName={customerName}
                  merchantName={merchant.name}
                  notice={joinError}
                  join={(marketingConsent) => join(marketingConsent, customerName)}
                />
              ) : (
                <DetailsStep merchantName={merchant.name} defaultValues={step.details} onSubmit={requestCode} />
              )}
            </>
          )}

          {step.kind === "code" && (
            <section aria-labelledby="ingresa-el-codigo" className="flex flex-col gap-5 px-5 pt-5 pb-8">
              <div className="flex flex-col gap-1.5">
                <h1
                  id="ingresa-el-codigo"
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-heading text-2xl font-semibold tracking-tight outline-none"
                >
                  Ingresá el código
                </h1>
                <p className="text-sm leading-normal text-muted-foreground">
                  {step.request.alreadySent ? "Ya te lo mandamos por WhatsApp al " : "Te lo mandamos por WhatsApp al "}
                  <span className="font-medium text-foreground">{step.details.phone}</span>.{" "}
                  {step.request.alreadySent
                    ? "Usá ese o pedí otro cuando se habilite."
                    : "Te llega un mensaje de Clubsy: abrí WhatsApp, copiá el código y volvé acá."}
                </p>
              </div>
              {reward && <PrizeReminder {...reward} />}
              <div className="flex flex-col gap-2">
                <CodeStep
                  phone={step.details.phone}
                  resendAt={step.request.resendAt}
                  alreadySent={step.request.alreadySent}
                  showNote={false}
                  submitLabel="Confirmar y sumarme"
                  classNames={joinCodeClasses}
                  onChangePhone={() => window.history.back()}
                  onResend={() => requestCode(step.details)}
                  onVerify={async (code) => {
                    const { details } = step;
                    const verified = await callApi(
                      api.POST("/auth/customer/otp/verify", {
                        body: { phone: details.phone, code, name: details.name },
                      }),
                    );
                    // Si el celular ya tenía cuenta, vale el nombre guardado, no el que escribió ahora.
                    return verified.ok
                      ? join(details.marketingConsent, verified.data.customer.name || details.name)
                      : verified;
                  }}
                />
              </div>
              <NotArrivedHelp resendAt={step.request.resendAt} />
            </section>
          )}

          {step.kind === "welcome" && (
            <>
              <section aria-labelledby="bienvenida" className="flex flex-col items-center px-5 pt-7 pb-6 text-center">
                <h1
                  id="bienvenida"
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-heading text-2xl leading-tight font-semibold tracking-tight text-balance wrap-break-word outline-none"
                >
                  ¡Listo, ya sos parte del club de {merchant.name}!
                </h1>
                {reward && (
                  <div className="mt-5 w-full">
                    <StampTicket stampsRequired={reward.stampsRequired} showNext>
                      <p className="text-xs text-ticket-foreground/82">Tu tarjeta</p>
                      <p className="text-[1.0625rem] font-semibold wrap-anywhere">{step.name}</p>
                      <p className="mt-1 text-[0.8125rem] text-ticket-foreground/82">
                        0 de {stampCount(reward.stampsRequired)} · Tu primer sello te espera
                      </p>
                    </StampTicket>
                  </div>
                )}
                <p className="mt-4.5 max-w-80 text-[0.9375rem] leading-normal text-neutral-700">
                  <span className="font-semibold text-foreground">¿Estás comprando ahora?</span> Mostrá tu QR en la
                  caja y sumá tu primer sello.
                </p>
              </section>
              <div className={joinBottomBarClass}>
                <Link
                  href={customerRoutes.cardQr(merchant.slug)}
                  className={cn(
                    "flex w-full items-center justify-center transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.99]",
                    joinButtonClass,
                  )}
                >
                  Mostrar mi QR
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// En el paso del código, el premio sigue a la vista: es lo que motiva a terminar.
function PrizeReminder({ stampsRequired, rewardDescription }: { stampsRequired: number; rewardDescription: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-[0.625rem] bg-ticket px-3 py-2.5 text-ticket-foreground">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ticket-prize text-ticket-prize-foreground">
        <GiftIcon aria-hidden strokeWidth={1.8} className="size-4" />
      </span>
      <p className="text-[0.8125rem] leading-snug">
        Ya casi: con {stampCount(stampsRequired)} te llevás{" "}
        <span className="font-semibold wrap-anywhere">{rewardDescription}</span>.
      </p>
    </div>
  );
}

// "¿No te llegó?" recién cuando se puede pedir otro código: antes, la pantalla no anticipa un error.
function NotArrivedHelp({ resendAt }: { resendAt: number }) {
  const secondsLeft = useCountdown(resendAt);
  if (secondsLeft > 0) return null;
  return (
    <div role="status" className="flex flex-col gap-1 rounded-[0.625rem] bg-neutral-100 px-4 py-3.5">
      <h2 className="text-[0.8125rem] font-semibold">¿No te llegó?</h2>
      <p className="text-[0.8125rem] leading-normal text-neutral-600">
        Fijate que el número sea el de tu WhatsApp; si no, tocá «Cambiar número». Si es el correcto, pedí otro
        código con «Reenviar código».
      </p>
    </div>
  );
}
