import type { ICreature, IFeral } from "../types/types";

type SheetType = "creature" | "feral";

interface SheetExport<T> {
  format: "wilderfeast-sheet";
  version: 1;
  type: SheetType;
  exportedAt: string;
  data: T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSheetData(value: unknown, type: SheetType): boolean {
  if (!isRecord(value) || typeof value.name !== "string") return false;

  return type === "feral" ? "utensil" in value : "lineage" in value;
}

export function exportSheet<T>(type: SheetType, data: T, name: string): void {
  const payload: SheetExport<T> = {
    format: "wilderfeast-sheet",
    version: 1,
    type,
    exportedAt: new Date().toISOString(),
    data,
  };
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");

  link.href = url;
  link.download = `${name.trim() || type}-${type}-wilderfeast.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function importSheet(
  file: File,
  expectedType: "feral",
): Promise<IFeral>;
export async function importSheet(
  file: File,
  expectedType: "creature",
): Promise<ICreature>;
export async function importSheet(
  file: File,
  expectedType: SheetType,
): Promise<IFeral | ICreature> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new Error("O arquivo não contém um JSON válido.");
  }

  const data =
    isRecord(parsed) && parsed.format === "wilderfeast-sheet"
      ? parsed.type === expectedType && parsed.version === 1
        ? parsed.data
        : null
      : parsed;

  if (!isSheetData(data, expectedType)) {
    throw new Error(
      `Selecione um arquivo JSON de ${expectedType === "feral" ? "Feral" : "Criatura"} válido.`,
    );
  }

  return data as IFeral | ICreature;
}
