"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { SectionCard } from "@/components/section-card";
import { adminRoutes } from "@/lib/admin/routes";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { slugify } from "@/lib/merchants/slug";
import { ClubFields } from "./club-fields";
import { MerchantDataFields } from "./merchant-data-fields";
import {
  newMerchantDefaults,
  newMerchantSchema,
  toCreateMerchantBody,
  type NewMerchantValues,
} from "./schemas";

export function NewMerchantForm() {
  const router = useRouter();
  const form = useForm<NewMerchantValues>({
    resolver: zodResolver(newMerchantSchema),
    defaultValues: newMerchantDefaults,
  });
  const name = useWatch({ control: form.control, name: "name" });

  async function onSubmit(values: NewMerchantValues) {
    const result = await callApi(api.POST("/admin/merchants", { body: toCreateMerchantBody(values) }));
    if (!result.ok) {
      showApiError(form, result);
      return;
    }
    form.reset();
    router.push(adminRoutes.merchant(result.data.id));
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <FormAlert message={form.formState.errors.root?.message} />
      <SectionCard
        title="Datos del comercio"
        description="Solo el nombre es obligatorio. El resto se puede completar después."
      >
        <MerchantDataFields control={form.control} />
      </SectionCard>
      <SectionCard
        title="Club de premios"
        description="Opcional: un comercio que solo compra carteles no lo necesita. Arranca en preparación."
      >
        <ClubFields control={form.control} slugPlaceholder={slugify(name) || undefined} optionalHint />
      </SectionCard>
      <div className="sm:w-56">
        <SubmitButton pending={form.formState.isSubmitting}>Crear comercio</SubmitButton>
      </div>
    </form>
  );
}
