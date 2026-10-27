// Copia un texto que todavía se está pidiendo. Safari solo deja escribir en el portapapeles
// durante el toque: con `ClipboardItem` la escritura arranca ahí y espera al texto.
export async function copyText(text: Promise<string>): Promise<void> {
  if (typeof ClipboardItem === "undefined") {
    await navigator.clipboard.writeText(await text);
    return;
  }
  const blob = text.then((value) => new Blob([value], { type: "text/plain" }));
  await navigator.clipboard.write([new ClipboardItem({ "text/plain": blob })]);
}
