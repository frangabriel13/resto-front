import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import type { StaffMerchant } from "@/lib/staff/access";
import { panelRoutes } from "@/lib/staff/routes";

const messages: Record<Exclude<StaffMerchant["status"], "ACTIVE">, string> = {
  DRAFT: "Tu club está en preparación: todavía no recibe clientes.",
  PAUSED:
    "El club está pausado: no se pueden sumar sellos ni anotar clientes. Los canjes de tarjetas completas siguen habilitados.",
  ENDED: "El club finalizó. El panel queda en modo consulta.",
};

export function MerchantStatusBanner({ merchant }: { merchant: StaffMerchant }) {
  if (merchant.status === "ACTIVE") return null;
  const showRewardLink = merchant.status === "DRAFT" && merchant.role === "OWNER";

  return (
    <div
      role="status"
      className="flex items-start gap-3 border-b border-brand/20 bg-brand/10 px-4 py-3 text-sm text-foreground md:px-8"
    >
      <CircleAlertIcon className="mt-0.5 size-4 shrink-0 text-brand" />
      <p>
        {messages[merchant.status]}{" "}
        {showRewardLink && (
          <Link href={panelRoutes.reward} className="font-medium text-primary underline underline-offset-4">
            Configurar el premio
          </Link>
        )}
      </p>
    </div>
  );
}
