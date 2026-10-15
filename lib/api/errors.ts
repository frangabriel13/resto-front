import type { components } from "./schema";

export type ApiError = components["schemas"]["ApiError"];
export type ApiErrorCode = ApiError["code"];

// Si la API está caída, el error es la respuesta del proxy (un 502), no un `ApiError`.
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
