import { Badge } from "@/components/ui/badge";
import { merchantStatusLabels, type MerchantStatus } from "@/lib/merchants/status";
import { cn } from "@/lib/utils";

const styles: Record<MerchantStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  ACTIVE: "bg-emerald-100 text-emerald-800",
  PAUSED: "bg-brand/15 text-brand",
  ENDED: "bg-secondary text-secondary-foreground",
};

export function MerchantStatusBadge({ status }: { status: MerchantStatus }) {
  return (
    <Badge variant="secondary" className={cn("border-transparent", styles[status])}>
      {merchantStatusLabels[status]}
    </Badge>
  );
}
