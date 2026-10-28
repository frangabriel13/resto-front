"use client";

import type { Control } from "react-hook-form";
import { TextField } from "@/components/form/text-field";
import { TextareaField } from "@/components/form/textarea-field";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { ReviewUrlField } from "./review-url-field";
import type { MerchantDataValues } from "./schemas";
import { WhatsAppChatButton } from "./whatsapp-chat-button";

// Datos del comercio y su ficha comercial (esta solo la ve Clubsy).
export function MerchantDataFields<T extends MerchantDataValues>({
  control: formControl,
  savedPhone,
}: {
  control: Control<T>;
  savedPhone?: string | null;
}) {
  // `Control` es invariante: el formulario puede tener más campos que estos.
  const control = formControl as unknown as Control<MerchantDataValues>;
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField control={control} name="name" label="Nombre del comercio" />
        <ReviewUrlField control={control} name="googleReviewUrl" label="Link de reseñas de Google" />
      </div>

      <FieldSet>
        <FieldLegend>Contacto</FieldLegend>
        <FieldDescription className="-mt-3">
          Quien atiende a Clubsy en el comercio. No entra al panel.
        </FieldDescription>
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField control={control} name="profile.contactName" label="Nombre" />
          <div className="flex flex-col gap-2">
            <TextField
              control={control}
              name="profile.contactPhone"
              label="Celular"
              type="tel"
              inputMode="tel"
              autoComplete="off"
            />
            {savedPhone && <WhatsAppChatButton phone={savedPhone} />}
          </div>
          <div className="sm:col-span-2">
            <TextField control={control} name="profile.address" label="Dirección" />
          </div>
        </div>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Google al empezar</FieldLegend>
        <FieldDescription className="-mt-3">
          Para comparar después cómo le fue con Clubsy.
        </FieldDescription>
        <div className="grid gap-6 sm:grid-cols-3">
          <TextField
            control={control}
            name="profile.googleRatingInitial"
            label="Puntuación"
            inputMode="decimal"
            placeholder="4,5"
          />
          <TextField
            control={control}
            name="profile.googleReviewsInitial"
            label="Reseñas"
            inputMode="numeric"
          />
          <TextField
            control={control}
            name="profile.googleDataTakenOn"
            label="Tomadas el"
            type="date"
          />
        </div>
      </FieldSet>

      <TextareaField
        control={control}
        name="profile.notes"
        label="Observaciones"
        description="Solo las ve Clubsy."
      />
    </div>
  );
}
