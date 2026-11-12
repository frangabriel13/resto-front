import type { ClubPiece } from "@/lib/customer/types";

type SocialType = ClubPiece["page"]["socials"][number]["type"];

// lucide no trae marcas: los trazos son los de Tabler Icons (MIT).
const socialIcons: Record<SocialType, { label: string; paths: string[] }> = {
  INSTAGRAM: {
    label: "Instagram",
    paths: [
      "M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z",
      "M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0",
      "M16.5 7.5v.01",
    ],
  },
  TIKTOK: {
    label: "TikTok",
    paths: [
      "M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z",
    ],
  },
  WHATSAPP: {
    label: "WhatsApp",
    paths: [
      "M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9",
      "M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1",
    ],
  },
  FACEBOOK: {
    label: "Facebook",
    paths: ["M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"],
  },
};

export function SocialLinks({ socials }: { socials: ClubPiece["page"]["socials"] }) {
  if (socials.length === 0) return null;
  return (
    <section aria-labelledby="seguinos" className="flex flex-col items-center gap-3">
      <h2 id="seguinos" className="text-sm font-semibold text-foreground">
        Seguinos
      </h2>
      <ul className="flex flex-wrap justify-center gap-3.5">
        {socials.map(({ type, url }) => {
          const { label, paths } = socialIcons[type];
          return (
            <li key={type}>
              {/* Como los íconos de la tarjeta: el principal (`ink`) suave de fondo y lleno en el ícono. */}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-11 items-center justify-center rounded-full bg-ink/8 text-ink transition outline-none hover:bg-ink/12 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-94 active:bg-ink/16"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="size-6.5"
                >
                  {paths.map((d) => (
                    <path key={d} d={d} />
                  ))}
                </svg>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
