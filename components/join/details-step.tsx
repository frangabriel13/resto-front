"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckboxField } from "@/components/form/checkbox-field";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { LegalConsentNote } from "@/components/legal/legal-links";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import type { ApiResult } from "@/lib/api/call-api";
import { detailsSchema, type DetailsValues } from "./schemas";
import { consentLabel, joinBottomBarClass, joinButtonClass, joinInputClass } from "./styles";

// "Tus datos" debajo del premio, en la misma hoja, con el botón fijo abajo. Mientras los campos no se
// ven, el botón lleva hasta ellos ("Sumarme al club"): el primer toque nunca responde con errores.
export function DetailsStep({
  merchantName,
  defaultValues,
  onSubmit,
}: {
  merchantName: string;
  defaultValues: DetailsValues;
  onSubmit: (values: DetailsValues) => Promise<ApiResult<unknown>>;
}) {
  const form = useForm<DetailsValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues,
  });
  const fieldsRef = useRef<HTMLDivElement>(null);
  // Si vuelve del paso del código con datos cargados, los campos ya los vio.
  const [fieldsSeen, setFieldsSeen] = useState(Boolean(defaultValues.phone));

  useEffect(() => {
    const nameInput = fieldsRef.current?.querySelector("input[name='name']");
    if (fieldsSeen || !nameInput) return;
    // Cuenta como visto cuando el campo del nombre se ve entero; el margen de abajo descuenta la barra
    // fija, que tapa el final de la pantalla.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setFieldsSeen(true);
      },
      { rootMargin: "0px 0px -90px 0px", threshold: 1 },
    );
    observer.observe(nameInput);
    return () => observer.disconnect();
  }, [fieldsSeen]);

  // Después de bajar a los datos, el mismo lugar del botón pasa a enviar: un doble toque no tiene que
  // mandar el formulario vacío.
  const sendBlockedUntil = useRef(0);

  function goToFields() {
    fieldsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    form.setFocus("name", { shouldSelect: false });
    sendBlockedUntil.current = Date.now() + 500;
    setFieldsSeen(true);
  }

  async function submit(values: DetailsValues) {
    const result = await onSubmit(values);
    if (!result.ok) showApiError(form, result);
  }

  return (
    <form
      onSubmit={(event) => {
        if (Date.now() < sendBlockedUntil.current) {
          event.preventDefault();
          return;
        }
        void form.handleSubmit(submit)(event);
      }}
      noValidate
      className="flex flex-1 flex-col"
    >
      <section aria-labelledby="tus-datos" className="scroll-mt-4 px-5 pt-7 pb-6">
        <h2 id="tus-datos" className="text-[1.0625rem] font-semibold">
          Tus datos
        </h2>
        <p className="mt-1 text-[0.8125rem] leading-normal text-muted-foreground">
          Tu celular es tu tarjeta: con él la recuperás si cambiás de teléfono. Usá el que tiene WhatsApp: te llega
          un mensaje de Clubsy con un código.
        </p>
        <div ref={fieldsRef} className="mt-4 scroll-mt-24">
          <FieldGroup>
            <FormAlert message={form.formState.errors.root?.message} />
            <TextField
              control={form.control}
              name="name"
              label="Tu nombre"
              autoComplete="given-name"
              enterKeyHint="next"
              // El "siguiente" del teclado pasa al celular en vez de mandar el formulario incompleto.
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;
                event.preventDefault();
                form.setFocus("phone");
              }}
              className={joinInputClass}
            />
            <TextField
              control={form.control}
              name="phone"
              label="Tu celular"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="Ej.: 11 2345 6789"
              enterKeyHint="send"
              className={joinInputClass}
            />
            <CheckboxField control={form.control} name="marketingConsent" label={consentLabel(merchantName)} />
            <LegalConsentNote />
          </FieldGroup>
        </div>
      </section>
      <div className={joinBottomBarClass}>
        <span aria-live="polite" className="sr-only">
          {fieldsSeen ? "Completá tus datos y tocá Recibir código por WhatsApp." : ""}
        </span>
        {fieldsSeen ? (
          <SubmitButton pending={form.formState.isSubmitting} className={joinButtonClass}>
            Recibir código por WhatsApp
          </SubmitButton>
        ) : (
          <Button type="button" size="lg" onClick={goToFields} className={`w-full ${joinButtonClass}`}>
            Sumarme al club
          </Button>
        )}
      </div>
    </form>
  );
}
