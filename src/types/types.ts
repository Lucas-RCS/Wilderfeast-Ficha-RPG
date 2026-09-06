export type ID = number;

// ============================================================================
// ESTILOS & HABILIDADES
// ============================================================================

export type StyleKey = "ligeiro" | "poderoso" | "preciso" | "sagaz";

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

export type FeralStyleLevel = 1 | 2 | 3 | 4 | 5;
export type CreatureStyleLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type SkillLevel = 0 | 1 | 2 | 3;

export type FeralStyles = Record<StyleKey, FeralStyleLevel>;
export type CreatureStyles = Record<StyleKey, CreatureStyleLevel>;
export type Skills = Record<SkillKey, SkillLevel>;

// ============================================================================
// CUSTOS
// ============================================================================

export type CostType = "acoes" | "vigor" | "sucessos";

export interface ICost {
  type: CostType;
  amount: number;
  restriction?: string;
}

// ============================================================================
// TRAÇOS
// ============================================================================

export interface ITraitDefinition {
  id: ID;
  name: string;
  description: string;
  cost?: ICost;
  maxLevel?: number | null;
}

export interface ITraitState {
  traitId: ID;
  level: number;
}

export interface ICustomTrait {
  id: ID;
  name: string;
  description: string;
  badge?: string;
  level?: number;
  maxLevel?: number | null;
}

// ============================================================================
// CONDIÇÕES
// ============================================================================

export interface IConditionDefinition {
  id: ID;
  name: string;
  description: string;
  maxLevel?: number | null;
}

export interface IConditionState {
  conditionId: ID;
  level: number;
}

// ============================================================================
// TÉCNICAS
// ============================================================================

export type TechniqueLevel = "Iniciante" | "Intermediária" | "Avançada";

export type UtensilKey =
  | "Barbante"
  | "Cutelo"
  | "Espeto"
  | "Luvas"
  | "Maçarico"
  | "Panela"
  | string;

export interface ITechniqueDefinition {
  id: ID;
  name: string;
  level: TechniqueLevel;
  description: string;
  cost?: ICost;
  utensils?: UtensilKey[];
}

export interface ITechniqueState {
  techniqueId: ID;
}

export interface ITechniqueTraining {
  techniqueId: ID;
  sessions: number;
}

// ============================================================================
// UTENSÍLIOS
// ============================================================================

// Uma das duas opções de distribuição de Estilos iniciais que um Utensílio
// oferece. O Estilo `main` recebe nível 3 e o `secondary` recebe nível 2.
// Os dois Estilos restantes (não citados) sempre recebem nível 1 cada.
export interface IUtensilStyleOption {
  main: StyleKey;
  secondary: StyleKey;
}

export interface IUtensilDefinition {
  id: UtensilKey;
  name: string;
  defaultRange: number;
  defaultMaxDurability: number;
  brokenDescription: string;

  // As duas opções de distribuição de Estilos iniciais oferecidas pelo
  // Utensílio na criação do Feral (3/2/1/1). Opcional para não quebrar
  // definições que ainda não tenham essa informação preenchida.
  initialStyleOptions?: [IUtensilStyleOption, IUtensilStyleOption];

  // Técnica que o Utensílio sempre concede de graça na criação do Feral.
  initialTechniqueId?: ID;

  // Técnicas adicionais entre as quais o jogador escolhe 1 na criação do Feral.
  techniqueOptionIds?: ID[];
}

export interface IFeralUtensil {
  utensilId: UtensilKey;
  range: number;
  durability: {
    current: number;
    max: number;
  };
}

// ============================================================================
// ESPECIALIDADES
// ============================================================================

export type SpecialtyKey =
  | "Açougueiro"
  | "Amontoeiro"
  | "Churrasqueiro"
  | "Jardineiro"
  | "Molheiro"
  | "Padeiro"
  | "Peixeiro"
  | "Pivoteiro"
  | string;

export interface ISpecialtyDefinition {
  id: SpecialtyKey;
  name: string;
  description: string;

  // Opções de onde o primeiro Traço inicial da Especialidade pode ser escolhido.
  firstTraitOptions: ID[];

  // Monstros importantes sugeridos pela Especialidade.
  importantMonsterOptions?: ID[];
}

// ============================================================================
// ORIGEM
// ============================================================================

export type OriginDishType = "criacao" | "iniciacao" | "ambicao";

export interface IOriginDish {
  type: OriginDishType;
  description: string;
  skillBonus: SkillKey;

