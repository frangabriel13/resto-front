"use client";

import { RefreshCwIcon, WifiOffIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { stampQrAnchor } from "@/lib/customer/routes";
import { useStampQr } from "./use-stamp-qr";

export function StampQr({ membershipId, forRedemption }: { membershipId: string; forRedemption: boolean }) {
  const { state, retry } = useStampQr(membershipId);
  const sectionRef = useRef<HTMLElement>(null);

  // Al llegar desde la bienvenida del alta ("Mostrar mi QR"), el QR queda a la vista.
  useEffect(() => {
    if (window.location.hash === `#${stampQrAnchor}`) sectionRef.current?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <section
      ref={sectionRef}
      id={stampQrAnchor}
      aria-labelledby="stamp-qr-title"
      className="flex scroll-mt-4 flex-col items-center gap-3 rounded-[0.875rem] bg-background px-5 pt-5 pb-4.5 text-center shadow-[0_2px_6px_rgb(0_0_0/0.04),0_12px_32px_rgb(0_0_0/0.1)]"
    >
      <h2 id="stamp-qr-title" className="text-base font-semibold">
        {forRedemption ? "Mostrá este QR para canjear tu premio" : "Mostrá este QR en la caja"}
      </h2>

      <div className="flex size-60 items-center justify-center rounded-xl bg-white">
        {state.status === "ready" && (
          <div
            role="img"
            aria-label="QR de tu tarjeta"
            className="size-60 [&>svg]:size-full"
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

      <p className="text-xs text-muted-foreground">Se actualiza solo: una captura de pantalla no sirve.</p>
    </section>
  );
}
