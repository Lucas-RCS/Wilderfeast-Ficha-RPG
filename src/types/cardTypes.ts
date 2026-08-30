import type { ID } from "../types/types";

export type SheetType = "feral" | "creature";
export interface DeleteTarget {
  id: ID;
  type: SheetType;
}
