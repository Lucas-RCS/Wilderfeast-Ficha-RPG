import type {
  CustomUtensil,
  ICondition,
  ICreature,
  ICreatureCard,
  ICreaturePart,
  IFeral,
  IFeralCard,
  ISkill,
  IStyle,
  ITechnique,
  ITrait,
  IUtensil,
  JournalNote,
  MonsterLineage,
  MonsterStage,
  PartCategory,
  SkillKey,
  StyleKey,
} from "../types";
import { DEFAULT_NEW_FERAL } from "../data/wilderfeastData";
import {
  createDefaultCreature,
  DEFAULT_CREATURE_LINEAGE,
  DEFAULT_CREATURE_STAGE,
} from "../data/creatureData";

const FERAL_KEY = "wilderfeast_ferals";
const CREATURE_KEY = "wilderfeast_creatures";
const STORE_VERSION = 2;

type StoreItem<T> = { data: T; lastSaved: string };
type ItemMap<T> = Record<string, StoreItem<T>>;
type ObjectLike = Record<string, any>;

interface FeralStore {
  version: typeof STORE_VERSION;
  items: ItemMap<IFeral>;
  customUtensils: Record<string, CustomUtensil>;
}

interface CreatureStore {
  version: typeof STORE_VERSION;
  items: ItemMap<ICreature>;
}

const isObject = (value: unknown): value is ObjectLike =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === "string";
const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const now = () => new Date().toISOString();

export function getItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Falha ao salvar "${key}".`, error);
  }
}

export function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Falha ao remover "${key}".`, error);
  }
}

