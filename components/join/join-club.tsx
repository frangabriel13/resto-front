"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { customerRoutes } from "@/lib/customer/routes";
import { JoinAsCustomer } from "./join-as-customer";
import { JoinWithPhone } from "./join-with-phone";

type JoinClubProps = {
  merchant: { id: string; name: string; slug: string };
  pieceCode: string;
  customerName: string | null;
};

export function JoinClub({ merchant, pieceCode, customerName }: JoinClubProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => () => setOpen(false), []);

  async function join(marketingConsent: boolean) {
    const result = await callApi(
      api.POST("/me/memberships", {
        body: { merchantId: merchant.id, marketingConsent, pieceCode },
      }),
    );
    if (result.ok) {
      router.push(customerRoutes.card(merchant.slug));
    } else {
      // Si ya validó el código tiene sesión: al recargar, la pantalla lo reconoce y no lo pide de nuevo.
      router.refresh();
    }
    return result;
  }

  if (customerName) {
    return <JoinAsCustomer customerName={customerName} merchantName={merchant.name} join={join} />;
  }
  if (!open) {
    return (
      <Button
        size="lg"
        onClick={() => setOpen(true)}
        className="h-12 w-full bg-cta text-base text-cta-foreground hover:bg-cta/90"
      >
        Sumarme al club
      </Button>
    );
  }
  return <JoinWithPhone merchantName={merchant.name} join={join} />;
}
