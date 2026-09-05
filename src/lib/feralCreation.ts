import type {
  FeralStyles,
  ICreature,
  ID,
  IFeral,
  IFeralOrigin,
  IFeralPersonality,
  IFeralUtensil,
  ISpecialtyDefinition,
  ITechniqueDefinition,
  ITraitDefinition,
  ITraitState,
  IUtensilDefinition,
  IUtensilStyleOption,
  OriginDishType,
  SkillKey,
  SpecialtyKey,
  UtensilKey,
} from "../types/types";
import {
  buildFeralStylesFromUtensil,
  buildFeralTechniquesFromUtensil,
  creaturesById,
  specialtiesById,
  specialtyDefinitions,
  techniquesById,
  traitsById,
  utensilDefinitions,
  utensilsById,
} from "../data/wilderfeastData";
import { createEmptySkills } from "../types/wilderfeastTypes";
import { getMatilhaById, saveFeral, saveMatilha } from "./storage";

const DEFAULT_VIGOR = 20;

// ============================================================================
// CONSULTA DE OPÇÕES — UTENSÍLIO & TÉCNICAS
// ============================================================================

export interface IUtensilCreationInfo {
  utensil: IUtensilDefinition;
  styleOptions?: [IUtensilStyleOption, IUtensilStyleOption];
  initialTechnique?: ITechniqueDefinition;
  optionalTechniques: ITechniqueDefinition[];
}

/** Lista todos os Utensílios disponíveis para escolha na criação. */
export function getAllUtensilOptions(): IUtensilDefinition[] {
  return utensilDefinitions;
}

/**
 * Reúne tudo que a etapa "Utensílio & Técnicas" precisa exibir para um
 * Utensílio específico: as duas opções de distribuição de Estilos, a
 * Técnica concedida de graça e as Técnicas opcionais (já resolvidas).
 */
export function getUtensilCreationInfo(
  utensilId: UtensilKey,
): IUtensilCreationInfo | undefined {
  const utensil = utensilsById[utensilId] as IUtensilDefinition | undefined;
  if (!utensil) return undefined;

  return {
    utensil,
    styleOptions: utensil.initialStyleOptions,
    initialTechnique:
      utensil.initialTechniqueId !== undefined
        ? (techniquesById[utensil.initialTechniqueId] as
            | ITechniqueDefinition
            | undefined)
        : undefined,
    optionalTechniques: (utensil.techniqueOptionIds ?? [])
      .map((id) => techniquesById[id] as ITechniqueDefinition | undefined)
      .filter((technique): technique is ITechniqueDefinition =>
        Boolean(technique),
      ),
  };
}

/** Pré-visualiza os Estilos 3/2/1/1 resultantes de uma opção de distribuição. */
export function previewUtensilStyles(
  utensilId: UtensilKey,
  optionIndex: 0 | 1,
): FeralStyles {
  return buildFeralStylesFromUtensil(utensilId, optionIndex);
}

// ============================================================================
// CONSULTA DE OPÇÕES — ESPECIALIDADE & TRAÇOS
// ============================================================================

export interface ISpecialtyCreationInfo {
  specialty: ISpecialtyDefinition;
  traitOptions: ITraitDefinition[];
  importantMonsterOptions: ICreature[];
}

/** Lista todas as Especialidades disponíveis para escolha na criação. */
export function getAllSpecialtyOptions(): ISpecialtyDefinition[] {
  return specialtyDefinitions;
}

/**
 * Reúne tudo que a etapa "Especialidade & Traços" precisa exibir para uma
 * Especialidade específica: os Traços iniciais entre os quais o jogador
 * escolhe 1, e os Monstros Importantes sugeridos (já resolvidos).
 */
