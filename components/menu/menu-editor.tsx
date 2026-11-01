"use client";

import { PlusIcon } from "lucide-react";
import { FormAlert } from "@/components/form/form-alert";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { hasVisibleItems } from "@/lib/menu/form";
import type { Menu } from "@/lib/menu/types";
import { CategoryForm } from "./category-form";
import { MenuCategoryCard } from "./menu-category-card";
import { MenuFormDialog } from "./menu-form-dialog";
import { MenuLabelField } from "./menu-label-field";
import { useMenuEditor } from "./use-menu-editor";

type MenuEditorProps = {
  menu: Menu;
  // Con `merchantId` edita el admin; sin él, el dueño de la sesión.
  merchantId?: string;
  readOnly: boolean;
  readOnlyNotice: string;
};

export function MenuEditor({ menu: initial, merchantId, readOnly, readOnlyNotice }: MenuEditorProps) {
  const editor = useMenuEditor(initial, merchantId, readOnly);
  const { menu } = editor;

  return (
    <div className="flex flex-col gap-6">
      {readOnly && <p className="rounded-lg border bg-muted/40 p-3 text-sm">{readOnlyNotice}</p>}
      {!readOnly && !hasVisibleItems(menu) && (
        <p className="rounded-lg border bg-muted/40 p-3 text-sm">
          Todavía no hay nada visible: el botón no aparece en la página hasta que haya al menos un ítem visible en una
          categoría visible.
        </p>
      )}

      <SectionCard title="Nombre del botón" description="Cómo se llama el botón en la página.">
        <MenuLabelField editor={editor} />
      </SectionCard>

      <section aria-labelledby="carta-categorias" className="flex flex-col gap-4">
        <h2 id="carta-categorias" className="font-heading text-xl font-semibold text-primary">
          Categorías e ítems
        </h2>
        {menu.categories.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {menu.categories.map((category, index) => (
              <MenuCategoryCard
                key={category.id}
                category={category}
                first={index === 0}
                last={index === menu.categories.length - 1}
                editor={editor}
              />
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
            Todavía no hay categorías.
          </p>
        )}
        {!readOnly && (
          <MenuFormDialog
            title="Nueva categoría"
            trigger={
              <Button type="button" className="h-10 self-start" disabled={editor.pending}>
                <PlusIcon />
                Agregar categoría
              </Button>
            }
          >
            {(close) => (
              <CategoryForm
                name=""
                submitLabel="Agregar categoría"
                onSave={({ name }) => editor.save((client) => client.addCategory({ name }))}
                onSaved={close}
              />
            )}
          </MenuFormDialog>
        )}
      </section>

      {/* Fijo: la acción que falló puede estar muy abajo en una carta larga. */}
      {editor.error && (
        <div className="fixed inset-x-4 bottom-24 z-30 mx-auto max-w-md bg-background md:bottom-6">
          <FormAlert message={editor.error} />
        </div>
      )}
    </div>
  );
}
