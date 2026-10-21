export const legalRoutes = {
  terms: "/terminos",
  privacy: "/privacidad",
} as const;

// Mientras sea borrador, las páginas lo avisan y no se indexan. Al aprobarse
// los textos: `draft: false` y la fecha de la versión aprobada (AAAA-MM-DD).
export const legalStatus: { draft: boolean; updatedAt: string | null } = {
  draft: true,
  updatedAt: null,
};

// Datos de quien presta el servicio. `null` se muestra como "a completar".
export const legalEntity: Record<"name" | "cuit" | "address" | "email", string | null> = {
  name: null,
  cuit: null,
  address: null,
  email: null,
};

export const legalEntityLabels: Record<keyof typeof legalEntity, string> = {
  name: "razón social",
  cuit: "CUIT",
  address: "domicilio legal",
  email: "email de contacto",
};

export function missingEntityFields(entity: typeof legalEntity = legalEntity): string[] {
  return (Object.keys(entity) as (keyof typeof legalEntity)[])
    .filter((key) => !entity[key])
    .map((key) => legalEntityLabels[key]);
}
