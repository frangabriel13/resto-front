"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ColorField } from "@/components/form/color-field";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { FieldGroup } from "@/components/ui/field";
import { callApi } from "@/lib/api/call-api";
import { clubsyColors } from "@/lib/brand/colors";
import { hexColorPattern } from "@/lib/merchants/fields";
import { api } from "@/lib/api/client";
import { cooldownText } from "@/lib/settings/cooldown";
import type { SettingsView } from "@/lib/settings/types";
import { BrandPreview } from "./brand-preview";
import { settingsSchema, toSettingsBody, toSettingsValues, type SettingsValues } from "./schemas";

export function SettingsForm({ view, readOnly }: { view: SettingsView; readOnly: boolean }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    values: toSettingsValues(view.settings),
    disabled: readOnly,
  });
  const [primaryColor, secondaryColor, cooldown] = useWatch({
    control: form.control,
    name: ["primaryColor", "secondaryColor", "stampCooldownMinutes"],
  });
  const minutes = /^\d+$/.test(cooldown) ? Number(cooldown) : null;

  async function onSubmit(values: SettingsValues) {
    setSaved(false);
    const result = await callApi(api.PUT("/panel/settings", { body: toSettingsBody(values) }));
    if (!result.ok) return showApiError(form, result);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormAlert message={form.formState.errors.root?.message} />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <ColorField
              control={form.control}
              name="primaryColor"
              label="Color principal"
              description="Fondo del encabezado y de la tarjeta. Vacío: los colores de Clubsy."
              emptyColor={clubsyColors.primary}
            />
            <ColorField
              control={form.control}
              name="secondaryColor"
              label="Color secundario"
              description="Sellos y detalles."
              emptyColor={hexColorPattern.test(primaryColor) ? primaryColor : clubsyColors.secondary}
            />
          </div>
          <BrandPreview
            name={view.merchant.name}
            logoUrl={view.merchant.logoUrl}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>
        <TextField
          control={form.control}
          name="googleReviewUrl"
          label="Link de reseñas de Google"
          description="Lo ven todos tus clientes en su tarjeta. Solo links de Google."
          type="url"
          placeholder="https://g.page/…"
          autoCapitalize="none"
        />
        <div className="sm:w-64">
          <TextField
            control={form.control}
            name="stampCooldownMinutes"
            label="Minutos entre sellos"
            description={minutes !== null && minutes <= 1440 ? cooldownText(minutes) : "De 0 a 1440 minutos."}
            inputMode="numeric"
          />
        </div>
        {!readOnly && (
          <div className="flex flex-col gap-2 sm:w-56">
            <SubmitButton pending={form.formState.isSubmitting}>Guardar cambios</SubmitButton>
            {saved && !form.formState.isDirty && (
              <p role="status" className="text-center text-sm text-emerald-700">
                Cambios guardados.
              </p>
            )}
          </div>
        )}
      </FieldGroup>
    </form>
  );
}
