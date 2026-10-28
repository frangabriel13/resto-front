"use client";

import { useId, type ReactNode } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PlaceIdBuilder } from "./place-id-builder";

type ReviewUrlFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: ReactNode;
};

// Link de reseñas de Google, que se puede pegar o armar desde el Place ID (solo en el admin).
export function ReviewUrlField<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: ReviewUrlFieldProps<T>) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Input
            {...field}
            id={id}
            type="url"
            placeholder="https://…"
            autoCapitalize="none"
            className="h-11"
            aria-invalid={fieldState.invalid}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          <PlaceIdBuilder current={field.value} onUse={field.onChange} />
        </Field>
      )}
    />
  );
}