export function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function generateId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function downloadJSON(data: unknown, filename: string): void {
  if (typeof document === "undefined") return;

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const STYLE_KEYS: StyleKey[] = ["ligeiro", "poderoso", "preciso", "sagaz"];

const DEFAULT_STYLE: IStyle = {
  ligeiro: 0,
  poderoso: 0,
  preciso: 0,
  sagaz: 0,
};

const DEFAULT_SKILL: ISkill = {
  agarrar: 0,
  armazenar: 0,
  assegurar: 0,
  atirar: 0,
  atravessar: 0,
  chamar: 0,
  curar: 0,
  estudar: 0,
  exibir: 0,
  golpear: 0,
  manufaturar: 0,
  procurar: 0,
};

function normalizeStyles(value: unknown, fallback: IStyle): IStyle {
  const raw = isObject(value) ? value : {};
  return STYLE_KEYS.reduce(
    (result, key) => {
      result[key] = isNumber(raw[key]) ? raw[key] : fallback[key];
      return result;
    },
    { ...fallback },
  );
}

function normalizeSkills(value: unknown, fallback: ISkill): ISkill {
  const raw = isObject(value) ? value : {};
  return (Object.keys(fallback) as SkillKey[]).reduce(
    (result, key) => {
      result[key] = isNumber(raw[key]) ? raw[key] : fallback[key];
      return result;
    },
    { ...fallback },
  );
}

function normalizeFeral(value: unknown): IFeral {
  const raw = isObject(value) ? value : {};
  const identity = isObject(raw.identity) ? raw.identity : {};
  const vigor = isObject(raw.vigor) ? raw.vigor : {};
  const utensil = isObject(raw.utensil) ? raw.utensil : {};
  const base = clone(DEFAULT_NEW_FERAL);

  return {
    ...base,
    id: isString(raw.id) ? raw.id : generateId("feral"),
    identity: {
      ...base.identity,
      ...identity,
      name: isString(identity.name) ? identity.name : base.identity.name,
      pronouns: isString(identity.pronouns)
        ? identity.pronouns
        : base.identity.pronouns,
      specialty: isString(identity.specialty)
        ? identity.specialty
        : base.identity.specialty,
      appearance: isString(identity.appearance)
        ? identity.appearance
        : base.identity.appearance,
      avatarUrl: isString(identity.avatarUrl)
        ? identity.avatarUrl
        : base.identity.avatarUrl,
      notes: isString(identity.notes) ? identity.notes : base.identity.notes,
    },
    harmony: isNumber(raw.harmony) ? raw.harmony : base.harmony,
    vigor: {
      current: isNumber(vigor.current) ? vigor.current : base.vigor.current,
      max: isNumber(vigor.max) ? vigor.max : base.vigor.max,
    },
    styles: normalizeStyles(raw.styles, base.styles),
    skills: normalizeSkills(raw.skills, base.skills),
    utensil: {
      ...base.utensil,
      ...utensil,
    } as IUtensil,
    techniques: Array.isArray(raw.techniques)
      ? (clone(raw.techniques) as ITechnique[])
      : base.techniques,
    traits: Array.isArray(raw.traits)
      ? (clone(raw.traits) as ITrait[])
      : base.traits,
    conditions: Array.isArray(raw.conditions)
      ? (clone(raw.conditions) as ICondition[])
      : [],
    familiarBeasts: Array.isArray(raw.familiarBeasts)
      ? clone(raw.familiarBeasts)
      : base.familiarBeasts,
    feastHistory: Array.isArray(raw.feastHistory)
      ? clone(raw.feastHistory)
      : [],
    notes: Array.isArray(raw.notes) ? (clone(raw.notes) as JournalNote[]) : [],
  };
}

function normalizeCategory(value: unknown): PartCategory {
  return ["Passiva", "Alcance", "Natural", "Outro"].includes(String(value))
    ? (value as PartCategory)
    : "Outro";
}

function normalizePart(value: unknown, index: number): ICreaturePart {
  const raw = isObject(value) ? value : {};
  const durability = isObject(raw.durability) ? raw.durability : {};
  const max = isNumber(durability.max) ? durability.max : 20;
  const current = isNumber(durability.current) ? durability.current : max;

  return {
    id: isString(raw.id) ? raw.id : `part-${index + 1}`,
    name: isString(raw.name) ? raw.name : `Parte ${index + 1}`,
    categories: Array.isArray(raw.categories)
      ? raw.categories.map(normalizeCategory)
      : ["Natural"],
    range: isNumber(raw.range) ? raw.range : undefined,
    skills: isString(raw.skills) ? (raw.skills as SkillKey) : undefined,
    styles: isString(raw.styles) ? (raw.styles as StyleKey) : undefined,
    durability: {
      current: Math.max(0, current),
      max: Math.max(1, max),
    },
    description: isString(raw.description)
      ? raw.description
      : "Parte corporal da criatura.",
    whenBroken: isString(raw.whenBroken) ? raw.whenBroken : undefined,
  };
}

function normalizeCreature(value: unknown): ICreature {
  const raw = isObject(value) ? value : {};
  const identity = isObject(raw.identity) ? raw.identity : {};
  const vigor = isObject(raw.vigor) ? raw.vigor : {};

  const name = isString(identity.name) ? identity.name : "Nova Criatura";

  const lineage = (
    isString(identity.lineage) ? identity.lineage : DEFAULT_CREATURE_LINEAGE
  ) as MonsterLineage;

  const stage = (
    isString(identity.stage) ? identity.stage : DEFAULT_CREATURE_STAGE
  ) as MonsterStage;

  const base = createDefaultCreature(name, lineage, stage);

  return {
    ...base,
    id: isString(raw.id) ? raw.id : generateId("creature"),
    identity: {
      ...base.identity,
      ...identity,
      name,
      lineage,
      stage,
      size: isNumber(identity.size) ? identity.size : base.identity.size,
      description: isString(identity.description)
        ? identity.description
        : base.identity.description,
      avatarUrl: isString(identity.avatarUrl) ? identity.avatarUrl : undefined,
    },
    vigor: {
      current: isNumber(vigor.current) ? vigor.current : base.vigor.current,
      max: isNumber(vigor.max) ? vigor.max : base.vigor.max,
    },
    styles: normalizeStyles(raw.styles, base.styles),
    skills: normalizeSkills(raw.skills, base.skills),
    traits: Array.isArray(raw.traits) ? clone(raw.traits) : base.traits,
    additionalTraits: Array.isArray(raw.additionalTraits)
      ? clone(raw.additionalTraits)
      : base.additionalTraits,
    parts: Array.isArray(raw.parts) ? raw.parts.map(normalizePart) : base.parts,
    diet: isString(raw.diet) ? raw.diet : base.diet,
    habitat: isString(raw.habitat) ? raw.habitat : base.habitat,
    behavior: isString(raw.behavior) ? raw.behavior : base.behavior,
    conditions: Array.isArray(raw.conditions)
      ? (clone(raw.conditions) as ICondition[])
      : [],
  };
}

function readFeralStore(): FeralStore {
  const raw = safeParseJSON<ObjectLike>(getItem(FERAL_KEY));
  const store: FeralStore = {
    version: STORE_VERSION,
    items: {},
    customUtensils: {},
  };

  if (!raw) return store;

  if (raw.version === STORE_VERSION && isObject(raw.items)) {
    for (const [id, item] of Object.entries(raw.items)) {
      if (isObject(item) && "data" in item) {
        store.items[id] = {
          data: item.data as IFeral,
          lastSaved: isString(item.lastSaved) ? item.lastSaved : now(),
        };
      }
    }
  }

  if (isObject(raw.customUtensils)) {
    store.customUtensils = raw.customUtensils as Record<string, CustomUtensil>;
  } else if (Array.isArray(raw.customUtensils)) {
    for (const item of raw.customUtensils) {
      if (isObject(item) && isString(item.id)) {
        store.customUtensils[item.id] = item as CustomUtensil;
      }
    }
  }

  return store;
}

function readCreatureStore(): CreatureStore {
  const raw = safeParseJSON<ObjectLike>(getItem(CREATURE_KEY));
  const store: CreatureStore = { version: STORE_VERSION, items: {} };

  if (!raw) return store;

  if (raw.version === STORE_VERSION && isObject(raw.items)) {
    for (const [id, item] of Object.entries(raw.items)) {
      if (isObject(item) && "data" in item) {
        store.items[id] = {
          data: item.data as ICreature,
          lastSaved: isString(item.lastSaved) ? item.lastSaved : now(),
        };
      }
    }
  }

  return store;
}

function writeFeralStore(store: FeralStore): void {
  setItem(FERAL_KEY, JSON.stringify(store));
}

function writeCreatureStore(store: CreatureStore): void {
  setItem(CREATURE_KEY, JSON.stringify(store));
}

function fileSlug(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/gi, "_") || "sem_nome"
  );
}

