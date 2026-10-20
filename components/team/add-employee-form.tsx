"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { FieldGroup } from "@/components/ui/field";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import type { CreatedStaff } from "@/lib/team/types";
import { employeeSchema, type EmployeeValues } from "./schemas";
import { TemporaryPasswordNotice } from "./temporary-password-notice";

const alreadyInMerchant = "Ya es parte de tu equipo. Si está dado de baja, reactivalo desde la lista.";

export function AddEmployeeForm() {
  const router = useRouter();
  const [created, setCreated] = useState<CreatedStaff | null>(null);
  const form = useForm<EmployeeValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { name: "", email: "" },
  });

  // La contraseña temporal no tiene que reaparecer al volver a la página.
  useLayoutEffect(() => () => setCreated(null), []);

  async function onSubmit(body: EmployeeValues) {
    setCreated(null);
    const result = await callApi(api.POST("/panel/staff", { body }));
    if (!result.ok) {
      if (result.error?.code === "STAFF_ALREADY_IN_MERCHANT") {
        form.setError("email", { message: alreadyInMerchant });
        return;
      }
      return showApiError(form, result);
    }
    form.reset();
    setCreated(result.data);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      {created && (
        <TemporaryPasswordNotice
          title={`${created.staff.name} ya puede entrar al panel con ${created.staff.email}`}
          password={created.temporaryPassword}
          existingAccountText="Ya tenía cuenta en Clubsy por otro comercio: entra con su contraseña de siempre y elige este comercio."
        />
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <FormAlert message={form.formState.errors.root?.message} />
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField control={form.control} name="name" label="Nombre" autoComplete="off" />
            <TextField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              autoComplete="off"
              autoCapitalize="none"
            />
          </div>
          <div className="sm:w-56">
            <SubmitButton pending={form.formState.isSubmitting}>Agregar empleado</SubmitButton>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
