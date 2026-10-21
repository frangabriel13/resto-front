import { customerApp, manifestResponse } from "@/lib/pwa/manifest";

export function GET() {
  return manifestResponse(customerApp);
}
