"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ApiResult } from "@/lib/api/call-api";
import type { PieceValues } from "@/lib/pieces/destination";
import { PieceForm } from "./piece-form";

type PieceDialogProps = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  submitLabel: string;
  notice?: string;
  defaultValues: PieceValues;
  merchantReviewUrl: string | null;
  onSave: (values: PieceValues) => Promise<ApiResult<unknown>>;
};

// El formulario se monta al abrir: cada apertura arranca de los datos actuales de la pieza.
export function PieceDialog({ trigger, title, description, ...formProps }: PieceDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function onSaved() {
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <PieceForm {...formProps} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  );
}
