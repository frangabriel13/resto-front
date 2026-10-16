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

export const connectionErrorMessage =
  "No pudimos conectarnos. Revisá tu conexión y probá de nuevo.";

export function apiErrorMessage(error: unknown): string {
  return isApiError(error) ? error.message : connectionErrorMessage;
}

export type FieldIssue = { path: string; message: string };

// Detalle por campo que manda la API en un VALIDATION_ERROR.
export function validationIssues(error: ApiError | undefined): FieldIssue[] {
  const issues = error?.code === "VALIDATION_ERROR" ? error.details?.issues : undefined;
  if (!Array.isArray(issues)) return [];
  return issues.filter(
    (issue): issue is FieldIssue =>
      typeof issue?.path === "string" && typeof issue?.message === "string",
  );
}
