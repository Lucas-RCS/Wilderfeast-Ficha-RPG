import {
  FeralSheet,
  CreatureSheet,
  CustomUtensil,
  FeralType,
  CreatureType,
} from "../types";
import { DEFAULT_NEW_CHARACTER } from "../data/wilderfeastData";
import {
  createDefaultCreature,
  calculateEffectiveStats,
} from "../data/creatureData";

const FERAL_STORE_KEY = "wilderfeast_ferals";
const CREATURE_STORE_KEY = "wilderfeast_creatures";

interface FeralStore {
  sheets: Record<string, FeralSheet>;
  customUtensils: CustomUtensil[];
}

interface CreatureStore {
  sheets: Record<string, CreatureSheet>;
}

// ==========================================
// HELPERS DE BAIXO NÍVEL
// ==========================================

export function getItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.error(`Falha ao ler a chave "${key}" do localStorage:`, err);
    return null;
  }
}

export function setItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.error(`Falha ao gravar a chave "${key}" no localStorage:`, err);
  }
}

export function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Falha ao remover a chave "${key}" do localStorage:`, err);
  }
}

export function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error("Falha ao interpretar JSON do storage:", err);
    return null;
  }
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function downloadJSON(data: unknown, filename: string): void {
  if (typeof document === "undefined") return;
  try {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(data, null, 2));
    const anchor = document.createElement("a");
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", filename);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  } catch (err) {
    console.error(`Falha ao baixar "${filename}":`, err);
  }
}

// ==========================================
// LEITURA/ESCRITA DOS DOIS BLOCOS
// ==========================================

function readFeralStore(): FeralStore {
  const raw = safeParseJSON<Partial<FeralStore>>(getItem(FERAL_STORE_KEY));
  return {
    sheets: raw?.sheets && typeof raw.sheets === "object" ? raw.sheets : {},
    customUtensils: Array.isArray(raw?.customUtensils)
      ? raw!.customUtensils
      : [],
  };
}

function writeFeralStore(store: FeralStore): void {
  setItem(FERAL_STORE_KEY, JSON.stringify(store));
}

function readCreatureStore(): CreatureStore {
  const raw = safeParseJSON<Partial<CreatureStore>>(
    getItem(CREATURE_STORE_KEY),
  );
  return {
    sheets: raw?.sheets && typeof raw.sheets === "object" ? raw.sheets : {},
  };
}

function writeCreatureStore(store: CreatureStore): void {
  setItem(CREATURE_STORE_KEY, JSON.stringify(store));
}

// ==========================================
// SANITIZERS
// Garantem que qualquer objeto vindo do storage (ou de um import)
// tenha o formato completo esperado pelo app, preenchendo campos
// ausentes com os defaults.
// ==========================================

function sanitizeCharacter(data: any): FeralSheet {
  const base = DEFAULT_NEW_CHARACTER;
  if (!data || typeof data !== "object") {
    return createNewCharacter();
  }

  const rawIdentity =
    data.identity && typeof data.identity === "object" ? data.identity : {};
  const rawVigor =
    data.vigor && typeof data.vigor === "object" ? data.vigor : {};
  const rawUtensil =
    data.utensil && typeof data.utensil === "object" ? data.utensil : {};
  const rawStyles =
    data.styles && typeof data.styles === "object" ? data.styles : {};
  const rawSkills =
    data.skills && typeof data.skills === "object" ? data.skills : {};
  const rawPackState =
    data.packState && typeof data.packState === "object" ? data.packState : {};
  const rawPersonality =
    data.personality && typeof data.personality === "object"
      ? data.personality
      : {};
  const rawFood = data.food && typeof data.food === "object" ? data.food : {};
  const rawOrigin =
    data.origin && typeof data.origin === "object" ? data.origin : {};
  const rawConnection =
    data.connection && typeof data.connection === "object"
      ? data.connection
      : {};

  return {
    ...base,
    ...data,
    id: data.id || generateId("feral"),
    identity: {
      ...base.identity,
      ...rawIdentity,
      name: rawIdentity.name ?? base.identity.name,
      pronouns: rawIdentity.pronouns ?? base.identity.pronouns,
      specialty: rawIdentity.specialty ?? base.identity.specialty,
      packName: rawIdentity.packName ?? base.identity.packName,
      packArchetype: rawIdentity.packArchetype ?? base.identity.packArchetype,
      appearance: rawIdentity.appearance ?? base.identity.appearance,
      denDescription:
        rawIdentity.denDescription ?? base.identity.denDescription,
      notes: rawIdentity.notes ?? base.identity.notes,
    },
    vigor: {
      current: typeof rawVigor.current === "number" ? rawVigor.current : 20,
      max: typeof rawVigor.max === "number" ? rawVigor.max : 20,
    },
    utensil: {
      ...base.utensil,
      ...rawUtensil,
      type: rawUtensil.type || base.utensil.type,
      customName: rawUtensil.customName || base.utensil.customName,
      reach: typeof rawUtensil.reach === "number" ? rawUtensil.reach : 1,
      currentDurability:
        typeof rawUtensil.currentDurability === "number"
          ? rawUtensil.currentDurability
          : 20,
      maxDurability:
        typeof rawUtensil.maxDurability === "number"
          ? rawUtensil.maxDurability
          : 20,
    },
    styles: {
      ...base.styles,
      ...rawStyles,
    },
    skills: {
      ...base.skills,
      ...rawSkills,
    },
    techniques: Array.isArray(data.techniques)
      ? data.techniques
      : base.techniques || [],
    traits: Array.isArray(data.traits) ? data.traits : base.traits || [],
    conditions: Array.isArray(data.conditions) ? data.conditions : [],
    familiarBeasts: Array.isArray(data.familiarBeasts)
      ? data.familiarBeasts
      : [],
    personality: {
      ...base.personality,
      ...rawPersonality,
    },
    food: {
      ...base.food,
      ...rawFood,
    },
    origin: {
      ...base.origin,
      ...rawOrigin,
    },
    connection: {
      ...base.connection,
      ...rawConnection,
    },
    feastHistory: Array.isArray(data.feastHistory) ? data.feastHistory : [],
    notes: Array.isArray(data.notes) ? data.notes : [],
    notesList: Array.isArray(data.notesList)
      ? data.notesList
      : base.notesList || [],
    packState: {
      harmony:
        typeof rawPackState.harmony === "number" ? rawPackState.harmony : 3,
      maxHarmony:
        typeof rawPackState.maxHarmony === "number"
          ? rawPackState.maxHarmony
          : 6,
      currentPernada:
        typeof rawPackState.currentPernada === "number"
          ? rawPackState.currentPernada
          : 1,
      currentTerrain: rawPackState.currentTerrain || "Chão",
    },
    lastSaved: data.lastSaved || new Date().toISOString(),
  };
}

function sanitizeCreature(data: any): CreatureSheet {
  const name = data?.name || "Nova Criatura";
  const lineage = data?.lineage || "Molheiro";
  const stage = data?.stage || "Adulto";
  const base = createDefaultCreature(name, lineage, stage);
  if (!data || typeof data !== "object") {
    return base;
  }
  return {
    ...base,
    ...data,
    id: data.id || generateId("creature"),
    name: data.name || base.name,
    lineage: data.lineage || base.lineage,
    stage: data.stage || base.stage,
    vigor: {
      current:
        typeof data.vigor?.current === "number"
          ? data.vigor.current
          : (base.vigor?.current ?? 30),
    },
    baseStyles: {
      ...base.baseStyles,
      ...(data.baseStyles || {}),
    },
    skills: {
      ...base.skills,
      ...(data.skills || {}),
    },
    parts: Array.isArray(data.parts) ? data.parts : base.parts,
    traits: Array.isArray(data.traits) ? data.traits : base.traits,
    additionalTraits: Array.isArray(data.additionalTraits)
      ? data.additionalTraits
      : [],
    specialActions: Array.isArray(data.specialActions)
      ? data.specialActions
      : [],
    diet: {
      ...base.diet,
      ...(data.diet || {}),
    },
    habitat: {
      ...base.habitat,
      ...(data.habitat || {}),
    },
    behavior: {
      ...base.behavior,
      ...(data.behavior || {}),
    },
    conditions: Array.isArray(data.conditions) ? data.conditions : [],
    lastSaved: data.lastSaved || new Date().toISOString(),
  };
}

// ==========================================
// FERAL FACTORY (criação de um personagem em branco)
// ==========================================

export function createNewCharacter(
  name = "",
  pronouns = "",
  specialty = "Açougueiro",
  utensil = "Cutelo",
): FeralSheet {
  return {
    ...DEFAULT_NEW_CHARACTER,
    id: generateId("feral"),
    lastSaved: new Date().toISOString(),
    identity: {
      ...DEFAULT_NEW_CHARACTER.identity,
      name,
      pronouns,
      specialty,
      notes: "",
    },
    utensil: {
      ...DEFAULT_NEW_CHARACTER.utensil,
      type: utensil,
      customName: `${utensil}`,
      reach: 1,
      currentDurability: 20,
      maxDurability: 20,
    },
    techniques: [],
    traits: [
      {
        id: "trait-brio",
        name: "BRIO",
        level: 1,
        cost: "Custo: 1 Sucesso",
        description: "Aumente o resultado do Dado de Ação [A] em 1.",
        isStandard: true,
      },
      {
        id: "trait-tino",
        name: "TINO",
        level: 1,
        cost: "Custo: 1 Sucesso",
        description: "Estabeleça um detalhe relevante sobre a situação.",
        isStandard: true,
      },
    ],
    conditions: [],
    familiarBeasts: [],
    notes: [],
    packState: {
      harmony: 3,
      maxHarmony: 6,
      currentPernada: 1,
      currentTerrain: "Chão",
    },
  };
}

interface SheetStoreConfig<
  TSheet extends { id: string; lastSaved: string },
  TSummary extends { id: string },
> {
  idPrefix: string;
  copySuffix: string;
  fileLabel: string;

  sanitize: (data: any) => TSheet;
  toSummary: (sheet: TSheet) => TSummary;

  /** Usado apenas na primeiríssima vez que o storage é acessado. */
  makeSeed: () => TSheet;
  /** Usado quando uma ficha é aberta por um id que ainda não existe. */
  makeBlank: () => TSheet;

  getName: (sheet: TSheet) => string;
  setName: (sheet: TSheet, name: string) => void;

  readSheets: () => Record<string, TSheet>;
  writeSheets: (sheets: Record<string, TSheet>) => void;
}

function createSheetStore<
  TSheet extends { id: string; lastSaved: string },
  TSummary extends { id: string },
>(config: SheetStoreConfig<TSheet, TSummary>) {
  function loadAllSummaries(): TSummary[] {
    let sheets = config.readSheets();

    return Object.values(sheets)
      .sort((a, b) => (b.lastSaved || "").localeCompare(a.lastSaved || ""))
      .map(config.toSummary);
  }

  function loadSheet(id: string): TSheet {
    const sheets = config.readSheets();
    const found = sheets[id];
    if (found) return config.sanitize(found);

    const blank = config.makeBlank();
    if (id) blank.id = id;
    saveSheet(blank);
    return blank;
  }

  function saveSheet(sheet: TSheet): TSheet {
    const sanitized = config.sanitize(sheet);
    const updated: TSheet = {
      ...sanitized,
      lastSaved: new Date().toISOString(),
    };

    const sheets = config.readSheets();
    sheets[updated.id] = updated;
    config.writeSheets(sheets);

    return updated;
  }

  function deleteSheet(id: string): void {
    const sheets = config.readSheets();
    if (!(id in sheets)) return;
    delete sheets[id];
    config.writeSheets(sheets);
  }

  function duplicateSheet(id: string): TSheet | null {
    const sheets = config.readSheets();
    const original = sheets[id];
    if (!original) return null;

    const copy = config.sanitize(JSON.parse(JSON.stringify(original)));
    copy.id = generateId(config.idPrefix);
    copy.lastSaved = new Date().toISOString();
    config.setName(copy, `${config.getName(original)}${config.copySuffix}`);

    saveSheet(copy);
    return copy;
  }

  function renameSheet(id: string, newName: string): void {
    const sheets = config.readSheets();
    const sheet = sheets[id];
    if (!sheet) return;
    config.setName(sheet, newName);
    saveSheet(sheet);
  }

  function exportAsJSON(sheet: TSheet): void {
    if (!sheet) return;
    const sanitized = config.sanitize(sheet);
    const safeName = config
      .getName(sanitized)
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, "_");
    downloadJSON(sanitized, `wilderfeast_${config.fileLabel}_${safeName}.json`);
  }

  function importFromJSON(jsonString: string): TSheet | null {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== "object") return null;

      const sanitized = config.sanitize(parsed);
      sanitized.id = generateId(config.idPrefix);
      sanitized.lastSaved = new Date().toISOString();

      saveSheet(sanitized);
      return sanitized;
    } catch (err) {
      console.error(`Falha ao importar JSON de ${config.fileLabel}:`, err);
      return null;
    }
  }

  return {
    loadAllSummaries,
    loadSheet,
    saveSheet,
    deleteSheet,
    duplicateSheet,
    renameSheet,
    exportAsJSON,
    importFromJSON,
  };
}

// ==========================================
// FERAL SHEETS (store + API pública)
// ==========================================

const feralStore = createSheetStore<FeralSheet, FeralType>({
  idPrefix: "feral",
  copySuffix: " (Cópia)",
  fileLabel: "feral",

  sanitize: sanitizeCharacter,

  toSummary: (sheet) => ({
    id: sheet.id,
    name: sheet.identity?.name || "Feral Sem Nome",
    image: sheet.identity?.image || "",
    specialty: sheet.identity?.specialty || "Açougueiro",
    utensil: sheet.utensil?.customName || sheet.utensil?.type || "Cutelo",
    lastSaved: sheet.lastSaved,
    vigorCurrent: sheet.vigor?.current ?? 20,
    vigorMax: sheet.vigor?.max ?? 20,
    pronouns: sheet.identity?.pronouns || "",
  }),

  makeSeed: () =>
    createNewCharacter("Feral", "ele/dele", "Açougueiro", "Cutelo"),

  makeBlank: () => createNewCharacter(),

  getName: (sheet) => sheet.identity?.name || "Feral Sem Nome",
  setName: (sheet, name) => {
    if (!sheet.identity) {
      sheet.identity = { ...DEFAULT_NEW_CHARACTER.identity };
    }
    sheet.identity.name = name;
  },

  readSheets: () => readFeralStore().sheets,
  writeSheets: (sheets) => writeFeralStore({ ...readFeralStore(), sheets }),
});

export function loadAllFeralSummaries(): FeralType[] {
  return feralStore.loadAllSummaries();
}

export function loadFeralSheet(id: string): FeralSheet {
  return feralStore.loadSheet(id);
}

export function saveFeralSheet(sheet: FeralSheet): void {
  feralStore.saveSheet(sheet);
}

export function deleteFeralSheet(id: string): void {
  feralStore.deleteSheet(id);
}

export function duplicateFeralSheet(id: string): FeralSheet | null {
  return feralStore.duplicateSheet(id);
}

export function renameFeralSheet(id: string, newName: string): void {
  feralStore.renameSheet(id, newName);
}

export function exportFeralAsJSON(sheet: FeralSheet): void {
  feralStore.exportAsJSON(sheet);
}

export function importFeralFromJSON(jsonString: string): FeralSheet | null {
  return feralStore.importFromJSON(jsonString);
}

// ==========================================
// CREATURE SHEETS / BESTIARY (store + API pública)
// ==========================================

const creatureStore = createSheetStore<CreatureSheet, CreatureType>({
  idPrefix: "creature",
  copySuffix: " (Cópia)",
  fileLabel: "criatura",

  sanitize: sanitizeCreature,

  toSummary: (sheet) => {
    const { maxVigor } = calculateEffectiveStats(sheet);
    return {
      id: sheet.id,
      name: sheet.name || "Criatura Sem Nome",
      lineage: sheet.lineage || "Molheiro",
      stage: sheet.stage || "Adulto",
      vigorCurrent: sheet.vigor?.current ?? 30,
      vigorMax: maxVigor,
      partsCount: sheet.parts?.length ?? 0,
      lastSaved: sheet.lastSaved,
    };
  },

  makeSeed: () => createDefaultCreature("Criatura", "Molheiro", "Adulto"),

  makeBlank: () => createDefaultCreature("Nova Criatura", "Molheiro", "Adulto"),

  getName: (sheet) => sheet.name || "Criatura Sem Nome",
  setName: (sheet, name) => {
    sheet.name = name;
  },

  readSheets: () => readCreatureStore().sheets,
  writeSheets: (sheets) =>
    writeCreatureStore({ ...readCreatureStore(), sheets }),
});

export function loadAllCreatureSummaries(): CreatureType[] {
  return creatureStore.loadAllSummaries();
}

export function loadCreatureSheet(id: string): CreatureSheet {
  return creatureStore.loadSheet(id);
}

export function saveCreatureSheet(sheet: CreatureSheet): void {
  creatureStore.saveSheet(sheet);
}

export function deleteCreatureSheet(id: string): void {
  creatureStore.deleteSheet(id);
}

export function duplicateCreatureSheet(id: string): CreatureSheet | null {
  return creatureStore.duplicateSheet(id);
}

export function renameCreatureSheet(id: string, newName: string): void {
  creatureStore.renameSheet(id, newName);
}

export function exportCreatureAsJSON(sheet: CreatureSheet): void {
  creatureStore.exportAsJSON(sheet);
}

export function importCreatureFromJSON(
  jsonString: string,
): CreatureSheet | null {
  return creatureStore.importFromJSON(jsonString);
}

// ==========================================
// UTENSÍLIOS CUSTOMIZADOS
// Guardados dentro do mesmo bloco de ferais (FERAL_STORE_KEY),
// então não criam uma terceira chave no localStorage.
// ==========================================

export function loadCustomUtensils(): CustomUtensil[] {
  return readFeralStore().customUtensils;
}

export function saveCustomUtensil(utensil: CustomUtensil): void {
  const store = readFeralStore();
  const existingIdx = store.customUtensils.findIndex(
    (u) => u.id === utensil.id,
  );
  if (existingIdx >= 0) {
    store.customUtensils[existingIdx] = utensil;
  } else {
    store.customUtensils.push(utensil);
  }
  writeFeralStore(store);
}

export function deleteCustomUtensil(id: string): void {
  const store = readFeralStore();
  store.customUtensils = store.customUtensils.filter((u) => u.id !== id);
  writeFeralStore(store);
}
