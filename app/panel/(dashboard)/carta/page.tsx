import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { MenuEditor } from "@/components/menu/menu-editor";
import { PageHeader } from "@/components/panel/page-header";
import { getPanelMenu } from "@/lib/menu/data";
import { requireOwnerSession } from "@/lib/staff/session";

export const metadata: Metadata = { title: "Carta" };

export default function MenuPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <PageHeader title="Carta" description="Lo que ven tus clientes en tu página: categorías, ítems y precios." />
      <Suspense fallback={<LoadingBlock />}>
        <MenuContent />
      </Suspense>
    </div>
  );
}

async function MenuContent() {
  const { merchant } = await requireOwnerSession();
  const menu = await getPanelMenu();
  const readOnly = merchant.status === "PAUSED" || merchant.status === "ENDED";

  return (
    <MenuEditor
      menu={menu}
      readOnly={readOnly}
      readOnlyNotice="Con el club pausado o finalizado, la carta no se puede cambiar."
    />
  );
}
