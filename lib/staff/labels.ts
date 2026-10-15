import type { StaffMerchant } from "./access";

export const roleLabels: Record<StaffMerchant["role"], string> = {
  OWNER: "Dueño",
  EMPLOYEE: "Empleado",
};
