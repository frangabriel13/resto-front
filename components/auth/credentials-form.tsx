"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormAlert } from "@/components/form/form-alert";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { FieldGroup } from "@/components/ui/field";

const credentialsSchema = z.object({
  email: z.email("Ingresá un email válido."),
  password: z.string().min(1, "Ingresá tu contraseña."),
});

export type Credentials = z.infer<typeof credentialsSchema>;

// `submit` devuelve el mensaje de error, o nada si el ingreso salió bien.
export function CredentialsForm({
  submit,
}: {
  submit: (credentials: Credentials) => Promise<string | undefined>;
}) {
  const form = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(credentials: Credentials) {
    const error = await submit(credentials);
    if (error) {
      form.setError("root", { message: error });
      return;
    }
    form.reset();
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
        <TextField
          control={form.control}
          name="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
        />
        <SubmitButton pending={form.formState.isSubmitting}>Ingresar</SubmitButton>
      </FieldGroup>
    </form>
  );
}
