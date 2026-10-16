// "hace 12 minutos" para el aviso de cooldown.
export function timeAgo(iso: string, now: number): string {
  const minutes = Math.floor((now - Date.parse(iso)) / 60_000);
  if (minutes < 1) return "hace un momento";
  if (minutes === 1) return "hace 1 minuto";
  if (minutes < 60) return `hace ${minutes} minutos`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `hace ${hours} h${rest ? ` ${rest} min` : ""}`;
}

// Cómo queda la tarjeta después de sumar un sello (los de más pasan a la próxima).
export function balanceAfterStamp(balance: number, stampsRequired: number): string {
  const next = balance + 1;
  return next > stampsRequired
    ? `${stampsRequired} de ${stampsRequired} y ${next - stampsRequired} para la próxima`
    : `${next} de ${stampsRequired}`;
}
