"use client";

import { PencilIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { emptyItemValues, toItemBody } from "@/lib/menu/form";
import type { MenuCategory } from "@/lib/menu/types";
import { CategoryForm } from "./category-form";
import { ItemForm } from "./item-form";
import { MenuFormDialog } from "./menu-form-dialog";
import { MenuItemRow } from "./menu-item-row";
import { RowActions } from "./row-actions";
import type { MenuEditorState } from "./use-menu-editor";

type MenuCategoryCardProps = { category: MenuCategory; first: boolean; last: boolean; editor: MenuEditorState };

function deleteCategoryWarning(items: number): string {
  if (items === 0) return "No se puede deshacer.";
  const lost = items === 1 ? "También se borra su ítem" : `También se borran sus ${items} ítems`;
  return `${lost}. No se puede deshacer. Si solo querés que no se vea, apagá “Visible”.`;
}

export function MenuCategoryCard({ category, first, last, editor }: MenuCategoryCardProps) {
  const { items } = category;
  return (
    <li className="flex flex-col gap-3 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="min-w-0 font-heading text-lg font-semibold break-words text-primary">{category.name}</h3>
        {!category.visible && <Badge variant="outline">Oculta</Badge>}
      </div>
      {!editor.readOnly && (
        <RowActions
          name={category.name}
          visible={category.visible}
          first={first}
          last={last}
          pending={editor.pending}
          deleteWarning={deleteCategoryWarning(items.length)}
          onMove={(direction) => editor.run((client) => client.moveCategory(category.id, direction))}
          onToggle={(visible) => editor.run((client) => client.updateCategory(category.id, { visible }))}
          onDelete={() => editor.run((client) => client.removeCategory(category.id))}
          editButton={
            <MenuFormDialog
              title="Editar categoría"
              trigger={
                <Button type="button" variant="outline" size="icon-lg" aria-label={`Editar ${category.name}`} disabled={editor.pending}>
                  <PencilIcon />
                </Button>
              }
            >
              {(close) => (
                <CategoryForm
                  name={category.name}
                  submitLabel="Guardar"
                  onSave={({ name }) => editor.save((client) => client.updateCategory(category.id, { name }))}
                  onSaved={close}
                />
              )}
            </MenuFormDialog>
          }
        />
      )}

      {items.length > 0 ? (
        <ul className="flex flex-col divide-y border-t">
          {items.map((item, index) => (
            <MenuItemRow key={item.id} item={item} first={index === 0} last={index === items.length - 1} editor={editor} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Sin ítems: no aparece en la página.</p>
      )}

      {!editor.readOnly && (
        <MenuFormDialog
          title={`Nuevo ítem en ${category.name}`}
          trigger={
            <Button type="button" variant="outline" className="h-10 self-start" disabled={editor.pending}>
              <PlusIcon />
              Agregar ítem
            </Button>
          }
        >
          {(close) => (
            <ItemForm
              defaultValues={emptyItemValues}
              submitLabel="Agregar ítem"
              onSave={(values) => editor.save((client) => client.addItem(category.id, toItemBody(values)))}
              onSaved={close}
            />
          )}
        </MenuFormDialog>
      )}
    </li>
  );
}
