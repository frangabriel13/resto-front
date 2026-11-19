import { WifiIcon } from "lucide-react";
import { brandStyle, clubsyColors, inkColor } from "@/lib/brand/colors";
import { wifiSteps } from "@/lib/customer/page-menu";
import { customerRoutes } from "@/lib/customer/routes";
import type { ClubPiece } from "@/lib/customer/types";
import { qrSvg } from "@/lib/pieces/qr";
import { CopyPasswordButton } from "./copy-password-button";
import { RoundBackLink } from "./round-back-link";

type Wifi = NonNullable<ClubPiece["page"]["wifi"]>;

type WifiScreenProps = {
  merchant: ClubPiece["merchant"];
  wifi: Wifi;
  pieceCode: string;
};

// La franja del color del comercio con "volver" y una tarjeta como un ticket: el ícono del Wi-Fi en
// el lugar del logo, la red y la contraseña, un corte y el QR para otro celular. Los pasos, abajo.
export async function WifiScreen({ merchant, wifi, pieceCode }: WifiScreenProps) {
  const svg = await qrSvg(wifi.qrPayload, inkColor(merchant.primaryColor ?? clubsyColors.primary));
  return (
    <main style={brandStyle(merchant)} className="flex flex-1 flex-col bg-neutral-100">
      <div className="h-31 shrink-0 bg-primary p-4">
        <RoundBackLink href={customerRoutes.piece(pieceCode)} />
      </div>

      <div className="relative mx-4.5 -mt-10 rounded-[0.875rem] bg-background shadow-[0_2px_6px_rgb(0_0_0/0.04),0_12px_32px_rgb(0_0_0/0.1)] sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center px-5 pb-5.5 text-center">
          <span className="-mt-10.5 flex size-21 items-center justify-center rounded-3xl border-4 border-white bg-ink text-white">
            <WifiIcon aria-hidden strokeWidth={1.8} className="size-8.5" />
          </span>
          <h1 className="mt-3 text-[0.8125rem] font-medium text-muted-foreground">Wi-Fi del local</h1>
          <p className="mt-0.5 text-[1.375rem] font-semibold wrap-anywhere">{wifi.ssid}</p>
          {wifi.password ? (
            <div className="mt-4.5 flex w-full flex-col gap-2.5">
              <div className="flex flex-col gap-0.5 rounded-[0.625rem] border-[1.5px] border-dashed border-neutral-300 px-4 py-3">
                <span className="text-xs text-muted-foreground">Contraseña</span>
                <code className="font-mono text-[1.1875rem] font-medium tracking-wide break-all">{wifi.password}</code>
              </div>
              <CopyPasswordButton value={wifi.password} />
            </div>
          ) : (
            <p className="mt-3.5 rounded-full bg-ink/8 px-3.5 py-2 text-[0.8125rem] font-medium text-ink">
              Red abierta · no pide contraseña
            </p>
          )}
        </div>

        <TicketCut />

        <div className="flex flex-col items-center px-5 pt-4 pb-5.5 text-center">
          <div
            role="img"
            aria-label={`QR para conectarse a la red ${wifi.ssid}`}
            className="size-44 [&>svg]:size-full"
            // SVG generado por nosotros a partir del texto que arma la API.
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <p className="mt-2 max-w-65 text-[0.8125rem] leading-normal text-muted-foreground">
            ¿Otro celular? Que escanee este código con la cámara y toque el aviso.
          </p>
        </div>
      </div>

      <section aria-labelledby="como-conectarte" className="mx-auto w-full max-w-md px-6 pt-6.5 pb-8">
        <h2 id="como-conectarte" className="mb-3 text-base font-semibold">
          Cómo conectarte
        </h2>
        <ol className="flex flex-col gap-2.5">
          {wifiSteps(wifi).map((step, index) => (
            <li key={step} className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-ink ring-1 ring-black/6">
                {index + 1}
              </span>
              <span className="pt-px text-sm leading-normal text-neutral-700">{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

// El corte del ticket: dos medialunas del color del fondo en los bordes y una línea punteada.
function TicketCut() {
  return (
    <div aria-hidden className="relative flex h-6 items-center">
      <span className="absolute -left-3 size-6 rounded-full bg-neutral-100 shadow-[inset_-6px_0_8px_-6px_rgb(0_0_0/0.12)]" />
      <span className="mx-5 flex-1 border-t-[1.5px] border-dashed border-neutral-200" />
      <span className="absolute -right-3 size-6 rounded-full bg-neutral-100 shadow-[inset_6px_0_8px_-6px_rgb(0_0_0/0.12)]" />
    </div>
  );
}
