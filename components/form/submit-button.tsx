import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button type="submit" size="lg" className="h-11 w-full text-base" disabled={pending}>
      {pending && <Spinner />}
      {children}
    </Button>
  );
}
