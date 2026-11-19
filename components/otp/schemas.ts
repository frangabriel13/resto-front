import { z } from "zod";
import { looksLikePhone } from "@/lib/customer/phone";

export const phoneField = z
  .string()
  .refine(looksLikePhone, "Ingresá tu celular con el código de área, por ejemplo 11 2345 6789.");

// Un código pegado desde WhatsApp puede venir como "123 456" o "123-456".
export function normalizeCode(code: string): string {
  return code.replace(/[\s-]/g, "");
}

export const codeSchema = z.object({
  code: z.string().refine((code) => /^\d{6}$/.test(normalizeCode(code)), "Ingresá los 6 números del código."),
});

export type CodeValues = z.infer<typeof codeSchema>;
