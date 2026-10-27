import { MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappChatUrl } from "@/lib/admin/profile";

export function WhatsAppChatButton({ phone }: { phone: string }) {
  return (
    <Button asChild variant="outline" className="h-10 self-start">
      <a href={whatsappChatUrl(phone)} target="_blank" rel="noopener noreferrer">
        <MessageCircleIcon />
        Abrir WhatsApp
      </a>
    </Button>
  );
}
