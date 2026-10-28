"use client";

import { ExternalLinkIcon, MapPinIcon } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parsePlaceId, placeIdFinderUrl, reviewUrlFromPlaceId } from "@/lib/merchants/place-id";

export function PlaceIdBuilder({ current, onUse }: { current: string; onUse: (url: string) => void }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const placeId = parsePlaceId(input);
  const built = placeId ? reviewUrlFromPlaceId(placeId) : null;

  function use() {
    if (!built) return;
    onUse(built);
    setOpen(false);
  }

  if (!open) {
    return (
      <Button
        type="button"
        variant="link"
        className="h-auto self-start p-0"
        onClick={() => {
          setInput(parsePlaceId(current) ?? "");
          setOpen(true);
        }}
      >
        <MapPinIcon />
        Armar el link con el Place ID
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor={id}>Place ID</Label>
        <Input
          id={id}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          // Enter adentro del formulario lo mandaría: acá usa el link armado.
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            use();
          }}
          placeholder="ChIJ…"
          autoCapitalize="none"
          autoComplete="off"
          spellCheck={false}
          className="h-11 font-mono"
          aria-invalid={input.trim() !== "" && !placeId}
        />
        <p className="text-sm text-muted-foreground">
          Buscá el comercio en el{" "}
          <a
            href={placeIdFinderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            buscador de Place ID de Google
          </a>{" "}
          y copiá el código que aparece (suele empezar con ChIJ).
        </p>
        {input.trim() !== "" && !placeId && (
          <p className="text-sm text-destructive">
            No parece un Place ID: son letras, números, guiones y guiones bajos, sin espacios.
          </p>
        )}
      </div>

      {built && (
        <div className="flex flex-col gap-2">
          <code className="rounded-md bg-background px-2 py-1.5 text-xs break-all">{built}</code>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={use}>
              Usar este link
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={built} target="_blank" rel="noopener noreferrer">
                <ExternalLinkIcon />
                Probar link
              </a>
            </Button>
          </div>
        </div>
      )}

      <Button type="button" variant="ghost" size="sm" className="self-start" onClick={() => setOpen(false)}>
        Cancelar
      </Button>
    </div>
  );
}
