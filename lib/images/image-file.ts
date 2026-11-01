export const maxImageBytes = 2 * 1024 * 1024;
export const imageAccept = "image/png,image/jpeg,image/webp";

// Antes de subirla, para avisar enseguida. La que decide es la API, que mira el contenido del archivo.
export function imageFileError({ type, size }: { type: string; size: number }): string | null {
  if (!imageAccept.split(",").includes(type)) return "La imagen tiene que ser PNG, JPG o WebP.";
  if (size > maxImageBytes) return "La imagen no puede pesar más de 2 MB.";
  return null;
}

// `openapi-fetch` manda un `FormData` tal cual, con el boundary que arma el navegador.
export function imageFormData(file: File): { file: string } {
  const body = new FormData();
  body.append("file", file);
  return body as unknown as { file: string };
}