export function getSpecialtyCreationInfo(
  specialtyId: SpecialtyKey,
): ISpecialtyCreationInfo | undefined {
  const specialty = specialtiesById[specialtyId] as
    | ISpecialtyDefinition
    | undefined;
  if (!specialty) return undefined;

  return {
    specialty,
    traitOptions: specialty.firstTraitOptions
      .map((id) => traitsById[id] as ITraitDefinition | undefined)
      .filter((trait): trait is ITraitDefinition => Boolean(trait)),
    importantMonsterOptions: (specialty.importantMonsterOptions ?? [])
      .map((id) => creaturesById[id] as ICreature | undefined)
      .filter((monster): monster is ICreature => Boolean(monster)),
  };
}

// ============================================================================
// RASCUNHO (DRAFT) — ESTADO DO MODAL EM ETAPAS
// ============================================================================

export interface IFeralOriginDraft {
  creationDescription: string;
  creationSkillBonus: SkillKey;
  initiationDescription: string;
  initiationSkillBonus: SkillKey;
  initiationMonsterId?: ID;
  initiationNotes: string;
  ambitionDescription: string;
  ambitionSkillBonus: SkillKey;
  homeland: string;
  typicalIngredient: string;
  typicalSeasoning: string;
}

export interface IFeralConnectionDraft {
  dish: OriginDishType;
  partnerFeralId?: ID;
  description: string;
}

export interface IFeralDraft {
  // Etapa 1 — Dados Básicos
  name: string;
  pronouns: string;
  appearance: string;
  avatarUrl: string;

  // Etapa 2 — Utensílio & Técnicas
  utensilId: UtensilKey | "";
  styleOptionIndex: 0 | 1;
  chosenTechniqueId?: ID;

  // Etapa 3 — Especialidade & Traços
  specialtyId: SpecialtyKey | "";
  chosenTraitId?: ID;
  importantMonsterName?: string;
  importantMonsterDescription: string;

  // Etapa 4 — Origem & Personalidade
  origin: IFeralOriginDraft;
  personality: IFeralPersonality;

  // Etapa 5 — Matilha & Vínculos
  matilhaId?: ID;
  connection: IFeralConnectionDraft;
}

/** Estado inicial em branco para abrir o wizard de criação de Feral. */
export function createEmptyFeralDraft(): IFeralDraft {
  return {
    name: "",
    pronouns: "",
    appearance: "",
    avatarUrl: "",

    utensilId: "",
    styleOptionIndex: 0,
    chosenTechniqueId: undefined,

    specialtyId: "",
    chosenTraitId: undefined,
    importantMonsterName: "",
    importantMonsterDescription: "",

    origin: {
      creationDescription: "",
      creationSkillBonus: "agarrar",
      initiationDescription: "",
      initiationSkillBonus: "agarrar",
      initiationMonsterId: undefined,
      initiationNotes: "",
      ambitionDescription: "",
      ambitionSkillBonus: "agarrar",
      homeland: "",
      typicalIngredient: "",
      typicalSeasoning: "",
    },
    personality: {
      is: "",
      strivesToBe: "",
    },

    matilhaId: undefined,
    connection: {
      dish: "iniciacao",
      partnerFeralId: undefined,
      description: "",
    },
  };
}

// ============================================================================
// VALIDAÇÃO & MONTAGEM
// ============================================================================

/** Valida o rascunho e retorna a lista de pendências (vazia se estiver ok). */
export function validateFeralDraft(draft: IFeralDraft): string[] {
  const errors: string[] = [];

  if (!draft.name.trim()) errors.push("Informe o nome do Feral.");
  if (!draft.pronouns.trim()) errors.push("Informe os pronomes do Feral.");
  if (!draft.utensilId) errors.push("Escolha um Utensílio de Arkaicaço.");
  if (!draft.specialtyId) errors.push("Escolha uma Especialidade.");
  if (draft.chosenTraitId === undefined)
    errors.push("Escolha o Traço inicial concedido pela Especialidade.");
  if (!draft.importantMonsterName?.trim())
    errors.push("Escolha o Monstro Importante do Feral.");
  if (!draft.origin.typicalIngredient.trim())
    errors.push("Descreva o Ingrediente típico da Origem.");
  if (!draft.origin.typicalSeasoning.trim())
    errors.push("Descreva o Tempero típico da Origem.");
  if (!draft.personality.is.trim() || !draft.personality.strivesToBe.trim())
    errors.push("Preencha a Personalidade (quem é e quem almeja ser).");

  return errors;
}

