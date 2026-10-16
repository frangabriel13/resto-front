import type { BarcodeDetector as PonyfillDetector } from "barcode-detector/ponyfill";

type QrDetector = Pick<PonyfillDetector, "detect">;
type DetectorClass = typeof PonyfillDetector;

// El lector nativo del navegador si lee QR (Chrome en Android); si no, el de zxing-wasm servido
// desde /vendor (lo copia scripts/copy-zxing-wasm.mjs), sin pedidos a un CDN.
export async function createQrDetector(): Promise<QrDetector> {
  const Native = (globalThis as { BarcodeDetector?: DetectorClass }).BarcodeDetector;
  if (Native && (await Native.getSupportedFormats()).includes("qr_code")) {
    return new Native({ formats: ["qr_code"] });
  }
  const { BarcodeDetector, prepareZXingModule } = await import("barcode-detector/ponyfill");
  prepareZXingModule({
    overrides: {
      locateFile: (path: string, prefix: string) =>
        path.endsWith(".wasm") ? `/vendor/${path}` : prefix + path,
    },
  });
  return new BarcodeDetector({ formats: ["qr_code"] });
}
