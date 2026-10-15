"use client";

import { ChevronRightIcon, StoreIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { FormAlert } from "@/components/form/form-alert";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import type { StaffAccount } from "@/lib/staff/access";
import { merchantStatusLabels } from "@/lib/merchants/status";
import { roleLabels } from "@/lib/staff/labels";
import { staffRoutes } from "@/lib/staff/routes";

export function MerchantPicker({ account }: { account: StaffAccount }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string>();

  // Next oculta la página al navegar en vez de desmontarla: al volver, no tiene que seguir "eligiendo".
  useLayoutEffect(() => () => setPendingId(null), []);

  async function select(merchantId: string) {
    setPendingId(merchantId);
    setError(undefined);
    const result = await callApi(
      api.POST("/auth/staff/select-merchant", { body: { merchantId } }),
    );
    if (!result.ok) {
      setError(result.message);
      setPendingId(null);
      return;
    }
    router.replace(staffRoutes.home);
  }

  return (
    <div className="flex flex-col gap-3">
      <FormAlert message={error} />
      <ul className="flex flex-col gap-2">
        {account.merchants.map((merchant) => (
          <li key={merchant.id}>
            <button
              type="button"
              onClick={() => select(merchant.id)}
              disabled={pendingId !== null}
              aria-current={merchant.id === account.selectedMerchantId}
              className="flex min-h-16 w-full items-center gap-3 rounded-lg border bg-card px-4 py-3 text-left transition-colors outline-none hover:border-primary/40 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60 aria-[current=true]:border-primary"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
                <StoreIcon className="size-5" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-medium break-words text-primary">{merchant.name}</span>
                <span className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {roleLabels[merchant.role]}
                  {merchant.status !== "ACTIVE" && (
                    <Badge variant="secondary">{merchantStatusLabels[merchant.status]}</Badge>
                  )}
                </span>
              </span>
              {pendingId === merchant.id ? (
                <Spinner className="text-muted-foreground" />
              ) : (
                <ChevronRightIcon className="size-4 text-muted-foreground" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
