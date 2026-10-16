// Validación previa y tolerante: la que decide si es un celular argentino válido es la API.
export function looksLikePhone(value: string): boolean {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "").length;
  return /^\+?[\d\s().-]+$/.test(trimmed) && digits >= 8 && digits <= 15;
}
