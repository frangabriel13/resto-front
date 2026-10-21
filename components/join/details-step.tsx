"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckboxField } from "@/components/form/checkbox-field";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { LegalConsentNote } from "@/components/legal/legal-links";
import { FieldGroup } from "@/components/ui/field";
import type { ApiResult } from "@/lib/api/call-api";
import { detailsSchema, type DetailsValues } from "./schemas";

export function DetailsStep({
  merchantName,
  defaultValues,
  onSubmit,
}: {
  merchantName: string;
  defaultValues: DetailsValues;
  onSubmit: (values: DetailsValues) => Promise<ApiResult<unknown>>;
}) {
  const form = useForm<DetailsValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues,
  });

  async function submit(values: DetailsValues) {
    const result = await onSubmit(values);
    if (!result.ok) showApiError(form, result);
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} noValidate>
      <FieldGroup>
        <FormAlert message={form.formState.errors.root?.message} />
        <TextField control={form.control} name="name" label="Tu nombre" autoComplete="given-name" />
        <TextField
          control={form.control}
          name="phone"
          label="Tu celular"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="11 2345 6789"
        />
        <CheckboxField
          control={form.control}
          name="marketingConsent"
          label={`Quiero recibir novedades y promociones de ${merchantName}. Es opcional.`}
        />
        <SubmitButton pending={form.formState.isSubmitting}>Recibir código</SubmitButton>
        <LegalConsentNote />
      </FieldGroup>
    </form>
  );
}
