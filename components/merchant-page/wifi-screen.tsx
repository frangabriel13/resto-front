import { BackLink } from "@/components/back-link";
import { CopyButton } from "@/components/copy-button";
import { wifiSteps } from "@/lib/customer/page-menu";
import { customerRoutes } from "@/lib/customer/routes";
import type { ClubPiece } from "@/lib/customer/types";
import { qrSvg } from "@/lib/pieces/qr";

type Wifi = NonNullable<ClubPiece["page"]["wifi"]>;

export async function WifiScreen({ wifi, pieceCode }: { wifi: Wifi; pieceCode: string }) {
  const svg = await qrSvg(wifi.qrPayload);
  return (
    <div>
      <BackLink href={customerRoutes.piece(pieceCode)}>Volver</BackLink>
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-lg font-semibold">Conectate al Wi-Fi</h2>
          <dl className="flex flex-col gap-3 rounded-xl border p-4">
            <div className="flex flex-col gap-1">
              <dt className="text-xs text-muted-foreground">Red</dt>
              <dd className="font-medium break-words">{wifi.ssid}</dd>
            </div>
            {wifi.password && (
              <div className="flex flex-col gap-1">
                <dt className="text-xs text-muted-foreground">Contraseña</dt>
                <dd className="flex flex-wrap items-center justify-between gap-2">
                  <code className="font-mono text-base break-all">{wifi.password}</code>
                  <CopyButton value={wifi.password} />
                </dd>
              </div>
            )}
          </dl>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            {wifiSteps(wifi).map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col items-center gap-3 text-center">
          <h2 className="font-heading font-semibold">¿Querés pasarle la red a otro celular?</h2>
          <p className="text-sm text-muted-foreground">
            Que escanee este código con la cámara y toque el aviso para conectarse.
          </p>
          <div
            role="img"
            aria-label={`QR para conectarse a la red ${wifi.ssid}`}
            className="size-48 rounded-lg border bg-white [&>svg]:size-full"
            // SVG generado por nosotros a partir del texto que arma la API.
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </section>
      </div>
    </div>
  );
}
