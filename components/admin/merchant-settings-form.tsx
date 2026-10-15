"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ColorField } from "@/components/form/color-field";
import { FormAlert } from "@/components/form/form-alert";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { FieldGroup } from "@/components/ui/field";
import type { AdminMerchant } from "@/lib/admin/types";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import {
  merchantSettingsSchema,
  toSettingsValues,
  toUpdateMerchantBody,
  type MerchantSettingsValues,
} from "./schemas";

export function MerchantSettingsForm({ merchant }: { merchant: AdminMerchant }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const form = useForm<MerchantSettingsValues>({
    resolver: zodResolver(merchantSettingsSchema),
    values: toSettingsValues(merchant),
  });

  async function onSubmit(values: MerchantSettingsValues) {
    setSaved(false);
    const result = await callApi(
      api.PATCH("/admin/merchants/{id}", {
        params: { path: { id: merchant.id } },
        body: toUpdateMerchantBody(values),
      }),
    );
    if (!result.ok) {
      form.setError("root", { message: result.message });
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormAlert message={form.formState.errors.root?.message} />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField control={form.control} name="name" label="Nombre" />
          <TextField
            control={form.control}
            name="slug"
            label="Slug"
            autoCapitalize="none"
            className="font-mono"
            disabled={merchant.status !== "DRAFT"}
          />
          <div className="sm:col-span-2">
            <TextField
              control={form.control}
              name="logoUrl"
              label="Logo (URL)"
              type="url"
              placeholder="https://…"
              autoCapitalize="none"
            />
          </div>
          <ColorField control={form.control} name="primaryColor" label="Color principal" />
          <ColorField control={form.control} name="secondaryColor" label="Color secundario" />
          <TextField
            control={form.control}
            name="googleReviewUrl"
            label="Link de reseñas de Google"
            type="url"
            placeholder="https://…"
            autoCapitalize="none"
          />
          <TextField
            control={form.control}
            name="stampCooldownMinutes"
            label="Minutos entre sellos"
            inputMode="numeric"
          />
        </div>
        <div className="flex flex-col gap-2 sm:w-56">
          <SubmitButton pending={form.formState.isSubmitting}>Guardar cambios</SubmitButton>
          {saved && !form.formState.isDirty && (
            <p role="status" className="text-center text-sm text-emerald-700">
              Cambios guardados.
            </p>
          )}
        </div>
      </FieldGroup>
    </form>
  );
}
