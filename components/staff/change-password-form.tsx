"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { FieldGroup } from "@/components/ui/field";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { staffNextStep } from "@/lib/staff/access";
import { changePasswordSchema, type ChangePasswordValues } from "./schemas";

export function ChangePasswordForm() {
  const router = useRouter();
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit({ currentPassword, newPassword }: ChangePasswordValues) {
    const changed = await callApi(
      api.POST("/auth/staff/password", { body: { currentPassword, newPassword } }),
    );
    if (!changed.ok) {
      form.setError("root", { message: changed.message });
      return;
    }
    form.reset();
    const account = await callApi(api.GET("/auth/staff/me"));
    router.replace(staffNextStep(account.ok ? account.data : null));
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormAlert message={form.formState.errors.root?.message} />
        <TextField
          control={form.control}
          name="currentPassword"
          label="Contraseña actual"
          type="password"
          autoComplete="current-password"
        />
        <TextField
          control={form.control}
          name="newPassword"
          label="Contraseña nueva"
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
        <SubmitButton pending={form.formState.isSubmitting}>
          Guardar contraseña
        </SubmitButton>
      </FieldGroup>
    </form>
  );
}
