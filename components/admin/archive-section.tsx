import { SectionCard } from "@/components/section-card";
import { canArchive, deleteBlockedReason, type DeletionSummary } from "@/lib/admin/archive";
import type { AdminMerchant, Piece } from "@/lib/admin/types";
import { ArchiveButton, UnarchiveButton } from "./archive-buttons";
import { DeleteMerchantDialog } from "./delete-merchant-dialog";

type ArchiveSectionProps = { merchant: AdminMerchant; pieces: Piece[]; deletion: DeletionSummary };

export function ArchiveSection({ merchant, pieces, deletion }: ArchiveSectionProps) {
  const archived = merchant.archivedAt !== null;
  const blocked = deleteBlockedReason(deletion, merchant.status);
  return (
    <SectionCard
      title="Archivar o borrar"
      description="Archivar lo saca del listado sin borrar nada. Borrar es definitivo: sin clientes se puede en cualquier momento; con clientes, solo archivado."
    >
      <div className="flex flex-col gap-4">
        {archived ? (
          <UnarchiveButton merchantId={merchant.id} />
        ) : canArchive(merchant.status) ? (
          <ArchiveButton merchantId={merchant.id} activePieces={pieces.filter((piece) => piece.active).length} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Para archivarlo, primero finalizá el club (en Estado).
          </p>
        )}
        {blocked ? (
          <p className="text-sm text-muted-foreground">{blocked}</p>
        ) : (
          <DeleteMerchantDialog merchantId={merchant.id} name={merchant.name} summary={deletion} />
        )}
      </div>
    </SectionCard>
  );
}
