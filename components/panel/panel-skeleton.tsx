import { Skeleton } from "@/components/ui/skeleton";
import { PanelShell } from "./panel-frame";

export function PanelSkeleton() {
  return (
    <PanelShell
      sidebar={
        <div className="flex flex-col gap-2 px-1">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      }
      header={
        <div className="flex h-16 items-center gap-3 border-b px-4 md:px-8">
          <Skeleton className="h-9 flex-1 md:max-w-48" />
          <Skeleton className="size-10 rounded-full" />
        </div>
      }
    >
      <div className="flex flex-col gap-3 px-4 pt-6 md:px-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-28" />
      </div>
    </PanelShell>
  );
}
