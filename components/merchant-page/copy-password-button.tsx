"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

type Status = "idle" | "copied" | "failed";

const labels: Record<Status, string> = {
  idle: "Copiar contraseña",
  copied: "Copiada",
  failed: "No se pudo copiar",
};

export function CopyPasswordButton({ value }: { value: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    setTimeout(() => setStatus("idle"), 2000);
  }

  const Icon = status === "copied" ? CheckIcon : CopyIcon;
  return (
    <button
      type="button"
      onClick={copy}
      className="flex h-12.5 items-center justify-center gap-2 rounded-[0.625rem] bg-cta text-[0.9375rem] font-medium text-cta-foreground transition-transform outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-98"
    >
      <Icon aria-hidden className="size-4.5" />
      <span aria-live="polite">{labels[status]}</span>
    </button>
  );
}
