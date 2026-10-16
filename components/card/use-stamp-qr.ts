"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { localExpiry, nextRefreshDelay, retryDelay } from "@/lib/customer/stamp-qr";

export type StampQrState =
  | { status: "loading" }
  | { status: "ready"; svg: string }
  | { status: "offline" }
  | { status: "error"; message: string };

// Pide el token firmado y lo renueva antes de que venza. Nunca deja en pantalla un QR vencido.
export function useStampQr(membershipId: string) {
  const [state, setState] = useState<StampQrState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    let expiryTimer: ReturnType<typeof setTimeout> | undefined;
    let expiresAt: number | null = null;
    let failures = 0;

    const expired = () => expiresAt === null || Date.now() >= expiresAt;

    async function load() {
      clearTimeout(refreshTimer);
      if (document.visibilityState === "hidden") return;
      const result = await callApi(
        api.GET("/me/memberships/{id}/stamp-token", { params: { path: { id: membershipId } } }),
      );
      if (cancelled) return;

      if (result.ok) {
        failures = 0;
        expiresAt = localExpiry(
          result.data.expiresAt,
          result.response?.headers.get("date") ?? null,
          Date.now(),
        );
        const svg = await QRCode.toString(result.data.token, {
          type: "svg",
          margin: 1,
          errorCorrectionLevel: "M",
          color: { dark: "#000000", light: "#ffffff" },
        });
        if (cancelled) return;
        setState({ status: "ready", svg });
        refreshTimer = setTimeout(
          load,
          nextRefreshDelay(result.data.refreshInSeconds, expiresAt, Date.now()),
        );
        clearTimeout(expiryTimer);
        expiryTimer = setTimeout(() => setState({ status: "offline" }), expiresAt - Date.now());
        return;
      }

      if (result.error) {
        setState({ status: "error", message: result.message });
        return;
      }
      // Sin conexión: se reintenta mientras el QR actual siga vigente.
      failures += 1;
      if (expired()) {
        setState({ status: "offline" });
        return;
      }
      refreshTimer = setTimeout(load, retryDelay(failures));
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") {
        clearTimeout(refreshTimer);
        return;
      }
      if (expired()) setState({ status: "loading" });
      load();
    }

    load();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      cancelled = true;
      clearTimeout(refreshTimer);
      clearTimeout(expiryTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [membershipId, attempt]);

  function retry() {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  }

  return { state, retry };
}
