import type { ID } from "../types/types";

export type SheetType = "feral" | "creature";

export type RenameHandler = (
  id: ID,
  currentName: string,
  type: SheetType,
) => void;

export interface DeleteTarget {
  id: ID;
  name: string;
  type: SheetType;
}
