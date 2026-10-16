import { LogInIcon, StoreIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MembershipCardView } from "@/components/card/membership-card-view";
import { ClubMessage } from "@/components/club/club-message";
import { LoadingBlock } from "@/components/loading-block";
import { Button } from "@/components/ui/button";
import { getMembershipCard } from "@/lib/customer/data";
import { customerRoutes } from "@/lib/customer/routes";

export const metadata: Metadata = { title: "Tu tarjeta" };

export default function CardPage({ params }: PageProps<"/c/[slug]">) {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <CardContent params={params} />
    </Suspense>
  );
}

async function CardContent({ params }: Pick<PageProps<"/c/[slug]">, "params">) {
  const { slug } = await params;
  const lookup = await getMembershipCard(slug);

  if (lookup.status === "no-session") {
    return (
      <ClubMessage
        icon={LogInIcon}
        title="Iniciá sesión para ver tu tarjeta"
        text="Ingresá con el celular con el que te sumaste al club."
        action={
          <Button asChild size="lg" className="mt-2 h-11">
            <Link href={customerRoutes.login(customerRoutes.card(slug))}>Ingresar con mi celular</Link>
          </Button>
        }
      />
    );
  }
  if (lookup.status === "not-member") {
    return (
      <ClubMessage
        icon={StoreIcon}
        title="Todavía no sos parte de este club"
        text="Escaneá el código del local para sumarte."
      />
    );
  }
  return <MembershipCardView card={lookup.card} customer={lookup.customer} />;
}
