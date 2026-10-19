import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";

// Solo por QR: el canje exige que el cliente esté presente.
export function redeemReward(stampToken: string, idempotencyKey: string) {
  return callApi(api.POST("/panel/redemptions", { body: { stampToken, idempotencyKey } }));
}
