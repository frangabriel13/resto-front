"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextareaField } from "@/components/form/textarea-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import type { CustomerHistoryEntry } from "@/lib/customers/types";

const voidSchema = z.object({
  reason: z.string().trim().min(1, "Contá por qué lo anulás.").max(200, "Hasta 200 caracteres."),
});
type VoidValues = z.infer<typeof voidSchema>;

function voidEntry(entry: CustomerHistoryEntry, body: VoidValues) {
  const params = { path: { id: entry.id } };
  return entry.type === "REDEMPTION"
    ? callApi(api.POST("/panel/redemptions/{id}/void", { params, body }))
    : callApi(api.POST("/panel/stamps/{id}/void", { params, body }));
}

function texts(entry: CustomerHistoryEntry) {
  if (entry.type === "REDEMPTION") {
    return {
      title: "Anular canje",
      description: `La tarjeta vuelve a la n.º ${entry.cycle}, con los sellos que tenía antes de canjear. El canje no se borra: queda en el historial como anulado, con tu nombre y el motivo.`,
      placeholder: "Por ejemplo: se canjeó por error",
    };
  }
  return {
    title: "Anular sello",
    description: "El sello no se borra: queda en el historial como anulado, con tu nombre y el motivo.",
    placeholder: "Por ejemplo: se cargó dos veces",
  };
}

// Anular no borra: el movimiento queda en el historial, tachado, con quién y por qué.
export function VoidEntry({ entry }: { entry: CustomerHistoryEntry }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<VoidValues>({ resolver: zodResolver(voidSchema), defaultValues: { reason: "" } });
  const { title, description, placeholder } = texts(entry);

  async function onSubmit(body: VoidValues) {
    const result = await voidEntry(entry, body);
    if (!result.ok) return showApiError(form, result);
    form.reset();
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Anular
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <FormAlert message={form.formState.errors.root?.message} />
            <TextareaField control={form.control} name="reason" label="Motivo" placeholder={placeholder} />
            <SubmitButton pending={form.formState.isSubmitting}>{title}</SubmitButton>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
