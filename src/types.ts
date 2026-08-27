// ============================================================================
// ESTILOS & HABILIDADES
// ============================================================================

export type StyleKey = "ligeiro" | "poderoso" | "preciso" | "sagaz";

export interface IStyle {
  ligeiro: number;
  poderoso: number;
  preciso: number;
  sagaz: number;
}

export type SkillKey =
  | "agarrar"
  | "armazenar"
  | "assegurar"
  | "atirar"
  | "atravessar"
  | "chamar"
  | "curar"
  | "estudar"
  | "exibir"
  | "golpear"
  | "manufaturar"
  | "procurar";

export interface ISkill {
  agarrar: number;
  armazenar: number;
  assegurar: number;
  atirar: number;
  atravessar: number;
  chamar: number;
  curar: number;
  estudar: number;
  exibir: number;
  golpear: number;
  manufaturar: number;
  procurar: number;
}

// ============================================================================
// UTENSÍLIOS
// ============================================================================

export type UtensilKey =
  | "Barbante"
  | "Cutelo"
  | "Espeto"
  | "Luvas"
  | "Maçarico"
  | "Panela"
  | string;

export interface IUtensil {
  type: UtensilKey;
  customName: string;
  reach: number;
  currentDurability: number;
  maxDurability: number;
  notes?: string;
  isCustom?: boolean;
  style1?: StyleKey;
  style2?: StyleKey;
}

export interface CustomUtensil {
  id: string;
  name: string;
  description: string;
  style1: StyleKey;
  style2: StyleKey;
  reach: number;
  maxDurability: number;
  techniques: Array<ITechnique>;
  personalitySuggestions?: string[];
}

// ============================================================================
// ENTIDADES
// ============================================================================

export interface ITechnique {
  id: string;
  name: string;
  level: "Iniciante" | "Intermediária" | "Avançada";
  cost: string;
  description: string;
  notes?: string;
  utensil?: string;
}

export interface ITrait {
  id: string;
  name: string;
  level: number;
  type: "Passiva" | "Ação" | "Sucesso";
  cost?: number;
  description: string;
}

export interface ICondition {
  id: string;
  name: string;
  level: number;
  description: string;
  notes?: string;
}

export interface JournalNote {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
}

export interface ISpecialty {
  name: string;
  theme: string;
  description: string;
  initialTraits: Array<ITrait>;
}

// ============================================================================
// FICHA DE FERAL
// ============================================================================

export interface IFeral {
  id: string;
  identity: {
    name: string;
    pronouns: string;
    specialty: string;
    appearance: string;
    avatarUrl?: string;
    notes?: string;
  };
  harmony: number;
  vigor: {
    current: number;
    max: number;
  };
  styles: IStyle;
  skills: ISkill;
  utensil: IUtensil;
  techniques: Array<ITechnique>;
  traits: Array<ITrait>;
  conditions: Array<ICondition>;
  familiarBeasts: Array<{
    id: string;
    name: string;
    species: string;
    connectionLevel: number;
    skills: string;
    personality: string;
    relation?: string;
    description?: string;
    notes?: string;
  }>;
  feastHistory: Array<{
    id: string;
    dishName: string;
    monsterSource: string;
    date: string;
    ingredients?: string;
    permanentBenefit: string;
  }>;
  notes: Array<JournalNote>;
}

export interface IFeralCard {
  id: string;
  name: string;
  avatarUrl?: string;
  specialty: string;
  utensil: string;
  lastSaved: string;
  pronouns?: string;
}

// ============================================================================
// FICHA DE CRIATURA
// ============================================================================

export type MonsterStage = "Jovem" | "Adulto" | "Ancião" | "Zênite";

export type MonsterLineage =
  | "Açougueiro"
  | "Amontoeiro"
  | "Churrasqueiro"
  | "Jardineiro"
  | "Molheiro"
  | "Padeiro"
  | "Peixeiro"
  | "Pivoteiro"
  | string;

export type PartCategory = "Passiva" | "Alcance" | "Natural" | "Outro";

export interface ICreaturePart {
  id: string;
  name: string;
  categories: PartCategory[];
  range?: number;
  skills?: SkillKey;
  styles?: StyleKey;
  durability: {
    current: number;
    max: number;
  };
  description: string;
  whenBroken?: string;
}

export interface ICreature {
  id: string;
  identity: {
    name: string;
    lineage: MonsterLineage;
    stage: MonsterStage;
    size: number;
    description: string;
    avatarUrl?: string;
  };
  vigor: {
    current: number;
    max: number;
  };
  styles: IStyle;
  skills: ISkill;
  traits: Array<ITrait>;
  additionalTraits: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  parts: Array<ICreaturePart>;
  diet: string;
  habitat: string;
  behavior: string; // Comportamento
  conditions: Array<ICondition>;
}

export interface ICreatureCard {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
  lineage: MonsterLineage;
  stage: MonsterStage;
  lastSaved: string;
}
