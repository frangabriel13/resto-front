"use client";

import * as Sentry from "@sentry/nextjs";
import { RotateCwIcon, TriangleAlertIcon } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import icon from "@/public/icon.png";

type ErrorScreenProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export function ErrorScreen({ error, retry }: ErrorScreenProps) {
  useEffect(() => {
    // Con `digest` es un error del servidor, que ya reportó onRequestError.
    if (!error.digest) Sentry.captureException(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 border-t-4 border-brand px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-brand/10 text-brand">
        <TriangleAlertIcon className="size-7" />
      </span>
      <h1 className="font-heading text-2xl font-semibold text-primary">Algo salió mal</h1>
      <p className="max-w-xs text-muted-foreground">
        Tuvimos un problema al mostrar esta página. Probá de nuevo en un momento.
      </p>
      <Button size="lg" className="h-12" onClick={retry}>
        <RotateCwIcon />
        Reintentar
      </Button>
      <Image src={icon} alt="Clubsy" className="mt-8 size-8 opacity-60" />
    </main>
  );
}
