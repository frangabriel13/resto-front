import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import type { ApiError } from "@/lib/api/errors";
import type { ScanResult } from "@/lib/stamps/types";

type StampTarget = { stampToken: string } | { membershipId: string };
export type StampKeys = Record<"normal" | "override", string>;

// Una clave por cada pedido distinto: reintentar el mismo pedido nunca suma dos sellos.
export function newStampKeys(): StampKeys {
  return { normal: crypto.randomUUID(), override: crypto.randomUUID() };
}

// Por QR (stampToken) o manual desde la ficha (membershipId).
export function grantStamp(target: StampTarget, keys: StampKeys, cooldownOverride: boolean) {
  const idempotencyKey = cooldownOverride ? keys.override : keys.normal;
  return callApi(
    api.POST("/panel/stamps", { body: { ...target, idempotencyKey, cooldownOverride } }),
  );
}

// Otro empleado le sumó un sello mientras se confirmaba: hay que confirmar que es otro consumo.
export function cooldownFromError(error: ApiError | undefined): ScanResult["cooldown"] | null {
  if (error?.code !== "COOLDOWN_ACTIVE") return null;
  const lastStampAt = typeof error.details?.lastStampAt === "string" ? error.details.lastStampAt : null;
  return { active: true, lastStampAt, retryAfterSeconds: 0 };
}
