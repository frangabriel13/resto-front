"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { ImagePickField, type PickedImage } from "@/components/images/image-pick-field";
import { imageHints } from "@/components/merchant-page/image-hints";
import { PageFields } from "@/components/merchant-page/page-fields";
import { SectionCard } from "@/components/section-card";
import { adminRoutes } from "@/lib/admin/routes";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { slugify } from "@/lib/merchants/slug";
import { ClubFields } from "./club-fields";
import { MerchantDataFields } from "./merchant-data-fields";
import { uploadMerchantImage } from "./merchant-images";
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
  const [cover, setCover] = useState<PickedImage | null>(null);
  const [logo, setLogo] = useState<PickedImage | null>(null);

  async function onSubmit(values: NewMerchantValues) {
    const result = await callApi(api.POST("/admin/merchants", { body: toCreateMerchantBody(values) }));
    if (!result.ok) {
      showApiError(form, result);
      return;
    }
    // El comercio ya existe: si falla una imagen, se avisa en su detalle, donde se puede reintentar.
    const { id } = result.data;
    const uploads = await Promise.all([
      cover && uploadMerchantImage(id, "cover", cover.file),
      logo && uploadMerchantImage(id, "logo", logo.file),
    ]);
    const failed = uploads.some((upload) => upload && !upload.ok);
    form.reset();
    setCover(null);
    setLogo(null);
    router.push(failed ? adminRoutes.merchantImageFailed(id) : adminRoutes.merchant(id));
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
        title="Página del comercio"
        description="Opcional. Es lo que ve el cliente al escanear un cartel con este destino."
      >
        <div className="flex flex-col gap-8">
          <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
            <ImagePickField
              label="Portada"
              description={imageHints.cover}
              variant="cover"
              value={cover}
              disabled={form.formState.isSubmitting}
              onChange={setCover}
            />
            <div className="sm:w-56">
              <ImagePickField
                label="Logo"
                description={imageHints.logo}
                variant="logo"
                value={logo}
                disabled={form.formState.isSubmitting}
                onChange={setLogo}
              />
            </div>
          </div>
          <PageFields control={form.control} />
        </div>
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
