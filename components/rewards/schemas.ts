import { z } from "zod";
import type { CreateRewardRuleBody, RewardRule } from "@/lib/rewards/types";

export const rewardRuleSchema = z.object({
  stampsRequired: z
    .string()
    .trim()
    .regex(/^\d+$/, "Ingresá un número.")
    .refine((value) => Number(value) >= 1 && Number(value) <= 50, "Entre 1 y 50 sellos."),
  rewardDescription: z
    .string()
    .trim()
    .min(1, "Contá qué se lleva el cliente.")
    .max(200, "Hasta 200 caracteres."),
  conditions: z.string().trim().max(500, "Hasta 500 caracteres."),
});

export type RewardRuleValues = z.infer<typeof rewardRuleSchema>;

export function toRewardRuleValues(rule: RewardRule | undefined): RewardRuleValues {
  return {
    stampsRequired: String(rule?.stampsRequired ?? 8),
    rewardDescription: rule?.rewardDescription ?? "",
    conditions: rule?.conditions ?? "",
  };
}

export function toCreateRewardRuleBody(values: RewardRuleValues): CreateRewardRuleBody {
  return {
    stampsRequired: Number(values.stampsRequired),
    rewardDescription: values.rewardDescription,
    conditions: values.conditions || null,
  };
}

// Para la vista previa mientras se escribe: un número fuera de rango no rompe el dibujo.
export function previewStamps(value: string): number {
  const stamps = Number(value);
  return Number.isInteger(stamps) && stamps >= 1 && stamps <= 50 ? stamps : 1;
}
