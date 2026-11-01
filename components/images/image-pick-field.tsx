"use client";

import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageFileButton } from "./image-file-button";
import { ImagePreview, type ImageVariant } from "./image-preview";

export type PickedImage = { file: File; url: string };

type ImagePickFieldProps = {
  label: string;
  description: string;
  variant: ImageVariant;
  value: PickedImage | null;
  disabled: boolean;
  onChange: (value: PickedImage | null) => void;
};

// En el alta: el comercio todavía no existe, así que la imagen se sube después de crearlo.
export function ImagePickField({ label, description, variant, value, disabled, onChange }: ImagePickFieldProps) {
  const [error, setError] = useState<string>();
  const url = value?.url;

  useEffect(() => {
    if (!url) return;
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      <ImagePreview url={url ?? null} alt={label} variant={variant} />
      <div className="flex flex-wrap gap-2">
        <ImageFileButton
          label={label}
          text={value ? "Cambiar" : "Elegir imagen"}
          disabled={disabled}
          onError={setError}
          onPick={(file) => {
            setError(undefined);
            onChange({ file, url: URL.createObjectURL(file) });
          }}
        />
        {value && (
          <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={() => onChange(null)}>
            <Trash2Icon />
            Sacar
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
