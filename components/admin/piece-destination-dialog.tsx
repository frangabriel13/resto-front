"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Piece } from "@/lib/admin/types";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { destinationTypeLabels } from "@/lib/pieces/fields";
import {
  pieceDestinationSchema,
  toPieceDestinationValues,
  toUpdateDestinationBody,
  type PieceDestinationValues,
} from "./schemas";

const chipLabels = { NTAG213: "NTAG213", NTAG215: "NTAG215", NTAG216: "NTAG216" } as const;

export function PieceDestinationDialog({
  merchantId,
  piece,
}: {
  merchantId: string;
  piece: Piece;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<PieceDestinationValues>({
    resolver: zodResolver(pieceDestinationSchema),
    values: toPieceDestinationValues(piece),
  });
  const destinationType = useWatch({ control: form.control, name: "destinationType" });

  async function onSubmit(values: PieceDestinationValues) {
    const result = await callApi(
      api.PATCH("/admin/merchants/{merchantId}/pieces/{pieceId}", {
        params: { path: { merchantId, pieceId: piece.id } },
        body: toUpdateDestinationBody(values),
      }),
    );
    if (!result.ok) {
      showApiError(form, result);
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <LinkIcon />
          Destino
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>A dónde redirige esta pieza</DialogTitle>
          <DialogDescription>
            La URL del chip no cambia nunca: solo cambia a dónde apunta. No hace falta
            reprogramar nada.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <FormAlert message={form.formState.errors.root?.message} />
            <Controller
              control={form.control}
              name="destinationType"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Destino</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(destinationTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            {destinationType !== "CLUBSY" && (
              <TextField
                control={form.control}
                name="destinationUrl"
                label="Link de destino"
                placeholder="https://…"
              />
            )}
            <Controller
              control={form.control}
              name="nfcChipType"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Tipo de chip</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(chipLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <SubmitButton pending={form.formState.isSubmitting}>Guardar</SubmitButton>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
