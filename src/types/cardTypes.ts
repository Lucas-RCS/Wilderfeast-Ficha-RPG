import type { ID } from "../types/types";

export type SheetType = "feral" | "creature";
export interface DeleteTarget {
  id: ID;
  name: string;
  type: SheetType;
}
