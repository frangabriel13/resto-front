"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import type { Piece } from "@/lib/admin/types";
import type { components } from "@/lib/api/schema";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { pieceSchema, type PieceValues } from "./schemas";

type UpdatePieceBody = components["schemas"]["UpdatePieceBody"];

function updatePiece(merchantId: string, pieceId: string, body: UpdatePieceBody) {
  return callApi(
    api.PATCH("/admin/merchants/{merchantId}/pieces/{pieceId}", {
      params: { path: { merchantId, pieceId } },
      body,
    }),
  );
}

export function PieceActions({ merchantId, piece }: { merchantId: string; piece: Piece }) {
  const router = useRouter();
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string>();

  async function toggleActive() {
    setToggling(true);
    setError(undefined);
    const result = await updatePiece(merchantId, piece.id, { active: !piece.active });
    setToggling(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <RenamePieceDialog merchantId={merchantId} piece={piece} />
        <Button variant="outline" size="sm" onClick={toggleActive} disabled={toggling}>
          {toggling && <Spinner />}
          {piece.active ? "Desactivar" : "Activar"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function RenamePieceDialog({ merchantId, piece }: { merchantId: string; piece: Piece }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<PieceValues>({
    resolver: zodResolver(pieceSchema),
    values: { label: piece.label },
  });

  async function onSubmit({ label }: PieceValues) {
    const result = await updatePiece(merchantId, piece.id, { label });
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
          <PencilIcon />
          Renombrar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renombrar pieza</DialogTitle>
          <DialogDescription>El nombre es interno: el cliente no lo ve.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <FormAlert message={form.formState.errors.root?.message} />
            <TextField control={form.control} name="label" label="Nombre" />
            <SubmitButton pending={form.formState.isSubmitting}>Guardar</SubmitButton>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
