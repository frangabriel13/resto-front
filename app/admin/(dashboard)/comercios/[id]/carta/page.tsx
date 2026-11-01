import type { Metadata } from "next";
import { Suspense } from "react";
import { BackLink } from "@/components/back-link";
import { LoadingBlock } from "@/components/loading-block";
import { MenuEditor } from "@/components/menu/menu-editor";
import { adminRoutes } from "@/lib/admin/routes";
import { getAdminMenu } from "@/lib/menu/data";

export const metadata: Metadata = { title: "Carta" };

export default function AdminMenuPage({ params }: PageProps<"/admin/comercios/[id]/carta">) {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Suspense fallback={<LoadingBlock />}>
        <AdminMenuContent params={params} />
      </Suspense>
    </div>
  );
}

async function AdminMenuContent({ params }: Pick<PageProps<"/admin/comercios/[id]/carta">, "params">) {
  const { id } = await params;
  const { merchant, menu } = await getAdminMenu(id);

  return (
    <>
      <div>
        <BackLink href={adminRoutes.merchant(id)}>{merchant.name}</BackLink>
        <h1 className="font-heading text-2xl font-semibold text-primary">Carta</h1>
      </div>
      <MenuEditor
        menu={menu}
        merchantId={id}
        readOnly={merchant.archivedAt !== null}
        readOnlyNotice="El comercio está archivado: desarchivalo para editar la carta."
      />
    </>
  );
}
