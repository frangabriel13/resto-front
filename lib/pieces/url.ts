import { customerRoutes } from "@/lib/customer/routes";

export function pieceUrl(siteUrl: string, publicCode: string): string {
  return `${siteUrl.replace(/\/+$/, "")}${customerRoutes.piece(publicCode)}`;
}
