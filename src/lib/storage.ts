import type {
  ICreature,
  ICreatureCard,
  IFeral,
  IFeralCard,
  ID,
} from "../types";

/** Chaves usadas no localStorage. */
const STORAGE_KEYS = {
  ferais: "wilderfeast:ferais",
  criaturas: "wilderfeast:criaturas",
} as const;

interface StoredEntry<T> {
  data: T;
  lastSaved: string; // ISO 8601
}

type EntryMap<T> = Record<ID, StoredEntry<T>>;

// ============================================================================
// FUNÇÕES BÁSICAS DE localStorage
// ============================================================================

function isStorageAvailable(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

export function getItem(key: string): string | null {
  if (!isStorageAvailable()) return null;

  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.error(`[storage] Falha ao ler a chave "${key}".`, error);
    return null;
  }
}

export function setItem(key: string, value: string): boolean {
  if (!isStorageAvailable()) return false;

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`[storage] Falha ao salvar a chave "${key}".`, error);
    return false;
  }
}

export function removeItem(key: string): void {
  if (!isStorageAvailable()) return;

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`[storage] Falha ao remover a chave "${key}".`, error);
  }
}

export function parseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error("[storage] Falha ao interpretar JSON armazenado.", error);
    return null;
  }
}

function nowISO(): string {
  return new Date().toISOString();
}

export function generateId(): ID {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}

// Funções internas e reaproveitáveis pelas duas entidades (Feral e Creature),
// evitando duplicação de lógica entre elas.
function getEntryMap<T>(key: string): EntryMap<T> {
  return parseJSON<EntryMap<T>>(getItem(key)) ?? {};
}

function setEntryMap<T>(key: string, map: EntryMap<T>): boolean {
  return setItem(key, JSON.stringify(map));
}

function getAllEntries<T>(key: string): StoredEntry<T>[] {
  return Object.values(getEntryMap<T>(key)).sort((a, b) =>
    b.lastSaved.localeCompare(a.lastSaved),
  );
}

function getEntryById<T>(key: string, id: ID): StoredEntry<T> | undefined {
  return getEntryMap<T>(key)[id];
}

/** Cria ou atualiza um registro. Gera um ID novo caso ainda não exista. */
function saveEntry<T extends { id: ID }>(key: string, data: T): T {
  const map = getEntryMap<T>(key);
  const id = data.id || generateId();
  const record: T = { ...data, id };

  map[id] = { data: record, lastSaved: nowISO() };
  setEntryMap(key, map);

  return record;
}

function deleteEntry(key: string, id: ID): boolean {
  const map = getEntryMap(key);
  if (!(id in map)) return false;

  delete map[id];
  return setEntryMap(key, map);
}

// ============================================================================
// FERAIS
// ============================================================================

/** Retorna todos os Ferais salvos, do mais recente para o mais antigo. */
export function getAllFerais(): IFeral[] {
  return getAllEntries<IFeral>(STORAGE_KEYS.ferais).map((entry) => entry.data);
}

/** Retorna um Feral específico pelo ID, ou `undefined` se não existir. */
export function getFeralById(id: ID): IFeral | undefined {
  return getEntryById<IFeral>(STORAGE_KEYS.ferais, id)?.data;
}

/** Salva (cria ou atualiza) um Feral e retorna o registro salvo. */
export function saveFeral(feral: IFeral): IFeral {
  return saveEntry(STORAGE_KEYS.ferais, feral);
}

/** Remove um Feral pelo ID. Retorna `true` se algo foi removido. */
export function deleteFeral(id: ID): boolean {
  return deleteEntry(STORAGE_KEYS.ferais, id);
}

function toFeralCard(feral: IFeral, lastSaved: string): IFeralCard {
  return {
    id: feral.id,
    name: feral.name,
    pronouns: feral.pronouns,
    avatarUrl: feral.avatarUrl,
    specialtyId: feral.specialtyId,
    utensilId: feral.utensil.utensilId,
    lastSaved,
  };
}

/** Retorna todos os Ferais já formatados como `IFeralCard`, para listagens. */
export function getAllFeralCards(): IFeralCard[] {
  return getAllEntries<IFeral>(STORAGE_KEYS.ferais).map(({ data, lastSaved }) =>
    toFeralCard(data, lastSaved),
  );
}

/** Retorna um único Feral já formatado como `IFeralCard`. */
export function getFeralCardById(id: ID): IFeralCard | undefined {
  const entry = getEntryById<IFeral>(STORAGE_KEYS.ferais, id);
  return entry ? toFeralCard(entry.data, entry.lastSaved) : undefined;
}

// ============================================================================
// CRIATURAS
// ============================================================================

/** Retorna todas as Creatures salvas, da mais recente para a mais antiga. */
export function getAllCreatures(): ICreature[] {
  return getAllEntries<ICreature>(STORAGE_KEYS.criaturas).map(
    (entry) => entry.data,
  );
}

/** Retorna uma Creature específica pelo ID, ou `undefined` se não existir. */
export function getCreatureById(id: ID): ICreature | undefined {
  return getEntryById<ICreature>(STORAGE_KEYS.criaturas, id)?.data;
}

/** Salva (cria ou atualiza) uma Creature e retorna o registro salvo. */
export function saveCreature(criatura: ICreature): ICreature {
  return saveEntry(STORAGE_KEYS.criaturas, criatura);
}

/** Remove uma Creature pelo ID. Retorna `true` se algo foi removido. */
export function deleteCreature(id: ID): boolean {
  return deleteEntry(STORAGE_KEYS.criaturas, id);
}

function toCreatureCard(creature: ICreature, lastSaved: string): ICreatureCard {
  return {
    id: creature.id,
    name: creature.name,
    description: creature.description,
    avatarUrl: creature.avatarUrl,
    lineage: creature.lineage,
    stage: creature.stage,
    lastSaved,
  };
}

/** Retorna todas as Creatures já formatadas como `ICreatureCard`. */
export function getAllCreatureCards(): ICreatureCard[] {
  return getAllEntries<ICreature>(STORAGE_KEYS.criaturas).map(
    ({ data, lastSaved }) => toCreatureCard(data, lastSaved),
  );
}

/** Retorna uma única Creature já formatada como `ICreatureCard`. */
export function getCreatureCardById(id: ID): ICreatureCard | undefined {
  const entry = getEntryById<ICreature>(STORAGE_KEYS.criaturas, id);
  return entry ? toCreatureCard(entry.data, entry.lastSaved) : undefined;
}

// ============================================================================
// UTILITÁRIOS GERAIS
// ============================================================================

/** Remove todos os Ferais e Creatures salvos. Use com cuidado. */
export function clearAllData(): void {
  removeItem(STORAGE_KEYS.ferais);
  removeItem(STORAGE_KEYS.criaturas);
}
