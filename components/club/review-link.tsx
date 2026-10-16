import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Visible para todos, sin condicionarlo a ninguna valoración ni dar nada a cambio (regla 8).
export function ReviewLink({ url }: { url: string | null }) {
  if (!url) return null;
  return (
    <Button asChild variant="outline" className="h-11 w-full">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <StarIcon />
        Contanos qué te pareció en Google
      </a>
    </Button>
  );
}
