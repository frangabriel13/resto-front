import { AtSignIcon, MessageCircleIcon, StarIcon, TicketIcon, type LucideIcon } from "lucide-react";
import type { DestinationType } from "@/lib/pieces/destination";

export const destinationIcons: Record<DestinationType, LucideIcon> = {
  CLUB: TicketIcon,
  GOOGLE_REVIEWS: StarIcon,
  INSTAGRAM: AtSignIcon,
  WHATSAPP: MessageCircleIcon,
};
