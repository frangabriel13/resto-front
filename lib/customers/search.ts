// Mismo criterio que la API: con 3 dígitos o más busca por teléfono; si no, por nombre.
export function searchMode(query: string): "too-short" | "phone" | "name" {
  const trimmed = query.trim();
  if (trimmed.length < 2) return "too-short";
  return trimmed.replace(/\D/g, "").length >= 3 ? "phone" : "name";
}