export function saveFeral(feral: IFeral): IFeral {
  const store = readFeralStore();
  const data = normalizeFeral(feral);
  store.items[data.id] = { data, lastSaved: now() };
  writeFeralStore(store);
  return data;
}

function saveCreatureInternal(creature: ICreature): ICreature {
  const store = readCreatureStore();
  const data = normalizeCreature(creature);
  store.items[data.id] = { data, lastSaved: now() };
  writeCreatureStore(store);
  return data;
}

// -----------------------------------------------------------------------------
// FERAIS
// -----------------------------------------------------------------------------

export function loadAllFeralCards(): IFeralCard[] {
  return Object.values(readFeralStore().items)
    .sort((a, b) => b.lastSaved.localeCompare(a.lastSaved))
    .map(({ data, lastSaved }) => ({
      id: data.id,
      name: data.identity.name || "Feral Sem Nome",
      avatarUrl: data.identity.avatarUrl,
      specialty: data.identity.specialty,
      utensil: data.utensil.customName.trim() || String(data.utensil.type),
      lastSaved,
      pronouns: data.identity.pronouns,
    }));
}

export function loadFeral(id: string): IFeral {
  const store = readFeralStore();
  const stored = store.items[id];
  if (stored) return stored.data;

  const feral = clone(DEFAULT_NEW_FERAL);
  feral.id = id || generateId("feral");
  feral.identity.name = "";
  feral.identity.pronouns = "";
  feral.techniques = [];
  feral.conditions = [];
  feral.familiarBeasts = [];
  feral.feastHistory = [];
  feral.notes = [];

  return saveFeral(feral);
}

