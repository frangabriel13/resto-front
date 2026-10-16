import Image from "next/image";
import { requirePanelSession } from "@/lib/staff/session";
import logoLateral from "@/public/logoLateral.png";
import { BottomNav } from "./bottom-nav";
import { MerchantStatusBanner } from "./merchant-status-banner";
import { PanelHeader } from "./panel-header";
import { SidebarNav } from "./sidebar-nav";

export async function PanelFrame({ children }: { children: React.ReactNode }) {
  const session = await requirePanelSession();

  return (
    <PanelShell
      sidebar={<SidebarNav role={session.merchant.role} />}
      header={<PanelHeader {...session} />}
    >
      <MerchantStatusBanner merchant={session.merchant} />
      <main className="flex-1 px-4 pt-6 pb-28 md:px-8 md:pb-10">{children}</main>
      <BottomNav role={session.merchant.role} />
    </PanelShell>
  );
}

export function PanelShell({
  sidebar,
  header,
  children,
}: {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 border-t-4 border-brand">
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col gap-8 border-r px-3 py-5 md:flex">
        <Image src={logoLateral} alt="Clubsy" loading="eager" className="h-auto w-36 px-1" />
        {sidebar}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        {header}
        {children}
      </div>
    </div>
  );
}
