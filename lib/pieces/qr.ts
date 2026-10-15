import "server-only";
import QRCode from "qrcode";

export function pieceQrSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    color: { dark: "#001d67", light: "#ffffff" },
  });
}
