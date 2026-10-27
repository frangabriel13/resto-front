"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { toDestinationBody, toPieceValues, type PieceValues } from "@/lib/pieces/destination";
import { PieceDialog } from "./piece-dialog";

export function NewPieceButton({
  merchantId,
  merchantReviewUrl,
}: {
  merchantId: string;
  merchantReviewUrl: string | null;
}) {
  function create(values: PieceValues) {
    return callApi(
      api.POST("/admin/merchants/{merchantId}/pieces", {
        params: { path: { merchantId } },
        body: { label: values.label, destination: toDestinationBody(values) },
      }),
    );
  }

  return (
    <PieceDialog
      trigger={
        <Button className="h-10 self-start">
          <PlusIcon />
          Agregar pieza
        </Button>
      }
      title="Nueva pieza"
      description="Se crea con su URL, su QR y la contraseña para proteger el chip."
      submitLabel="Crear pieza"
      defaultValues={toPieceValues(null, merchantReviewUrl)}
      merchantReviewUrl={merchantReviewUrl}
      onSave={create}
    />
  );
}
