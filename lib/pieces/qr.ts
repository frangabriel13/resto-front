import "server-only";
import QRCode from "qrcode";

// Por defecto, el azul de Clubsy; la página del comercio lo dibuja con su color (`inkColor`).
export function qrSvg(text: string, color = "#001d67"): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    color: { dark: color, light: "#ffffff" },
  });
}
