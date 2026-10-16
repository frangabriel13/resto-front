import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import type { StaffMerchant } from "@/lib/staff/access";
import { merchantNotice } from "@/lib/staff/merchant-notice";
import { panelRoutes } from "@/lib/staff/routes";

export function MerchantStatusBanner({ merchant }: { merchant: StaffMerchant }) {
  const notice = merchantNotice(merchant);
  if (!notice) return null;

  return (
    <div
      role="status"
      className="flex items-start gap-3 border-b border-brand/20 bg-brand/10 px-4 py-3 text-sm text-foreground md:px-8"
    >
      <CircleAlertIcon className="mt-0.5 size-4 shrink-0 text-brand" />
      <p>
        {notice.text}{" "}
        {notice.rewardLink && (
          <Link href={panelRoutes.reward} className="font-medium text-primary underline underline-offset-4">
            Configurar el premio
          </Link>
        )}
      </p>
    </div>
  );
}
