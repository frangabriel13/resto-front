import { callApi, type ApiResult } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import type { CategoryBody, ItemBody, Menu, MenuLabel, MoveDirection, NewCategoryBody, NewItemBody } from "./types";

type Result = Promise<ApiResult<Menu>>;

// Las rutas de la carta son las mismas para el dueño y para el admin; todas devuelven la carta actualizada.
export type MenuClient = {
  setLabel: (label: MenuLabel) => Result;
  addCategory: (body: NewCategoryBody) => Result;
  updateCategory: (categoryId: string, body: CategoryBody) => Result;
  removeCategory: (categoryId: string) => Result;
  moveCategory: (categoryId: string, direction: MoveDirection) => Result;
  addItem: (categoryId: string, body: NewItemBody) => Result;
  updateItem: (itemId: string, body: ItemBody) => Result;
  removeItem: (itemId: string) => Result;
  moveItem: (itemId: string, direction: MoveDirection) => Result;
};

export const panelMenuClient: MenuClient = {
  setLabel: (label) => callApi(api.PUT("/panel/menu/label", { body: { label } })),
  addCategory: (body) => callApi(api.POST("/panel/menu/categories", { body })),
  updateCategory: (categoryId, body) =>
    callApi(api.PATCH("/panel/menu/categories/{categoryId}", { params: { path: { categoryId } }, body })),
  removeCategory: (categoryId) =>
    callApi(api.DELETE("/panel/menu/categories/{categoryId}", { params: { path: { categoryId } } })),
  moveCategory: (categoryId, direction) =>
    callApi(
      api.POST("/panel/menu/categories/{categoryId}/move", {
        params: { path: { categoryId } },
        body: { direction },
      }),
    ),
  addItem: (categoryId, body) =>
    callApi(api.POST("/panel/menu/categories/{categoryId}/items", { params: { path: { categoryId } }, body })),
  updateItem: (itemId, body) =>
    callApi(api.PATCH("/panel/menu/items/{itemId}", { params: { path: { itemId } }, body })),
  removeItem: (itemId) => callApi(api.DELETE("/panel/menu/items/{itemId}", { params: { path: { itemId } } })),
  moveItem: (itemId, direction) =>
    callApi(api.POST("/panel/menu/items/{itemId}/move", { params: { path: { itemId } }, body: { direction } })),
};

export function adminMenuClient(merchantId: string): MenuClient {
  return {
    setLabel: (label) =>
      callApi(
        api.PUT("/admin/merchants/{merchantId}/menu/label", { params: { path: { merchantId } }, body: { label } }),
      ),
    addCategory: (body) =>
      callApi(api.POST("/admin/merchants/{merchantId}/menu/categories", { params: { path: { merchantId } }, body })),
    updateCategory: (categoryId, body) =>
      callApi(
        api.PATCH("/admin/merchants/{merchantId}/menu/categories/{categoryId}", {
          params: { path: { merchantId, categoryId } },
          body,
        }),
      ),
    removeCategory: (categoryId) =>
      callApi(
        api.DELETE("/admin/merchants/{merchantId}/menu/categories/{categoryId}", {
          params: { path: { merchantId, categoryId } },
        }),
      ),
    moveCategory: (categoryId, direction) =>
      callApi(
        api.POST("/admin/merchants/{merchantId}/menu/categories/{categoryId}/move", {
          params: { path: { merchantId, categoryId } },
          body: { direction },
        }),
      ),
    addItem: (categoryId, body) =>
      callApi(
        api.POST("/admin/merchants/{merchantId}/menu/categories/{categoryId}/items", {
          params: { path: { merchantId, categoryId } },
          body,
        }),
      ),
    updateItem: (itemId, body) =>
      callApi(
        api.PATCH("/admin/merchants/{merchantId}/menu/items/{itemId}", {
          params: { path: { merchantId, itemId } },
          body,
        }),
      ),
    removeItem: (itemId) =>
      callApi(
        api.DELETE("/admin/merchants/{merchantId}/menu/items/{itemId}", {
          params: { path: { merchantId, itemId } },
        }),
      ),
    moveItem: (itemId, direction) =>
      callApi(
        api.POST("/admin/merchants/{merchantId}/menu/items/{itemId}/move", {
          params: { path: { merchantId, itemId } },
          body: { direction },
        }),
      ),
  };
}
