// "60 minutos (1 hora)" para la ayuda del campo.
export function cooldownText(minutes: number): string {
  if (minutes === 0) return "Sin espera: se puede sumar un sello tras otro.";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const parts = [hours && `${hours} ${hours === 1 ? "hora" : "horas"}`, rest && `${rest} min`].filter(Boolean);
  return `Entre dos sellos al mismo cliente tienen que pasar ${parts.join(" y ")}.`;
}
