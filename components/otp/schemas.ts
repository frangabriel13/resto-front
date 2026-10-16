import { z } from "zod";
import { looksLikePhone } from "@/lib/customer/phone";

export const phoneField = z
  .string()
  .refine(looksLikePhone, "Ingresá tu celular con el código de área, por ejemplo 11 2345 6789.");

export const codeSchema = z.object({
  code: z.string().trim().regex(/^\d{6}$/, "Ingresá los 6 números del código."),
});

export type CodeValues = z.infer<typeof codeSchema>;
