import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Ingresá tu contraseña actual."),
    newPassword: z
      .string()
      .min(8, "Tiene que tener al menos 8 caracteres.")
      .max(128, "Puede tener hasta 128 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ["newPassword"],
    message: "Tiene que ser distinta de la actual.",
  })
  .refine((values) => values.confirmPassword === values.newPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
