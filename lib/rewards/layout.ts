const maxPerRow = 7;

// Filas parejas, como una tarjeta de cartón: 8 sellos van en 2 filas de 4, nunca más de 7 por fila.
export function stampColumns(stamps: number): number {
  const rows = Math.ceil(stamps / maxPerRow);
  return Math.ceil(stamps / rows);
}
