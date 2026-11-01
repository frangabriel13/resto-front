"use client";

import { useId } from "react";
import { Controller, useWatch, type Control } from "react-hook-form";
import { TextField } from "@/components/form/text-field";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { wifiSecurityOptions, type PageValues } from "@/lib/merchants/page";

type PageFormValues = { page: PageValues };

// Wi-Fi y redes de la página del comercio, en el admin y en la configuración del dueño.
export function PageFields<T extends PageFormValues>({ control: formControl }: { control: Control<T> }) {
  // `Control` es invariante: el formulario puede tener más campos que estos.
  const control = formControl as unknown as Control<PageFormValues>;
  const security = useWatch({ control, name: "page.wifi.security" });

  return (
    <div className="flex flex-col gap-8">
      <FieldSet>
        <FieldLegend>Wi-Fi</FieldLegend>
        <FieldDescription className="-mt-3">
          Opcional. Cualquiera que abra la página ve el nombre y la contraseña.
        </FieldDescription>
        <TextField
          control={control}
          name="page.wifi.ssid"
          label="Nombre de la red"
          autoCapitalize="none"
          autoComplete="off"
        />
        <WifiSecurityField control={control} />
        {security !== "NONE" && (
          <TextField
            control={control}
            name="page.wifi.password"
            label="Contraseña de la red"
            autoCapitalize="none"
            autoComplete="off"
            spellCheck={false}
          />
        )}
      </FieldSet>

      <FieldSet>
        <FieldLegend>Redes</FieldLegend>
        <FieldDescription className="-mt-3">
          Opcionales. Las que cargues van al pie de la página.
        </FieldDescription>
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            control={control}
            name="page.instagramUsername"
            label="Instagram"
            placeholder="@cafedelaesquina"
            autoCapitalize="none"
            autoComplete="off"
          />
          <TextField
            control={control}
            name="page.tiktokUsername"
            label="TikTok"
            placeholder="@cafedelaesquina"
            autoCapitalize="none"
            autoComplete="off"
          />
          <TextField
            control={control}
            name="page.whatsappPhone"
            label="WhatsApp"
            type="tel"
            inputMode="tel"
            autoComplete="off"
          />
          <TextField
            control={control}
            name="page.facebookUrl"
            label="Facebook"
            type="url"
            placeholder="https://www.facebook.com/…"
            autoCapitalize="none"
            autoComplete="off"
          />
        </div>
      </FieldSet>
    </div>
  );
}

function WifiSecurityField({ control }: { control: Control<PageFormValues> }) {
  const id = useId();
  return (
    <Controller
      control={control}
      name="page.wifi.security"
      render={({ field }) => (
        <FieldSet>
          <FieldLegend variant="label">Seguridad</FieldLegend>
          <RadioGroup
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            disabled={field.disabled}
            className="sm:grid-cols-3"
          >
            {wifiSecurityOptions.map(({ value, label, description }) => (
              <FieldLabel key={value} htmlFor={`${id}-${value}`}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{label}</FieldTitle>
                    <FieldDescription>{description}</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value={value} id={`${id}-${value}`} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </FieldSet>
      )}
    />
  );
}
