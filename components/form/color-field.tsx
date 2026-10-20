"use client";

import { useId } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { hexColorPattern as hexColor } from "@/lib/merchants/fields";

type ColorFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  // Color que se usa si el campo queda vacío (lo muestra la muestra de color).
  emptyColor?: string;
};

export function ColorField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  emptyColor = "#ffffff",
}: ColorFieldProps<T>) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <div className="flex gap-2">
            <input
              type="color"
              aria-label={`${label}: elegir color`}
              value={hexColor.test(field.value) ? field.value : emptyColor}
              onChange={(event) => field.onChange(event.target.value)}
              disabled={field.disabled}
              className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border bg-background p-1"
            />
            <Input
              {...field}
              id={id}
              placeholder="#RRGGBB"
              autoCapitalize="none"
              className="h-11 font-mono"
              aria-invalid={fieldState.invalid}
            />
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
