"use client";

import { useId } from "react";
import { Field, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { menuTexts } from "@/lib/customer/menu";
import type { MenuLabel } from "@/lib/menu/types";
import type { MenuEditorState } from "./use-menu-editor";

const labels = Object.entries(menuTexts) as [MenuLabel, (typeof menuTexts)[MenuLabel]][];

export function MenuLabelField({ editor }: { editor: MenuEditorState }) {
  const id = useId();
  return (
    <RadioGroup
      aria-label="Nombre del botón"
      value={editor.menu.label}
      disabled={editor.readOnly || editor.pending}
      onValueChange={(label) => editor.run((client) => client.setLabel(label as MenuLabel))}
      className="sm:grid-cols-2"
    >
      {labels.map(([value, { button }]) => (
        <FieldLabel key={value} htmlFor={`${id}-${value}`}>
          <Field orientation="horizontal">
            <FieldTitle className="flex-1">{button}</FieldTitle>
            <RadioGroupItem value={value} id={`${id}-${value}`} />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
}
