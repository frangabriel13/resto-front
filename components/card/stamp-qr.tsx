"use client";

import { RefreshCwIcon, WifiOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useStampQr } from "./use-stamp-qr";

export function StampQr({ membershipId, forRedemption }: { membershipId: string; forRedemption: boolean }) {
  const { state, retry } = useStampQr(membershipId);

  return (
    <section aria-labelledby="stamp-qr-title" className="flex flex-col items-center gap-3 rounded-2xl border p-5 text-center">
      <h2 id="stamp-qr-title" className="font-heading text-lg font-semibold">
        {forRedemption ? "Mostrá este QR para canjear tu premio" : "Mostrá este QR en la caja"}
      </h2>

      <div className="flex size-56 items-center justify-center rounded-xl bg-white">
        {state.status === "ready" && (
          <div
            role="img"
            aria-label="QR de tu tarjeta"
            className="size-56 [&>svg]:size-full"
            // SVG generado en el navegador a partir del token firmado de la API.
            dangerouslySetInnerHTML={{ __html: state.svg }}
          />
        )}
        {state.status === "loading" && <Spinner className="size-8 text-muted-foreground" />}
        {(state.status === "offline" || state.status === "error") && (
          <div className="flex flex-col items-center gap-3 px-4">
            <WifiOffIcon className="size-8 text-muted-foreground" />
            <p className="text-sm">
              {state.status === "offline"
                ? "Sin conexión: no podemos mostrar tu QR."
                : state.message}
            </p>
            <Button variant="outline" size="sm" onClick={retry}>
              <RefreshCwIcon />
              Reintentar
            </Button>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">Se actualiza solo. Una captura de pantalla no sirve.</p>
    </section>
  );
}
