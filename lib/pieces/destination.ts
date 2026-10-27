import { z } from "zod";
import type { components } from "@/lib/api/schema";
import { looksLikePhone } from "@/lib/customer/phone";
import { isGoogleReviewUrl } from "@/lib/merchants/fields";

type PieceDestination = components["schemas"]["PieceDestination"];
type PieceDestinationBody = components["schemas"]["PieceDestinationBody"];
export type DestinationType = PieceDestination["type"];

export const destinationOptions: { type: DestinationType; label: string; description: string }[] = [
  { type: "CLUB", label: "Club de premios", description: "Muestra el club del comercio." },
  { type: "GOOGLE_REVIEWS", label: "Reseñas de Google", description: "Abre la página para dejar una reseña." },
  { type: "INSTAGRAM", label: "Instagram", description: "Abre el perfil del comercio." },
  { type: "WHATSAPP", label: "WhatsApp", description: "Abre un chat con el comercio." },
];

export const destinationLabels = Object.fromEntries(
  destinationOptions.map((option) => [option.type, option.label]),
) as Record<DestinationType, string>;

// El dato que identifica el destino, para mostrar en la tarjeta de la pieza.
export function destinationDetail(destination: PieceDestination): string | null {
  switch (destination.type) {
    case "CLUB":
      return null;
    case "GOOGLE_REVIEWS":
      return destination.url;
    case "INSTAGRAM":
      return `@${destination.username}`;
    case "WHATSAPP":
      return destination.phone;
  }
}

// Mismo formato que la API: con o sin @, letras, números, puntos y guiones bajos.
const instagramUsername = /^@?[A-Za-z0-9._]{1,30}$/;

const destinationSchema = z
  .object({
    type: z.enum(["CLUB", "GOOGLE_REVIEWS", "INSTAGRAM", "WHATSAPP"]),
    url: z.string().trim().max(500, "Hasta 500 caracteres."),
    username: z.string().trim(),
    phone: z.string().trim(),
    message: z.string().trim().max(500, "Hasta 500 caracteres."),
  })
  .superRefine((values, ctx) => {
    const fail = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
    if (values.type === "GOOGLE_REVIEWS" && !isGoogleReviewUrl(values.url)) {
      fail("url", "Tiene que ser un link https de Google (por ejemplo, https://g.page/…).");
    }
    if (values.type === "INSTAGRAM" && !instagramUsername.test(values.username)) {
      fail("username", "Ingresá el usuario, por ejemplo @cafedelaesquina.");
    }
    if (values.type === "WHATSAPP" && !looksLikePhone(values.phone)) {
      fail("phone", "Ingresá un celular válido.");
    }
  });

// `destination` anidado como en la API, así sus errores (`destination.url`) caen en su campo.
export const pieceSchema = z.object({
  label: z.string().trim().min(1, "Ingresá un nombre.").max(60, "Hasta 60 caracteres."),
  destination: destinationSchema,
});

export type PieceValues = z.infer<typeof pieceSchema>;

// Los campos de los otros destinos quedan precargados por si se cambia de tipo;
// el de reseñas sugiere el link del comercio.
export function toPieceValues(
  piece: { label: string; destination: PieceDestination } | null,
  merchantReviewUrl: string | null,
): PieceValues {
  const destination = piece?.destination ?? { type: "CLUB" };
  return {
    label: piece?.label ?? "",
    destination: {
      type: destination.type,
      url: destination.type === "GOOGLE_REVIEWS" ? destination.url : (merchantReviewUrl ?? ""),
      username: destination.type === "INSTAGRAM" ? destination.username : "",
      phone: destination.type === "WHATSAPP" ? destination.phone : "",
      message: destination.type === "WHATSAPP" ? (destination.message ?? "") : "",
    },
  };
}

// Solo viajan los campos del destino elegido: la API rechaza los de otro.
export function toDestinationBody({ destination }: PieceValues): PieceDestinationBody {
  switch (destination.type) {
    case "CLUB":
      return { type: "CLUB" };
    case "GOOGLE_REVIEWS":
      return { type: "GOOGLE_REVIEWS", url: destination.url };
    case "INSTAGRAM":
      return { type: "INSTAGRAM", username: destination.username };
    case "WHATSAPP":
      return { type: "WHATSAPP", phone: destination.phone, message: destination.message || null };
  }
}
