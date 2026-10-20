import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { ScanCallout } from "@/components/panel/scan-callout";
import { ClubSummary } from "@/components/stats/club-summary";
import { getStats } from "@/lib/activity/data";
import { requirePanelSession } from "@/lib/staff/session";

export const metadata: Metadata = { title: "Inicio" };

export default function PanelHomePage() {
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Suspense fallback={<LoadingBlock />}>
        <Welcome />
      </Suspense>
      <Suspense fallback={<LoadingBlock />}>
        <Summary />
      </Suspense>
    </div>
  );
}

async function Welcome() {
  const { account, merchant } = await requirePanelSession();

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold text-primary">
          Hola, {account.user.name}
        </h1>
        <p className="text-muted-foreground">Estás trabajando en {merchant.name}.</p>
      </div>
      <ScanCallout status={merchant.status} />
    </>
  );
}

async function Summary() {
  await requirePanelSession();
  return <ClubSummary stats={await getStats()} />;
}
