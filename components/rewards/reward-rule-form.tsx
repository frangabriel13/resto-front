"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { SubmitButton } from "@/components/form/submit-button";
import { TextareaField } from "@/components/form/textarea-field";
import { TextField } from "@/components/form/text-field";
import { FieldGroup } from "@/components/ui/field";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import type { RewardRule } from "@/lib/rewards/types";
import {
  previewStamps,
  rewardRuleSchema,
  toCreateRewardRuleBody,
  toRewardRuleValues,
  type RewardRuleValues,
} from "./schemas";
import { StampPreview } from "./stamp-preview";

export function RewardRuleForm({ activeRule }: { activeRule: RewardRule | undefined }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const form = useForm<RewardRuleValues>({
    resolver: zodResolver(rewardRuleSchema),
    values: toRewardRuleValues(activeRule),
  });
  const [stampsRequired, rewardDescription] = useWatch({
    control: form.control,
    name: ["stampsRequired", "rewardDescription"],
  });

  useLayoutEffect(() => () => setSaved(false), []);

  async function onSubmit(values: RewardRuleValues) {
    setSaved(false);
    const result = await callApi(
      api.POST("/panel/reward-rules", { body: toCreateRewardRuleBody(values) }),
    );
    if (!result.ok) {
      form.setError("root", { message: result.message });
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormAlert message={form.formState.errors.root?.message} />
        <TextField
          control={form.control}
          name="stampsRequired"
          label="Sellos para el premio"
          inputMode="numeric"
          className="sm:max-w-32"
        />
        <TextField
          control={form.control}
          name="rewardDescription"
          label="Premio"
          placeholder="Por ejemplo: Un café con medialuna"
        />
        <TextareaField
          control={form.control}
          name="conditions"
          label="Condiciones (opcional)"
          placeholder="Por ejemplo: No incluye bebidas grandes."
          description="El cliente las ve en su tarjeta."
        />
        <StampPreview
          stampsRequired={previewStamps(stampsRequired)}
          rewardDescription={rewardDescription.trim()}
        />
        {activeRule && (
          <p className="flex gap-2 text-sm text-muted-foreground">
            <InfoIcon className="mt-0.5 size-4 shrink-0 text-brand" />
            Los clientes que ya están juntando sellos terminan su tarjeta con el premio actual. El
            nuevo aplica desde su próxima tarjeta.
          </p>
        )}
        <div className="flex flex-col gap-2 sm:w-56">
          <SubmitButton pending={form.formState.isSubmitting}>
            {activeRule ? "Cambiar el premio" : "Guardar el premio"}
          </SubmitButton>
          {saved && !form.formState.isDirty && (
            <p role="status" className="text-center text-sm text-emerald-700">
              Premio guardado.
            </p>
          )}
        </div>
      </FieldGroup>
    </form>
  );
}
