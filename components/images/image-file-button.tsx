"use client";

import { UploadIcon } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { imageAccept, imageFileError } from "@/lib/images/image-file";

type ImageFileButtonProps = {
  label: string;
  text: string;
  disabled: boolean;
  pending?: boolean;
  onPick: (file: File) => void;
  onError: (message: string) => void;
};

// Avisa enseguida si el archivo no sirve, antes de mandarlo a ningún lado.
export function ImageFileButton({ label, text, disabled, pending, onPick, onError }: ImageFileButtonProps) {
  const input = useRef<HTMLInputElement>(null);

  function pick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Vaciarlo deja elegir el mismo archivo otra vez, por ejemplo después de un error.
    event.target.value = "";
    if (!file) return;
    const error = imageFileError(file);
    if (error) onError(error);
    else onPick(file);
  }

  return (
    <>
      <input
        ref={input}
        type="file"
        accept={imageAccept}
        aria-label={label}
        tabIndex={-1}
        disabled={disabled}
        onChange={pick}
        className="sr-only"
      />
      <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={() => input.current?.click()}>
        {pending ? <Spinner /> : <UploadIcon />}
        {text}
      </Button>
    </>
  );
}
