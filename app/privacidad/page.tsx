import { LegalPage, legalMetadata } from "@/components/legal/legal-page";
import { PrivacyContent } from "@/components/legal/privacy-content";

export const metadata = legalMetadata("Política de privacidad");

export default function PrivacyPage() {
  return (
    <LegalPage title="Política de privacidad">
      <PrivacyContent />
    </LegalPage>
  );
}
