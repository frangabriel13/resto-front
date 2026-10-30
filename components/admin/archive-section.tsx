import { SectionCard } from "@/components/section-card";
import { canArchive } from "@/lib/admin/archive";
import type { AdminMerchant, Piece } from "@/lib/admin/types";
import { ArchiveButton, UnarchiveButton } from "./archive-buttons";
import { DeleteMerchantDialog } from "./delete-merchant-dialog";

export function ArchiveSection({ merchant, pieces }: { merchant: AdminMerchant; pieces: Piece[] }) {
  const archived = merchant.archivedAt !== null;
  return (
    <SectionCard
      title="Archivar o borrar"
      description="Archivar lo saca del listado sin borrar nada. Borrar es definitivo y solo se puede si nunca tuvo clientes."
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
        <DeleteMerchantDialog merchantId={merchant.id} name={merchant.name} pieceCount={pieces.length} />
      </div>
    </SectionCard>
  );
}
