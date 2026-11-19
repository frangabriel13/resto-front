import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function SubmitButton({
  pending,
  className,
  children,
}: {
  pending: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Button type="submit" size="lg" className={cn("h-11 w-full text-base", className)} disabled={pending}>
      {pending && <Spinner />}
      {children}
    </Button>
  );
}