/** Monta um `IFeral` completo a partir do rascunho preenchido no wizard. */
export function buildFeralFromDraft(draft: IFeralDraft): IFeral {
  const utensilId = draft.utensilId as UtensilKey;
  const utensilInfo = getUtensilCreationInfo(utensilId);
  if (!utensilInfo) {
    throw new Error(`Utensílio "${draft.utensilId}" não encontrado.`);
  }

  const styles = buildFeralStylesFromUtensil(utensilId, draft.styleOptionIndex);
  const techniques = buildFeralTechniquesFromUtensil(
    utensilId,
    draft.chosenTechniqueId,
  );

  const utensil: IFeralUtensil = {
    utensilId,
    range: utensilInfo.utensil.defaultRange,
    durability: {
      current: utensilInfo.utensil.defaultMaxDurability,
      max: utensilInfo.utensil.defaultMaxDurability,
    },
  };

  const traits: ITraitState[] =
    draft.chosenTraitId !== undefined
      ? [
          { traitId: 1, level: 1 },
          { traitId: 2, level: 1 },
          { traitId: draft.chosenTraitId, level: 1 },
        ]
      : [];

  const origin: IFeralOrigin = {
    creation: {
      type: "criacao",
      description: draft.origin.creationDescription,
      skillBonus: draft.origin.creationSkillBonus,
    },
    initiation: {
      type: "iniciacao",
      description: draft.origin.initiationDescription,
      skillBonus: draft.origin.initiationSkillBonus,
      monsterId: draft.origin.initiationMonsterId,
      notes: draft.origin.initiationNotes || undefined,
    },
    ambition: {
      type: "ambicao",
      description: draft.origin.ambitionDescription,
      skillBonus: draft.origin.ambitionSkillBonus,
    },
    homeland: draft.origin.homeland || undefined,
    typicalIngredient: draft.origin.typicalIngredient,
    typicalSeasoning: draft.origin.typicalSeasoning,
    connection: {
      dish: draft.connection.dish,
      partnerFeralId: draft.connection.partnerFeralId ?? 0,
      description: draft.connection.description,
    },
  };

  return {
    id: 0, // o ID definitivo é gerado pelo storage ao salvar
    name: draft.name.trim(),
    pronouns: draft.pronouns.trim(),
    appearance: draft.appearance.trim(),
    avatarUrl: draft.avatarUrl || undefined,
    harmony: 3,

    specialtyId: draft.specialtyId as SpecialtyKey,
    utensil,
    personality: draft.personality,
    origin,

    importantMonster: {
      monsterName: draft.importantMonsterName?.trim() ?? "",
      description: draft.importantMonsterDescription,
    },

    styles,
    skills: createEmptySkills(),

    vigor: {
      current: DEFAULT_VIGOR,
      max: DEFAULT_VIGOR,
    },

    techniques,
    traits,
    conditions: [],

    feastHistory: [],
    notes: [],
  };
}

export interface IFinalizeFeralResult {
  feral?: IFeral;
  errors: string[];
}

/**
 * Valida, monta e persiste o Feral criado no wizard. Caso uma Matilha
 * tenha sido escolhida na última etapa, o novo Feral também é adicionado
 * aos membros dela.
 */
export function finalizeFeralCreation(
  draft: IFeralDraft,
): IFinalizeFeralResult {
  const errors = validateFeralDraft(draft);
  if (errors.length > 0) return { errors };

  const feral = buildFeralFromDraft(draft);
  const saved = saveFeral(feral);

  if (draft.matilhaId !== undefined) {
    const matilha = getMatilhaById(draft.matilhaId);
    if (matilha && !matilha.memberIds.includes(saved.id)) {
      saveMatilha({ ...matilha, memberIds: [...matilha.memberIds, saved.id] });
    }
  }

  return { feral: saved, errors: [] };
}
