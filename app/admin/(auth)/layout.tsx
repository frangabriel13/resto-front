import { AuthShell } from "@/components/auth/auth-shell";

export default function AdminAuthLayout({ children }: LayoutProps<"/admin">) {
  return <AuthShell>{children}</AuthShell>;
}
