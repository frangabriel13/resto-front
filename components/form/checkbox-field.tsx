"use client";

import { useId } from "react";
import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";

type CheckboxFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPathByValue<T, boolean>;
  label: React.ReactNode;
};

export function CheckboxField<T extends FieldValues>({ control, name, label }: CheckboxFieldProps<T>) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field orientation="horizontal" className="items-start gap-3">
          <Checkbox
            id={id}
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked === true)}
            onBlur={field.onBlur}
            ref={field.ref}
            className="mt-0.5 size-5"
          />
          <FieldLabel htmlFor={id} className="font-normal leading-snug text-muted-foreground">
            {label}
          </FieldLabel>
        </Field>
      )}
    />
  );
}
