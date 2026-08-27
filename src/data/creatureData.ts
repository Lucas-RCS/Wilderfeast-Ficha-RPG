import type {
  ICreature,
  ICreaturePart,
  ISkill,
  IStyle,
  MonsterLineage,
  MonsterStage,
  SkillKey,
  StyleKey,
  PartCategory,
} from "../types";

export interface MonsterLineageDefinition {
  name: MonsterLineage;
  description: string;
}

export const MONSTER_LINEAGES: MonsterLineageDefinition[] = [
  { name: "Açougueiro", description: "Monstros com protuberâncias de metal ou mineral, carniceiros e predadores blindados." },
  { name: "Amontoeiro", description: "Monstros que acumulam comida em covis, gordura corporal ou reservas duradouras." },
  { name: "Churrasqueiro", description: "Monstros que convivem com chamas, calor extremo e combustão." },
  { name: "Jardineiro", description: "Monstros que gerenciam a flora, sementes e o crescimento vegetal da Terra Una." },
  { name: "Molheiro", description: "Monstros que excretam secreções, tóxicas, medicinais, mucos e compostos químicos." },
  { name: "Padeiro", description: "Monstros longevos, polinizadores ou com adaptações de grande resiliência." },
  { name: "Peixeiro", description: "Monstros aquáticos, semiaquáticos e voadores dos mares e rios." },
  { name: "Pivoteiro", description: "Monstros definidos por metamorfose, mimetismo, inteligência e adaptação dinâmica." },
  { name: "Personalizada", description: "Linhagem lendária ou única criada pelo Guia." },
];

export interface StageConfig {
  label: MonsterStage;
  vigorMax: number;
  styleModifier: number;
  durabilityModifier: number;
  fullTurnsRule: string;
  traitSpecial?: string;
}

export const STAGE_CONFIG: Record<MonsterStage, StageConfig> = {
  Jovem: {
    label: "Jovem",
    vigorMax: 20,
    styleModifier: -1,
    durabilityModifier: -5,
    fullTurnsRule: "1 turno completo por rodada.",
  },
  Adulto: {
    label: "Adulto",
    vigorMax: 30,
    styleModifier: 0,
    durabilityModifier: 0,
    fullTurnsRule: "1 turno completo por rodada.",
  },
  Ancião: {
    label: "Ancião",
    vigorMax: 40,
    styleModifier: 1,
    durabilityModifier: 5,
    fullTurnsRule: "2 turnos completos por rodada se enfrentar 3 ou mais ferais.",
  },
  Zênite: {
    label: "Zênite",
    vigorMax: 50,
    styleModifier: 2,
    durabilityModifier: 10,
    fullTurnsRule:
      "Número de turnos completos igual à metade do número de ferais (arredondado para cima).",
    traitSpecial:
      "ZÊNITE (Passivo): Remove 1 Sucesso de cada Teste realizado por criaturas hostis em combate com você.",
  },
};

const DEFAULT_STYLES: IStyle = {
  ligeiro: 2,
  poderoso: 2,
  preciso: 1,
  sagaz: 1,
};

const DEFAULT_SKILLS: ISkill = {
  agarrar: 1,
  armazenar: 0,
  assegurar: 0,
  atirar: 0,
  atravessar: 1,
  chamar: 1,
  curar: 0,
  estudar: 1,
  exibir: 0,
  golpear: 2,
  manufaturar: 0,
  procurar: 1,
};

const ID_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

function createId(prefix: string): string {
  let suffix = "";
  for (let i = 0; i < 7; i++) {
    suffix += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
  }
  return `${prefix}-${Date.now()}-${suffix}`;
}

const cloneStyles = (): IStyle => ({ ...DEFAULT_STYLES });
const cloneSkills = (): ISkill => ({ ...DEFAULT_SKILLS });

