export function pieceUrl(siteUrl: string, publicCode: string): string {
  return `${siteUrl.replace(/\/+$/, "")}/p/${encodeURIComponent(publicCode)}`;
}
