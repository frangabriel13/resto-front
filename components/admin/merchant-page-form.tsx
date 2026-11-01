"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { PageFields } from "@/components/merchant-page/page-fields";
import { FieldGroup } from "@/components/ui/field";
import type { AdminMerchant } from "@/lib/admin/types";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { pageSchema, toPageBody, toPageValues } from "@/lib/merchants/page";
import { SaveRow } from "./save-row";

const schema = z.object({ page: pageSchema });
type Values = z.infer<typeof schema>;

export function MerchantPageForm({ merchant, readOnly }: { merchant: AdminMerchant; readOnly: boolean }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    values: { page: toPageValues(merchant.page) },
  });

  async function onSubmit({ page }: Values) {
    setSaved(false);
    const result = await callApi(
      api.PATCH("/admin/merchants/{id}", {
        params: { path: { id: merchant.id } },
        body: { page: toPageBody(page) },
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
      <fieldset disabled={readOnly} className="min-w-0">
        <FieldGroup>
          <FormAlert message={form.formState.errors.root?.message} />
          <PageFields control={form.control} />
          <SaveRow pending={form.formState.isSubmitting} saved={saved && !form.formState.isDirty} />
        </FieldGroup>
      </fieldset>
    </form>
  );
}
