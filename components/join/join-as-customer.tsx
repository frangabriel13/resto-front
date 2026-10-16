"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckboxField } from "@/components/form/checkbox-field";
import { FormAlert } from "@/components/form/form-alert";
import { SubmitButton } from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { callApi, type ApiResult } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";

type JoinAsCustomerProps = {
  customerName: string;
  merchantName: string;
  join: (marketingConsent: boolean) => Promise<ApiResult<unknown>>;
};

export function JoinAsCustomer({ customerName, merchantName, join }: JoinAsCustomerProps) {
  const [switching, setSwitching] = useState(false);
  const form = useForm<{ marketingConsent: boolean }>({
    defaultValues: { marketingConsent: false },
  });

  async function submit({ marketingConsent }: { marketingConsent: boolean }) {
    const result = await join(marketingConsent);
    if (!result.ok) form.setError("root", { message: result.message });
  }

  // Teléfonos compartidos: cerrar la sesión y recargar deja la pantalla lista para otra persona.
  async function switchAccount() {
    setSwitching(true);
    await callApi(api.POST("/auth/customer/logout"));
    window.location.reload();
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} noValidate>
      <FieldGroup>
        <FormAlert message={form.formState.errors.root?.message} />
        <CheckboxField
          control={form.control}
          name="marketingConsent"
          label={`Quiero recibir novedades y promociones de ${merchantName}. Es opcional.`}
        />
        <SubmitButton pending={form.formState.isSubmitting}>
          Sumarme como {customerName}
        </SubmitButton>
        <Button
          type="button"
          variant="link"
          className="h-auto self-center"
          disabled={switching}
          onClick={switchAccount}
        >
          ¿No sos {customerName}? Usar otra cuenta
        </Button>
      </FieldGroup>
    </form>
  );
}
