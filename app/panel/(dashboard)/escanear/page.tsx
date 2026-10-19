import { StoreIcon } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { PageHeader } from "@/components/panel/page-header";
import { ScanFlow } from "@/components/scan/scan-flow";
import { requirePanelSession } from "@/lib/staff/session";

export const metadata: Metadata = { title: "Escanear" };

export default function ScanPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <PageHeader title="Escanear" description="Escaneá el QR de la tarjeta del cliente para sumar un sello o canjear su premio." />
      <Suspense fallback={<LoadingBlock />}>
        <ScanGate />
      </Suspense>
    </div>
  );
}

async function ScanGate() {
  const { merchant } = await requirePanelSession();
  if (merchant.status === "DRAFT" || merchant.status === "ENDED") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed px-6 py-10 text-center">
        <StoreIcon className="size-8 text-brand" />
        <p className="font-medium">
          {merchant.status === "DRAFT" ? "El club todavía no está activo" : "El club finalizó"}
        </p>
        <p className="text-sm text-muted-foreground">No se pueden sumar sellos.</p>
      </div>
    );
  }
  return <ScanFlow stampsAllowed={merchant.status === "ACTIVE"} />;
}
