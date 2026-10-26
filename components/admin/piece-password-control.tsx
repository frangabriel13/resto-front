"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, KeyIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CopyButton } from "@/components/copy-button";
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
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { nfcPasswordSchema, type NfcPasswordValues } from "./schemas";

// Poner/cambiar la contraseña y revelarla son dos acciones separadas: cada
// "ver" queda auditado aparte en la API (quién y cuándo la pidió).
export function PiecePasswordControl({
  merchantId,
  piece,
}: {
  merchantId: string;
  piece: Piece;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <SetPasswordDialog merchantId={merchantId} pieceId={piece.id} />
      {piece.hasNfcPassword && <RevealPasswordButton merchantId={merchantId} pieceId={piece.id} />}
    </div>
  );
}

function SetPasswordDialog({ merchantId, pieceId }: { merchantId: string; pieceId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<NfcPasswordValues>({
    resolver: zodResolver(nfcPasswordSchema),
    defaultValues: { nfcPassword: "" },
  });

  async function onSubmit(body: NfcPasswordValues) {
    const result = await callApi(
      api.POST("/admin/merchants/{merchantId}/pieces/{pieceId}/nfc-password", {
        params: { path: { merchantId, pieceId } },
        body,
      }),
    );
    if (!result.ok) {
      showApiError(form, result);
      return;
    }
    form.reset();
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <KeyIcon />
          Contraseña del chip
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contraseña del chip NFC</DialogTitle>
          <DialogDescription>
            Se guarda cifrada. Hace falta para reprogramarlo con NFC Tools; un admin la puede
            volver a ver con &quot;Ver contraseña&quot;.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <FormAlert message={form.formState.errors.root?.message} />
            <TextField control={form.control} name="nfcPassword" label="Contraseña nueva" />
            <SubmitButton pending={form.formState.isSubmitting}>Guardar</SubmitButton>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RevealPasswordButton({ merchantId, pieceId }: { merchantId: string; pieceId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [password, setPassword] = useState<string>();

  async function reveal() {
    setLoading(true);
    setError(undefined);
    const result = await callApi(
      api.POST("/admin/merchants/{merchantId}/pieces/{pieceId}/reveal-password", {
        params: { path: { merchantId, pieceId } },
      }),
    );
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setPassword(result.data.nfcPassword);
  }

  if (password) {
    return (
      <div className="flex items-center gap-2">
        <code className="rounded-md bg-muted px-2 py-1.5 text-sm">{password}</code>
        <CopyButton value={password} label="Copiar" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Button variant="outline" size="sm" onClick={reveal} disabled={loading}>
        {loading ? <Spinner /> : <EyeIcon />}
        Ver contraseña
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
