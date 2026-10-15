import type { components } from "./schema";

// Forma de toda respuesta de error de la API. Qué mostrar se decide por `code`;
// `message` es un texto de respaldo en español.
export type ApiError = components["schemas"]["ApiError"];
export type ApiErrorCode = ApiError["code"];

// El `error` de openapi-fetch puede no ser un `ApiError` si la respuesta no
// vino de la API (por ejemplo, un 502 del proxy con la API caída).
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    "message" in error &&
    typeof error.message === "string"
  );
}
