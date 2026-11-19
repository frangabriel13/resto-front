"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckboxField } from "@/components/form/checkbox-field";
import { FormAlert } from "@/components/form/form-alert";
import { SubmitButton } from "@/components/form/submit-button";
import { LegalConsentNote } from "@/components/legal/legal-links";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { callApi, type ApiResult } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { consentLabel, joinBottomBarClass, joinButtonClass, joinLinkClass } from "./styles";

type JoinAsCustomerProps = {
  customerName: string;
  merchantName: string;
  // Un alta que falló después de validar el código: se muestra hasta que vuelva a intentar.
  notice?: string | null;
  join: (marketingConsent: boolean) => Promise<ApiResult<unknown>>;
};

export function JoinAsCustomer({ customerName, merchantName, notice, join }: JoinAsCustomerProps) {
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

  // El tilde y los legales van en la hoja; "Sumarme como …" queda fijo abajo, como sin sesión.
  return (
    <form onSubmit={form.handleSubmit(submit)} noValidate className="flex flex-1 flex-col">
      <FieldGroup className="px-5 pt-6 pb-5">
        <FormAlert message={form.formState.errors.root?.message ?? (form.formState.isSubmitted ? undefined : notice ?? undefined)} />
        <CheckboxField control={form.control} name="marketingConsent" label={consentLabel(merchantName)} />
        <LegalConsentNote />
        <Button
          type="button"
          variant="link"
          className={cn("h-auto self-center", joinLinkClass)}
          disabled={switching}
          onClick={switchAccount}
        >
          ¿No sos {customerName}? Usar otra cuenta
        </Button>
      </FieldGroup>
      <div className={joinBottomBarClass}>
        <SubmitButton pending={form.formState.isSubmitting} className={joinButtonClass}>
          Sumarme como {customerName}
        </SubmitButton>
      </div>
    </form>
  );
}
