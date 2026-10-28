// Herramienta oficial de Google para buscar el Place ID de un negocio en el mapa.
export const placeIdFinderUrl =
  "https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder";

const reviewBase = "https://search.google.com/local/writereview?placeid=";

// Google no fija un largo máximo; el tope es el de `googleReviewUrl` en la API (500 con el prefijo).
const placeIdPattern = new RegExp(`^[A-Za-z0-9_-]{20,${500 - reviewBase.length}}$`);

// Acepta el ID solo o un link que lo traiga (`placeid=` o `place_id=`), como el que ya está guardado.
export function parsePlaceId(input: string): string | null {
  const value = input.trim();
  if (placeIdPattern.test(value)) return value;
  try {
    const url = new URL(value);
    const id = url.searchParams.get("placeid") ?? url.searchParams.get("place_id");
    return id && placeIdPattern.test(id) ? id : null;
  } catch {
    return null;
  }
}

export const reviewUrlFromPlaceId = (placeId: string) => `${reviewBase}${placeId}`;
