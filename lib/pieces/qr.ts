import "server-only";
import QRCode from "qrcode";

export function qrSvg(text: string): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    color: { dark: "#001d67", light: "#ffffff" },
  });
}
