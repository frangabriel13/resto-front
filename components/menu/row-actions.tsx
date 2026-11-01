"use client";

import { ArrowDownIcon, ArrowUpIcon, Trash2Icon } from "lucide-react";
import { useId } from "react";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { MoveDirection } from "@/lib/menu/types";

type RowActionsProps = {
  name: string;
  visible: boolean;
  first: boolean;
  last: boolean;
  pending: boolean;
  deleteWarning: string;
  editButton: React.ReactNode;
  onMove: (direction: MoveDirection) => void;
  onToggle: (visible: boolean) => void;
  onDelete: () => void;
};

// Lo mismo para una categoría y para un ítem: subir y bajar, visible, editar y borrar.
export function RowActions({
  name,
  visible,
  first,
  last,
  pending,
  deleteWarning,
  editButton,
  onMove,
  onToggle,
  onDelete,
}: RowActionsProps) {
  const id = useId();
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <div className="flex gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label={`Subir ${name}`}
          disabled={first || pending}
          onClick={() => onMove("up")}
        >
          <ArrowUpIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label={`Bajar ${name}`}
          disabled={last || pending}
          onClick={() => onMove("down")}
        >
          <ArrowDownIcon />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id={id}
          checked={visible}
          disabled={pending}
          aria-label={`Visible: ${name}`}
          onCheckedChange={onToggle}
        />
        <Label htmlFor={id} className="font-normal">
          Visible
        </Label>
      </div>
      <div className="ml-auto flex gap-1">
        {editButton}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="outline" size="icon-lg" aria-label={`Borrar ${name}`} disabled={pending}>
              <Trash2Icon />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Borrar {name}?</AlertDialogTitle>
              <AlertDialogDescription>{deleteWarning}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={onDelete}>
                Borrar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
