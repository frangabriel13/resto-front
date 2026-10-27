"use client";

import type { Control } from "react-hook-form";
import { ColorField } from "@/components/form/color-field";
import { TextField } from "@/components/form/text-field";
import type { ClubSettingsValues } from "./schemas";

// Lo que ven los clientes en la tarjeta del club.
export function ClubFields<T extends ClubSettingsValues>({
  control: formControl,
  slugLocked = false,
  slugPlaceholder,
  optionalHint = false,
}: {
  control: Control<T>;
  slugLocked?: boolean;
  slugPlaceholder?: string;
  // En el alta, el slug y los minutos se pueden dejar vacíos.
  optionalHint?: boolean;
}) {
  // `Control` es invariante: el formulario puede tener más campos que estos.
  const control = formControl as unknown as Control<ClubSettingsValues>;
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <TextField
        control={control}
        name="slug"
        label="Slug"
        autoCapitalize="none"
        className="font-mono"
        placeholder={slugPlaceholder}
        disabled={slugLocked}
        description={
          optionalHint
            ? "Va en la dirección de la tarjeta. Si lo dejás vacío, se arma con el nombre."
            : slugLocked
              ? "Ya no se puede cambiar: circulan links con este slug."
              : "Va en la dirección de la tarjeta. Solo se puede cambiar mientras está en preparación."
        }
      />
      <TextField
        control={control}
        name="stampCooldownMinutes"
        label="Minutos entre sellos"
        inputMode="numeric"
        description={optionalHint ? "Si lo dejás vacío, el valor por defecto." : undefined}
      />
      <div className="sm:col-span-2">
        <TextField
          control={control}
          name="logoUrl"
          label="Logo (URL)"
          type="url"
          placeholder="https://…"
          autoCapitalize="none"
        />
      </div>
      <ColorField control={control} name="primaryColor" label="Color principal" />
      <ColorField control={control} name="secondaryColor" label="Color secundario" />
    </div>
  );
}
