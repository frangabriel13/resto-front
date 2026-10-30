"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { TemporaryPasswordNotice } from "@/components/team/temporary-password-notice";
import { FieldGroup } from "@/components/ui/field";
import type { components } from "@/lib/api/schema";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { ownerSchema, type OwnerValues } from "./schemas";

type CreatedOwner = components["schemas"]["CreatedOwner"];

export function OwnerForm({ merchantId, readOnly }: { merchantId: string; readOnly: boolean }) {
  const [created, setCreated] = useState<CreatedOwner | null>(null);
  const form = useForm<OwnerValues>({
    resolver: zodResolver(ownerSchema),
    defaultValues: { email: "", name: "" },
  });

  // La contraseña temporal se muestra una sola vez: no tiene que reaparecer al volver a la página.
  useLayoutEffect(() => () => setCreated(null), []);

  async function onSubmit(body: OwnerValues) {
    setCreated(null);
    const result = await callApi(
      api.POST("/admin/merchants/{merchantId}/owner", {
        params: { path: { merchantId } },
        body,
      }),
    );
    if (!result.ok) {
      showApiError(form, result);
      return;
    }
    form.reset();
    setCreated(result.data);
  }

  return (
    <div className="flex flex-col gap-4">
      {created && (
        <TemporaryPasswordNotice
          title={`${created.newUser ? "Dueño creado" : "Dueño agregado"}: ${created.email}`}
          password={created.temporaryPassword}
        />
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <fieldset disabled={readOnly} className="min-w-0">
          <FieldGroup>
          <FormAlert message={form.formState.errors.root?.message} />
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              autoComplete="off"
              autoCapitalize="none"
            />
            <TextField control={form.control} name="name" label="Nombre" autoComplete="off" />
          </div>
          <div className="sm:w-56">
            <SubmitButton pending={form.formState.isSubmitting}>Agregar dueño</SubmitButton>
          </div>
          </FieldGroup>
        </fieldset>
      </form>
    </div>
  );
}
