export const panelRoutes = {
  home: "/panel",
  scan: "/panel/escanear",
  customers: "/panel/clientes",
  activity: "/panel/actividad",
  reward: "/panel/premio",
  staff: "/panel/empleados",
  settings: "/panel/configuracion",
} as const;

export type PanelRoute = (typeof panelRoutes)[keyof typeof panelRoutes];

export const panelCustomerRoute = (membershipId: string) => `${panelRoutes.customers}/${membershipId}`;

export const staffRoutes = {
  login: "/panel/ingresar",
  changePassword: "/panel/cambiar-contrasena",
  selectMerchant: "/panel/elegir-comercio",
  home: panelRoutes.home,
} as const;

export type StaffRoute = (typeof staffRoutes)[keyof typeof staffRoutes];

export function isPanelRouteActive(pathname: string, route: PanelRoute): boolean {
  if (route === panelRoutes.home) return pathname === route;
  return pathname === route || pathname.startsWith(`${route}/`);
}
