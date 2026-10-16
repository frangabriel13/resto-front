import { apiErrorMessage, connectionErrorMessage, isApiError, type ApiError } from "./errors";

type FetchResult<T> = { data?: T; error?: unknown; response: Response };

// `error` está solo si la respuesta vino de la API (sirve para leer `code` y `details`).
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; error?: ApiError };

export async function callApi<T>(
  request: Promise<FetchResult<T>>,
): Promise<ApiResult<T>> {
  try {
    const { data, error, response } = await request;
    // Las respuestas 204 llegan sin `data`.
    if (response.ok) return { ok: true, data: data as T };
    return {
      ok: false,
      message: apiErrorMessage(error),
      ...(isApiError(error) && { error }),
    };
  } catch {
    return { ok: false, message: connectionErrorMessage };
  }
}
