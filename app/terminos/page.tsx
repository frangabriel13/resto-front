import { LegalPage, legalMetadata } from "@/components/legal/legal-page";
import { TermsContent } from "@/components/legal/terms-content";

export const metadata = legalMetadata("Términos y condiciones");

export default function TermsPage() {
  return (
    <LegalPage title="Términos y condiciones">
      <TermsContent />
    </LegalPage>
  );
}
