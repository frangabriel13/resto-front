import { CheckIcon } from "lucide-react";

// Después de salir de un club o borrar la cuenta: siempre un texto fijo (`accountNotice`).
export function AccountNotice({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="status"
      className="mb-4 flex items-start gap-2.5 rounded-[0.625rem] bg-neutral-100 px-3.5 py-3 text-[0.8125rem] leading-normal text-neutral-700"
    >
      <CheckIcon aria-hidden strokeWidth={2.2} className="mt-px size-4.5 shrink-0 text-ink" />
      {children}
    </p>
  );
}
