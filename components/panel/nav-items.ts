import {
  ActivityIcon,
  GiftIcon,
  HouseIcon,
  ScanLineIcon,
  SettingsIcon,
  UserCogIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import type { StaffMerchant } from "@/lib/staff/access";
import { panelRoutes, type PanelRoute } from "@/lib/staff/routes";

export type NavItem = { href: PanelRoute; label: string; icon: LucideIcon };

export const mainNavItems: NavItem[] = [
  { href: panelRoutes.home, label: "Inicio", icon: HouseIcon },
  { href: panelRoutes.scan, label: "Escanear", icon: ScanLineIcon },
  { href: panelRoutes.customers, label: "Clientes", icon: UsersIcon },
  { href: panelRoutes.activity, label: "Actividad", icon: ActivityIcon },
];

const ownerNavItems: NavItem[] = [
  { href: panelRoutes.reward, label: "Premio", icon: GiftIcon },
  { href: panelRoutes.staff, label: "Empleados", icon: UserCogIcon },
  { href: panelRoutes.settings, label: "Configuración", icon: SettingsIcon },
];

export function adminNavItems(role: StaffMerchant["role"]): NavItem[] {
  return role === "OWNER" ? ownerNavItems : [];
}
