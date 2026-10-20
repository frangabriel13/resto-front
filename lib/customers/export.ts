// Nombre del archivo que manda la API (`attachment; filename="clubsy-cafe-demo-2026-10-20.csv"`).
export function exportFilename(contentDisposition: string | null, fallback = "clubsy-clientes.csv"): string {
  const match = contentDisposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  return match ? decodeURIComponent(match[1]) : fallback;
}