function createPart(
  id: string,
  name: string,
  description: string,
  options: {
    categories?: PartCategory[];
    range?: number;
    skills?: SkillKey;
    styles?: StyleKey;
    whenBroken?: string;
  } = {},
): ICreaturePart {
  return {
    id,
    name,
    categories: options.categories ?? ["Natural"],
    durability: { current: 20, max: 20 },
    description,
    range: options.range,
    skills: options.skills,
    styles: options.styles,
    whenBroken: options.whenBroken,
  };
}

export function calculateEffectiveStats(creature: ICreature) {
  const config = STAGE_CONFIG[creature.identity.stage] ?? STAGE_CONFIG.Adulto;

  const effectiveStyles = (Object.keys(creature.styles) as StyleKey[]).reduce(
    (result, style) => {
      const base = creature.styles[style];
      result[style] =
        config.styleModifier < 0
          ? Math.max(0, base + config.styleModifier)
          : base > 0
            ? base + config.styleModifier
            : 0;
      return result;
    },
    { ligeiro: 0, poderoso: 0, preciso: 0, sagaz: 0 } as IStyle,
  );

  const effectiveParts = creature.parts.map((part) => {
    const max = Math.max(
      1,
      part.durability.max + config.durabilityModifier,
    );

    return {
      ...part,
      durability: {
        current: Math.min(part.durability.current, max),
        max,
      },
    };
  });

  return {
    maxVigor: config.vigorMax,
    effectiveStyles,
    effectiveParts,
    config,
  };
}

export function createDefaultCreature(
  name = "Nova Criatura",
  lineage: MonsterLineage = "Molheiro",
  stage: MonsterStage = "Adulto",
): ICreature {
  const config = STAGE_CONFIG[stage] ?? STAGE_CONFIG.Adulto;

  return {
    id: createId("creature"),
    identity: {
      name,
      lineage,
      stage,
      size: 4,
      description:
        "Um monstro selvagem da Terra Una adaptado ao seu ecossistema.",
    },
    vigor: {
      current: config.vigorMax,
      max: config.vigorMax,
    },
    styles: cloneStyles(),
    skills: cloneSkills(),
    traits: [
      {
        id: "c-trait-1",
        name: "ARMADURA NATURAL",
        level: 1,
        cost: "Passiva",
        description:
          "Você reduz à metade o Dano causado por GOLPEAR PODEROSO e ATIRAR PODEROSO.",
      },
    ],
    additionalTraits: [
      {
        id: "c-add-trait-1",
        name: "DIETA GENERALISTA",
        description:
          "Pode se alimentar de diversas fontes naturais da região sem restrições severas.",
      },
    ],
    parts: [
      createPart(
        "part-1",
        "Garras",
        "Garras resistentes usadas para ataques de curta distância.",
        {
          range: 1,
          styles: "poderoso",
          skills: "golpear",
          whenBroken:
            "Alcance: 1 (GOLPEAR PODEROSO). Esta PARTE causa metade do Dano.",
        },
      ),
      createPart(
        "part-2",
        "Carapaça",
        "Carapaça que protege o corpo contra impactos frontais.",
        {
          categories: ["Passiva"],
          whenBroken: "Você fica Exposto e perde ARMADURA NATURAL.",
        },
      ),
    ],
    diet:
      "Generalista: frutos silvestres, raízes, pequenas caças e recursos locais.",
    habitat:
      "Costa Sen, arredores da Trilha; fendas rochosas e bosques úmidos.",
    behavior:
      "Se nenhuma criatura estiver Exposta, mire na criatura mais próxima. Seu instinto é manter o domínio territorial e golpear com precisão. Quando Ferido 3, torna-se agressivo e foca em desferir golpes rápidos antes de recuar.",
    conditions: [],
  };
}

export function getStageConfig(stage: MonsterStage): StageConfig {
  return STAGE_CONFIG[stage];
}

export function getLineageOptions(): MonsterLineageDefinition[] {
  return MONSTER_LINEAGES;
}

export const DEFAULT_CREATURE_LINEAGE: MonsterLineage = "Molheiro";
export const DEFAULT_CREATURE_STAGE: MonsterStage = "Adulto";
export const DEFAULT_CREATURE_SIZE = 4;
