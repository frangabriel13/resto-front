"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { TextareaField } from "@/components/form/textarea-field";
import { FieldGroup } from "@/components/ui/field";
import type { ApiResult } from "@/lib/api/call-api";
import { pieceSchema, type PieceValues } from "@/lib/pieces/destination";
import { DestinationTypeField } from "./destination-type-field";

type PieceFormProps = {
  defaultValues: PieceValues;
  merchantReviewUrl: string | null;
  submitLabel: string;
  notice?: string;
  onSave: (values: PieceValues) => Promise<ApiResult<unknown>>;
  onSaved: () => void;
};

export function PieceForm({
  defaultValues,
  merchantReviewUrl,
  submitLabel,
  notice,
  onSave,
  onSaved,
}: PieceFormProps) {
  const form = useForm<PieceValues>({ resolver: zodResolver(pieceSchema), defaultValues });
  const [type, url] = useWatch({ control: form.control, name: ["destination.type", "destination.url"] });

  async function onSubmit(values: PieceValues) {
    const result = await onSave(values);
    if (!result.ok) {
      showApiError(form, result);
      return;
    }
    onSaved();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormAlert message={form.formState.errors.root?.message} />
        <TextField
          control={form.control}
          name="label"
          label="Nombre"
          placeholder="Por ejemplo: Mostrador"
          description="Interno: el cliente no lo ve."
        />
        <DestinationTypeField control={form.control} />

        {type === "GOOGLE_REVIEWS" && (
          <TextField
            control={form.control}
            name="destination.url"
            label="Link de reseñas"
            type="url"
            placeholder="https://g.page/…"
            autoCapitalize="none"
            description={reviewUrlHint(url, merchantReviewUrl)}
          />
        )}
        {type === "INSTAGRAM" && (
          <TextField
            control={form.control}
            name="destination.username"
            label="Usuario de Instagram"
            placeholder="@cafedelaesquina"
            autoCapitalize="none"
            autoComplete="off"
          />
        )}
        {type === "WHATSAPP" && (
          <>
            <TextField
              control={form.control}
              name="destination.phone"
              label="Celular"
              type="tel"
              inputMode="tel"
              autoComplete="off"
            />
            <TextareaField
              control={form.control}
              name="destination.message"
              label="Mensaje (opcional)"
              description="Aparece escrito en el chat; el cliente lo puede cambiar antes de mandarlo."
            />
          </>
        )}

        {notice && <p className="text-sm text-muted-foreground">{notice}</p>}
        <SubmitButton pending={form.formState.isSubmitting}>{submitLabel}</SubmitButton>
      </FieldGroup>
    </form>
  );
}

function reviewUrlHint(url: string, merchantReviewUrl: string | null) {
  if (!merchantReviewUrl) return "El comercio no tiene link de reseñas cargado: pegá el de Google.";
  if (url.trim() === merchantReviewUrl) return "Es el link de reseñas cargado en los datos del comercio.";
  return undefined;
}
