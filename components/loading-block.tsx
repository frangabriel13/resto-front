import { Spinner } from "@/components/ui/spinner";

export function LoadingBlock() {
  return (
    <div className="flex min-h-40 items-center justify-center text-muted-foreground">
      <Spinner className="size-6" />
    </div>
  );
}
