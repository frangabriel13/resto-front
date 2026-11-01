"use client";

import { PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { menuItemPrice } from "@/lib/customer/menu";
import { toItemBody, toItemValues } from "@/lib/menu/form";
import type { MenuItem } from "@/lib/menu/types";
import { ItemForm } from "./item-form";
import { MenuFormDialog } from "./menu-form-dialog";
import { RowActions } from "./row-actions";
import type { MenuEditorState } from "./use-menu-editor";

type MenuItemRowProps = { item: MenuItem; first: boolean; last: boolean; editor: MenuEditorState };

export function MenuItemRow({ item, first, last, editor }: MenuItemRowProps) {
  const price = menuItemPrice(item);
  return (
    <li className="flex flex-col gap-2 py-3">
      <div className="flex items-baseline justify-between gap-4">
        <span className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="font-medium break-words">{item.name}</span>
          {!item.visible && <Badge variant="outline">Oculto</Badge>}
        </span>
        {price && <span className="shrink-0 font-medium whitespace-nowrap">{price}</span>}
      </div>
      {item.description && <p className="text-sm break-words text-muted-foreground">{item.description}</p>}
      {!editor.readOnly && (
        <RowActions
          name={item.name}
          visible={item.visible}
          first={first}
          last={last}
          pending={editor.pending}
          deleteWarning="No se puede deshacer. Si solo querés que no se vea, apagá “Visible”."
          onMove={(direction) => editor.run((client) => client.moveItem(item.id, direction))}
          onToggle={(visible) => editor.run((client) => client.updateItem(item.id, { visible }))}
          onDelete={() => editor.run((client) => client.removeItem(item.id))}
          editButton={
            <MenuFormDialog
              title="Editar ítem"
              trigger={
                <Button type="button" variant="outline" size="icon-lg" aria-label={`Editar ${item.name}`} disabled={editor.pending}>
                  <PencilIcon />
                </Button>
              }
            >
              {(close) => (
                <ItemForm
                  defaultValues={toItemValues(item)}
                  submitLabel="Guardar"
                  onSave={(values) => editor.save((client) => client.updateItem(item.id, toItemBody(values)))}
                  onSaved={close}
                />
              )}
            </MenuFormDialog>
          }
        />
      )}
    </li>
  );
}
