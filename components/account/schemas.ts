import { z } from "zod";
import { phoneField } from "@/components/otp/schemas";

export const phoneSchema = z.object({ phone: phoneField });
export type PhoneValues = z.infer<typeof phoneSchema>;

export const nameSchema = z.object({
  name: z.string().trim().min(1, "Decinos tu nombre.").max(60, "Hasta 60 caracteres."),
});
export type NameValues = z.infer<typeof nameSchema>;
