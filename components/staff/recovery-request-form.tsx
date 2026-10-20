"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheckIcon } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { staffRoutes } from "@/lib/staff/routes";
import { recoveryRequestSchema, type RecoveryRequestValues } from "./schemas";

export function RecoveryRequestForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const form = useForm<RecoveryRequestValues>({
    resolver: zodResolver(recoveryRequestSchema),
    defaultValues: { email: "" },
  });

  useLayoutEffect(() => () => setSentTo(null), []);

  async function onSubmit(body: RecoveryRequestValues) {
    const result = await callApi(api.POST("/auth/staff/password-reset/request", { body }));
    if (!result.ok) return showApiError(form, result);
    form.reset();
    setSentTo(body.email);
  }

  // La API responde lo mismo exista o no la cuenta: el mensaje no confirma nada.
  if (sentTo) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 rounded-xl bg-muted p-4 text-sm">
          <MailCheckIcon className="mt-0.5 size-5 shrink-0 text-brand" />
          <p>
            Si <span className="font-medium break-all">{sentTo}</span> es el email de un dueño, te mandamos un link
            para elegir una contraseña nueva. Vence en 30 minutos. Si no lo ves, revisá el correo no deseado.
          </p>
        </div>
        <Button asChild variant="outline" className="h-11">
          <Link href={staffRoutes.login}>Volver a ingresar</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormAlert message={form.formState.errors.root?.message} />
        <TextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
        />
        <SubmitButton pending={form.formState.isSubmitting}>Mandarme el link</SubmitButton>
        <Button asChild variant="ghost" className="h-11">
          <Link href={staffRoutes.login}>Volver a ingresar</Link>
        </Button>
      </FieldGroup>
    </form>
  );
}