  // Usado principalmente na Iniciação, que descreve o criatura do primeiro
  // Banquete Feral.
  monsterId?: ID;

  notes?: string;
}

export interface IOriginConnection {
  dish: OriginDishType;
  partnerFeralId: ID;
  description: string;
}

export interface IFeralOrigin {
  creation: IOriginDish;
  initiation: IOriginDish;
  ambition: IOriginDish;

  homeland?: string;
  typicalIngredient: string;
  typicalSeasoning: string;

  connection: IOriginConnection;
}

// ============================================================================
// PERSONALIDADE
// ============================================================================

export interface IFeralPersonality {
  is: string;
  strivesToBe: string;
}

// ============================================================================
// BANQUETE & PROGRESSÃO
// ============================================================================

export type PermanentReward =
  | {
      type: "style";
      key: StyleKey;
    }
  | {
      type: "skill";
      key: SkillKey;
    }
  | {
      type: "trait";
      traitId: ID;
    };

export interface IFeastRecord {
  id: ID;
  monsterName: string;
  dishName?: string;
  date?: string;
  permanentReward: PermanentReward;
}

// ============================================================================
// ANOTAÇÕES
// ============================================================================

export interface IJournalNote {
  id: ID;
  title: string;
  category: string;
  content: string;
  createdAt: string;
}

// ============================================================================
// MONSTRO IMPORTANTE
// ============================================================================

export interface IImportantMonsterRelation {
  monsterName: string;
  description: string;
}

// ============================================================================
// FICHA DE FERAL
// ============================================================================

export interface IFeral {
  id: ID;

  name: string;
  pronouns: string;
  appearance: string;
  avatarUrl?: string;
  harmony: number;

  specialtyId: SpecialtyKey;
  utensil: IFeralUtensil;
  personality: IFeralPersonality;
  origin: IFeralOrigin;

  importantMonster: IImportantMonsterRelation;

  styles: FeralStyles;
  skills: Skills;

  vigor: {
    current: number;
    max: number;
  };

  techniques: ITechniqueState[];
  techniqueTraining?: ITechniqueTraining;
  traits: ITraitState[];
  customTraits?: ICustomTrait[];
  conditions: IConditionState[];

  feastHistory: IFeastRecord[];
  notes: IJournalNote[];
}

// ============================================================================
// CARTÃO / RESUMO DE FERAL
// ============================================================================

export interface IFeralCard {
  id: ID;
  name: string;
  pronouns?: string;
  avatarUrl?: string;
  specialtyId: SpecialtyKey;
  utensilId: UtensilKey;
  lastSaved: string;
}

// ============================================================================
// MATILHA
// ============================================================================

export type PackArchetype =
  | "academica"
  | "juramentada"
  | "livre"
  | "mercenaria"
  | "outra";

export interface IPackHarmony {
  current: number;
  max: number;
}

export interface IMatilha {
  id: ID;
  name: string;
  archetype: PackArchetype;
  purpose: string;
  lair: string;

  memberIds: ID[];
  harmony: IPackHarmony;

  // Monstros sob cuidado da Matilha/Toca.
  caredMonsterIds?: ID[];
}

// ============================================================================
// COMBATE — PARTES DE MONSTROS
// ============================================================================

export interface IPartAttack {
  range: number;
  skill: SkillKey;
  style: StyleKey;
}

export interface ICreaturePart {
  id: ID;
  name: string;

  durability: {
    current: number;
    max: number;
  };

  description?: string;
  passiveEffect?: string;
  attack?: IPartAttack;

  broken?: {
    description: string;
    passiveEffect?: string;
    attack?: IPartAttack;
  };
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
  | "Pivoteiro";

export interface ICreature {
  id: ID;

  name: string;
  lineage: MonsterLineage;
  stage: MonsterStage;
  sizeDescription: string;
  description: string;
  avatarUrl?: string;

  vigor: {
    current: number;
    max: number;
  };

  styles: CreatureStyles;
  skills: Skills;

  traits: ITraitState[];
  additionalTraits: ITraitState[];
  customTraits?: ICustomTrait[];
  conditions: IConditionState[];
  parts: ICreaturePart[];

  diet: string;
  habitat: string;
  behavior: string;
}

// ============================================================================
// CARTÃO / RESUMO DE CRIATURA
// ============================================================================

export interface ICreatureCard {
  id: ID;
  name: string;
  description: string;
  avatarUrl?: string;
  lineage: MonsterLineage;
  stage: MonsterStage;
  lastSaved: string;
}
