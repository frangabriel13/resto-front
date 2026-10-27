"use client";

import { useId } from "react";
import { Controller, type Control } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { destinationOptions, type PieceValues } from "@/lib/pieces/destination";
import { destinationIcons } from "./destination-icons";

export function DestinationTypeField({ control }: { control: Control<PieceValues> }) {
  const id = useId();
  return (
    <Controller
      control={control}
      name="destination.type"
      render={({ field }) => (
        <FieldSet>
          <FieldLegend variant="label">Al escanearla</FieldLegend>
          <RadioGroup
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            className="grid-cols-1 sm:grid-cols-2"
          >
            {destinationOptions.map(({ type, label, description }) => {
              const Icon = destinationIcons[type];
              return (
                <FieldLabel key={type} htmlFor={`${id}-${type}`}>
                  <Field orientation="horizontal">
                    <Icon className="mt-0.5 size-4 shrink-0 text-brand" />
                    <FieldContent>
                      <FieldTitle>{label}</FieldTitle>
                      <FieldDescription>{description}</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value={type} id={`${id}-${type}`} />
                  </Field>
                </FieldLabel>
              );
            })}
          </RadioGroup>
        </FieldSet>
      )}
    />
  );
}
