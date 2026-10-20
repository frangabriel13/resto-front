import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().trim().min(1, "Ingresá el nombre.").max(100, "Hasta 100 caracteres."),
  email: z.email("Ingresá un email válido."),
});

export type EmployeeValues = z.infer<typeof employeeSchema>;
