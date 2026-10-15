"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckIcon } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CopyButton } from "@/components/copy-button";
import { FormAlert } from "@/components/form/form-alert";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FieldGroup } from "@/components/ui/field";
import type { components } from "@/lib/api/schema";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { ownerSchema, type OwnerValues } from "./schemas";

type CreatedOwner = components["schemas"]["CreatedOwner"];

export function OwnerForm({ merchantId }: { merchantId: string }) {
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
      form.setError("root", { message: result.message });
      return;
    }
    form.reset();
    setCreated(result.data);
  }

  return (
    <div className="flex flex-col gap-4">
      {created && <CreatedOwnerNotice owner={created} />}
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
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
      </form>
    </div>
  );
}

function CreatedOwnerNotice({ owner }: { owner: CreatedOwner }) {
  return (
    <Alert className="border-emerald-200 bg-emerald-50">
      <CircleCheckIcon className="text-emerald-700" />
      <AlertTitle>
        {owner.newUser ? "Dueño creado" : "Dueño agregado"}: {owner.email}
      </AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        {owner.temporaryPassword ? (
          <>
            <p>
              Pasale esta contraseña temporal. La va a tener que cambiar al entrar. No se vuelve a
              mostrar.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded-md border bg-background px-2 py-1.5 font-mono text-base text-foreground">
                {owner.temporaryPassword}
              </code>
              <CopyButton value={owner.temporaryPassword} label="Copiar contraseña" />
            </div>
          </>
        ) : (
          <p>Ya tenía cuenta en Clubsy: entra con su contraseña de siempre.</p>
        )}
      </AlertDescription>
    </Alert>
  );
}
