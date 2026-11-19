"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { joinButtonClass, joinInputClass } from "@/components/join/styles";
import { FieldGroup } from "@/components/ui/field";
import type { ApiResult } from "@/lib/api/call-api";
import { phoneSchema, type PhoneValues } from "./schemas";

export function PhoneStep({
  defaultPhone,
  onSubmit,
}: {
  defaultPhone: string;
  onSubmit: (phone: string) => Promise<ApiResult<unknown>>;
}) {
  const form = useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: defaultPhone },
  });

  async function submit({ phone }: PhoneValues) {
    const result = await onSubmit(phone);
    if (!result.ok) showApiError(form, result);
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} noValidate>
      <FieldGroup>
        <FormAlert message={form.formState.errors.root?.message} />
        <TextField
          control={form.control}
          name="phone"
          label="Tu celular"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="Ej.: 11 2345 6789"
          enterKeyHint="send"
          description="Te llega un mensaje de Clubsy por WhatsApp con un código."
          className={joinInputClass}
        />
        <SubmitButton pending={form.formState.isSubmitting} className={joinButtonClass}>
          Recibir código por WhatsApp
        </SubmitButton>
      </FieldGroup>
    </form>
  );
}
