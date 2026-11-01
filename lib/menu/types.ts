import type { components } from "@/lib/api/schema";

export type Menu = components["schemas"]["Menu"];
export type MenuLabel = Menu["label"];
export type MenuCategory = Menu["categories"][number];
export type MenuItem = MenuCategory["items"][number];
export type MoveDirection = components["schemas"]["MoveMenuBody"]["direction"];
export type CategoryBody = components["schemas"]["UpdateMenuCategoryBody"];
export type NewCategoryBody = components["schemas"]["CreateMenuCategoryBody"];
export type ItemBody = components["schemas"]["UpdateMenuItemBody"];
export type NewItemBody = components["schemas"]["CreateMenuItemBody"];
