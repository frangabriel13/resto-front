import { callApi, type ApiResult } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";

export type OtpRequest = { resendAt: number; alreadySent: boolean };

// Pide el código y devuelve desde cuándo se puede pedir otro (timestamp en ms).
export async function requestOtp(phone: string): Promise<ApiResult<OtpRequest>> {
  const result = await callApi(api.POST("/auth/customer/otp/request", { body: { phone } }));
  if (result.ok) {
    return {
      ok: true,
      data: { resendAt: Date.now() + result.data.resendInSeconds * 1000, alreadySent: false },
    };
  }
  if (result.error?.code === "OTP_RESEND_TOO_SOON") {
    // Hace menos de un minuto se pidió otro: puede servir ese (si no se usó) o esperar para reenviar.
    const retryAfter = Number(result.error.details?.retryAfterSeconds ?? 60);
    return { ok: true, data: { resendAt: Date.now() + retryAfter * 1000, alreadySent: true } };
  }
  return result;
}
