import { Suspense } from "react";
import { AdminFrame, AdminShell } from "@/components/admin/admin-frame";
import { LoadingBlock } from "@/components/loading-block";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense
      fallback={
        <AdminShell account={<Skeleton className="size-10 rounded-full" />}>
          <LoadingBlock />
        </AdminShell>
      }
    >
      <AdminFrame>{children}</AdminFrame>
    </Suspense>
  );
}
