import { ScanLineIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { StaffMerchant } from "@/lib/staff/access";
import { panelRoutes } from "@/lib/staff/routes";

const callouts: Partial<Record<StaffMerchant["status"], { title: string; text: string }>> = {
  ACTIVE: {
    title: "Sumá un sello",
    text: "Escaneá el QR de la tarjeta del cliente después de cada compra.",
  },
  PAUSED: {
    title: "Canjeá premios",
    text: "Con el club pausado, escaneá el QR solo para canjear tarjetas completas.",
  },
};

export function ScanCallout({ status }: { status: StaffMerchant["status"] }) {
  const callout = callouts[status];
  if (!callout) return null;

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-primary p-5 text-primary-foreground">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-lg font-semibold">{callout.title}</h2>
        <p className="text-sm text-primary-foreground/80">{callout.text}</p>
      </div>
      <Button
        asChild
        size="lg"
        className="h-11 w-full bg-brand text-base text-brand-foreground hover:bg-brand/90 sm:w-fit"
      >
        <Link href={panelRoutes.scan}>
          <ScanLineIcon />
          Escanear QR
        </Link>
      </Button>
    </section>
  );
}
