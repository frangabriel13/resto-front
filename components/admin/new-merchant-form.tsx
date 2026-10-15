"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { FieldGroup } from "@/components/ui/field";
import { adminRoutes } from "@/lib/admin/routes";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { slugify } from "@/lib/merchants/slug";
import { newMerchantSchema, type NewMerchantValues } from "./schemas";

export function NewMerchantForm() {
  const router = useRouter();
  const form = useForm<NewMerchantValues>({
    resolver: zodResolver(newMerchantSchema),
    defaultValues: { name: "", slug: "" },
  });
  const autoSlug = useRef("");

  // Sigue al nombre mientras el slug sea el que generamos o esté vacío (`isDirty` falla al vaciar el nombre).
  useEffect(() => {
    return form.subscribe({
      name: "name",
      exact: true,
      formState: { values: true },
      callback: ({ values }) => {
        if (values.slug !== "" && values.slug !== autoSlug.current) return;
        autoSlug.current = slugify(values.name);
        form.setValue("slug", autoSlug.current, {
          shouldValidate: form.formState.isSubmitted,
        });
      },
    });
  }, [form]);

  async function onSubmit(body: NewMerchantValues) {
    const result = await callApi(api.POST("/admin/merchants", { body }));
    if (!result.ok) {
      form.setError("root", { message: result.message });
      return;
    }
    form.reset();
    router.push(adminRoutes.merchant(result.data.id));
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormAlert message={form.formState.errors.root?.message} />
        <TextField control={form.control} name="name" label="Nombre del comercio" />
        <TextField
          control={form.control}
          name="slug"
          label="Slug"
          autoCapitalize="none"
          className="font-mono"
        />
        <p className="-mt-3 text-sm text-muted-foreground">
          Identifica al comercio en la dirección de su tarjeta. Solo se puede cambiar mientras está
          en preparación.
        </p>
        <SubmitButton pending={form.formState.isSubmitting}>Crear comercio</SubmitButton>
      </FieldGroup>
    </form>
  );
}
