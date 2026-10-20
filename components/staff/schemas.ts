import { z } from "zod";

const newPassword = z
  .string()
  .min(8, "Tiene que tener al menos 8 caracteres.")
  .max(128, "Puede tener hasta 128 caracteres.");

const passwordsMatch = {
  path: ["confirmPassword"],
  message: "Las contraseñas no coinciden.",
};

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Ingresá tu contraseña actual."),
    newPassword,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ["newPassword"],
    message: "Tiene que ser distinta de la actual.",
  })
  .refine((values) => values.confirmPassword === values.newPassword, passwordsMatch);

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const recoveryRequestSchema = z.object({ email: z.email("Ingresá un email válido.") });

export type RecoveryRequestValues = z.infer<typeof recoveryRequestSchema>;

export const resetPasswordSchema = z
  .object({ newPassword, confirmPassword: z.string() })
  .refine((values) => values.confirmPassword === values.newPassword, passwordsMatch);

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
