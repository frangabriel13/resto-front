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
    <ul className="flex flex-wrap justify-center gap-3">
      {socials.map(({ type, url }) => {
        const { label, paths } = socialIcons[type];
        return (
          <li key={type}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex size-11 items-center justify-center rounded-full border text-primary transition-colors hover:bg-muted"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="size-5"
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
  );
}
