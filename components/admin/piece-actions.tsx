"use client";

import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { Piece } from "@/lib/admin/types";
import type { components } from "@/lib/api/schema";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { toDestinationBody, toPieceValues, type PieceValues } from "@/lib/pieces/destination";
import { PieceDialog } from "./piece-dialog";

type UpdatePieceBody = components["schemas"]["UpdatePieceBody"];

type PieceActionsProps = { merchantId: string; piece: Piece; merchantReviewUrl: string | null };

function updatePiece(merchantId: string, pieceId: string, body: UpdatePieceBody) {
  return callApi(
    api.PATCH("/admin/merchants/{merchantId}/pieces/{pieceId}", {
      params: { path: { merchantId, pieceId } },
      body,
    }),
  );
}

export function PieceActions({ merchantId, piece, merchantReviewUrl }: PieceActionsProps) {
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

  function save(values: PieceValues) {
    return updatePiece(merchantId, piece.id, {
      label: values.label,
      destination: toDestinationBody(values),
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <PieceDialog
          trigger={
            <Button variant="outline" size="sm">
              <PencilIcon />
              Editar
            </Button>
          }
          title="Editar pieza"
          description={piece.label}
          submitLabel="Guardar"
          notice="El cambio aplica en el próximo escaneo, sin reprogramar el chip."
          defaultValues={toPieceValues(piece, merchantReviewUrl)}
          merchantReviewUrl={merchantReviewUrl}
          onSave={save}
        />
        <Button variant="outline" size="sm" onClick={toggleActive} disabled={toggling}>
          {toggling && <Spinner />}
          {piece.active ? "Desactivar" : "Activar"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
