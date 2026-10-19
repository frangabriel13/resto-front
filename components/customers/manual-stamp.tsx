"use client";

import { HandIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { ConfirmView } from "@/components/scan/confirm-view";
import { cooldownFromError, grantStamp, newStampKeys, type StampKeys } from "@/components/scan/grant-stamp";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CustomerDetail } from "@/lib/customers/types";
import type { ScanResult } from "@/lib/stamps/types";

type Attempt = { scan: ScanResult; checkedAt: number; keys: StampKeys; pending: boolean; error?: string };

// Alternativa al QR si falla la cámara: queda registrado como sello manual.
export function ManualStamp({ detail }: { detail: CustomerDetail }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => () => {
    setAttempt(null);
    setDone(false);
  }, []);

  function open() {
    setDone(false);
    setAttempt({
      scan: { membership: detail.membership, cooldown: detail.cooldown },
      checkedAt: Date.now(),
      keys: newStampKeys(),
      pending: false,
    });
  }

  async function confirm(cooldownOverride: boolean) {
    if (!attempt) return;
    const current = { ...attempt, pending: true, error: undefined };
    setAttempt(current);
    const result = await grantStamp({ membershipId: detail.membership.id }, attempt.keys, cooldownOverride);
    if (result.ok) {
      setAttempt(null);
      setDone(true);
      setTimeout(() => setDone(false), 4000);
      router.refresh();
      return;
    }
    const cooldown = cooldownFromError(result.error);
    setAttempt({
      ...current,
      pending: false,
      ...(cooldown
        ? { checkedAt: Date.now(), scan: { ...attempt.scan, cooldown } }
        : { error: result.message }),
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" size="lg" className="h-12" onClick={open}>
        <HandIcon />
        Sumar sello sin QR
      </Button>
      {done && (
        <p role="status" className="text-center text-sm text-emerald-700">
          Sello sumado.
        </p>
      )}
      <Dialog open={attempt !== null} onOpenChange={(isOpen) => !isOpen && !attempt?.pending && setAttempt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sumar sello sin QR</DialogTitle>
            <DialogDescription>
              Usalo solo si no funciona la cámara. Queda registrado como sello manual.
            </DialogDescription>
          </DialogHeader>
          {attempt && (
            <ConfirmView
              scan={attempt.scan}
              checkedAt={attempt.checkedAt}
              pending={attempt.pending ? "stamp" : null}
              error={attempt.error}
              onConfirm={confirm}
              onCancel={() => setAttempt(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
