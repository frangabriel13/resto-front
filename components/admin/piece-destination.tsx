import type { Piece } from "@/lib/admin/types";
import { destinationDetail, destinationLabels } from "@/lib/pieces/destination";
import { destinationIcons } from "./destination-icons";

export function PieceDestination({ piece }: { piece: Piece }) {
  const { destination, redirectUrl } = piece;
  const Icon = destinationIcons[destination.type];
  const detail = destinationDetail(destination);

  return (
    <div className="flex flex-col gap-1 text-sm">
      <span className="flex items-center gap-1.5 font-medium">
        <Icon className="size-4 text-brand" />
        {destinationLabels[destination.type]}
      </span>
      {detail && redirectUrl && (
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          {detail}
        </a>
      )}
      {destination.type === "WHATSAPP" && destination.message && (
        <p className="text-muted-foreground">Mensaje: “{destination.message}”</p>
      )}
    </div>
  );
}
