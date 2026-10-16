"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FormAlert } from "@/components/form/form-alert";
import { showApiError } from "@/components/form/show-api-error";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { pieceSchema, type PieceValues } from "./schemas";

export function NewPieceForm({ merchantId }: { merchantId: string }) {
  const router = useRouter();
  const form = useForm<PieceValues>({
    resolver: zodResolver(pieceSchema),
    defaultValues: { label: "" },
  });

  async function onSubmit(body: PieceValues) {
    const result = await callApi(
      api.POST("/admin/merchants/{merchantId}/pieces", {
        params: { path: { merchantId } },
        body,
      }),
    );
    if (!result.ok) {
      showApiError(form, result);
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
      <FormAlert message={form.formState.errors.root?.message} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <TextField
            control={form.control}
            name="label"
            label="Nueva pieza"
            placeholder="Por ejemplo: Mostrador"
          />
        </div>
        <Button
          type="submit"
          className="h-11 sm:mt-[1.625rem]"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Spinner /> : <PlusIcon />}
          Agregar pieza
        </Button>
      </div>
    </form>
  );
}