export function deleteFeral(id: string): void {
  const store = readFeralStore();
  delete store.items[id];
  writeFeralStore(store);
}

export function duplicateFeral(id: string): IFeral | null {
  const source = readFeralStore().items[id]?.data;
  if (!source) return null;

  const copy = clone(source);
  copy.id = generateId("feral");
  copy.identity.name = `${source.identity.name || "Feral Sem Nome"} (Cópia)`;
  return saveFeral(copy);
}

export function renameFeral(id: string, name: string): void {
  if (!name.trim()) return;
  const source = readFeralStore().items[id]?.data;
  if (!source) return;

  const feral = clone(source);
  feral.identity.name = name.trim();
  saveFeral(feral);
}

export function exportFeralAsJSON(feral: IFeral): void {
  const data = normalizeFeral(feral);
  downloadJSON(data, `wilderfeast_feral_${fileSlug(data.identity.name)}.json`);
}

export function importFeralFromJSON(json: string): IFeral | null {
  try {
    const feral = normalizeFeral(JSON.parse(json));
    feral.id = generateId("feral");
    return saveFeral(feral);
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// CRIATURAS
// -----------------------------------------------------------------------------

export function loadAllCreatureCards(): ICreatureCard[] {
  return Object.values(readCreatureStore().items)
    .sort((a, b) => b.lastSaved.localeCompare(a.lastSaved))
    .map(({ data, lastSaved }) => ({
      id: data.id,
      name: data.identity.name || "Criatura Sem Nome",
      description: data.identity.description,
      avatarUrl: data.identity.avatarUrl,
      lineage: data.identity.lineage,
      stage: data.identity.stage,
      lastSaved,
    }));
}

export function loadCreature(id: string): ICreature {
  const store = readCreatureStore();
  if (store.items[id]) return store.items[id].data;

  const creature = createDefaultCreature(
    "Nova Criatura",
    DEFAULT_CREATURE_LINEAGE,
    DEFAULT_CREATURE_STAGE,
  );
  creature.id = id || generateId("creature");

  return saveCreatureInternal(creature);
}

export const saveCreature = saveCreatureInternal;

export function deleteCreature(id: string): void {
  const store = readCreatureStore();
  delete store.items[id];
  writeCreatureStore(store);
}

export function duplicateCreature(id: string): ICreature | null {
  const source = readCreatureStore().items[id]?.data;
  if (!source) return null;

  const copy = clone(source);
  copy.id = generateId("creature");
  copy.identity.name = `${source.identity.name || "Criatura Sem Nome"} (Cópia)`;

  return saveCreatureInternal(copy);
}

export function renameCreature(id: string, name: string): void {
  if (!name.trim()) return;
  const source = readCreatureStore().items[id]?.data;
  if (!source) return;

  const creature = clone(source);
  creature.identity.name = name.trim();
  saveCreatureInternal(creature);
}

export function exportCreatureAsJSON(creature: ICreature): void {
  const data = normalizeCreature(creature);
  downloadJSON(
    data,
    `wilderfeast_criatura_${fileSlug(data.identity.name)}.json`,
  );
}

export function importCreatureFromJSON(json: string): ICreature | null {
  try {
    const creature = normalizeCreature(JSON.parse(json));
    creature.id = generateId("creature");
    return saveCreatureInternal(creature);
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// UTENSÍLIOS PERSONALIZADOS
// -----------------------------------------------------------------------------

export function loadCustomUtensils(): CustomUtensil[] {
  return Object.values(readFeralStore().customUtensils);
}

export function saveCustomUtensil(utensil: CustomUtensil): void {
  const store = readFeralStore();
  store.customUtensils[utensil.id] = clone(utensil);
  writeFeralStore(store);
}

export function deleteCustomUtensil(id: string): void {
  const store = readFeralStore();
  delete store.customUtensils[id];
  writeFeralStore(store);
}
