import { CircleAlertIcon } from "lucide-react";

export function ClubNotice({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="flex gap-2 rounded-xl bg-muted px-4 py-3 text-sm">
      <CircleAlertIcon className="mt-0.5 size-4 shrink-0" />
      {children}
    </p>
  );
}
