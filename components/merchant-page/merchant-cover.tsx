import Image from "next/image";

// La portada a todo el ancho o, sin ella, una franja del color del comercio. La tarjeta del menú se
// monta encima de su borde de abajo.
export function MerchantCover({ coverUrl }: { coverUrl: string | null }) {
  if (!coverUrl) return <div className="h-31 w-full shrink-0 bg-primary" />;
  return (
    <div className="relative aspect-16/9 max-h-80 w-full shrink-0 bg-muted">
      {/* `unoptimized`: se sirve tal cual desde el bucket de imágenes. */}
      <Image src={coverUrl} alt="" fill unoptimized loading="eager" className="object-cover" />
    </div>
  );
}
