"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { cardChange, changeMessage, pollIntervalMs, pollWindowMs } from "@/lib/customer/card-updates";
import type { MembershipCard } from "@/lib/customer/types";

// Mientras el cliente muestra el QR, consulta su tarjeta para mostrarle el sello o el canje
// apenas los registra el local. Con la pestaña oculta no consulta.
export function useCardUpdates(card: MembershipCard, active: boolean): string | null {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const latest = useRef(card);
  const membershipId = card.id;

  useEffect(() => {
    latest.current = card;
  }, [card]);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let windowStart = Date.now();

    async function poll() {
      clearTimeout(timer);
      if (document.visibilityState === "hidden" || Date.now() - windowStart > pollWindowMs) return;
      const result = await callApi(
        api.GET("/me/memberships/{id}", { params: { path: { id: membershipId } } }),
      );
      if (cancelled) return;
      // Error de la API (por ejemplo, sesión vencida): deja de consultar.
      if (!result.ok && result.error) return;
      if (result.ok) {
        const previous = latest.current;
        const change = cardChange(previous, result.data);
        if (change) {
          latest.current = result.data;
          windowStart = Date.now();
          const text = changeMessage(change, result.data, previous);
          if (text) setMessage(text);
          router.refresh();
        }
      }
      timer = setTimeout(poll, pollIntervalMs);
    }

    function onVisibilityChange() {
      clearTimeout(timer);
      if (document.visibilityState === "hidden") return;
      windowStart = Date.now();
      poll();
    }

    timer = setTimeout(poll, pollIntervalMs);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [active, membershipId, router]);

  return message;
}
