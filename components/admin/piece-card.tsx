import { DownloadIcon } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Piece } from "@/lib/admin/types";
import { destinationTypeLabels } from "@/lib/pieces/fields";
import { slugify } from "@/lib/merchants/slug";
import { pieceQrSvg } from "@/lib/pieces/qr";
import { pieceUrl } from "@/lib/pieces/url";
import { cn } from "@/lib/utils";
import { PieceActions } from "./piece-actions";
import { PieceDestinationDialog } from "./piece-destination-dialog";
import { PiecePasswordControl } from "./piece-password-control";

type PieceCardProps = {
  merchantId: string;
  merchantSlug: string;
  piece: Piece;
  siteUrl: string;
};

export async function PieceCard({ merchantId, merchantSlug, piece, siteUrl }: PieceCardProps) {
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
          <Badge variant="outline">{destinationTypeLabels[piece.destinationType]}</Badge>
        </div>
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
        <PieceActions merchantId={merchantId} piece={piece} />
        <div className="flex flex-wrap gap-2 border-t pt-3">
          <PieceDestinationDialog merchantId={merchantId} piece={piece} />
          <PiecePasswordControl merchantId={merchantId} piece={piece} />
        </div>
      </div>
    </li>
  );
}
