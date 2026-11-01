"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { FieldGroup } from "@/components/ui/field";
import type { ApiResult } from "@/lib/api/call-api";
import { categorySchema, type CategoryValues } from "@/lib/menu/form";
import type { Menu } from "@/lib/menu/types";

type CategoryFormProps = {
  name: string;
  submitLabel: string;
  onSave: (values: CategoryValues) => Promise<ApiResult<Menu>>;
  onSaved: () => void;
};

export function CategoryForm({ name, submitLabel, onSave, onSaved }: CategoryFormProps) {
  const form = useForm<CategoryValues>({ resolver: zodResolver(categorySchema), defaultValues: { name } });

  async function onSubmit(values: CategoryValues) {
    const result = await onSave(values);
    if (!result.ok) return showApiError(form, result);
    onSaved();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormAlert message={form.formState.errors.root?.message} />
        <TextField control={form.control} name="name" label="Nombre de la categoría" placeholder="Por ejemplo: Cafetería" />
        <SubmitButton pending={form.formState.isSubmitting}>{submitLabel}</SubmitButton>
      </FieldGroup>
    </form>
  );
}
