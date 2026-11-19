"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import type { ApiResult } from "@/lib/api/call-api";
import { formatCountdown } from "@/lib/format";
import { cn } from "@/lib/utils";
import { codeSchema, normalizeCode, type CodeValues } from "./schemas";
import { useCountdown } from "./use-countdown";

type CodeStepProps = {
  phone: string;
  resendAt: number;
  alreadySent: boolean;
  onVerify: (code: string) => Promise<ApiResult<unknown>>;
  onResend: () => Promise<ApiResult<unknown>>;
  onChangePhone: () => void;
  // El alta muestra el aviso del envío en su propio encabezado y usa los estilos de la página del comercio.
  showNote?: boolean;
  submitLabel?: string;
  classNames?: { input?: string; button?: string; link?: string };
};

export function CodeStep({
  phone,
  resendAt,
  alreadySent,
  onVerify,
  onResend,
  onChangePhone,
  showNote = true,
  submitLabel = "Confirmar",
  classNames = {},
}: CodeStepProps) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const secondsLeft = useCountdown(resendAt);
  const form = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });

  async function submit({ code }: CodeValues) {
    const result = await onVerify(normalizeCode(code));
    if (!result.ok) showApiError(form, result);
  }

  // Al completar los 6 números (escritos, pegados o con el autocompletado del celular) se confirma
  // solo, una vez por código: si falla, se corrige y se vuelve a intentar.
  const code = useWatch({ control: form.control, name: "code" });
  const autoSubmitted = useRef("");
  useEffect(() => {
    const normalized = normalizeCode(code);
    if (!/^\d{6}$/.test(normalized) || normalized === autoSubmitted.current) return;
    autoSubmitted.current = normalized;
    void form.handleSubmit(submit)();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo reacciona al código escrito
  }, [code]);

  async function resend() {
    setResending(true);
    setResent(false);
    form.clearErrors();
    const result = await onResend();
    setResending(false);
    if (!result.ok) {
      form.setError("root", { message: result.message });
      return;
    }
    form.reset();
    setResent(true);
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} noValidate>
      <FieldGroup>
        {showNote && (
          <p className="text-sm text-muted-foreground">
            {alreadySent ? "Ya te mandamos un código hace un momento al " : "Te mandamos un código de 6 números al "}
            <span className="font-medium text-foreground">{phone}</span>.
            {alreadySent && " Usá ese o pedí otro cuando se habilite."}
          </p>
        )}
        <FormAlert message={form.formState.errors.root?.message} />
        {resent && (
          <p role="status" className="text-sm text-emerald-700">
            Te mandamos un código nuevo.
          </p>
        )}
        <TextField
          control={form.control}
          name="code"
          label="Código"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={9}
          className={cn("text-center font-mono text-xl tracking-[0.4em]", classNames.input)}
        />
        <SubmitButton pending={form.formState.isSubmitting} className={classNames.button}>
          {submitLabel}
        </SubmitButton>
        <div className="flex flex-wrap justify-between gap-2">
          <Button type="button" variant="link" className={cn("h-auto px-0", classNames.link)} onClick={onChangePhone}>
            Cambiar número
          </Button>
          <Button
            type="button"
            variant="link"
            className={cn("h-auto px-0", classNames.link)}
            disabled={secondsLeft > 0 || resending}
            onClick={resend}
          >
            {secondsLeft > 0
              ? `Reenviar código en ${formatCountdown(secondsLeft)}`
              : "Reenviar código"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
