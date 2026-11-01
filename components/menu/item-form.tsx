"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { CheckboxField } from "@/components/form/checkbox-field";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { TextareaField } from "@/components/form/textarea-field";
import { FieldGroup } from "@/components/ui/field";
import type { ApiResult } from "@/lib/api/call-api";
import { itemSchema, type ItemValues } from "@/lib/menu/form";
import type { Menu } from "@/lib/menu/types";

type ItemFormProps = {
  defaultValues: ItemValues;
  submitLabel: string;
  onSave: (values: ItemValues) => Promise<ApiResult<Menu>>;
  onSaved: () => void;
};

export function ItemForm({ defaultValues, submitLabel, onSave, onSaved }: ItemFormProps) {
  const form = useForm<ItemValues>({ resolver: zodResolver(itemSchema), defaultValues });
  const price = useWatch({ control: form.control, name: "price" });

  async function onSubmit(values: ItemValues) {
    const result = await onSave(values);
    if (!result.ok) return showApiError(form, result);
    onSaved();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormAlert message={form.formState.errors.root?.message} />
        <TextField control={form.control} name="name" label="Nombre" />
        <TextareaField control={form.control} name="description" label="Descripción (opcional)" />
        <TextField
          control={form.control}
          name="price"
          label="Precio en pesos (opcional)"
          inputMode="numeric"
          placeholder="1500"
          description="Sin centavos. Vacío: no se muestra precio."
        />
        {price.trim() !== "" && (
          <CheckboxField control={form.control} name="priceFrom" label="Mostrarlo como “Desde”" />
        )}
        <SubmitButton pending={form.formState.isSubmitting}>{submitLabel}</SubmitButton>
      </FieldGroup>
    </form>
  );
}
