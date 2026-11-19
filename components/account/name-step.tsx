"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { LegalConsentNote } from "@/components/legal/legal-links";
import { joinButtonClass, joinInputClass } from "@/components/join/styles";
import { FieldGroup } from "@/components/ui/field";
import type { ApiResult } from "@/lib/api/call-api";
import { nameSchema, type NameValues } from "./schemas";

// Celular sin cuenta: la API no gastó el código y espera el nombre para crearla.
export function NameStep({ onSubmit }: { onSubmit: (name: string) => Promise<ApiResult<unknown>> }) {
  const form = useForm<NameValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: "" },
  });

  async function submit({ name }: NameValues) {
    const result = await onSubmit(name);
    if (!result.ok) showApiError(form, result);
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} noValidate>
      <FieldGroup>
        <FormAlert message={form.formState.errors.root?.message} />
        <TextField
          control={form.control}
          name="name"
          label="Tu nombre"
          autoComplete="given-name"
          placeholder="Ej.: Lucía"
          className={joinInputClass}
        />
        <SubmitButton pending={form.formState.isSubmitting} className={joinButtonClass}>
          Crear mi cuenta
        </SubmitButton>
        <LegalConsentNote />
      </FieldGroup>
    </form>
  );
}
