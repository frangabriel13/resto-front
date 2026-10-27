"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { FieldGroup } from "@/components/ui/field";
import type { AdminMerchant } from "@/lib/admin/types";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { ClubFields } from "./club-fields";
import { SaveRow } from "./save-row";
import {
  clubSettingsSchema,
  toClubSettingsBody,
  toClubSettingsValues,
  type ClubSettingsValues,
} from "./schemas";

export function ClubSettingsForm({ merchant }: { merchant: AdminMerchant }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const form = useForm<ClubSettingsValues>({
    resolver: zodResolver(clubSettingsSchema),
    values: toClubSettingsValues(merchant),
  });

  async function onSubmit(values: ClubSettingsValues) {
    setSaved(false);
    const result = await callApi(
      api.PATCH("/admin/merchants/{id}", {
        params: { path: { id: merchant.id } },
        body: toClubSettingsBody(values),
      }),
    );
    if (!result.ok) {
      showApiError(form, result);
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormAlert message={form.formState.errors.root?.message} />
        <ClubFields control={form.control} slugLocked={merchant.status !== "DRAFT"} />
        <SaveRow pending={form.formState.isSubmitting} saved={saved && !form.formState.isDirty} />
      </FieldGroup>
    </form>
  );
}
