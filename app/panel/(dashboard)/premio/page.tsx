import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/loading-block";
import { PageHeader } from "@/components/panel/page-header";
import { RewardHistory } from "@/components/rewards/reward-history";
import { RewardRuleForm } from "@/components/rewards/reward-rule-form";
import { StampPreview } from "@/components/rewards/stamp-preview";
import { SectionCard } from "@/components/section-card";
import { getRewardRules } from "@/lib/rewards/data";
import { requireOwnerSession } from "@/lib/staff/session";

export const metadata: Metadata = { title: "Premio" };

export default function RewardPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <PageHeader
        title="Premio"
        description="Cuántos sellos hacen falta y qué se lleva el cliente."
      />
      <Suspense fallback={<LoadingBlock />}>
        <RewardContent />
      </Suspense>
    </div>
  );
}

async function RewardContent() {
  const { merchant } = await requireOwnerSession();
  const rules = await getRewardRules();
  const activeRule = rules.find((rule) => rule.active);
  const editable = merchant.status === "DRAFT" || merchant.status === "ACTIVE";

  return (
    <>
      {editable ? (
        <SectionCard
          title={activeRule ? "Cambiar el premio" : "Configurá el premio"}
          description={
            activeRule
              ? "El cambio no afecta las tarjetas que tus clientes ya empezaron."
              : "Es lo primero que ven tus clientes al sumarse al club."
          }
        >
          <RewardRuleForm activeRule={activeRule} />
        </SectionCard>
      ) : (
        <SectionCard
          title="Premio actual"
          description="Con el club pausado o finalizado, el premio no se puede cambiar."
        >
          {activeRule ? (
            <div className="flex flex-col gap-3">
              <StampPreview
                stampsRequired={activeRule.stampsRequired}
                rewardDescription={activeRule.rewardDescription}
              />
              {activeRule.conditions && (
                <p className="text-sm text-muted-foreground">{activeRule.conditions}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">El club no tiene un premio configurado.</p>
          )}
        </SectionCard>
      )}

      {rules.length > 0 && (
        <SectionCard title="Historial" description="Cada cambio crea una versión nueva.">
          <RewardHistory rules={rules} />
        </SectionCard>
      )}
    </>
  );
}
