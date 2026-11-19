// Campos y botón principal del alta, con el estilo de la página del comercio (etapa 12).
// En el celular el texto queda en 16 px: con menos, Safari agranda la pantalla al tocar el campo.
export const joinInputClass = "h-12 rounded-[0.625rem] px-3.5 md:text-[0.9375rem]";

export const joinButtonClass =
  "h-12.5 rounded-[0.625rem] bg-cta text-[0.9375rem] font-medium text-cta-foreground hover:bg-cta/90";

// Los links de texto también se tocan con el dedo: 44 px de alto como mínimo.
export const joinLinkClass = "min-h-11 font-medium text-ink";

export const joinCodeClasses = {
  input: "h-15 rounded-[0.625rem] text-2xl md:text-2xl",
  button: joinButtonClass,
  link: joinLinkClass,
};

// La barra de abajo con el botón principal, fija mientras se recorre la hoja.
export const joinBottomBarClass = "sticky bottom-0 mt-auto border-t border-neutral-100 bg-background px-5 pt-3 pb-5";

export function consentLabel(merchantName: string): string {
  return `Quiero recibir novedades y promociones de ${merchantName}. Es opcional: si no la marcás, no te escribimos.`;
}
