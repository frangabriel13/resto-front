import { z } from "zod";
import { phoneField } from "@/components/otp/schemas";

export const detailsSchema = z.object({
  name: z.string().trim().min(1, "Decinos tu nombre.").max(60, "Hasta 60 caracteres."),
  phone: phoneField,
  marketingConsent: z.boolean(),
});

export type DetailsValues = z.infer<typeof detailsSchema>;
