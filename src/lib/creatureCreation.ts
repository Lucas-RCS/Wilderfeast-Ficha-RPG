import type {
  CreatureStyles,
  IConditionDefinition,
  IConditionState,
  ICreature,
  ICreaturePart,
  ITraitDefinition,
  ITraitState,
  MonsterLineage,
  MonsterStage,
  Skills,
} from "../types/types";
import {
  conditionDefinitions,
  traitDefinitions,
} from "../data/wilderfeastData";
import {
  ALL_MONSTER_LINEAGES,
  ALL_MONSTER_STAGES,
  ALL_STYLE_KEYS,
  createEmptySkills,
} from "../types/wilderfeastTypes";
import { generateId, saveCreature } from "./storage";

const DEFAULT_VIGOR = 12;

// ============================================================================
// CONSULTA DE OPÇÕES
// ============================================================================

export function getAllLineageOptions(): MonsterLineage[] {
  return ALL_MONSTER_LINEAGES;
}

export function getAllStageOptions(): MonsterStage[] {
  return ALL_MONSTER_STAGES;
}

export function getAllTraitOptions(): ITraitDefinition[] {
  return traitDefinitions;
}

export function getAllConditionOptions(): IConditionDefinition[] {
  return conditionDefinitions;
}

/** Cria uma Parte em branco com um ID único, pronta para edição no wizard. */
export function createEmptyCreaturePart(): ICreaturePart {
  return {
    id: generateId(),
    name: "",
    durability: { current: 10, max: 10 },
    description: "",
    passiveEffect: undefined,
    attack: undefined,
    broken: undefined,
  };
}

// ============================================================================
// RASCUNHO (DRAFT) — ESTADO DO MODAL EM ETAPAS
// ============================================================================

export interface ICreatureDraft {
  // Etapa 1 — Dados Básicos
  name: string;
  lineage: MonsterLineage;
  stage: MonsterStage;
  sizeDescription: string;
  description: string;
  avatarUrl: string;
  vigorMax: number;

  // Etapa 2 — Estilos & Perícias
  styles: CreatureStyles;
  skills: Skills;

  // Etapa 3 — Traços & Condições
  traits: ITraitState[];
  additionalTraits: ITraitState[];
  conditions: IConditionState[];

  // Etapa 4 — Partes do Corpo
  parts: ICreaturePart[];

  // Etapa 5 — Comportamento
  diet: string;
  habitat: string;
  behavior: string;
}

/** Estado inicial em branco para abrir o wizard de criação de Creature. */
export function createEmptyCreatureDraft(): ICreatureDraft {
  return {
    name: "",
    lineage: "Açougueiro",
    stage: "Jovem",
    sizeDescription: "",
    description: "",
    avatarUrl: "",
    vigorMax: DEFAULT_VIGOR,

    styles: ALL_STYLE_KEYS.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as CreatureStyles),
    skills: createEmptySkills(),

    traits: [],
    additionalTraits: [],
    conditions: [],

    parts: [],

    diet: "",
    habitat: "",
    behavior: "",
  };
}

// ============================================================================
// VALIDAÇÃO & MONTAGEM
// ============================================================================

/** Valida o rascunho e retorna a lista de pendências (vazia se estiver ok). */
export function validateCreatureDraft(draft: ICreatureDraft): string[] {
  const errors: string[] = [];

  if (!draft.name.trim()) errors.push("Informe o nome da Criatura.");
  if (!draft.sizeDescription.trim())
    errors.push("Descreva o tamanho/porte da Criatura.");
  if (!draft.description.trim())
    errors.push("Escreva uma descrição geral da Criatura.");
  if (!draft.diet.trim()) errors.push("Descreva a Dieta da Criatura.");
  if (!draft.habitat.trim()) errors.push("Descreva o Habitat da Criatura.");
  if (!draft.behavior.trim())
    errors.push("Descreva o Comportamento da Criatura.");
  if (draft.parts.length === 0)
    errors.push("Cadastre ao menos uma Parte do corpo.");

  draft.parts.forEach((part, index) => {
    if (!part.name.trim()) errors.push(`Informe o nome da Parte ${index + 1}.`);
  });

  return errors;
}

/** Monta um `ICreature` completo a partir do rascunho preenchido no wizard. */
export function buildCreatureFromDraft(draft: ICreatureDraft): ICreature {
  return {
    id: 0, // o ID definitivo é gerado pelo storage ao salvar
    name: draft.name.trim(),
    lineage: draft.lineage,
    stage: draft.stage,
    sizeDescription: draft.sizeDescription.trim(),
    description: draft.description.trim(),
    avatarUrl: draft.avatarUrl || undefined,

    vigor: {
      current: draft.vigorMax,
      max: draft.vigorMax,
    },

    styles: draft.styles,
    skills: draft.skills,

    traits: draft.traits,
    additionalTraits: draft.additionalTraits,
    conditions: draft.conditions,
    parts: draft.parts,

    diet: draft.diet.trim(),
    habitat: draft.habitat.trim(),
    behavior: draft.behavior.trim(),
  };
}

export interface IFinalizeCreatureResult {
  creature?: ICreature;
  errors: string[];
}

/** Valida, monta e persiste a Creature criada no wizard. */
export function finalizeCreatureCreation(
  draft: ICreatureDraft,
): IFinalizeCreatureResult {
  const errors = validateCreatureDraft(draft);
  if (errors.length > 0) return { errors };

  const creature = buildCreatureFromDraft(draft);
  return { creature: saveCreature(creature), errors: [] };
}
