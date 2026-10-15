import { ConstructionIcon } from "lucide-react";
import { PageHeader } from "./page-header";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
          <ConstructionIcon className="size-6" />
        </span>
        <p className="font-medium">Próximamente</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Estamos terminando esta sección.
        </p>
      </div>
    </>
  );
}
