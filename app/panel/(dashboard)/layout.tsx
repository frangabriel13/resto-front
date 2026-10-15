import { Suspense } from "react";
import { PanelFrame } from "@/components/panel/panel-frame";
import { PanelSkeleton } from "@/components/panel/panel-skeleton";

export default function PanelLayout({ children }: LayoutProps<"/panel">) {
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <PanelFrame>{children}</PanelFrame>
    </Suspense>
  );
}
