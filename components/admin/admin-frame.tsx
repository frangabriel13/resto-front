import Image from "next/image";
import Link from "next/link";
import { AccountMenu } from "@/components/auth/account-menu";
import { adminRoutes } from "@/lib/admin/routes";
import { requireAdminSession } from "@/lib/admin/session";
import logoLateral from "@/public/logoLateral.png";

export async function AdminFrame({ children }: { children: React.ReactNode }) {
  const account = await requireAdminSession();

  return (
    <AdminShell
      account={
        <AccountMenu kind="admin" name={account.name} email={account.email} detail="Admin de FullSync" />
      }
    >
      {children}
    </AdminShell>
  );
}

export function AdminShell({
  account,
  children,
}: {
  account: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col border-t-4 border-brand">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4">
          <Link href={adminRoutes.merchants} className="flex items-center gap-2">
            <Image src={logoLateral} alt="Clubsy" priority className="h-auto w-28" />
            <span className="rounded-md bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
              Admin
            </span>
          </Link>
          <div className="flex-1" />
          {account}
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:py-8">{children}</main>
    </div>
  );
}
