import { DownloadIcon } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Piece } from "@/lib/admin/types";
import { formatDateTime } from "@/lib/format";
import { slugify } from "@/lib/merchants/slug";
import { pieceQrSvg } from "@/lib/pieces/qr";
import { pieceUrl } from "@/lib/pieces/url";
import { cn } from "@/lib/utils";
import { NfcPassword } from "./nfc-password";
import { PieceActions } from "./piece-actions";
import { PieceDestination } from "./piece-destination";

type PieceCardProps = {
  merchantId: string;
  merchantSlug: string;
  merchantReviewUrl: string | null;
  piece: Piece;
  siteUrl: string;
  editable: boolean;
};

export async function PieceCard({
  merchantId,
  merchantSlug,
  merchantReviewUrl,
  piece,
  siteUrl,
  editable,
}: PieceCardProps) {
  const url = pieceUrl(siteUrl, piece.publicCode);
  const svg = await pieceQrSvg(url);
  const fileName = `clubsy-${merchantSlug}-${slugify(piece.label) || "pieza"}.svg`;

  return (
    <li className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row">
      <div
        aria-label={`QR de ${piece.label}`}
        role="img"
        className={cn(
          "size-36 shrink-0 self-center rounded-lg border bg-white sm:self-start [&>svg]:size-full",
          !piece.active && "opacity-40",
        )}
        // SVG generado por nosotros a partir de la URL de la pieza.
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium text-primary">{piece.label}</h3>
          <Badge variant={piece.active ? "secondary" : "outline"}>
            {piece.active ? "Activa" : "Inactiva"}
          </Badge>
        </div>
        <PieceDestination piece={piece} />
        <p className="text-xs text-muted-foreground">Creada el {formatDateTime(piece.createdAt)}</p>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">URL para el chip NFC</span>
          <code className="rounded-md bg-muted px-2 py-1.5 text-sm break-all">{url}</code>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={url} label="Copiar URL" />
          <Button asChild variant="outline" size="sm">
            <a href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`} download={fileName}>
              <DownloadIcon />
              Descargar QR
            </a>
          </Button>
        </div>
        <NfcPassword merchantId={merchantId} pieceId={piece.id} />
        {editable && (
          <PieceActions merchantId={merchantId} piece={piece} merchantReviewUrl={merchantReviewUrl} />
        )}
      </div>
    </li>
  );
}
