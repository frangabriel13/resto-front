import { AuthShell } from "@/components/auth/auth-shell";

export default function StaffAuthLayout({ children }: LayoutProps<"/panel">) {
  return <AuthShell>{children}</AuthShell>;
}
