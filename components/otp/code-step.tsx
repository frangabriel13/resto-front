"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import type { ApiResult } from "@/lib/api/call-api";
import { formatCountdown } from "@/lib/format";
import { codeSchema, type CodeValues } from "./schemas";
import { useCountdown } from "./use-countdown";

type CodeStepProps = {
  phone: string;
  resendAt: number;
  alreadySent: boolean;
  onVerify: (code: string) => Promise<ApiResult<unknown>>;
  onResend: () => Promise<ApiResult<unknown>>;
  onChangePhone: () => void;
};

export function CodeStep({
  phone,
  resendAt,
  alreadySent,
  onVerify,
  onResend,
  onChangePhone,
}: CodeStepProps) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const secondsLeft = useCountdown(resendAt);
  const form = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });

  async function submit({ code }: CodeValues) {
    const result = await onVerify(code);
    if (!result.ok) showApiError(form, result);
  }

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
        <p className="text-sm text-muted-foreground">
          {alreadySent ? "Ya te mandamos un código hace un momento al " : "Te mandamos un código de 6 números al "}
          <span className="font-medium text-foreground">{phone}</span>.
          {alreadySent && " Usá ese o pedí otro cuando se habilite."}
        </p>
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
          maxLength={6}
          className="text-center font-mono text-xl tracking-[0.4em]"
        />
        <SubmitButton pending={form.formState.isSubmitting}>Confirmar</SubmitButton>
        <div className="flex flex-wrap justify-between gap-2">
          <Button type="button" variant="link" className="h-auto px-0" onClick={onChangePhone}>
            Cambiar número
          </Button>
          <Button
            type="button"
            variant="link"
            className="h-auto px-0"
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
