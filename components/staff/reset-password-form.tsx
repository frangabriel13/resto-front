"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckIcon } from "lucide-react";
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
import { recoveryRoutes, staffRoutes } from "@/lib/staff/routes";
import { resetPasswordSchema, type ResetPasswordValues } from "./schemas";

type State = "form" | "done" | "invalid";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, setState] = useState<State>("form");
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  useLayoutEffect(() => () => setState("form"), []);

  async function onSubmit({ newPassword }: ResetPasswordValues) {
    const result = await callApi(api.POST("/auth/staff/password-reset/confirm", { body: { token, newPassword } }));
    if (!result.ok) {
      if (result.error?.code === "RESET_TOKEN_INVALID") return setState("invalid");
      return showApiError(form, result);
    }
    form.reset();
    setState("done");
  }

  if (state === "invalid") return <InvalidLink />;

  if (state === "done") {
    return (
      <div className="flex flex-col gap-4">
        <p className="flex gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
          <CircleCheckIcon className="mt-0.5 size-5 shrink-0 text-emerald-700" />
          Listo, ya tenés tu contraseña nueva. Por seguridad cerramos tus sesiones abiertas: ingresá de nuevo.
        </p>
        {/* Recarga completa: cualquier sesión que hubiera en este navegador ya no sirve. */}
        <Button asChild className="h-11">
          <a href={staffRoutes.login}>Ingresar</a>
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
          name="newPassword"
          label="Contraseña nueva"
          description="Entre 8 y 128 caracteres."
          type="password"
          autoComplete="new-password"
        />
        <TextField
          control={form.control}
          name="confirmPassword"
          label="Repetí la contraseña nueva"
          type="password"
          autoComplete="new-password"
        />
        <SubmitButton pending={form.formState.isSubmitting}>Guardar contraseña</SubmitButton>
      </FieldGroup>
    </form>
  );
}

export function InvalidLink() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Este link ya no sirve: vence a los 30 minutos, se puede usar una sola vez y, si pediste otro, solo vale el
        último.
      </p>
      <Button asChild className="h-11">
        <Link href={recoveryRoutes.request}>Pedir un link nuevo</Link>
      </Button>
    </div>
  );
}
