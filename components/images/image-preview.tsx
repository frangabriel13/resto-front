import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type ImageVariant = "cover" | "logo";

const frames: Record<ImageVariant, string> = {
  cover: "aspect-2/1 w-full",
  logo: "size-24",
};

export function ImagePreview({ url, alt, variant }: { url: string | null; alt: string; variant: ImageVariant }) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg border bg-muted", frames[variant])}>
      {url ? (
        // `unoptimized`: la imagen del bucket o la que se acaba de elegir, tal cual.
        <Image
          src={url}
          alt={alt}
          fill
          unoptimized
          className={variant === "cover" ? "object-cover" : "bg-white object-contain p-1"}
        />
      ) : (
        <span className="flex size-full items-center justify-center text-muted-foreground">
          <ImageIcon className="size-6" />
        </span>
      )}
    </div>
  );
}
