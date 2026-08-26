export type StyleKey = "ligeiro" | "poderoso" | "preciso" | "sagaz";

export interface IStyle {
  ligeiro: number;
  poderoso: number;
  preciso: number;
  sagaz: number;
}

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
  cost: string;
  description: string;
  notes?: string;
  isStandard?: boolean;
  isMonstrous?: boolean;
}

export interface ICondition {
  id: string;
  name: string;
  level: number;
  description: string;
  notes?: string;
}

// FERAL SHEET
export interface IFeral {
  id: string;
  version: number;
  lastSaved: string;
  harmony: number;
  identity: {
    name: string;
    pronouns: string;
    specialty: string;
    packName: string;
    appearance: string;
    avatarUrl?: string;
    notes?: string;
  };
  styles: IStyle;
  skills: ISkill;
  utensil: IUtensil;
  techniques: Array<ITechnique>;
  traits: Array<ITrait>;
  vigor: {
    current: number;
    max: number;
  };
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
  connection?: {
    partnerName: string;
    dishReference: string;
    description: string;
  };
  notesList: JournalNote[];
  notes: Array<{
    id: string;
    title: string;
    content: string;
    category?: string;
    date?: string;
  }>;
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

export interface JournalNote {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
}

// CREATURE SHEET

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

export type PartCategory = "Arma" | "Ponto Fraco" | "Coisa Esquisita";

export interface CreaturePart {
  id: string;
  name: string;
  categories: PartCategory[];
  baseMaxDurability: number; // e.g. 10, 20, 30
  currentDurability: number;

  // Se Arma
  weaponReach?: number;
  weaponStyle?: StyleKey;
  weaponSkill?: SkillKey;
  weaponEffect?: string;

  // Se Ponto Fraco
  weakPointEffect?: string;

  specialFeatureEffect?: string;

  // Efeito se quebrada (geral/obrigatório para reproduzir bestiário)
  brokenEffect: string;
  notes?: string;
}

export interface CreatureSpecialAction {
  id: string;
  name: string;
  type: "Passiva" | "Ação" | "Reação" | "Outro";
  cost:
    | "Livre"
    | "1 Ação"
    | "2 Ações"
    | "3 Ações"
    | "Vigor"
    | "Sucesso"
    | "Personalizado";
  customCost?: string;
  description: string;
}

export interface CreatureSheet {
  id: string;
  version: number;
  name: string;
  lineage: MonsterLineage;
  stage: MonsterStage;
  sizeConcept: string;
  description: string;
  avatarUrl?: string;
  lastSaved: string;

  vigor: {
    current: number;
    max: number;
  };

  baseStyles: IStyle;

  skills: ISkill;

  traits: Array<ITrait>;

  additionalTraits: Array<{
    id: string;
    name: string;
    level?: number;
    description: string;
  }>;

  diet: {
    type: "Generalista" | "Seletiva" | "Personalizada" | string;
    description: string;
    examples: string;
  };

  habitat: {
    region: string; // e.g. "Montanhas (Lakkarakku)"
    areas: string; // e.g. "Fundão, Antigo Sen Che, Bandejargênteas"
    notes: string;
  };

  // Comportamento & Instintos
  behavior: {
    targetSelection: string; // "Se nenhuma criatura estiver Exposta, mire..."
    instincts: string; // "Seu instinto é..."
    woundedPhase?: string; // Comportamento quando ferido
    specialRules: Array<{ id: string; name: string; rule: string }>;
  };

  // Partes Dinâmicas
  parts: CreaturePart[];

  // Habilidades Especiais / Mecânicas
  specialActions: CreatureSpecialAction[];

  conditions: Array<ICondition>;
}

// SHEET SUMMARIES FOR HUB
export interface FeralType {
  id: string;
  name: string;
  avatarUrl?: string;
  specialty: string;
  utensil: string;
  lastSaved: string;
  pronouns?: string;
}

export interface CreatureType {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
  lineage: MonsterLineage;
  stage: MonsterStage;
  lastSaved: string;
}
