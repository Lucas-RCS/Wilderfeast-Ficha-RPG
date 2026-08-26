import { CreatureSheet, MonsterStage, StyleKey } from "../types";

export const MONSTER_LINEAGES = [
  {
    name: "Açougueiro",
    description:
      "Monstros com protuberâncias de metal ou mineral, carniceiros e predadores blindados.",
  },
  {
    name: "Amontoeiro",
    description:
      "Monstros que acumulam comida em covis, gordura corporal ou reservas duradouras.",
  },
  {
    name: "Churrasqueiro",
    description: "Monstros que convivem com chamas, calor extremo e combustão.",
  },
  {
    name: "Jardineiro",
    description:
      "Monstros que gerenciam a flora, sementes e o crescimento vegetal da Terra Una.",
  },
  {
    name: "Molheiro",
    description:
      "Monstros que excretam secreções, tóxicas, medicinais, mucos e compostos químicos.",
  },
  {
    name: "Padeiro",
    description:
      "Monstros longevos, polinizadores ou com adaptações de grande resiliência.",
  },
  {
    name: "Peixeiro",
    description:
      "Monstros aquáticos, semiaquáticos e voadores dos mares e rios.",
  },
  {
    name: "Pivoteiro",
    description:
      "Monstros definidos por metamorfose, mimetismo, inteligência e adaptação dinâmica.",
  },
  {
    name: "Personalizada",
    description: "Linhagem lendária ou única criada pelo Guia.",
  },
];

export const STAGE_CONFIG: Record<
  MonsterStage,
  {
    label: string;
    vigorMax: number;
    styleModifier: number; // For non-zero styles (or -1 with min 0 for Jovem)
    durabilityModifier: number;
    fullTurnsRule: string;
    traitSpecial?: string;
  }
> = {
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
    fullTurnsRule:
      "2 turnos completos por rodada se enfrentar 3 ou mais ferais.",
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

/**
 * Calculates effective stats from base values and monster stage
 * This guarantees no data degradation across stage switching!
 */
export function calculateEffectiveStats(sheet: CreatureSheet) {
  const stage = sheet.stage || "Adulto";
  const config = STAGE_CONFIG[stage] || STAGE_CONFIG.Adulto;

  const maxVigor = config.vigorMax;

  // Effective Styles calculation:
  // Jovem: base - 1 (min 0)
  // Adulto: base
  // Ancião: base > 0 ? base + 1 : 0
  // Zênite: base > 0 ? base + 2 : 0
  const effectiveStyles: Record<StyleKey, number> = {
    ligeiro:
      stage === "Jovem"
        ? Math.max(0, sheet.baseStyles.ligeiro - 1)
        : sheet.baseStyles.ligeiro > 0
          ? sheet.baseStyles.ligeiro + config.styleModifier
          : 0,
    poderoso:
      stage === "Jovem"
        ? Math.max(0, sheet.baseStyles.poderoso - 1)
        : sheet.baseStyles.poderoso > 0
          ? sheet.baseStyles.poderoso + config.styleModifier
          : 0,
    preciso:
      stage === "Jovem"
        ? Math.max(0, sheet.baseStyles.preciso - 1)
        : sheet.baseStyles.preciso > 0
          ? sheet.baseStyles.preciso + config.styleModifier
          : 0,
    sagaz:
      stage === "Jovem"
        ? Math.max(0, sheet.baseStyles.sagaz - 1)
        : sheet.baseStyles.sagaz > 0
          ? sheet.baseStyles.sagaz + config.styleModifier
          : 0,
  };

  // Effective Part Durability
  const effectiveParts = sheet.parts.map((part) => {
    const effMax = Math.max(
      1,
      part.baseMaxDurability + config.durabilityModifier,
    );
    return {
      ...part,
      effectiveMaxDurability: effMax,
      currentDurability: Math.min(part.currentDurability, effMax),
    };
  });

  return {
    maxVigor,
    effectiveStyles,
    effectiveParts,
    config,
  };
}

export function createDefaultCreature(
  name = "Nova Criatura",
  lineage = "Molheiro",
  stage: MonsterStage = "Adulto",
): CreatureSheet {
  const config = STAGE_CONFIG[stage] || STAGE_CONFIG.Adulto;

  return {
    id: `creature-${Date.now()}`,
    version: 1,
    name,
    lineage,
    stage,
    sizeConcept: "Tem em média 4 metros de comprimento.",
    description:
      "Um monstro selvagem da Terra Una adaptado ao seu ecossistema.",
    lastSaved: new Date().toISOString(),
    vigor: {
      current: config.vigorMax,
    },
    baseStyles: {
      ligeiro: 2,
      poderoso: 2,
      preciso: 1,
      sagaz: 1,
    },
    skills: {
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
    },
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
    diet: {
      type: "Generalista",
      description: "Alimenta-se de frutos silvestres, raízes e pequenas caças.",
      examples: "Monstros terrestres, vegetação nativa, carniça",
    },
    habitat: {
      region: "Costa Sen",
      areas: "Arredores da Trilha",
      notes: "Habita fendas rochosas e bosques úmidos durante as monções.",
    },
    behavior: {
      targetSelection:
        "Se nenhuma criatura estiver Exposta, mire na criatura mais próxima.",
      instincts:
        "Seu instinto é manter o domínio territorial e golpear com precisão.",
      woundedPhase:
        "Quando Ferido 3, torna-se agressivo e foca em desferir golpes rápidos antes de recuar.",
      specialRules: [],
    },
    parts: [
      {
        id: "part-1",
        name: "Garras",
        categories: ["Arma"],
        baseMaxDurability: 20,
        currentDurability: 20,
        weaponReach: 1,
        weaponStyle: "poderoso",
        weaponSkill: "golpear",
        weaponEffect: "Golpe contundente que causa dano direto.",
        brokenEffect:
          "Alcance: 1 (GOLPEAR PODEROSO). Esta PARTE causa metade do Dano.",
      },
      {
        id: "part-2",
        name: "Carapaça",
        categories: ["Ponto Fraco"],
        baseMaxDurability: 20,
        currentDurability: 20,
        weakPointEffect: "Protege contra ataques frontais.",
        brokenEffect: "Você fica Exposto e perde ARMADURA NATURAL.",
      },
    ],
    specialActions: [
      {
        id: "act-1",
        name: "Investida Selvagem",
        type: "Ação",
        cost: "2 Ações",
        description:
          "Move-se em direção ao alvo e desfere um golpe de impacto.",
      },
    ],
    conditions: [],
  };
}
