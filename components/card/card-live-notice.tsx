"use client";

import { PartyPopperIcon } from "lucide-react";
import type { MembershipCard } from "@/lib/customer/types";
import { useCardUpdates } from "./use-card-updates";

export function CardLiveNotice({ card, active }: { card: MembershipCard; active: boolean }) {
  const message = useCardUpdates(card, active);
  if (!message) return null;
  return (
    <p role="status" className="flex items-center gap-3 rounded-xl bg-brand/15 px-4 py-3 font-medium text-primary">
      <PartyPopperIcon className="size-5 shrink-0 text-brand" />
      {message}
    </p>
  );
}
