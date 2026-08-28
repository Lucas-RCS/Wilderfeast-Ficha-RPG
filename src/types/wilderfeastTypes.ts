import type {
  MonsterLineage,
  MonsterStage,
  OriginDishType,
  SkillKey,
  Skills,
  StyleKey,
} from "./types";

/**
 * Fonte única de verdade para as chaves de Estilo e Perícia, evitando
 * repetir esses arrays em cada tela de criação de ficha.
 */
export const ALL_STYLE_KEYS: StyleKey[] = [
  "ligeiro",
  "poderoso",
  "preciso",
  "sagaz",
];

export const ALL_SKILL_KEYS: SkillKey[] = [
  "agarrar",
  "armazenar",
  "assegurar",
  "atirar",
  "atravessar",
  "chamar",
  "curar",
  "estudar",
  "exibir",
  "golpear",
  "manufaturar",
  "procurar",
];

export const ALL_MONSTER_STAGES: MonsterStage[] = [
  "Jovem",
  "Adulto",
  "Ancião",
  "Zênite",
];

export const ALL_MONSTER_LINEAGES: MonsterLineage[] = [
  "Açougueiro",
  "Amontoeiro",
  "Churrasqueiro",
  "Jardineiro",
  "Molheiro",
  "Padeiro",
  "Peixeiro",
  "Pivoteiro",
];

export const ALL_ORIGIN_DISH_TYPES: OriginDishType[] = [
  "criacao",
  "iniciacao",
  "ambicao",
];

export const ORIGIN_DISH_LABELS: Record<OriginDishType, string> = {
  criacao: "Prato da Criação",
  iniciacao: "Prato da Iniciação",
  ambicao: "Prato da Ambição",
};

/** Objeto de Perícias com todos os valores zerados, pronto para clonar. */
export function createEmptySkills(): Skills {
  return ALL_SKILL_KEYS.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as Skills);
}
