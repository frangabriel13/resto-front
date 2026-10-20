"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { FormAlert } from "@/components/form/form-alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import type { MerchantStatus } from "@/lib/merchants/status";
import { memberActions } from "@/lib/team/members";
import type { StaffMember } from "@/lib/team/types";
import { TemporaryPasswordNotice } from "./temporary-password-notice";

type Pending = "active" | "password" | null;

export function MemberActions({ member, status }: { member: StaffMember; status: MerchantStatus }) {
  const router = useRouter();
  const actions = memberActions(member, status);
  const [pending, setPending] = useState<Pending>(null);
  const [error, setError] = useState<string>();
  const [password, setPassword] = useState<string | null>(null);
  const path = { params: { path: { staffUserId: member.staffUserId } } };

  useLayoutEffect(
    () => () => {
      setPassword(null);
      setError(undefined);
      setPending(null);
    },
    [],
  );

  async function setActive(active: boolean) {
    setPending("active");
    setError(undefined);
    const result = await callApi(api.PATCH("/panel/staff/{staffUserId}", { ...path, body: { active } }));
    setPending(null);
    if (!result.ok) return setError(result.message);
    router.refresh();
  }

  async function resetPassword() {
    setPending("password");
    setError(undefined);
    setPassword(null);
    const result = await callApi(api.POST("/panel/staff/{staffUserId}/reset-password", path));
    setPending(null);
    if (!result.ok) return setError(result.message);
    setPassword(result.data.temporaryPassword);
    router.refresh();
  }

  if (!actions.deactivate && !actions.reactivate && !actions.resetPassword) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {actions.resetPassword && (
          <Confirm
            label="Nueva contraseña"
            title={`¿Darle una contraseña nueva a ${member.name}?`}
            description="Se cierran sus sesiones abiertas y la va a tener que cambiar al entrar. Usalo si se olvidó la suya."
            confirm="Generar contraseña"
            pending={pending === "password"}
            disabled={pending !== null}
            onConfirm={resetPassword}
          />
        )}
        {actions.deactivate && (
          <Confirm
            label="Dar de baja"
            title={`¿Dar de baja a ${member.name}?`}
            description="Deja de poder usar el panel de este comercio desde su próxima acción. Su historial queda. Lo podés reactivar después."
            confirm="Dar de baja"
            destructive
            pending={pending === "active"}
            disabled={pending !== null}
            onConfirm={() => setActive(false)}
          />
        )}
        {actions.reactivate && (
          <Button variant="outline" size="sm" disabled={pending !== null} onClick={() => setActive(true)}>
            {pending === "active" && <Spinner />}
            Reactivar
          </Button>
        )}
      </div>
      <FormAlert message={error} />
      {/* Dado de baja, la contraseña ya no sirve. */}
      {password && member.active && (
        <TemporaryPasswordNotice title={`Contraseña nueva para ${member.name}`} password={password} />
      )}
    </div>
  );
}

function Confirm({
  label,
  title,
  description,
  confirm,
  destructive = false,
  pending,
  disabled,
  onConfirm,
}: {
  label: string;
  title: string;
  description: string;
  confirm: string;
  destructive?: boolean;
  pending: boolean;
  disabled: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          {pending && <Spinner />}
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant={destructive ? "destructive" : "default"} onClick={onConfirm}>
            {confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
