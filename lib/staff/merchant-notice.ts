import type { StaffMerchant } from "./access";

export type MerchantNotice = { text: string; rewardLink: boolean };

// Aviso del panel según el estado del comercio; `null` si está activo.
export function merchantNotice(
  merchant: Pick<StaffMerchant, "status" | "role" | "hasActiveRule">,
): MerchantNotice | null {
  switch (merchant.status) {
    case "ACTIVE":
      return null;
    case "DRAFT":
      if (merchant.hasActiveRule) {
        return {
          text: "Tu club está en preparación: ya tiene premio. Falta que Clubsy lo active para empezar a recibir clientes.",
          rewardLink: false,
        };
      }
      return merchant.role === "OWNER"
        ? { text: "Tu club está en preparación: todavía no recibe clientes.", rewardLink: true }
        : {
            text: "Tu club está en preparación: falta que el dueño configure el premio.",
            rewardLink: false,
          };
    case "PAUSED":
      return {
        text: "El club está pausado: no se pueden sumar sellos ni anotar clientes. Los canjes de tarjetas completas siguen habilitados.",
        rewardLink: false,
      };
    case "ENDED":
      return { text: "El club finalizó. El panel queda en modo consulta.", rewardLink: false };
  }
}
