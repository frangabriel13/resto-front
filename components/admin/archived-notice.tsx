import { ArchiveIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate } from "@/lib/format";
import { UnarchiveButton } from "./archive-buttons";

export function ArchivedNotice({ merchantId, archivedAt }: { merchantId: string; archivedAt: string }) {
  return (
    <Alert>
      <ArchiveIcon />
      <AlertTitle>Archivado el {formatDate(archivedAt)}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <p>
          No se puede editar hasta desarchivarlo. La contraseña NFC de las piezas se puede seguir
          viendo.
        </p>
        <UnarchiveButton merchantId={merchantId} />
      </AlertDescription>
    </Alert>
  );
}
