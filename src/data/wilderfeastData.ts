// ============================================================================
// WILDERFEAST — DADOS DO LIVRO BÁSICO PT-BR
//
// Este arquivo contém definições estáticas compatíveis com types.ts.
// Estado mutável de fichas deve viver em IFeral, ICreature e IMatilha.
// ============================================================================

import type {
  FeralStyles,
  IConditionDefinition,
  ICreature,
  ID,
  ISpecialtyDefinition,
  ITechniqueDefinition,
  ITechniqueState,
  ITraitDefinition,
  IUtensilDefinition,
  SkillKey,
  StyleKey,
  UtensilKey,
} from "../types/types";

export const STYLES: Record<StyleKey, { name: string; description: string }> = {
  ligeiro: {
    name: "LIGEIRO",
    description: "Rápido, enérgico, alerta ou hábil.",
  },
  poderoso: {
    name: "PODEROSO",
    description: "Forte, tenaz, firme ou grosseiro.",
  },
  preciso: {
    name: "PRECISO",
    description: "Calmo, metódico, focado ou acurado.",
  },
  sagaz: {
    name: "SAGAZ",
    description: "Sutil, dissimulado, técnico ou astuto.",
  },
};

export const SKILLS: Record<SkillKey, { name: string; description: string }> = {
  agarrar: {
    name: "AGARRAR",
    description: "Segurar firme, agarrar criaturas ou objetos.",
  },
  armazenar: {
    name: "ARMAZENAR",
    description: "Possuir ou acumular recursos, guardá-los em segurança.",
  },
  assegurar: {
    name: "ASSEGURAR",
    description: "Acalmar ou encorajar criaturas, inclusive a si mesmo.",
  },
  atirar: {
    name: "ATIRAR",
    description: "Atacar à distância.",
  },
  atravessar: {
    name: "ATRAVESSAR",
    description: "Cruzar distâncias.",
  },
  chamar: {
    name: "CHAMAR",
    description:
      "Comunicar-se com criaturas, vocalizar e usar determinados Traços sobrenaturais.",
  },
  curar: {
    name: "CURAR",
    description: "Tratar ou curar ferimentos, inclusive os seus.",
  },
  estudar: {
    name: "ESTUDAR",
    description: "Obter conhecimento e avaliar situações.",
  },
  exibir: {
    name: "EXIBIR",
    description: "Fazer uma demonstração, chamar atenção ou dar um show.",
  },
  golpear: {
    name: "GOLPEAR",
    description: "Atacar de perto.",
  },
  manufaturar: {
    name: "MANUFATURAR",
    description: "Criar ou reparar objetos.",
  },
  procurar: {
    name: "PROCURAR",
    description: "Encontrar coisas, como rastros, comida ou inimigos.",
  },
};

export const utensilDefinitions: IUtensilDefinition[] = [
  {
    id: "Barbante",
    name: "Barbante",
    defaultRange: 1,
    defaultMaxDurability: 20,
    brokenDescription:
      "Se estiver quebrado, alcance adicional de Técnicas é perdido, o Utensílio causa metade do Dano e as Técnicas que exigirem o acesso ao utensílio ficam indisponíveis até recuperá-lo.",
    initialStyleOptions: [
      { main: "ligeiro", secondary: "sagaz" },
      { main: "sagaz", secondary: "ligeiro" },
    ],
    // Inicial: RÉDIA CURTA (3). Opções: ARMADILHA (1), CHICOTADA (2), REPAROS EM CAMPO (4).
    initialTechniqueId: 3,
    techniqueOptionIds: [1, 2, 4],
  },
  {
    id: "Cutelo",
    name: "Cutelo",
    defaultRange: 1,
    defaultMaxDurability: 20,
    brokenDescription:
      "Se estiver quebrado, alcance adicional de Técnicas é perdido, o Utensílio causa metade do Dano e as Técnicas que exigirem o acesso ao utensílio ficam indisponíveis até recuperá-lo.",
    initialStyleOptions: [
      { main: "poderoso", secondary: "preciso" },
      { main: "preciso", secondary: "poderoso" },
    ],
    // Inicial: CORTE LIMPO (10). Opções: ESPADA GRANDE PRA CARA*** (11), SEM DESPERDÍCIO (12), TREINAMENTO MÉDICO (13).
    initialTechniqueId: 10,
    techniqueOptionIds: [11, 12, 13],
  },
  {
    id: "Espeto",
    name: "Espeto",
    defaultRange: 1,
    defaultMaxDurability: 20,
    brokenDescription:
      "Se estiver quebrado, alcance adicional de Técnicas é perdido, o Utensílio causa metade do Dano e as Técnicas que exigirem o acesso ao utensílio ficam indisponíveis até recuperá-lo.",
    initialStyleOptions: [
      { main: "preciso", secondary: "ligeiro" },
      { main: "ligeiro", secondary: "preciso" },
    ],
    // Inicial: SEQUÊNCIA DE MOVIMENTOS (22). Opções: AGULHA E LINHA (19), DESATOLAR (20), ETIQUETA GASTRONÔMICA (21).
    initialTechniqueId: 22,
    techniqueOptionIds: [19, 20, 21],
  },
  {
    id: "Luvas",
    name: "Luvas",
    defaultRange: 1,
    defaultMaxDurability: 20,
    brokenDescription:
      "Se estiver quebrado, alcance adicional de Técnicas é perdido, o Utensílio causa metade do Dano e as Técnicas que exigirem o acesso ao utensílio ficam indisponíveis até recuperá-lo.",
    initialStyleOptions: [
      { main: "poderoso", secondary: "ligeiro" },
      { main: "ligeiro", secondary: "poderoso" },
    ],
    // Inicial: DE PERTINHO (29). Opções: ALCANCE ENCOURAÇADO (28), MÃOS LARGAS, PEGADA FORTE (30), TÔ CONTIGO (31).
    initialTechniqueId: 29,
    techniqueOptionIds: [28, 30, 31],
  },
  {
    id: "Maçarico",
    name: "Maçarico",
    defaultRange: 1,
    defaultMaxDurability: 20,
    brokenDescription:
      "Se estiver quebrado, alcance adicional de Técnicas é perdido, o Utensílio causa metade do Dano e as Técnicas que exigirem o acesso ao utensílio ficam indisponíveis até recuperá-lo.",
    initialStyleOptions: [
      { main: "preciso", secondary: "sagaz" },
      { main: "sagaz", secondary: "preciso" },
    ],
    // Inicial: LINHA DE FOGO (38). Opções: IGNIÇÃO RÁPIDA (37), LUZ GUIA (39), PREAQUECIMENTO (40).
    initialTechniqueId: 38,
    techniqueOptionIds: [37, 39, 40],
  },
  {
    id: "Panela",
    name: "Panela",
    defaultRange: 1,
    defaultMaxDurability: 20,
    brokenDescription:
      "Se estiver quebrado, alcance adicional de Técnicas é perdido, o Utensílio causa metade do Dano e as Técnicas que exigirem o acesso ao utensílio ficam indisponíveis até recuperá-lo.",
    initialStyleOptions: [
      { main: "poderoso", secondary: "sagaz" },
      { main: "sagaz", secondary: "poderoso" },
    ],
    // Inicial: ESCUDO DE AÇO (46). Opções: LANÇAMENTO RICOCHETE (47), POSTURA APRUMADA (48), SUPERFÍCIE ESPELHADA (49).
    initialTechniqueId: 46,
    techniqueOptionIds: [47, 48, 49],
  },
];

export const traitDefinitions: ITraitDefinition[] = [
  {
    id: 1,
    name: "BRIO",
    description: "BRIO. (Custo: 1 Sucesso) Aumente [A] em 1.",
    cost: {
      type: "sucessos",
      amount: 1,
    },
  },
  {
    id: 2,
    name: "TINO",
    description:
      "TINO. (Custo: 1 Sucesso) Estabeleça um detalhe sobre a situação. TRAÇOS MONSTRUOSOS",
    cost: {
      type: "sucessos",
      amount: 1,
    },
  },
  {
    id: 3,
    name: "AMEAÇAR",
    description:
      "AMEAÇAR. (Custo: 1 Sucesso PODEROSO) Uma criatura à sua escolha fica Amedrontada. ◇ AMEAÇAR 2. (Custo: 1 Sucesso PODEROSO) Criaturas à sua escolha ficam Amedrontadas.",
    cost: {
      type: "sucessos",
      amount: 1,
      restriction: "PODEROSO",
    },
    maxLevel: 2,
  },
  {
    id: 4,
    name: "APOSEMÁTICO",
    description:
      "APOSEMÁTICO. (Custo: 2 Ações) Faça um EXIBIR usando qualquer ESTILO. Você fica Exposto e uma criatura à sua escolha fica Amedrontada [A].",
    cost: {
      type: "acoes",
      amount: 2,
    },
  },
  {
    id: 5,
    name: "ARMADURA NATURAL",
    description:
      "ARMADURA NATURAL. (Passiva) Você reduz à metade o Dano causado por GOLPEAR PODEROSO e ATIRAR PODEROSO.",
  },
  {
    id: 6,
    name: "BANHA",
    description:
      "BANHA. (Passiva) Seu Vigor máximo aumenta em 10, mas somente durante A Trilha. ◇ BANHA 2. (Passiva) Seu Vigor máximo aumenta em 10.",
    maxLevel: 2,
  },
  {
    id: 7,
    name: "BIOLUMINESCÊNCIA",
    description:
      "BIOLUMINESCÊNCIA. (Custo: 1 Sucesso SAGAZ) Uma criatura à sua escolha fica Confusa. ◇ BIOLUMINESCÊNCIA 2. (Custo: 1 Sucesso SAGAZ) Uma criatura à sua escolha fica Confusa 2. ◇ BIOLUMINESCÊNCIA 3. (Custo: 1 Sucesso SAGAZ) Uma criatura à sua escolha fica Confusa 3.",
    cost: {
      type: "sucessos",
      amount: 1,
      restriction: "SAGAZ",
    },
    maxLevel: 3,
  },
  {
    id: 8,
    name: "BRINCALHÃO",
    description:
      "BRINCALHÃO. (Custo: 1 Sucesso) Harmonia aumenta em 1. Você pode aumentar Harmonia além do máximo, mas só pode usar esse TRAÇO durante o Recesso.",
    cost: {
      type: "sucessos",
      amount: 1,
    },
  },
  {
    id: 9,
    name: "CABEÇADA",
    description:
      "CABEÇADA. (Custo: 1 Sucesso) Depois de atacar uma criatura, empurre-a para 1 Pernada de você. Se a criatura estiver escalando ou voando, ela cai no Chão.",
    cost: {
      type: "sucessos",
      amount: 1,
    },
  },
  {
    id: 10,
    name: "CAMUFLAGEM",
    description: "CAMUFLAGEM. (Custo: 1 Sucesso SAGAZ) Você fica Escondido.",
    cost: {
      type: "sucessos",
      amount: 1,
      restriction: "SAGAZ",
    },
  },
  {
    id: 11,
    name: "CARNICEIRO",
    description:
      "CARNICEIRO. (Passiva) Você não pode ficar Envenenado por comida. Se Forragear (com sucesso ou não), você também recebe <H> porções do seguinte Ingrediente: Detritos. Receba (1) Envenenado.",
  },
  {
    id: 12,
    name: "CATAR PIOLHO",
    description:
      "CATAR PIOLHO. (Passiva) Se você ajudar um parça a ASSEGURAR, CHAMAR ou EXIBIR e passarem, a Harmonia aumenta em 1.",
  },
  {
    id: 13,
    name: "CHAFURDAR",
    description:
      "CHAFURDAR. (Passiva) Quando você Acampa, pode restaurar uma PARTE para sua Durabilidade máxima.",
  },
  {
    id: 14,
    name: "CHEIRO DE SANGUE",
    description:
      "CHEIRO DE SANGUE. (Passiva) Você tem Vantagem em todos os Testes durante a primeira rodada da Caçada se do outro lado houver uma criatura Ferida.",
  },
  {
    id: 15,
    name: "CHOQUE ELÉTRICO",
    description:
      "CHOQUE ELÉTRICO. (Custo: 2 Ações) Faça um CHAMAR LIGEIRO. Se passar, cada criatura a até 1 Pernada sofre [A] de Dano e fica Atordoada.",
    cost: {
      type: "acoes",
      amount: 2,
    },
  },
  {
    id: 16,
    name: "CLARÃO",
    description:
      "CLARÃO. (Custo: 2 Ações) Faça um EXIBIR LIGEIRO. Se passar, uma criatura à sua escolha fica Atordoada e Confusa [A].",
    cost: {
      type: "acoes",
      amount: 2,
    },
  },
  {
    id: 17,
    name: "CONSTRUTOR DE NINHO",
    description:
      "CONSTRUTOR DE NINHO. (Passiva) Quando a matilha Acampa, você e seus parças podem manter todos os níveis de uma Condição ao invés de removê-los.",
  },
  {
    id: 18,
    name: "CORPO QUENTE",
    description:
      "CORPO QUENTE. (Passiva) No começo de cada rodada, todas as criaturas à sua escolha em até 0 Pernada de você sofrem 2 de Dano. Além disso, se você estiver Preso por uma PARTE, essa PARTE fica Queimada. Por fim, suas PARTES não podem ficar Queimadas.",
  },
  {
    id: 19,
    name: "CULTIVADOR",
    description:
      "CULTIVADOR. (Passiva) Dobre os efeitos recebidos por ceder sua porção do Banquete.",
  },
  {
    id: 20,
    name: "DEFENSOR DO REBANHO",
    description:
      "DEFENSOR DO REBANHO. (Passiva) Se você Agrupar com uma criatura, vocês dois podem Levantar a Guarda sem gastar Ações.",
  },
  {
    id: 21,
    name: "DESORIENTAR",
    description:
      "DESORIENTAR. (Passiva) Criaturas que ataquem você (acertando ou não) ficam Confusas.",
  },
  {
    id: 22,
    name: "DEVORADOR DE ENERGIA",
    description:
      "DEVORADOR DE ENERGIA. (Passiva) Se estiver Convalescente e passar o Recesso próximo a uma leylinha, você recupera 10 de Vigor. Se estiver Ferido e passar o Recesso próximo a uma leylinha, você remove um nível adicional de Ferido.",
  },
  {
    id: 23,
    name: "DIETA GENERALISTA",
    description:
      "DIETA GENERALISTA (Passiva) Quando comer uma refeição com um efeito adicional, você pode ignorá-lo e recuperar Vigor como se tivesse preparado a refeição com Tempero (se a refeição já foi preparada com Tempero, não dobre o Vigor recuperado novamente).",
  },
  {
    id: 24,
    name: "DIETA SELETIVA",
    description:
      "DIETA SELETIVA. (Passiva) Quando receber esse TRAÇO, nomeie um Ingrediente. Você recebe <H> porções desse Ingrediente no começo de cada Recesso e quando Reabastecer.",
  },
  {
    id: 25,
    name: "DIGESTÃO LENTA",
    description:
      "DIGESTÃO LENTA. (Passiva) Refeições com efeitos que durem até a sua próxima refeição duram até o fim da Jornada.",
  },
  {
    id: 26,
    name: "ECOLOCALIZAÇÃO",
    description:
      "ECOLOCALIZAÇÃO. (Custo: 1 Sucesso em um CHAMAR) Uma criatura à sua escolha fica Exposta.",
    cost: {
      type: "sucessos",
      amount: 1,
      restriction: "em um CHAMAR",
    },
  },
  {
    id: 27,
    name: "ELETRORRECEPTIVIDADE",
    description:
      "ELETRORRECEPTIVIDADE. (Passiva) Criaturas Escondidas não têm Vantagem se Atacarem você. representar outros sentidos pouco convencionais, como a habilidade para detectar radiação infravermelha ou leylinhas, sem mudar a mecânica.",
  },
  {
    id: 28,
    name: "ENGOLIR INTEIRO",
    description:
      "ENGOLIR INTEIRO. (Custo: 1 Ação) Coma qualquer quantidade de Ingredientes para recuperar uma quantidade igual de Vigor. Você não recebe nenhum efeito bônus.",
  },
  {
    id: 29,
    name: "ENXAME",
    description:
      "ENXAME. (Passiva) Se você ajudar uma criatura que também tem esse TRAÇO, ambos recuperam <H> de Vigor.",
  },
  {
    id: 30,
    name: "ESCALAR",
    description:
      "ESCALAR (Passiva) Você pode ESCALAR sem Desvantagem. ◇ ESCALAR 2. (Passiva) Você pode ESCALAR sem Desvantagem. Além disso, ao Mover-se enquanto escala, você pode se Mover 2 Pernadas em vez de 1. ◇ ESCALAR 3. (Passiva) Você pode ESCALAR sem Desvantagem. Além disso, Ao Mover-se enquanto escala, você pode se Mover até 2 Pernadas em vez de 1. Por fim, você tem Vantagem para ATRAVESSAR enquanto escala.",
    maxLevel: 3,
  },
  {
    id: 31,
    name: "ESCAVAR",
    description:
      "ESCAVAR. (Passiva) Você pode cavar. ◇ ESCAVAR 2. (Passiva) Você pode cavar. Além disso, ao Mover-se enquanto cava, você pode se Mover até 2 Pernadas em vez de 1. ◇ ESCAVAR 3. (Passiva) Você pode cavar. Além disso, ao Mover-se enquanto cava, você pode se Mover até 2 Pernadas em vez de 1. Por fim, você tem Vantagem em ATRAVESSAR enquanto cava.",
    maxLevel: 3,
  },
  {
    id: 32,
    name: "ESCORREGADIO",
    description: "ESCORREGADIO. (Passiva) Você não pode ficar Preso.",
  },
  {
    id: 33,
    name: "ESTASE",
    description:
      "ESTASE. (Passiva) Quando estiver prestes a morrer, você entra em estase. Sua matilha deve Trabalhar em um Projeto durante o Recesso para revivê-lo, completando um Desafio VA 10. O VA aumenta em 10 para cada vez que você usa esse TRAÇO subsequentemente.",
  },
  {
    id: 34,
    name: "EXPANDIR",
    description: "EXPANDIR. (Custo: 1 Ação) Você fica Expandido.",
  },
  {
    id: 35,
    name: "EXPLOSÃO SÔNICA",
    description:
      "EXPLOSÃO SÔNICA. (Passiva) Quando Atacar, você pode CHAMAR em vez de ATIRAR ou GOLPEAR.",
  },
  {
    id: 36,
    name: "FAMINTO",
    description:
      "FAMINTO. (Custo: 1 de Harmonia) Role novamente seu Dado de Ação. esse TRAÇO misterioso representa uma fome primordial e sobrenatural acima de tudo. Quando os ferais abraçam essa fome extrema, criam aberturas para que o frenesi se espalhe, tanto por dentro quanto por fora.",
  },
  {
    id: 37,
    name: "FERMENTADOR",
    description:
      "FERMENTADOR. (Passiva) Quando comer uma refeição, em vez de recuperar Vigor, você pode receber um número de níveis de Revigorado igual à metade da Vigor que teria recuperado. ambos são especializados em extrair nutrientes de plantas de difícil digestão.",
  },
  {
    id: 38,
    name: "FLUTUANTE",
    description:
      "FLUTUANTE. (Passiva) Desde que você possa voar, pode ignorar os Traços desta Área.",
  },
  {
    id: 39,
    name: "FOTOSSÍNTESE",
    description:
      "FOTOSSÍNTESE. (Custo: 3 Ações) Se você tiver acesso ao Céu, recupere seu Vigor para o máximo.",
    cost: {
      type: "acoes",
      amount: 3,
    },
  },
  {
    id: 40,
    name: "GIGANTESCO",
    description:
      "GIGANTESCO. (Passiva) Trate todas as criaturas como se estivessem 3 Pernadas mais próximas de você do que realmente estão.",
  },
  {
    id: 41,
    name: "HIBERNADOR",
    description:
      "HIBERNADOR. (Passiva) Cada nível de Descansado aumenta seu Vigor máximo em 2 em vez de 1.",
  },
  {
    id: 42,
    name: "INABALÁVEL",
    description: "INABALÁVEL. (Passiva) Você não pode ficar Confuso.",
  },
  {
    id: 43,
    name: "INCANSÁVEL",
    description:
      "INCANSÁVEL. (Custo: 1 Sucesso PODEROSO) Remove <H> Fadigado e recupera <H> Vigor.",
    cost: {
      type: "sucessos",
      amount: 1,
      restriction: "PODEROSO",
    },
  },
  {
    id: 44,
    name: "INVESTIDA",
    description:
      "INVESTIDA. (Custo: 1 Ação) Escolha uma criatura a até 3 Pernadas. Você se Move a 0 Pernada da criatura e então causa Dano a ela e a si mesmo ao número de Pernadas que você se Moveu (Isso não conta como gastar Vigor.)",
  },
  {
    id: 45,
    name: "LADRÃO",
    description:
      "LADRÃO. (Custo: 1 Sucesso SAGAZ) Roube um Ingrediente, um Lanche ou uma criatura Presa de um alvo que esteja a até 1 Pernada de você. (Você escolhe se a criatura Presa roubada por você agora está Presa por você ou livre.)",
    cost: {
      type: "sucessos",
      amount: 1,
      restriction: "SAGAZ",
    },
  },
  {
    id: 46,
    name: "MERGULHAR",
    description:
      "MERGULHAR. (Custo: 1 Ação) Mova para até 0 Pernada de uma criatura em um Terreno abaixo de você (Céu está acima da maioria dos Terrenos, e o Subterrâneo está abaixo da maioria dos Terrenos. Nos demais casos, avalie conforme seu julgamento).",
  },
  {
    id: 47,
    name: "METAMORFOSE",
    description:
      "METAMORFOSE. (Passiva) Durante O Banquete, você pode perder este TRAÇO permanentemente. Se fizer isso, escolha dois ESTILOS, HABILIDADES ou TRAÇOS para ganhar um nível no lugar deste traço.",
  },
  {
    id: 48,
    name: "MIGRADOR",
    description: "Definição do Traço conforme o Livro Básico de Wilderfeast.",
  },
  {
    id: 49,
    name: "MIMETISMO VOCAL",
    description:
      "MIMETISMO VOCAL. (Custo: 2 Ações) Faça um CHAMAR SAGAZ. Se passar, escolha um desses efeitos: uma criatura a sua escolha fica Confusa [A], uma criatura a sua escolha fica Amedrontada [A], ou todas as criaturas a até 1 Pernada de você sofrem cada uma [A] de Dano e ficam Atordoadas.",
    cost: {
      type: "acoes",
      amount: 2,
    },
  },
  {
    id: 50,
    name: "MIRA INSTINTIVA",
    description:
      "MIRA INSTINTIVA. (Custo: 1 Sucesso em ATIRAR) A criatura atingida por ATIRAR fica Atordoada.",
    cost: {
      type: "sucessos",
      amount: 1,
      restriction: "em ATIRAR",
    },
  },
  {
    id: 51,
    name: "NADAR",
    description:
      "NADAR. (Passiva) Você pode nadar sem Desvantagem. ◇ NADAR 2. (Passiva) Você pode nadar sem Desvantagem. Além disso, caso se Mova enquanto nada, você pode se Mover até 2 Pernadas em vez de 1. ◇ NADAR 3. (Passiva) Você pode nadar sem Desvantagem. Além disso, caso se Mova enquanto nada, você pode se Mover até 2 Pernadas em vez de 1. Por fim, você tem Vantagem para ATRAVESSAR enquanto nada.",
    maxLevel: 3,
  },
  {
    id: 52,
    name: "NÃO-ME-TOQUE",
    description:
      "NÃO-ME-TOQUE. (Passiva) Se uma criatura fizer um AGARRAR ou GOLPEAR contra você, cause 1 de Dano a ela. ◇ NÃO-ME-TOQUE 2 A 5. (Passiva) Se uma criatura fizer um AGARRAR ou GOLPEAR contra você, cause 1 de Dano a ela para cada nível desse TRAÇO.",
    maxLevel: 5,
  },
  {
    id: 53,
    name: "OSTENTAR",
    description:
      "OSTENTAR. (Custo: 2 Ações) Faça um EXIBIR PODEROSO. Se passar, todas as criaturas à sua escolha recuperam [A] de Vigor.",
    cost: {
      type: "acoes",
      amount: 2,
    },
  },
  {
    id: 54,
    name: "PACIÊNCIA",
    description:
      "PACIÊNCIA. (Passiva) Você pode Preparar até 3 vezes por turno.",
  },
  {
    id: 55,
    name: "PARASITA DE NINHADA",
    description:
      "PARASITA DE NINHADA. (Passiva) Quando trabalhar em um Projeto, escolha um NPC: o personagem escolhido também faz um Teste para contribuir para o seu projeto. (Trabalhe com a Guia para determinar os detalhes, como a maneira como o NPC ajuda e como você o convenceu a fazê-lo.)",
  },
  {
    id: 56,
    name: "PERSEGUIÇÃO DO PREDADOR",
    description:
      "PERSEGUIÇÃO DO PREDADOR. (Passiva) Se você se Mover em direção a uma criatura, ganhe Vantagem ao Ataca-la até o final do seu turno.",
  },
  {
    id: 57,
    name: "POLINIZADOR",
    description:
      "POLINIZADOR. (Custo: 1 Sucesso em um PROCURAR) Harmonia aumenta em 1.",
    cost: {
      type: "sucessos",
      amount: 1,
      restriction: "em um PROCURAR",
    },
  },
  {
    id: 58,
    name: "PREDADOR DE EMBOSCADA",
    description:
      "PREDADOR DE EMBOSCADA. (Passiva) Se você Atacar enquanto estiver Escondido, você causa o dobro do Dano.",
  },
  {
    id: 59,
    name: "PREDADOR RESISTENTE",
    description:
      "PREDADOR RESISTENTE. (Custo: 1 Sucesso PODEROSO ou LIGEIRO) Uma criatura à sua escolha fica Fadigada.",
    cost: {
      type: "sucessos",
      amount: 1,
      restriction: "PODEROSO ou LIGEIRO",
    },
  },
  {
    id: 60,
    name: "PREDADOR SOCIÁVEL",
    description: "Definição do Traço conforme o Livro Básico de Wilderfeast.",
  },
  {
    id: 61,
    name: "PROFESSOR",
    description:
      "PROFESSOR. (Custo: 1 Sucesso PRECISO) Até o final da rodada, seus parças têm Vantagem se fizerem um Teste usando a mesma HABILIDADE que você usou ao ativar esse TRAÇO.",
    cost: {
      type: "sucessos",
      amount: 1,
      restriction: "PRECISO",
    },
  },
  {
    id: 62,
    name: "RECUO",
    description:
      "RECUO. (Custo: 1 Sucesso PODEROSO ou PRECISO) Você Levanta a guarda sem gastar Ações, mas não pode se Mover até o início do seu próximo turno.",
    cost: {
      type: "sucessos",
      amount: 1,
      restriction: "PODEROSO ou PRECISO",
    },
  },
  {
    id: 63,
    name: "REFLEXOS NATURAIS",
    description:
      "REFLEXOS NATURAIS. (Passiva) Você reduz o Dano causado por GOLPEAR LIGEIRO e ATIRAR LIGEIRO pela metade.",
  },
  {
    id: 64,
    name: "REGENERAÇÃO",
    description:
      "REGENERAÇÃO. (Custo: 1 Sucesso) Recupere 1 de Durabilidade de uma de suas PARTES. ◇ REGENERAÇÃO 2 A 5. (Custo: 1 Sucesso) Recupere 1 de Durabilidade de uma de suas PARTES para cada nível que tiver nesse TRAÇO.",
    cost: {
      type: "sucessos",
      amount: 1,
    },
    maxLevel: 5,
  },
  {
    id: 65,
    name: "RESISTENTE A IMPACTO",
    description:
      "RESISTENTE A IMPACTO. (Passiva) Você não pode ficar Atordoado.",
  },
  {
    id: 66,
    name: "ROBUSTO",
    description:
      "ROBUSTO. (Passiva) Nada pode empurrá-lo ou puxá-lo, a menos que você permita ou esteja Preso.",
  },
  {
    id: 67,
    name: "SACRIFÍCIO PARENTAL",
    description:
      "SACRIFÍCIO PARENTAL. (Passiva) No início do Recesso, em vez de remover Ferido 1, você pode Trabalhar num Projeto sem gastar Ações.",
  },
  {
    id: 68,
    name: "SANGUESSUGA",
    description:
      "SANGUESSUGA. (Custo: 3 Ações) Faça um GOLPEAR PRECISO contra uma criatura a 1 Pernada de distância. Se passar, você ganha um nível em um dos ESTILOS, HABILIDADES ou TRAÇOS da criatura até o final da Jornada (a criatura NÃO precisa ter mais níveis na característica escolhida do que você). Se você usar esse TRAÇO de novo, troque o nível que ganhou anteriormente pelo novo.",
    cost: {
      type: "acoes",
      amount: 3,
    },
  },
  {
    id: 69,
    name: "SEDATIVO",
    description:
      "SEDATIVO. (Custo: 1 Ação) Até o começo de seu próximo turno, todas as criaturas precisam gastar 1 Ação adicional para Atacar.",
  },
  {
    id: 70,
    name: "SENTIDOS AGUÇADOS",
    description:
      "SENTIDOS AGUÇADOS. (Custo: 1 Sucesso PRECISO) Uma criatura à sua escolha fica Exposta. contas, é uma forma mais simples de SENTIDOS AGUÇADOS. Trabalhe a personalização desse TRAÇO com sua Guia. Se deseja representar um tipo específico de sentido e mudar seu custo de 1 Sucesso PRECISO, você pode alterar para 1 Sucesso da HABILIDADE, caso seja apropriado. Exemplo: Uma habilidade semelhante à de uma aranha sentindo vibrações através de uma teia pode ter seu custo alterado para 1 Sucesso em MANUFATURAR",
    cost: {
      type: "sucessos",
      amount: 1,
      restriction: "PRECISO",
    },
  },
  {
    id: 71,
    name: "SOPRO DE FOGO",
    description:
      "SOPRO DE FOGO. (Custo: 2 Ações) Faça um ATIRAR PODEROSO contra uma criatura a até 2 Pernadas de distância. Se acertar, você causa [A] Dano à Parte e a PARTE que você alvejou fica Queimada.",
    cost: {
      type: "acoes",
      amount: 2,
    },
  },
  {
    id: 72,
    name: "TANATOSE",
    description:
      "TANATOSE. (Passiva) Se você estiver Ferido 3 e permanecendo caído, no final de cada turno, você pode forçar a barra em vez disso. Se estiver Ferido 3 e forçando a barra, no início do seu turno, você pode escolher permanecer caído em vez disso.",
  },
  {
    id: 73,
    name: "TERRITORIAL",
    description:
      "TERRITORIAL. (Passiva) Você tem Vantagem em todos os Testes contra intrusos em sua Toca.",
  },
  {
    id: 74,
    name: "VELOCIDADE",
    description:
      "VELOCIDADE. (Custo: 1 Sucesso LIGEIRO) Você pode se Mover sem gastar uma Ação.",
    cost: {
      type: "sucessos",
      amount: 1,
      restriction: "LIGEIRO",
    },
  },
  {
    id: 75,
    name: "VENENO",
    description:
      "VENENO. (Custo: 1 Sucesso em ATIRAR ou GOLPEAR) A criatura atingida por ATIRAR ou GOLPEAR fica Envenenada. ◇ VENENO 2. (Custo: 1 Sucesso em ATIRAR ou GOLPEAR) A criatura atingida por ATIRAR ou GOLPEAR fica Envenenada 2. ◇ VENENO 3. (Custo: 1 Sucesso em ATIRAR ou GOLPEAR) A criatura atingida por ATIRAR ou GOLPEAR fica Envenenada 3.",
    cost: {
      type: "sucessos",
      amount: 1,
      restriction: "em ATIRAR ou GOLPEAR",
    },
    maxLevel: 3,
  },
  {
    id: 76,
    name: "VOAR",
    description:
      "VOAR. (Passiva) Você pode voar. ◇ VOAR 2. (Passiva) Você pode voar. Além disso, caso se Mova enquanto voa, você pode se Mover 2 Pernadas em vez de 1. ◇ VOAR 3. (Passiva) Você pode voar. Além disso, caso se Mova enquanto voa, você pode se Mover 2 Pernadas em vez de 1. Por fim, você tem Vantagem em todos seus ATRAVESSAR enquanto voa.",
    maxLevel: 3,
  },
  {
    id: 77,
    name: "TECE-TEIAS",
    description:
      "TECE-TEIAS. (Custo: 2 Ações) Faça um MANUFATURAR SAGAZ. Se passar, na próxima vez em que uma criatura hostil se Mover em sua direção, ela sofre [A] Dano à Parte e não pode se Mover até o início do próximo turno. você pode usar TECE-TEIAS para virar o bicho.",
    cost: {
      type: "acoes",
      amount: 2,
    },
  },
  {
    id: 78,
    name: "ACELERAR",
    description: "Você pode se Mover sem gastar uma Ação.",
    cost: {
      type: "sucessos",
      amount: 1,
      restriction: "LIGEIRO",
    },
  },
  {
    id: 79,
    name: "DESORIENTANTE",
    description:
      "Criaturas que Ataquem você ficam Confusas, independentemente de o ataque acertar ou falhar.",
  },
  {
    id: 80,
    name: "CORPO EM CHAMAS",
    description:
      "Traço específico de certos criaturas: gera calor ou dano em curta distância e pode queimar Utensílios, conforme a ficha do criatura.",
    maxLevel: null,
  },
];

export const conditionDefinitions: IConditionDefinition[] = [
  {
    id: 1,
    name: "Amedrontado",
    description:
      "Depois de qualquer Teste, reduza [A] em X. Durante seu turno, você ou um parça pode gastar 3 de Vigor para fazer ASSEGURAR com qualquer Estilo e remover [A] níveis em um Sucesso; é possível repetir enquanto houver Vigor. Todos os níveis são removidos após recuar.",
  },
  {
    id: 2,
    name: "Atordoado",
    description:
      "Você tem X Ações a menos no começo do turno. Remova 1 nível ao iniciar um turno curto e todos os níveis ao iniciar um turno completo.",
  },
  {
    id: 3,
    name: "Confuso",
    description:
      "Cada uso de um Traço que não seja Passivo e não seja BRIO ou TINO causa X de Dano. Remova 1 nível ao concluir um turno curto sem usar Traço qualificado ou todos os níveis após um turno completo sem usar Traço qualificado. Não pode ser removida no mesmo turno em que foi recebida.",
  },
  {
    id: 4,
    name: "Convalescente",
    description:
      "Condição exclusiva de criaturas. A criatura se recupera de trauma, ignora outras Condições e não recupera Vigor naturalmente. Remova 1 nível quando comida recuperar seu Vigor ao máximo; se ainda restar Convalescente, o Vigor volta a 0 e apenas o excedente da refeição é aplicado.",
    maxLevel: 6,
  },
  {
    id: 5,
    name: "Descansado",
    description:
      "Seu Vigor máximo aumenta em X. Remova todos os níveis ao ficar Ferido. Se ficar Fadigado enquanto Descansado, remova níveis de ambas em proporção de um para um.",
  },
  {
    id: 6,
    name: "Dissonante",
    description:
      "Seus pensamentos e instintos estão em conflito; você tem Desvantagem em todos os Testes. Remova quando a Harmonia ficar maior que 0.",
  },
  {
    id: 7,
    name: "Envenenado",
    description:
      "No início de cada rodada, você sofre X de Dano. Durante seu turno, você ou um parça pode usar 1 Ação para CURAR com qualquer Estilo e remover [A] níveis em um Sucesso.",
  },
  {
    id: 8,
    name: "Escondido",
    description:
      "Você Ataca com Vantagem e criaturas Atacam você com Desvantagem. Você não pode se tornar alvo de um Monstro, embora permaneça alvo até ele escolher novamente. Remova após fazer qualquer Teste; se ficar Exposto enquanto Escondido, remova ambas.",
  },
  {
    id: 9,
    name: "Expandido",
    description:
      "Você aumenta temporariamente de tamanho; trate todas as criaturas como se estivessem 1 Pernada mais próximas. Remova gastando 1 Ação no seu turno.",
  },
  {
    id: 10,
    name: "Exposto",
    description:
      "Você sofre Dano dobrado. Remova ao Levantar a Guarda ou sofrer Dano durante A Caçada. Se ficar Escondido enquanto Exposto, remova ambas.",
  },
  {
    id: 11,
    name: "Fadigado",
    description:
      "Seu Vigor máximo diminui em X. Se ficar Descansado enquanto Fadigado, remova níveis de ambas em proporção de um para um.",
  },
  {
    id: 12,
    name: "Ferido",
    description:
      "Ferido 1 não possui efeito isolado, mas interage com outras regras. Em Ferido 2 você não pode gastar Vigor. Em Ferido 3 você não pode recuperar nem gastar Vigor e, se permanecer caído, fica fora de ação; ao forçar a barra pode agir, mas o próximo Dano enquanto Ferido 3 causa morte.",
    maxLevel: 3,
  },
  {
    id: 13,
    name: "Preso",
    description:
      "Uma Parte da criatura o agarra e o puxa a 0 Pernada. Você não pode se Mover e sofre Desvantagem em todos os Testes. Remova quando a Parte que prende sofrer Dano à Parte ou você for deslocado para longe.",
  },
  {
    id: 14,
    name: "Queimado",
    description:
      "Afeta Partes: você tem Desvantagem ao Atacar com a Parte. Remova ao recuperar qualquer Durabilidade dessa Parte ou ao estar Debaixo d’Água ou no Subterrâneo.",
  },
  {
    id: 15,
    name: "Revigorado",
    description:
      "No começo de cada rodada, recupere X Vigor. Remova 1 nível no início de cada rodada.",
  },
];

export const techniqueDefinitions: ITechniqueDefinition[] = [
  {
    id: 1,
    name: "ARMADILHA",
    level: "Iniciante",
    description:
      "ARMADILHA. (Custo: 2 Ações) Faça um MANUFATURAR SAGAZ. Se passar, na próxima vez em que uma criatura hostil se Mover em sua direção, ela sofre [A] Dano à Parte e não pode Mover até o início do próximo turno dela.",
    cost: {
      type: "acoes",
      amount: 2,
    },
    utensils: ["Barbante"],
  },
  {
    id: 2,
    name: "CHICOTADA",
    level: "Iniciante",
    description:
      "CHICOTADA. (Passiva) Seu Barbante recebe: “Alcance: 2 (GOLPEAR)”.",
    utensils: ["Barbante"],
  },
  {
    id: 3,
    name: "RÉDEA CURTA",
    level: "Iniciante",
    description:
      "RÉDEA CURTA. (Custo: 3 de Vigor) Escolha entre puxar a si mesmo 1 Pernada em direção a uma criatura, ou puxar um parça 1 Pernada para mais perto de você.",
    cost: {
      type: "vigor",
      amount: 3,
    },
    utensils: ["Barbante"],
  },
  {
    id: 4,
    name: "REPAROS EM CAMPO",
    level: "Iniciante",
    description:
      "REPAROS EM CAMPO. (Custo: 2 Ações) Escolha um parça a até 0 Pernada e faça um MANUFATURAR LIGEIRO. Se passar, recupere [A] Durabilidade do UTENSÍLIO do parça escolhido.",
    cost: {
      type: "acoes",
      amount: 2,
    },
    utensils: ["Barbante"],
  },
  {
    id: 5,
    name: "ARREIOS DE SEGURANÇA",
    level: "Intermediária",
    description:
      "ARREIOS DE SEGURANÇA. (Passiva) Se sofrer Dano durante a Trilha, seu Vigor não pode ficar menor que 1.",
    utensils: ["Barbante"],
  },
  {
    id: 6,
    name: "CESTA ABUNDANTE",
    level: "Intermediária",
    description:
      "CESTA ABUNDANTE. (Custo: 1 Vigor) Se você Forrageia com sucesso, pode escolher um ESTILO diferente do que usou para Forragear. Se fizer isso, colha ingredientes que correspondam a esse ESTILO.",
    cost: {
      type: "vigor",
      amount: 1,
    },
    utensils: ["Barbante"],
  },
  {
    id: 7,
    name: "FIO EMARANHADO",
    level: "Intermediária",
    description:
      "FIO EMARANHADO. (Custo: 3 Vigor) Se você Atacar uma criatura e acertar, ela tem Desvantagem em seu próximo Ataque.",
    cost: {
      type: "vigor",
      amount: 3,
    },
    utensils: ["Barbante"],
  },
  {
    id: 8,
    name: "CORRENTES DE PRATA PRENDEM O MUNDO",
    level: "Avançada",
    description:
      "CORRENTES DE PRATA PRENDEM O MUNDO. (Custo: 5 Vigor) Se você Atacar uma criatura e acertar, ela fica Presa pelo seu BARBANTE. Enquanto a criatura estiver Presa, você não pode Atacar. Além disso, no começo de cada rodada, você deve gastar 5 de Vigor ou remover a Condição.",
    cost: {
      type: "vigor",
      amount: 5,
    },
    utensils: ["Barbante"],
  },
  {
    id: 9,
    name: "PRINCÍPIO DA FORMA INCONSTANTE",
    level: "Avançada",
    description:
      "PRINCÍPIO DA FORMA INCONSTANTE. (Variável) Aprenda uma Técnica de qualquer outro UTENSÍLIO.",
    utensils: ["Barbante"],
  },
  {
    id: 10,
    name: "CORTE LIMPO",
    level: "Iniciante",
    description:
      "CORTE LIMPO. (Custo: 4 Ações) Faça um GOLPEAR PODEROSO ou GOLPEAR PRECISO contra uma criatura a até 1 Pernada de distância. Se acertar, dê [A] × 2 Dano à Parte. Se falhar, fique Exposto.",
    cost: {
      type: "acoes",
      amount: 4,
    },
    utensils: ["Cutelo"],
  },
  {
    id: 11,
    name: "ESPADA GRANDE PRA CARA***",
    level: "Iniciante",
    description:
      "ESPADA GRANDE PRA CARA***. (Custo: 3 de Vigor) um humano à sua escolha fica Amedrontado.",
    cost: {
      type: "vigor",
      amount: 3,
    },
    utensils: ["Cutelo"],
  },
  {
    id: 12,
    name: "SEM DESPERDÍCIO",
    level: "Iniciante",
    description:
      "SEM DESPERDÍCIO. (Passiva) Depois que você terminar O Banquete, você recebe 1 porção deste Ingrediente: O Melhor Pedaço. Receba (+1) em qualquer ESTILO.",
    utensils: ["Cutelo"],
  },
  {
    id: 13,
    name: "TREINAMENTO MÉDICO",
    level: "Iniciante",
    description:
      "TREINAMENTO MÉDICO. (Passiva) Uma vez por Recesso, escolha um parça para remover 1 nível de Ferido.",
    utensils: ["Cutelo"],
  },
  {
    id: 14,
    name: "ESTUDANTE DE OSSOS",
    level: "Intermediária",
    description:
      "ESTUDANTE DE OSSOS. (Passiva) Você tem Vantagem quando Ataca qualquer criatura que sua matilha matou durante a Jornada anterior (discuta com a Guia se você recebe esse bônus contra criaturas que matou na sua origem.)",
    utensils: ["Cutelo"],
  },
  {
    id: 15,
    name: "MARCA DO CIRURGIÃO",
    level: "Intermediária",
    description:
      "MARCA DO CIRURGIÃO. (Custo: 5 de Vigor) Escolha a PARTE de uma criatura. Aquela PARTE perde o dobro de Durabilidade quando sofre Dano. O efeito dessa Técnica acaba quando essa PARTE quebra ou ao usar essa Técnica novamente.",
    cost: {
      type: "vigor",
      amount: 5,
    },
    utensils: ["Cutelo"],
  },
  {
    id: 16,
    name: "SEM MEDO DA MORTE",
    level: "Intermediária",
    description:
      "SEM MEDO DA MORTE. (Passiva) Você pode gastar Vigor enquanto estiver Ferido 2.",
    utensils: ["Cutelo"],
  },
  {
    id: 17,
    name: "BESTA ENSANGUENTADA",
    level: "Avançada",
    description:
      "BESTA ENSANGUENTADA. (Passiva) Você pode ficar Ferido 4. Quando estiver Ferido 2 ou mais, você sofre os efeitos do nível anterior. (Por exemplo, se estiver Ferido 3, sofre os efeitos como se estivesse Ferido 2.)",
    utensils: ["Cutelo"],
  },
  {
    id: 18,
    name: "LÂMINA INEVITÁVEL",
    level: "Avançada",
    description:
      "LÂMINA INEVITÁVEL. (Custo: 10 Vigor) Se você GOLPEAR, recebe 1 Sucesso. Você não pode usar essa Técnica se virar o bicho.",
    cost: {
      type: "vigor",
      amount: 10,
    },
    utensils: ["Cutelo"],
  },
  {
    id: 19,
    name: "AGULHA E LINHA",
    level: "Iniciante",
    description:
      "AGULHA E LINHA. (Passiva) Seu Espeto recebe: “Alcance: 2 (ATIRAR). Se fizer um ATIRAR com este UTENSÍLIO e acertar, você pode se puxar 1 Pernada em direção ao seu alvo.”",
    utensils: ["Espeto"],
  },
  {
    id: 20,
    name: "DESATOLAR",
    level: "Iniciante",
    description:
      "DESATOLAR. (Custo: 3 de Vigor) você pode refazer um ATRAVESSAR.",
    cost: {
      type: "vigor",
      amount: 3,
    },
    utensils: ["Espeto"],
  },
  {
    id: 21,
    name: "ETIQUETA GASTRONÔMICA",
    level: "Iniciante",
    description:
      "ETIQUETA GASTRONÔMICA. (Custo: 3 de Vigor) Escolha uma Comunidade humana. A Guia diz uma ação que fará com que eles aprovem você e uma ação que fará com que eles o rejeitem.",
    cost: {
      type: "vigor",
      amount: 3,
    },
    utensils: ["Espeto"],
  },
  {
    id: 22,
    name: "SEQUÊNCIA DE MOVIMENTOS",
    level: "Iniciante",
    description:
      "SEQUÊNCIA DE MOVIMENTOS. (Custo: 5 de Vigor) Você recebe uma Ação extra se estiver na Caçada.",
    cost: {
      type: "vigor",
      amount: 5,
    },
    utensils: ["Espeto"],
  },
  {
    id: 23,
    name: "ESPETINHO MISTO",
    level: "Intermediária",
    description:
      "ESPETINHO MISTO. (Passiva) Quando sua matilha Acampa e prepara uma refeição, a refeição pode ter um efeito adicional.",
    utensils: ["Espeto"],
  },
  {
    id: 24,
    name: "PONTO DE PRESSÃO",
    level: "Intermediária",
    description:
      "PONTO DE PRESSÃO. (Custo: 5 Vigor) Se você causar Dano à Parte, a PARTE alvejada torna-se temporariamente quebrada até o final do próximo turno do Monstro.",
    cost: {
      type: "vigor",
      amount: 5,
    },
    utensils: ["Espeto"],
  },
  {
    id: 25,
    name: "SALTO COM VARA",
    level: "Intermediária",
    description:
      "SALTO COM VARA. (Custo: 1 de Vigor) Até o início de sua próxima rodada, você ganha 1 nível em VOAR.",
    cost: {
      type: "vigor",
      amount: 1,
    },
    utensils: ["Espeto"],
  },
  {
    id: 26,
    name: "LANÇA SEM SOMBRA",
    level: "Avançada",
    description:
      "LANÇA SEM SOMBRA. (Passiva) Durante a primeira rodada da Caçada, você tem um turno mesmo que o Monstro tenha a iniciativa e recebe 3 Ações em vez de 1.",
    utensils: ["Espeto"],
  },
  {
    id: 27,
    name: "NESSA LONGA ESTRADA DA VIDA",
    level: "Avançada",
    description:
      "NESSA LONGA ESTRADA DA VIDA. (Custo: 4 Vigor) Antes de um Evento começar, a Guia gera um Evento adicional do mesmo tipo. Escolha um desses Eventos como opção de caminho para a matilha seguir e ignore o resto (a Guia prevê suas opções por meio da narração).",
    cost: {
      type: "vigor",
      amount: 4,
    },
    utensils: ["Espeto"],
  },
  {
    id: 28,
    name: "ALCANCE ENCOURAÇADO",
    level: "Iniciante",
    description:
      "ALCANCE ENCOURAÇADO. (Passiva) Você não sofre Dano de TRAÇOS Passivos (como CORPO QUENTE ou NÃO-ME-TOQUE).",
    utensils: ["Luvas"],
  },
  {
    id: 29,
    name: "DE PERTINHO",
    level: "Iniciante",
    description:
      "DE PERTINHO. (Passiva) Você tem Vantagem em GOLPEAR contra criaturas a 0 Pernada de você.",
    utensils: ["Luvas"],
  },
  {
    id: 30,
    name: "MÃOS LARGAS, PEGADA FORTE",
    level: "Iniciante",
    description:
      "MÃOS LARGAS, PEGADA FORTE. (Custo: 2 de Vigor) Até o início de sua próxima rodada, você ganha 1 nível em um dos seguintes Traços: ESCALAR, ESCAVAR ou NADAR.",
    cost: {
      type: "vigor",
      amount: 2,
    },
    utensils: ["Luvas"],
  },
  {
    id: 31,
    name: "TÔ CONTIGO",
    level: "Iniciante",
    description:
      "TÔ CONTIGO. (Custo: 2 de Vigor) Escolha uma criatura Convalescente ou Ferida a até 0 Pernada. Você a carrega. Enquanto estiver carregando essa criatura, você não pode Atacar e, se ela sofrer Dano, você sofre o Dano em seu lugar. Você pode colocar a criatura no chão a qualquer momento. Se a criatura for um criatura, essa técnica tem um custo adicional de 3 de Vigor.",
    cost: {
      type: "vigor",
      amount: 2,
    },
    utensils: ["Luvas"],
  },
  {
    id: 32,
    name: "INVESTIDA HILÁRIA",
    level: "Intermediária",
    description:
      "INVESTIDA HILÁRIA. (Passiva) Para cada Pernada que você se Move na direção do Monstro, você fica Revigorado.",
    utensils: ["Luvas"],
  },
  {
    id: 33,
    name: "O VELHO JAB E DIRETO",
    level: "Intermediária",
    description:
      "O VELHO JAB E DIRETO. (Passiva) Se você atingir uma criatura com um GOLPEAR LIGEIRO e depois um GOLPEAR PODEROSO no mesmo turno, a criatura fica Atordoada.",
    utensils: ["Luvas"],
  },
  {
    id: 34,
    name: "PEGADA FIRME",
    level: "Intermediária",
    description:
      "PEGADA FIRME. (Passiva) Se você estiver a 0 Pernada de um criatura, ele não pode se distanciar de você. Se ele se Mover, puxa você junto, a menos que você decida soltar-se.",
    utensils: ["Luvas"],
  },
  {
    id: 35,
    name: "500 SOCOS DERRUBAM OS CÉUS",
    level: "Avançada",
    description:
      "500 SOCOS DERRUBAM OS CÉUS. (Custo: 1 Sucesso em um GOLPEAR LIGEIRO). Você recebe −1 em LIGEIRO até o final do seu turno. Então, pode Atacar imediatamente usando o Estilo LIGEIRO de novo sem gastar Ações.",
    cost: {
      type: "sucessos",
      amount: 1,
      restriction: "em um GOLPEAR LIGEIRO",
    },
    utensils: ["Luvas"],
  },
  {
    id: 36,
    name: "ME DÊ SUA FORÇA, PARÇA",
    level: "Avançada",
    description:
      "ME DÊ SUA FORÇA, PARÇA. (Custo: 5 Vigor) Se GOLPEAR PODEROSO, aumente [A] em <H>. Seus parças também podem gastar 5 de Vigor. Se todos fizerem isso, aumente [A] em <H> mais uma vez.",
    cost: {
      type: "vigor",
      amount: 5,
    },
    utensils: ["Luvas"],
  },
  {
    id: 37,
    name: "IGNIÇÃO RÁPIDA",
    level: "Iniciante",
    description:
      "IGNIÇÃO RÁPIDA. (Passiva) Quando sua matilha Acampa e cozinha uma refeição, você pode cozinhar uma refeição adicional.",
    utensils: ["Maçarico"],
  },
  {
    id: 38,
    name: "LINHA DE FOGO",
    level: "Iniciante",
    description:
      "LINHA DE FOGO. (Passiva) Seu Maçarico recebe: “Alcance: 3 (ATIRAR)”.",
    utensils: ["Maçarico"],
  },
  {
    id: 39,
    name: "LUZ GUIA",
    level: "Iniciante",
    description:
      "LUZ GUIA. (Passiva) Se você fizer um ATRAVESSAR e passar, o próximo parça que fizer um ATRAVESSAR tem Vantagem.",
    utensils: ["Maçarico"],
  },
  {
    id: 40,
    name: "PREAQUECIMENTO",
    level: "Iniciante",
    description:
      "PREAQUECIMENTO. (Custo: 3 de Vigor) Escolha um parça a até 0 Pernada. Até o fim da rodada, se o parça escolhido causar Dano à Parte, aquela PARTE também fica Queimada.",
    cost: {
      type: "vigor",
      amount: 3,
    },
    utensils: ["Maçarico"],
  },
  {
    id: 41,
    name: "FLAMBAR",
    level: "Intermediária",
    description:
      "FLAMBAR. (Custo: 3 Ações) Escolha uma criatura a até 3 Pernadas. A próxima vez que você causar Dano à Parte nessa criatura, cada uma de suas PARTES perde [A] de Durabilidade e fica Queimada.",
    cost: {
      type: "acoes",
      amount: 3,
    },
    utensils: ["Maçarico"],
  },
  {
    id: 42,
    name: "MECANISMO COMPATÍVEL",
    level: "Intermediária",
    description:
      "MECANISMO COMPATÍVEL. (Passiva) Você tem Vantagem nos Testes para estudar ou operar artefatos de arkaicaço. Além disso, uma vez por Recesso, escolha um parça. O parça escolhido pode Treinar sem gastar Ações. (o parça ainda só pode Treinar uma vez por Recesso).",
    utensils: ["Maçarico"],
  },
  {
    id: 43,
    name: "VIGILÂNCIA",
    level: "Intermediária",
    description:
      "VIGILÂNCIA. (Custo: 2 Vigor) Até o início do seu próximo turno, na primeira vez que uma criatura se Mover na sua direção, você pode ATIRAR SAGAZ contra ela, causando [A] de Dano à Parte se acertar. Você não pode usar essa Técnica se estiver Exposto.",
    cost: {
      type: "vigor",
      amount: 2,
    },
    utensils: ["Maçarico"],
  },
  {
    id: 44,
    name: "DAS CINZAS, CRESCEM SEMENTES",
    level: "Avançada",
    description:
      "DAS CINZAS, CRESCEM SEMENTES. (Passiva) Se a Saúde de qualquer Comunidade chegar a 0, a Guia inicia um Desafio de VA 20 que só você pode completar trabalhando num Projeto durante o Recesso. Se completar o Desafio, você recupera 1 de Saúde da Comunidade (trabalhe com a Guia para estabelecer de que forma você restaurou Comunidades perdidas, extintas ou desaparecidas).",
    utensils: ["Maçarico"],
  },
  {
    id: 45,
    name: "EXPLOSÃO TERMONUCLEAR ARKAFOGO",
    level: "Avançada",
    description:
      "EXPLOSÃO TERMONUCLEAR ARKAFOGO. (Custo: 3 Ações) Uma vez por Jornada, escolha uma criatura. No começo do seu próximo turno, aquela criatura e cada criatura a até 1 Pernada dela sofre 20 de Dano, e todas as suas PARTES ficam Queimadas.",
    cost: {
      type: "acoes",
      amount: 3,
    },
    utensils: ["Maçarico"],
  },
  {
    id: 46,
    name: "ESCUDO DE AÇO",
    level: "Iniciante",
    description:
      "ESCUDO DE AÇO. (Passiva) A Durabilidade máxima da sua Panela aumenta em 30.",
    utensils: ["Panela"],
  },
  {
    id: 47,
    name: "LANÇAMENTO RICOCHETE",
    level: "Iniciante",
    description:
      "LANÇAMENTO RICOCHETE. (Passiva) Sua Panela recebe “Alcance: 2 (ATIRAR). Se você causar 10 ou mais de Dano com um ATIRAR, seu alvo fica Atordoado.”",
    utensils: ["Panela"],
  },
  {
    id: 48,
    name: "POSTURA APRUMADA",
    level: "Iniciante",
    description:
      "POSTURA APRUMADA. (Passiva) Quando recuperar Vigor, você também pode remover um nível de qualquer Condição exceto Ferido ou Dissonante.",
    utensils: ["Panela"],
  },
  {
    id: 49,
    name: "SUPERFÍCIE ESPELHADA",
    level: "Iniciante",
    description:
      "SUPERFÍCIE ESPELHADA. (Passiva) Você pode Provocar de qualquer distância.",
    utensils: ["Panela"],
  },
  {
    id: 50,
    name: "PORÇÃO GENEROSA",
    level: "Intermediária",
    description:
      "PORÇÃO GENEROSA. (Passiva) Quando sua matilha Acampa, prepara uma refeição e a serve fresquinha, você também faz um Lanche que recupera uma quantidade igual de Vigor, mas isso não tem efeitos adicionais.",
    utensils: ["Panela"],
  },
  {
    id: 51,
    name: "UNIDOS VENCEREMOS",
    level: "Avançada",
    description:
      "UNIDOS VENCEREMOS. (Passiva) Se um parça recuperar Vigor, você recupera uma quantidade igual de Vigor.",
    utensils: ["Panela"],
  },
  {
    id: 52,
    name: "O DOLORIDO É VER VOCÊ SOFRER",
    level: "Avançada",
    description:
      "O DOLORIDO É VER VOCÊ SOFRER. (Passiva) Se Provocar, você pode Levantar a Guarda sem gastar Ações. TÉCNICAS COMPARTILHADAS são sempre Intermediárias.",
    utensils: ["Panela"],
  },
  {
    id: 53,
    name: "COMBO RÁPIDO",
    level: "Intermediária",
    description:
      "COMBO RÁPIDO. (Passiva) Você pode Atacar usando o Estilo LIGEIRO múltiplas vezes no mesmo turno.",
    utensils: ["Luvas", "Espeto", "Barbante"],
  },
  {
    id: 54,
    name: "INVESTIDA VIOLENTA",
    level: "Intermediária",
    description:
      "INVESTIDA VIOLENTA. (Variável) Antes de atacar, você pode se Mover quantas Pernadas quiser em direção ao seu alvo. Depois de atacar, afaste-se de seu alvo o mesmo número de Pernadas. Gaste 1 ponto de Vigor para cada Pernada que você se Mover usando esta técnica.",
    utensils: ["Luvas", "Espeto", "Barbante"],
  },
  {
    id: 55,
    name: "ISSO É PRA HOJE",
    level: "Intermediária",
    description:
      "ISSO É PRA HOJE. (Passiva) Uma vez por Recesso, você pode trabalhar num Projeto sem gastar Ações.",
    utensils: ["Luvas", "Espeto", "Barbante"],
  },
  {
    id: 56,
    name: "BASE SÓLIDA",
    level: "Intermediária",
    description:
      "BASE SÓLIDA. (Custo: 1 Ação) Seu turno acaba. Você tem Vantagem no seu próximo Teste. Caso se Mova antes de fazer um Teste, você perde sua Vantagem.",
    utensils: ["Cutelo", "Luvas", "Panela"],
  },
  {
    id: 57,
    name: "EU AGUENTO",
    level: "Intermediária",
    description:
      "EU AGUENTO. (Passiva) Se você se tornar o alvo de um Monstro, recupere <H> de Vigor.",
    utensils: ["Cutelo", "Luvas", "Panela"],
  },
  {
    id: 58,
    name: "UTENSÍLIO REFORÇADO",
    level: "Intermediária",
    description:
      "UTENSÍLIO REFORÇADO. (Passiva) A Durabilidade máxima dos seus UTENSÍLIOS aumenta em 10.",
    utensils: ["Cutelo", "Luvas", "Panela"],
  },
  {
    id: 59,
    name: "PORÇÕES EXATAS",
    level: "Intermediária",
    description:
      "PORÇÕES EXATAS. (Passiva) Quando a matilha Acampa e prepara uma refeição, escolha um parça que recebeu Vigor o bastante para alcançar seu máximo com aquela refeição, e então faça um Lanche. Esse Lanche recupera Vigor igual ao excedente de Vigor que esse parça recebeu daquela Refeição e não tem efeitos adicionais.",
    utensils: ["Cutelo", "Espeto", "Maçarico"],
  },
  {
    id: 60,
    name: "TRAÇOS TÊNUES",
    level: "Intermediária",
    description:
      "TRAÇOS TÊNUES. (Passiva) No início de cada rodada de viagem, você pode perguntar à Guia uma questão a respeito do Monstro, como se você tivesse encontrado Rastros Frescos na Área (você pode perguntar à Guia uma questão adicional se encontrar Rastros Frescos depois).",
    utensils: ["Cutelo", "Espeto", "Maçarico"],
  },
  {
    id: 61,
    name: "APAVORAR",
    level: "Intermediária",
    description:
      "APAVORAR. (Custo: 3 Vigor) A próxima vez que você Atacar usando o Estilo SAGAZ, em vez de causar Dano à Parte, você faz seu alvo ficar Amedrontado [A].",
    cost: {
      type: "vigor",
      amount: 3,
    },
    utensils: ["Panela", "Maçarico", "Barbante"],
  },
  {
    id: 62,
    name: "LARGAR A ISCA",
    level: "Intermediária",
    description:
      "LARGAR A ISCA. (Custo: 2 Ações) Seu UTENSÍLIO perde 1d6 de Durabilidade e você fica Escondido. Você não pode usar essa Técnica se seu UTENSÍLIO estiver quebrado.",
    cost: {
      type: "acoes",
      amount: 2,
    },
    utensils: ["Panela", "Maçarico", "Barbante"],
  },
  {
    id: 63,
    name: "MUTAÇÕES DISFARÇADAS",
    level: "Intermediária",
    description:
      "MUTAÇÕES DISFARÇADAS. (Custo: 3 Vigor) Até a próxima vez que virar o bicho ou usar um TRAÇO além de BRIO ou TINO, você se passa por não feral.",
    cost: {
      type: "vigor",
      amount: 3,
    },
    utensils: ["Panela", "Maçarico", "Barbante"],
  },
  {
    id: 64,
    name: "VEM PRA CIMA",
    level: "Intermediária",
    description:
      "(Custo: 2 Vigor) Após acertar um Ataque, você pode Provocar sem gastar Ações.",
    cost: {
      type: "vigor",
      amount: 2,
    },
    utensils: ["Panela"],
  },
  {
    id: 65,
    name: "SE ORIENTA!",
    level: "Intermediária",
    description:
      "(Custo: 2 Ações) Cause 1 de Dano a um parça a 0 Pernada; ele remove todos os níveis de Confuso, Fadigado, Amedrontado e Atordoado.",
    cost: {
      type: "acoes",
      amount: 2,
    },
    utensils: ["Panela"],
  },
  {
    id: 66,
    name: "PONTO FRACO",
    level: "Intermediária",
    description:
      "(Custo: 2 Vigor) Na próxima vez que você causar Dano a uma PARTE quebrada, seu alvo fica Exposto.",
    cost: {
      type: "vigor",
      amount: 2,
    },
    utensils: ["Cutelo", "Espeto", "Maçarico"],
  },
];

export const specialtyDefinitions: ISpecialtyDefinition[] = [
  {
    id: "Açougueiro",
    name: "Açougueiro",
    description:
      "Especialidade ligada a criaturas com protuberâncias metálicas ou minerais; tende a lidar confortavelmente com a morte e com o peso do golpe final.",
    firstTraitOptions: [14, 5, 11],
    importantMonsterOptions: [13, 14, 27, 1, 10],
  },
  {
    id: "Amontoeiro",
    name: "Amontoeiro",
    description:
      "Especialidade ligada a criaturas que acumulam comida em reservas, ninhos ou covis; enfatiza conservação e preparação cuidadosa.",
    firstTraitOptions: [17, 28, 41],
    importantMonsterOptions: [15, 29, 30, 22, 5],
  },
  {
    id: "Churrasqueiro",
    name: "Churrasqueiro",
    description:
      "Especialidade ligada a criaturas do fogo; valoriza refeições generosas, sabores ricos e uso agressivo do calor.",
    firstTraitOptions: [3, 18, 71],
    importantMonsterOptions: [7, 8, 4, 32, 28],
  },
  {
    id: "Jardineiro",
    name: "Jardineiro",
    description:
      "Especialidade ligada a criaturas que administram a flora; favorece mobilidade e menor derramamento de sangue, com uso de frutas-ferais e mushi quando apropriado.",
    firstTraitOptions: [78, 28, 44],
    importantMonsterOptions: [12, 20, 9, 6, 39],
  },
  {
    id: "Molheiro",
    name: "Molheiro",
    description:
      "Especialidade ligada a criaturas de secreções tóxicas, medicinais ou recreativas e a experimentos biológicos esotéricos.",
    firstTraitOptions: [21, 32, 75],
    importantMonsterOptions: [40, 23, 17, 19, 25],
  },
  {
    id: "Padeiro",
    name: "Padeiro",
    description:
      "Especialidade ligada a criaturas longevos, frequentemente polinizadores e consumidores de mel, néctar ou seiva; ferais dessa linhagem tendem à paciência e confeitaria.",
    firstTraitOptions: [29, 57, 66],
    importantMonsterOptions: [18, 3, 35, 16, 21],
  },
  {
    id: "Peixeiro",
    name: "Peixeiro",
    description:
      "Especialidade ligada a criaturas de mares, lagos e rios, incluindo leviatãs; explora ambientes aquáticos e mutações associadas à água.",
    firstTraitOptions: [15, 26, 51],
    importantMonsterOptions: [33, 36, 34, 26, 37],
  },
  {
    id: "Pivoteiro",
    name: "Pivoteiro",
    description:
      "Especialidade ligada à mudança, metamorfose, camuflagem e mimetismo; ferais dessa linhagem são conhecidos por versatilidade.",
    firstTraitOptions: [10, 47, 64],
    importantMonsterOptions: [2, 11, 31, 38, 24],
  },
];

export const creatureDefinitions: ICreature[] = [
  {
    id: 1,
    name: "Asewa",
    lineage: "Açougueiro",
    stage: "Adulto",
    sizeDescription: "15 metros de comprimento",
    description:
      "Um criatura da Linhagem dos Açougueiros. Tem em média 15 metros de comprimento.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 2,
      preciso: 3,
      sagaz: 0,
    },
    skills: {
      agarrar: 3,
      armazenar: 1,
      assegurar: 1,
      atirar: 0,
      atravessar: 0,
      chamar: 0,
      curar: 0,
      estudar: 0,
      exibir: 0,
      golpear: 2,
      manufaturar: 0,
      procurar: 0,
    },
    traits: [
      {
        traitId: 5,
        level: 1,
      },
      {
        traitId: 43,
        level: 1,
      },
      {
        traitId: 52,
        level: 2,
      },
      {
        traitId: 70,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 12,
        level: 1,
      },
      {
        traitId: 28,
        level: 1,
      },
      {
        traitId: 28,
        level: 1,
      },
      {
        traitId: 41,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "ESCAMAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "ESCAMAS. Alcance: 1 (AGARRAR PODEROSO ) Passiva: se você conseguir Atacar uma criatura com esta PARTE, ela fica Presa. Criaturas Presas por esta PARTE sofrem 5 de Dano à Parte cada vez que gastarem Ações ou Vigor. ◆ Se Quebradas: Alcance: 1 (AGARRAR PODEROSO ). Esta PARTE causa metade do Dano. Você perde 1 20 nível de NÃO-ME-TOQUE.",
        attack: {
          range: 1,
          style: "poderoso",
          skill: "agarrar",
        },
        broken: {
          description:
            "Alcance: 1 (AGARRAR PODEROSO ). Esta PARTE causa metade do Dano. Você perde 1 20 nível de NÃO-ME-TOQUE.",
        },
      },
      {
        id: 2,
        name: "LÂMINAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "LÂMINAS. Alcance: 1 (GOLPEAR PRECISO). ◆ Se Quebradas: Alcance: 1 (GOLPEAR PRECISO). Esta PARTE causa metade do Dano. Você perde 1 nível de",
        attack: {
          range: 1,
          style: "preciso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PRECISO). Esta PARTE causa metade do Dano. Você perde 1 nível de 20",
        },
      },
      {
        id: 3,
        name: "MANDÍBULA",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "MANDÍBULA. Esta PARTE não tem efeito adicional. ◆ Se Quebrada: Você perde SENTIDOS AGUÇADOS e reduz seu nível em AGARRAR para +1.",
        broken: {
          description:
            "Você perde SENTIDOS AGUÇADOS e reduz seu nível em AGARRAR para +1. 10",
        },
      },
    ],
    diet: "• Monstros terrestres (Cauda de Rakuzar, Wooda Selvagem)",
    habitat: "• Deserto (Minas Lakkin Leste, Refúgio da Ravina, Maratsia)",
    behavior:
      "Se nenhuma criatura estiver Presa ou Exposta, mire a criatura que pode infligir a condição Queimado, já que você detecta suas presas pelo calor. Seu instinto é o de se enrolar lenta e continuamente em torno do seu alvo e sufocá-lo até a morte. Você não é muito rápida, mas assim que tiver seu alvo Preso, lutar apenas vai acelerar a morte da sua presa. Sua MANDÍBULA é seu ponto fraco, já que abriga seus órgãos sensores de calor e você confia em seus dentes para segurar a presa enquanto a enrola e esfola com suas ESCAMAS.",
  },
  {
    id: 2,
    name: "Botabo",
    lineage: "Pivoteiro",
    stage: "Adulto",
    sizeDescription: "2 - 4 metros de altura",
    description:
      "Um criatura da Linhagem dos Pivoteiros. Tem 2 metros de altura sobre as quatro patas, e o dobro disso ou mais se estiver de pé.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 3,
      poderoso: 0,
      preciso: 0,
      sagaz: 2,
    },
    skills: {
      agarrar: 3,
      armazenar: 3,
      assegurar: 0,
      atirar: 0,
      atravessar: 0,
      chamar: 1,
      curar: 0,
      estudar: 2,
      exibir: 0,
      golpear: 1,
      manufaturar: 0,
      procurar: 2,
    },
    traits: [
      {
        traitId: 30,
        level: 1,
      },
      {
        traitId: 45,
        level: 1,
      },
      {
        traitId: 63,
        level: 1,
      },
      {
        traitId: 74,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 11,
        level: 1,
      },
      {
        traitId: 23,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "AXILAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "AXILAS. Passiva: Você inicia o combate com <H> Lanches. Cada Lanche recupera 10 de Vigor e concede movimento VOAR ou NADAR até sua próxima refeição.                                                                                 20 ◆ Se Quebradas: Você deixa seus Lanches caírem, incluindo os que você roubou.",
        broken: {
          description:
            "Você deixa seus Lanches caírem, incluindo os que você roubou.",
        },
      },
      {
        id: 2,
        name: "DENTES",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "DENTES. Alcance: 1 (GOLPEAR LIGEIRO). ◆ Se Quebrados: Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "ligeiro",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano. 20",
        },
      },
      {
        id: 3,
        name: "GARRAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "GARRAS. Alcance: 1 (GOLPEAR SAGAZ). ◆ Se Quebradas: Alcance: 1 (GOLPEAR SAGAZ ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "sagaz",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR SAGAZ ). Essa PARTE causa metade do Dano. 20",
        },
      },
    ],
    diet: "• Monstros terrestres, criaturas voadores, criaturas aquáticos (Goby Guelrabença), ovos (Ovos de Katang), carcaça, frutas, sementes e grãos (maioria dos Pratos Típicos)",
    habitat:
      "• Costa (Ladeirabaixo, Cidade-Estação Tesouromar), Deserto (Cidade-Estação Bhusag)",
    behavior:
      "Se nenhuma criatura estiver Exposta, mire na última criatura a Comer, pois é provável que ela tenha mais Lanches. Seu instinto é pegar o que puder e fugir. O frenesi exacerba sua agressividade e amortece sua urgência de se autopreservar, mas no fundo você ainda é um ladrão de personalidade inquieta e furtiva. Sua sensibilidade à Lei Una permite a escolha entre voar e nadar a depender do que for melhor para a situação. Lembre-se de que você também se beneficia dos efeitos de Lanches roubados, embora só durem até você comer o próximo.",
  },
  {
    id: 3,
    name: "Chamig",
    lineage: "Padeiro",
    stage: "Adulto",
    sizeDescription: "30 metros de comprimento",
    description:
      "Um criatura da Linhagem dos Padeiros. Tem 30 metros de comprimento.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 4,
      preciso: 0,
      sagaz: 0,
    },
    skills: {
      agarrar: 0,
      armazenar: 1,
      assegurar: 3,
      atirar: 0,
      atravessar: 0,
      chamar: 0,
      curar: 3,
      estudar: 0,
      exibir: 0,
      golpear: 0,
      manufaturar: 0,
      procurar: 1,
    },
    traits: [
      {
        traitId: 5,
        level: 1,
      },
      {
        traitId: 40,
        level: 1,
      },
      {
        traitId: 62,
        level: 1,
      },
      {
        traitId: 66,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 48,
        level: 1,
      },
      {
        traitId: 57,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "CASCO",
        durability: {
          current: 30,
          max: 30,
        },
        description:
          "CASCO. Passiva: Esta PARTE funciona como um Terreno adicional onde outras criaturas podem escalar, voar e correr. Durante seu turno, você pode gastar 2 Ações para ATRAVESSAR PODEROSO, balançando essa PARTE. Se fizer isso, todas as criaturas em seu CASCO sem VOAR devem gastar [A] Vigor ou cairão no Chão.                       30 ◆ Se Quebrado: Você fica Exposto e perde os Traços ARMADURA NATURAL e RECUO.",
        broken: {
          description:
            "Você fica Exposto e perde os Traços ARMADURA NATURAL e RECUO.",
        },
      },
      {
        id: 2,
        name: "PÉS",
        durability: {
          current: 30,
          max: 30,
        },
        description:
          "PÉS. Alcance: 1 (GOLPEAR PODEROSO). Passiva: Você não pode atacar criaturas que estejam em seu CASCO com essa PARTE. Se você se Mover, deve Atacar qualquer criatura no Chão com essa PARTE sem gastar Ações.                 30 ◆ Se Quebrados: Alcance: 1 (GOLPEAR PODEROSO ). Essa PARTE causa metade do Dano. Essa PARTE mantém seu efeito Passivo.",
        attack: {
          range: 1,
          style: "poderoso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PODEROSO ). Essa PARTE causa metade do Dano. Essa PARTE mantém seu efeito Passivo.",
        },
      },
    ],
    diet: "• N/A",
    habitat: "• Deserto",
    behavior:
      "Se nenhuma criatura estiver Exposta, mire uma criatura Expandida, já que a maioria dos alvos potenciais é tão pequena que você os ignora. Seu instinto é esmagar tudo no seu caminho. Antes mesmo de começar A Caçada, considere que está em fase livre. Em termos de estatísticas, você apresenta um combate difícil, mas gerenciável, no qual os jogadores se envolverão taticamente. Como uma série de Desafios personalizados e cenários narrativos, incorpore seu tamanho e escala inspiradores. Nenhuma das abordagens está errada, mas uma pode ser melhor que outra para o tom que você está tentando alcançar na narrativa.",
  },
  {
    id: 4,
    name: "Fagurila",
    lineage: "Churrasqueiro",
    stage: "Adulto",
    sizeDescription: "de 4 metros de altura",
    description:
      "Com exceção dos gigantes, Fagurilas são os maiores símios encontrados na Terra Una.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 1,
      poderoso: 3,
      preciso: 0,
      sagaz: 0,
    },
    skills: {
      agarrar: 2,
      armazenar: 0,
      assegurar: 1,
      atirar: 0,
      atravessar: 1,
      chamar: 2,
      curar: 0,
      estudar: 1,
      exibir: 3,
      golpear: 2,
      manufaturar: 1,
      procurar: 0,
    },
    traits: [
      {
        traitId: 3,
        level: 2,
      },
      {
        traitId: 30,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 8,
        level: 1,
      },
      {
        traitId: 61,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "PELOS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "PELOS. Passiva: Seu CORPO EM CHAMAS não causa Dano, a menos que você gaste 1 Ação para incendiá- lo. Cada vez que usar AMEAÇAR 2, aumente o Dano causado por CORPO EM CHAMAS em 1 até o final da Jornada ou até que essa PARTE seja Quebrada. Se você causar Dano a um feral com CORPO EM CHAMAS, o                   20 UTENSÍLIO dele fica Queimado. ◆ Se Quebrados: Você perde CORPO EM CHAMAS.",
        broken: {
          description: "Você perde CORPO EM CHAMAS.",
        },
      },
      {
        id: 2,
        name: "PUNHOS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "PUNHOS. Alcance: 1 (GOLPEAR PODEROSO ou GOLPEAR LIGEIRO). Passiva: Se você conseguir Atacar uma criatura com essa PARTE, ela fica Presa.                                                                             20 ◆ Se Quebrados: Alcance: 1 (GOLPEAR PODEROSO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "poderoso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PODEROSO ). Essa PARTE causa metade do Dano.",
        },
      },
    ],
    diet: "• Monstros terrestres, ovos (Ovos de Wari), folhagem (Broto de Ervafumo), fruta (Falso Pêssego Che, Cerejasca), fungos (Cogumelo Olho-de-Siri)",
    habitat:
      "• Arvoredo (Jardins Ghao Gan, Bosque das Testemunhas), Montanha (Antigo Sen Che, Bosque da Ervafumo)",
    behavior:
      "Se nenhuma criatura estiver Presa ou Exposta, mire a criatura que usou o Estilo PODEROSO na sua última rodada, já que você considera força uma ameaça. Seu instinto é agarrar qualquer desafiante e subjugá-lo, rugindo alto para que todas as testemunhas saibam que esse é seu território. Você pode manter múltiplas criaturas Presas em seus PUNHOS, mas tende a focar em esmerilhar o primeiro no soco antes de dar atenção para outro inimigo. Normalmente, você não inflama seus PELOS até que esteja Amedrontado ou Ferido — não por razões táticas, mas por ser um animal que não gasta recursos sem motivo. Quando fica em chamas, é hora de se apressar e terminar a luta de uma forma ou de outra. Cada vez que você bater no seu peito para AMEAÇAR, mais faíscas voam, e mais sua pelagem esquenta, até irromper em chamas.",
  },
  {
    id: 5,
    name: "Gelaranha Asig",
    lineage: "Amontoeiro",
    stage: "Adulto",
    sizeDescription: "4 metros de altura",
    description:
      "Um criatura da Linhagem dos Amontoeiros. Tem 4 metros de altura.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 0,
      preciso: 3,
      sagaz: 2,
    },
    skills: {
      agarrar: 0,
      armazenar: 3,
      assegurar: 0,
      atirar: 0,
      atravessar: 0,
      chamar: 0,
      curar: 0,
      estudar: 2,
      exibir: 0,
      golpear: 1,
      manufaturar: 3,
      procurar: 0,
    },
    traits: [
      {
        traitId: 10,
        level: 1,
      },
      {
        traitId: 45,
        level: 1,
      },
      {
        traitId: 54,
        level: 1,
      },
      {
        traitId: 70,
        level: 1,
      },
      {
        traitId: 77,
        level: 1,
      },
    ],
    additionalTraits: [],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "PELOS",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "PELOS. Passiva: Você pode gastar 1 Sucesso em um MANUFATURAR para usar SENTIDOS AGUÇADOS.                                     10 ◆ Se Quebrados: Você perde SENTIDOS AGUÇADOS.",
        broken: {
          description: "Você perde SENTIDOS AGUÇADOS.",
        },
      },
      {
        id: 2,
        name: "PERNAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "PERNAS. Alcance: 1 (GOLPEAR PRECISO). ◆ Se Quebradas: Alcance: 1 (GOLPEAR PRECISO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "preciso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PRECISO ). Essa PARTE causa metade do Dano. 20",
        },
      },
      {
        id: 3,
        name: "TEIA",
        durability: {
          current: 1,
          max: 1,
        },
        description:
          "TEIA. Passiva: Cada vez que você usa TECE-TEIAS, crie uma nova instância dessa PARTE com sua própria Durabilidade separada. Criaturas que sofrem Dano à Parte do TECE-TEIAS também ficam Presas por essa PARTE, mas não são puxadas para 0 Pernada na sua direção. Criaturas podem Atacar essa PARTE de qualquer                         1 distância, mas se o fizeram, você não perde Vigor. ◆ Se Quebrada: A instância de TECE-TEIAS representada por essa PARTE acaba.",
        broken: {
          description:
            "A instância de TECE-TEIAS representada por essa PARTE acaba.",
        },
      },
    ],
    diet: "• Monstros terrestres (Geleca de Onagung, Wooda Selvagem), criaturas voadores",
    habitat: "• Montanha (Antigo Sen Che)",
    behavior:
      "Se nenhuma criatura estiver Presa ou Exposta, mire a última criatura que atacou sua TEIA, já que você prefere manter suas armadilhas de teia intactas. Seu instinto é preparar sua armadilha de teia e esperar pacientemente no seu centro. Se estiver confusa sobre como sua TEIA funciona, faça o que fizer sentido narrativamente falando.",
  },
  {
    id: 6,
    name: "Golanuvem",
    lineage: "Jardineiro",
    stage: "Adulto",
    sizeDescription: "18 metros de altura",
    description:
      "Um criatura da Linhagem dos Jardineiros. Tem 18 metros de altura.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 3,
      preciso: 1,
      sagaz: 0,
    },
    skills: {
      agarrar: 0,
      armazenar: 0,
      assegurar: 2,
      atirar: 0,
      atravessar: 2,
      chamar: 2,
      curar: 1,
      estudar: 0,
      exibir: 1,
      golpear: 0,
      manufaturar: 0,
      procurar: 0,
    },
    traits: [
      {
        traitId: 3,
        level: 1,
      },
      {
        traitId: 9,
        level: 1,
      },
      {
        traitId: 34,
        level: 1,
      },
      {
        traitId: 39,
        level: 1,
      },
      {
        traitId: 66,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 37,
        level: 1,
      },
      {
        traitId: 48,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "GOLA",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "GOLA. Passiva: Você só pode usar FOTOSSÍNTESE enquanto estiver Expandido. ◆ Se Quebrado: Você perde acesso a EXPANDIR e FOTOSSÍNTESE e não pode mais se tornar Expandido.",
        broken: {
          description:
            "Você perde acesso a EXPANDIR e FOTOSSÍNTESE e não pode mais se tornar Expandido. 10",
        },
      },
      {
        id: 2,
        name: "PÉS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "PÉS. Alcance: 1 (GOLPEAR PRECISO). Passiva: Se Atacar com essa PARTE e acertar, você também causa Dano [A] a todas as criaturas da sua escolha que estiverem a 0 Pernada do seu alvo.                                    20 ◆ Se Quebrados: Alcance: 1 (GOLPEAR PRECISO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "preciso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PRECISO ). Essa PARTE causa metade do Dano.",
        },
      },
      {
        id: 3,
        name: "PESCOÇO",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "PESCOÇO. Alcance: 2 (GOLPEAR PODEROSO). Passiva: Se usar CABEÇADA contra uma criatura que estiver escalando ou voando, em vez de empurrar, puxe-a para 1 Pernada mais próxima de você.                              20 ◆ Se Quebrado: Alcance: 2 (GOLPEAR PODEROSO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 2,
          style: "poderoso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 2 (GOLPEAR PODEROSO ). Essa PARTE causa metade do Dano.",
        },
      },
    ],
    diet: "• Folhagem",
    habitat: "• Deserto (Vale dos Açougueiros, Ovomonte)",
    behavior:
      "Se nenhuma criatura estiver Exposta, mire uma criatura que esteja escalando ou voando, já que você não gosta que predadores ou parasitas cheguem perto da sua cabeça. Seu instinto é esmagar seus rivais contra o chão com seu PESCOÇO e então Preparar para fazer isso novamente. EXPANDIR ajuda a alcançar alvos distantes, mas você não mudará seu percurso só para fazer isso ou FOTOSSÍNTESE. Da mesma forma, seus PÉS não são suas armas preferidas, mas você pode ficar tentado a usá-los se muitas criaturas estiverem no mesmo lugar para serem esmagadas. Guarde CABEÇADA até o final da rodada, quando é possível derrubar seu alvo antes de mudar o foco para outro.",
  },
  {
    id: 7,
    name: "Hagsechu",
    lineage: "Churrasqueiro",
    stage: "Adulto",
    sizeDescription: "5 metros de comprimento",
    description:
      "Um criatura da Linhagem dos Churrasqueiros. Tem 5 metros de comprimento em média, incluindo a cauda.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 2,
      preciso: 0,
      sagaz: 3,
    },
    skills: {
      agarrar: 3,
      armazenar: 0,
      assegurar: 0,
      atirar: 1,
      atravessar: 2,
      chamar: 0,
      curar: 0,
      estudar: 1,
      exibir: 0,
      golpear: 0,
      manufaturar: 0,
      procurar: 0,
    },
    traits: [
      {
        traitId: 10,
        level: 1,
      },
      {
        traitId: 31,
        level: 2,
      },
      {
        traitId: 54,
        level: 1,
      },
      {
        traitId: 58,
        level: 1,
      },
      {
        traitId: 71,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 48,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "CASCA",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "CASCA. Passiva: Suas PARTES não podem ser Queimadas. ◆ Se Quebrada: Você perde SOPRO DE FOGO.",
        broken: {
          description: "Você perde SOPRO DE FOGO. 20",
        },
      },
      {
        id: 2,
        name: "CAUDA",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "CAUDA. Passiva: Você tem Vantagem para usar SOPRO DE FOGO em uma criatura que estiver Presa. ◆ Se Quebrada: Você perde SOPRO DE FOGO.",
        broken: {
          description: "Você perde SOPRO DE FOGO. 20",
        },
      },
      {
        id: 3,
        name: "PERNAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "PERNAS. Alcance: 1 (GOLPEAR SAGAZ). Passiva: Se você conseguir Atacar uma criatura com essa PARTE, ela fica Presa.                                                                                                            20 ◆ Se Quebradas: Alcance: 1 (GOLPEAR SAGAZ ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "sagaz",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR SAGAZ ). Essa PARTE causa metade do Dano.",
        },
      },
    ],
    diet: "• Monstros terrestres (Cauda de Rakuzar, Lapuni Selvagem)                                                       Test",
    habitat: "• Arvoredo (Terras Chafurdantes, Bosque das emunhas), Deserto",
    behavior:
      "Se nenhuma criatura estiver Presa ou Exposta, escolha a última criatura que se moveu no Chão, pois o ritmo dos passos sempre atrai sua atenção. Seu instinto é esperar o quanto for para pegar uma criatura que passe sobre você. Construa suas ações com PACIÊNCIA, em seguida, saia do seu esconderijo no Subterrâneo partindo para cima com suas PERNAS de predador. Lembre-se de que SOPRO DE FOGO é um Traço que não tem as mesmas limitações de quando você ataca — você pode usá-lo repetidas vezes, desde que haja Ações para gastar. A menos que existam circunstâncias especiais, você sempre começa A Caçada no Subterrâneo e Escondido.",
  },
  {
    id: 8,
    name: "Hutangwa",
    lineage: "Churrasqueiro",
    stage: "Adulto",
    sizeDescription: "3 metros de envergadura média",
    description:
      "Um criatura da Linhagem dos Churrasqueiros. Tem 3 metros de envergadura média.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 3,
      poderoso: 0,
      preciso: 2,
      sagaz: 0,
    },
    skills: {
      agarrar: 1,
      armazenar: 0,
      assegurar: 0,
      atirar: 0,
      atravessar: 2,
      chamar: 1,
      curar: 0,
      estudar: 2,
      exibir: 0,
      golpear: 1,
      manufaturar: 0,
      procurar: 3,
    },
    traits: [
      {
        traitId: 56,
        level: 1,
      },
      {
        traitId: 70,
        level: 1,
      },
      {
        traitId: 74,
        level: 1,
      },
      {
        traitId: 76,
        level: 3,
      },
    ],
    additionalTraits: [
      {
        traitId: 61,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "ASAS",
        durability: {
          current: 20,
          max: 20,
        },
        description: "Essa PARTE não tem efeito adicional.",
        broken: {
          description: "Você perde VOAR 3",
        },
      },
      {
        id: 2,
        name: "BICO",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "BICO. Alcance: 1 (GOLPEAR PRECISO). ◆ Se Quebrado: Alcance: 1 (GOLPEAR PRECISO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "preciso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PRECISO ). Essa PARTE causa metade do Dano. 10",
        },
      },
      {
        id: 3,
        name: "GARRAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "GARRAS. Alcance: 1 (GOLPEAR LIGEIRO). Passiva: Se você Atacar uma criatura com essa PARTE e acertar, ela fica Presa.                                                                                                20 ◆ Se Quebradas: Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "ligeiro",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano.",
        },
      },
    ],
    diet: "• Monstros terrestres (Asaginga, Wooda Selvagem), criaturas voadores",
    habitat: "• Praia (Mesalta), Arvoredo",
    behavior:
      "Se nenhuma criatura estiver Presa ou Exposta, mire a criatura que estiver Ferida, já que você é um assassino eficiente e brutal. Seu instinto é capturar uma criatura com suas GARRAS e alçar voo com VELOCIDADE, depois estripá-la com seus BICO. Você é flexível e inteligente, então, se alguma coisa estiver dando errado com seu plano, você se adapta rapidamente. Se ficar Ferido, fuja. Para representar sua tendência incendiária, use esta regra opcional: se for inverno, a área para a qual você recuou recebe os efeitos do Traço Incêndio de Towon Seha. Você tem experiência suficiente com fogo para passar por ele com segurança, mas quem o seguir não estará tão preparado.",
  },
  {
    id: 9,
    name: "Jama-Jama",
    lineage: "Molheiro",
    stage: "Adulto",
    sizeDescription: "3 metros de comprimento",
    description: "Uma criatura amfíbia de pele rochosa.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 0,
      preciso: 3,
      sagaz: 2,
    },
    skills: {
      agarrar: 2,
      armazenar: 0,
      assegurar: 0,
      atirar: 2,
      atravessar: 0,
      chamar: 0,
      curar: 2,
      estudar: 0,
      exibir: 0,
      golpear: 0,
      manufaturar: 0,
      procurar: 0,
    },
    traits: [
      {
        traitId: 51,
        level: 1,
      },
      {
        traitId: 75,
        level: 3,
      },
    ],
    additionalTraits: [
      {
        traitId: 24,
        level: 1,
      },
      {
        traitId: 28,
        level: 1,
      },
      {
        traitId: 37,
        level: 1,
      },
      {
        traitId: 47,
        level: 1,
      },
      {
        traitId: 57,
        level: 1,
      },
      {
        traitId: 73,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "BARRIGA",
        durability: {
          current: 10,
          max: 10,
        },
        description: "Essa PARTE não tem efeito adicional.",
        broken: {
          description: "Você fica Exposto",
        },
      },
      {
        id: 2,
        name: "LÍNGUA",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "LÍNGUA. Alcance: 3 (AGARRAR PRECISO). Passiva: Se você Atacar com essa PARTE e acertar, você pode puxar seu alvo para 1 Pernada mais perto.                                                                          20 ◆ Se Quebrada: Alcance: 1 (GOLPEAR PRECISO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 3,
          style: "preciso",
          skill: "agarrar",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PRECISO ). Essa PARTE causa metade do Dano.",
        },
      },
      {
        id: 3,
        name: "MANDÍBULA",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "MANDÍBULA. Alcance: 3 (ATIRAR SAGAZ). Passiva: A cada vez que usar VENENO quando Atacar com essa PARTE, todas as criaturas a 0 Pernada do seu alvo (incluindo seu alvo) ficam Confusas.                                    20 ◆ Se Quebrada: Alcance: 2 (ATIRAR SAGAZ ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 3,
          style: "sagaz",
          skill: "atirar",
        },
        broken: {
          description:
            "Alcance: 2 (ATIRAR SAGAZ ). Essa PARTE causa metade do Dano.",
        },
      },
    ],
    diet: "• Fruta (Ameixa Jya)",
    habitat: "• Montanha (Fundão, Antigo Sen Che, Bandejargênteas)",
    behavior:
      "Se nenhuma criatura estiver Exposta, mire uma criatura que esteja a 0 Pernada de outra, já que você almeja eficiência com seu arroto. Seu instinto é manter-se firme e afastar todos os intrusos do seu território. Enquanto sua LÍNGUA puxa tecnicamente qualquer criatura para perto, você a usa principalmente para agrupar criaturas e sufocá-las com uma nuvem intoxicante de sua MANDÍBULA (dê aos ferais oportunidades de fazer o papel de bêbado; quase todo mundo se diverte interpretando um bebum). Seus vários Traços não combativos provavelmente não serão relevantes durante A Caçada, mas é possível usá-los como inspiração ao descrever suas ações ou em momentos de improvisação.",
  },
  {
    id: 10,
    name: "Kakwari",
    lineage: "Açougueiro",
    stage: "Adulto",
    sizeDescription: "4 metros de altura",
    description:
      "Um criatura da Linhagem dos Açougueiros. Tem 4 metros de altura, em média.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 3,
      preciso: 0,
      sagaz: 2,
    },
    skills: {
      agarrar: 0,
      armazenar: 0,
      assegurar: 0,
      atirar: 0,
      atravessar: 0,
      chamar: 2,
      curar: 0,
      estudar: 0,
      exibir: 3,
      golpear: 2,
      manufaturar: 0,
      procurar: 1,
    },
    traits: [
      {
        traitId: 3,
        level: 2,
      },
      {
        traitId: 53,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 12,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "ASAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "ASAS. Passiva: Depois de ficar Ferido ou outra PARTE quebrar, mova qualquer criatura para 1 Pernada de distância. Então, mova outra criatura para 2 Pernadas de Distância. Por fim, mova todas as outras criaturas                20 para 3 Pernadas de distância. ◆ Se Quebrada: Essa PARTE não faz nada.",
        broken: {
          description: "Essa PARTE não faz nada.",
        },
      },
      {
        id: 2,
        name: "CAUDA",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "CAUDA. Alcance: 1 (GOLPEAR SAGAZ). Passiva: Se você Atacar com essa PARTE e acertar, também causa [A] de Dano (não de Dano à PARTE) em todas as criaturas a 1 Pernada de você, exceto seu alvo. ◆Se Quebrada: Alcance: 1 (GOLPEAR SAGAZ). Essa PARTE causa metade do Dano. Você não pode mais 20 usar OSTENTAR.",
        attack: {
          range: 1,
          style: "sagaz",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR SAGAZ). Essa PARTE causa metade do Dano. Você não pode mais 20 usar OSTENTAR.",
        },
      },
      {
        id: 3,
        name: "GARRAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "GARRAS. Alcance: 1 (GOLPEAR PODEROSO). ◆ Se Quebrada: Alcance: 1 (GOLPEAR PODEROSO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "poderoso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PODEROSO ). Essa PARTE causa metade do Dano. 20",
        },
      },
    ],
    diet: "• Monstros terrestres (Cobragulha), sementes e grãos (Prótea-real)",
    habitat: "• Arvoredo (Jardins Ghao Gan, Musicampo, Terras furdantes)",
    behavior:
      "Se nenhuma criatura estiver Exposta, mire uma criatura que não esteja Amedrontada, já que fica particularmente irritado com criaturas que parecem desafiá-lo. Seu instinto é projetar confiança, varrer para longe com sua CAUDA antes de pisotear seu alvo e subjugá-lo com suas GARRAS. A despeito de sua bravata, você é cauteloso, usando OSTENTAR sempre que seu Vigor estiver baixo e realizando turnos completos durante o último turno da rodada, para conter a situação. Isso é, pelo menos até você estar Ferido — então, use suas ASAS para saltar em pânico e reorganizar seus arredores antes de ficar furioso e partir totalmente para a ofensiva.",
  },
  {
    id: 11,
    name: "Kala-Kala",
    lineage: "Pivoteiro",
    stage: "Adulto",
    sizeDescription: "2 metros de comprimento",
    description:
      "Um criatura da Linhagem dos Pivoteiros. Tem 2 metros de comprimento, em média.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 2,
      poderoso: 0,
      preciso: 1,
      sagaz: 3,
    },
    skills: {
      agarrar: 2,
      armazenar: 0,
      assegurar: 0,
      atirar: 0,
      atravessar: 1,
      chamar: 3,
      curar: 0,
      estudar: 1,
      exibir: 0,
      golpear: 0,
      manufaturar: 0,
      procurar: 0,
    },
    traits: [
      {
        traitId: 30,
        level: 2,
      },
      {
        traitId: 49,
        level: 1,
      },
      {
        traitId: 63,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 47,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "LÍNGUA",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "LÍNGUA. Alcance: 3 (AGARRAR LIGEIRO). Passiva: Se você Atacar uma criatura com essa PARTE e acertar, ela fica Presa. Você não pode Atacar enquanto estiver segurando uma criatura Presa, mas no início de cada um dos seus turnos ela fica Fadigada, e no início de cada um dos seus turnos completos, fica Fadigada 5.                         20 ◆Se Quebrada: Alcance: 1 (AGARRAR LIGEIRO). Essa PARTE causa metade do Dano.",
        attack: {
          range: 3,
          style: "ligeiro",
          skill: "agarrar",
        },
        broken: {
          description:
            "Alcance: 1 (AGARRAR LIGEIRO). Essa PARTE causa metade do Dano.",
        },
      },
      {
        id: 2,
        name: "PERNAS",
        durability: {
          current: 20,
          max: 20,
        },
        description: "Essa Parte não tem efeitos adicionais.",
        broken: {
          description: "Você perde 1 nível de REFLEXOS NATURAIS.",
        },
      },
      {
        id: 3,
        name: "SACOS VOCAIS",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "SACOS VOCAIS. Passiva: Se você fizer um CHAMAR com um [A] de 20+, um membro territorial, instigado, ou protetor da espécie que você está imitando chega para investigar no final da rodada.                                 10 ◆ Se Quebrados: Você perde MIMETISMO VOCAL.",
        broken: {
          description: "Você perde MIMETISMO VOCAL.",
        },
      },
    ],
    diet: "• Monstros terrestres (Vermes), microalgas (Alga Noturna)",
    habitat: "• Arvoredo",
    behavior:
      "Se nenhuma criatura estiver Presa ou Exposta, mire a última criatura a se Mover, já que você caça baseado em movimentação. Seu instinto é encontrar um lugar seguro para usar seu MIMETISMO VOCAL e então agarrar o alvo com sua LÍNGUA. Você odeia ficar cercado, então está sempre tentando criar distância entre qualquer criatura que não esteja tentando comer. O efeito adicional dos seus SACOS VOCAIS raramente acontece, mas aproveite o caos caso ocorra. Para dicas sobre como executar A Caçada com múltiplos criaturas, veja a p. 275.",
  },
  {
    id: 12,
    name: "Ko-Ketak",
    lineage: "Jardineiro",
    stage: "Adulto",
    sizeDescription: "2 metros de altura",
    description:
      "Um criatura da Linhagem dos Jardineiros. Tem 2 metros de altura, em média.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 2,
      preciso: 3,
      sagaz: 0,
    },
    skills: {
      agarrar: 0,
      armazenar: 3,
      assegurar: 0,
      atirar: 0,
      atravessar: 0,
      chamar: 0,
      curar: 0,
      estudar: 0,
      exibir: 0,
      golpear: 3,
      manufaturar: 3,
      procurar: 0,
    },
    traits: [
      {
        traitId: 3,
        level: 1,
      },
      {
        traitId: 70,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 19,
        level: 1,
      },
      {
        traitId: 24,
        level: 1,
      },
      {
        traitId: 73,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "ASAS",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "ASAS. Passiva: Se você se Mover, pode Mover-se 2 Pernadas em vez de 1. ◆ Se Quebradas: Você se torna Exposto e perde AMEAÇAR.",
        broken: {
          description: "Você se torna Exposto e perde AMEAÇAR. 10",
        },
      },
      {
        id: 2,
        name: "BRAÇOS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "BRAÇOS. Alcance: 1 (GOLPEAR PRECISO). ◆ Se Quebrados: Alcance: 1 (GOLPEAR PRECISO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "preciso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PRECISO ). Essa PARTE causa metade do Dano. 20",
        },
      },
      {
        id: 3,
        name: "MANDÍBULAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "MANDÍBULAS. Alcance: 1 (GOLPEAR PODEROSO). ◆ Se Quebradas: Alcance: 1 (GOLPEAR PODEROSO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "poderoso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PODEROSO ). Essa PARTE causa metade do Dano.                                        20",
        },
      },
    ],
    diet: "• Fungos (Vertigumelo, Cogumelo Olho-de-Siri)",
    habitat: "• Arvoredo",
    behavior:
      "Se nenhuma criatura estiver Exposta, mire uma criatura que esteja no chão, já que elas estão mais próximas do seu precioso jardim de fungos. Seu instinto é simplesmente atacar. Suas PARTES e TRAÇOS são simples, mas você não precisa de estratégias elegantes para cortar intrusos em pedaços. Sem o frenesi, você pararia de perseguir seus oponentes assim que estivessem fora do seu território, já que, na verdade, matá-los não lhe trará nenhum benefício material. A infecção, no entanto, exacerbou seu instinto agressivo.",
  },
  {
    id: 13,
    name: "Lapu-Lapu",
    lineage: "Açougueiro",
    stage: "Adulto",
    sizeDescription: "1,5 metros de altura",
    description:
      "Um criatura da Linhagem dos Açougueiros. Tem 3 metros de altura, em média.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 3,
      poderoso: 2,
      preciso: 0,
      sagaz: 0,
    },
    skills: {
      agarrar: 0,
      armazenar: 2,
      assegurar: 2,
      atirar: 0,
      atravessar: 0,
      chamar: 0,
      curar: 0,
      estudar: 0,
      exibir: 0,
      golpear: 0,
      manufaturar: 1,
      procurar: 1,
    },
    traits: [
      {
        traitId: 31,
        level: 1,
      },
      {
        traitId: 52,
        level: 5,
      },
    ],
    additionalTraits: [
      {
        traitId: 6,
        level: 1,
      },
      {
        traitId: 12,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "INCISIVOS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "INCISIVOS. Alcance: 1 (GOLPEAR LIGEIRO). Passiva: Se você causar Dano com essa PARTE, em vez disso, cause Dano à PARTE.                                                                                                               20 ◆ Se Quebrados: Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "ligeiro",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano.",
        },
      },
      {
        id: 2,
        name: "LÃ",
        durability: {
          current: 50,
          max: 50,
        },
        description:
          "LÃ. Passiva: Para cada 10 pontos de Durabilidade que essa PARTE perde, você perde 1 nível de NÃO-ME- TOQUE (Exemplo: Se essa PARTE tiver 40 de durabilidade, você só tem NÃO-ME-TOQUE 4.) Criaturas que miram nessa PARTE com Dano à Parte não sofrem Dano pelo NÃO-ME-TOQUE.                                                      50 ◆ Se Quebrada: Você perde todos os seus níveis de NÃO-ME-TOQUE e fica Exposto.",
        broken: {
          description:
            "Você perde todos os seus níveis de NÃO-ME-TOQUE e fica Exposto.",
        },
      },
      {
        id: 3,
        name: "PERNAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "PERNAS. Alcance: 1 (GOLPEAR PODEROSO). Passiva: Depois de ficar Ferido, mova qualquer criatura 1 Pernada de distância. Então, mova outra criatura 2 Pernadas de distância. Então, mova outra criatura 3 Pernadas de distância.       20 ◆ Se Quebradas: Alcance: 1 (GOLPEAR PODEROSO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "poderoso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PODEROSO ). Essa PARTE causa metade do Dano.",
        },
      },
    ],
    diet: "• Folhagem (Luminusgo), raízes (Raiz coxim), fungos, sementes e grãos",
    habitat: "• Montanha",
    behavior:
      "Se nenhuma criatura estiver Exposta, mire a última criatura que causou Dano à Parte em sua LÃ, já que você precisa proteger sua pelagem para que ela o proteja. Seu instinto é fugir, mantendo distância de seu perseguidor enquanto usa sua LÃ abrasiva coibir qualquer tentativa dele de pará-lo. Ao mesmo tempo, o frenesi o leva a roer qualquer ferramenta de arkaicaço que os ferais possam usar para cortar sua pelagem. Se estiver Machucado e suas PERNAS não estiverem quebradas, saltite de um lado para o outro, reorganizando o campo de batalha a seu favor (você pode fazer isso fora do seu turno, e isso não custa Ações)",
  },
  {
    id: 14,
    name: "Lobo-Diadema",
    lineage: "Açougueiro",
    stage: "Adulto",
    sizeDescription: "3 metros de altura",
    description:
      "Um criatura da Linhagem dos Açougueiros. Tem a média de 3 metros até os ombros.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 2,
      poderoso: 2,
      preciso: 2,
      sagaz: 0,
    },
    skills: {
      agarrar: 0,
      armazenar: 0,
      assegurar: 2,
      atirar: 0,
      atravessar: 2,
      chamar: 2,
      curar: 0,
      estudar: 2,
      exibir: 0,
      golpear: 2,
      manufaturar: 0,
      procurar: 3,
    },
    traits: [
      {
        traitId: 14,
        level: 1,
      },
      {
        traitId: 43,
        level: 1,
      },
      {
        traitId: 56,
        level: 1,
      },
      {
        traitId: 59,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 11,
        level: 1,
      },
      {
        traitId: 73,
        level: 1,
      },
      {
        traitId: 60,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "DENTES",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "DENTES. Alcance: 1 (GOLPEAR PRECISO). Passiva: Se você causar Dano à Parte em uma PARTE quebrada, seu alvo fica Exposto.                                                                                                20 ◆ Se Quebrados: Alcance: 1 (GOLPEAR PRECISO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "preciso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PRECISO ). Essa PARTE causa metade do Dano.",
        },
      },
      {
        id: 2,
        name: "GARRAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "GARRAS. Alcance: 1 (GOLPEAR PODEROSO ou GOLPEAR LIGEIRO). ◆ Se Quebradas: Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "poderoso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano. 20",
        },
      },
    ],
    diet: "• Monstros terrestres (Wooda Selvagem), carniça Monta",
    habitat:
      "• Praia (Mesalta), Arvoredo (Montes Nakwon, Musicampo), nhas (Trilha das Lamentações), Deserto (Vale dos Açougueiros)",
    behavior:
      "Se nenhuma criatura estiver Exposta, mire em uma criatura Fadigada, já que você tem preferência por presas cansadas. Seu instinto é o de nunca dar a sua presa uma chance para descansar, e tudo isso enquanto cuida do próprio Vigor. Para ser franco, sua verdadeira força está além das suas estatísticas. Sua tolerância e coordenação com seu bando brilham muito mais durante a fase livre e na Trilha, mas quando está furioso e sozinho, você perde seus maiores trunfos. Apesar de tudo, você continua sendo um caçador grande e perigoso! Seus DENTES metálicos são particularmente bons para quebrar ferramentas de arkaicaço e deixar os ferais vulneráveis.",
  },
  {
    id: 15,
    name: "Lotangwa",
    lineage: "Amontoeiro",
    stage: "Adulto",
    sizeDescription: "6 metros de envergadura média",
    description:
      "Um criatura da Linhagem dos Amontoeiros, com 6 metros de envergadura, em média.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 2,
      poderoso: 3,
      preciso: 0,
      sagaz: 0,
    },
    skills: {
      agarrar: 1,
      armazenar: 0,
      assegurar: 0,
      atirar: 0,
      atravessar: 3,
      chamar: 2,
      curar: 0,
      estudar: 1,
      exibir: 0,
      golpear: 0,
      manufaturar: 1,
      procurar: 1,
    },
    traits: [
      {
        traitId: 46,
        level: 1,
      },
      {
        traitId: 51,
        level: 1,
      },
      {
        traitId: 76,
        level: 2,
      },
    ],
    additionalTraits: [
      {
        traitId: 28,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "ASAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "ASAS. Alcance: 1 (GOLPEAR LIGEIRO). Passiva: Ao final de cada turno completo, você pode se Mover para Mudar o Terreno sem gastar nenhuma das suas Ações.                                                                       20 ◆ Se Quebradas: Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "ligeiro",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano.",
        },
      },
      {
        id: 2,
        name: "BICO",
        durability: {
          current: 30,
          max: 30,
        },
        description:
          "BICO. Alcance: 1 (AGARRAR PODEROSO ) Passiva: Se você Atacar uma criatura com essa PARTE e acertar, ela fica Presa. ◆ Se Quebrado: Alcance: 1 (GOLPEAR PODEROSO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "poderoso",
          skill: "agarrar",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PODEROSO ). Essa PARTE causa metade do Dano. 30",
        },
      },
      {
        id: 3,
        name: "BICO",
        durability: {
          current: 20,
          max: 20,
        },
        description: "Essa PARTE não tem efeito adicional.",
        broken: {
          description: "Você perde NADAR",
        },
      },
    ],
    diet: "• Monstros aquáticos (Goby Guelrabença, Lulesguicho, Peixe-bobo Marinho)",
    habitat: "• Praias",
    behavior:
      "Se nenhuma criatura estiver Presa ou Exposta, mire uma criatura que esteja num terreno abaixo de você, já que você sempre tenta golpear sua presa vindo de cima. Seu instinto é pegar uma criatura com seu BICO e recuar para uma distância segura. Lembre-se de que você pode Atacar um alvo que esteja Preso, triturando-o com seu BICO enquanto tenta sufocá-lo e engoli-lo. Seus PÉS com membranas e suas ASAS LIGEIRAS lhe dão melhores condições de manobra quando você MERGULHA entrando e saindo da água.",
  },
  {
    id: 16,
    name: "Mammudo",
    lineage: "Padeiro",
    stage: "Adulto",
    sizeDescription: "3 metros de altura",
    description:
      "Um criatura da Linhagem dos Padeiros. Tem 3 metros de altura, em média.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 3,
      preciso: 2,
      sagaz: 0,
    },
    skills: {
      agarrar: 0,
      armazenar: 0,
      assegurar: 0,
      atirar: 0,
      atravessar: 0,
      chamar: 0,
      curar: 0,
      estudar: 0,
      exibir: 0,
      golpear: 2,
      manufaturar: 0,
      procurar: 2,
    },
    traits: [
      {
        traitId: 5,
        level: 1,
      },
      {
        traitId: 31,
        level: 1,
      },
      {
        traitId: 43,
        level: 1,
      },
      {
        traitId: 44,
        level: 1,
      },
      {
        traitId: 62,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 24,
        level: 1,
      },
      {
        traitId: 57,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "ESCAMAS",
        durability: {
          current: 40,
          max: 40,
        },
        description:
          "ESCAMAS. Alcance: 1 (GOLPEAR PODEROSO). Você só pode atacar com essa PARTE imediatamente após fazer uma INVESTIDA. Se você Atacar com essa PARTE e acertar, pode empurrar seu alvo para 3 Pernadas longe de você.             40 ◆ Se Quebradas: Você perde ARMADURA NATURAL.",
        attack: {
          range: 1,
          style: "poderoso",
          skill: "golpear",
        },
        broken: {
          description: "Você perde ARMADURA NATURAL.",
        },
      },
      {
        id: 2,
        name: "GARRAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "GARRAS. Alcance: 1 (GOLPEAR PRECISO). ◆ Se Quebradas: Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "preciso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano. 20",
        },
      },
    ],
    diet: "• Monstros terrestres (Brasanguejo), néctar (Néctar de Taçaflauta), mel (Balsamel) e minerais (Argilafurda)",
    habitat:
      "• Arvoredo (Pomar Sen To, Terras Chafurdantes, Bosque das Testemunhas)",
    behavior:
      "Se nenhuma criatura estiver Exposta, mire na última criatura que comeu algo doce, já que você está sempre curioso a respeito de fontes de açúcar. Seu instinto é rolar como uma bola, usar INVESTIDA contra seu alvo e derrubá-lo como um pino de boliche; depois disso, resguardar-se com RECUO e INCANSÁVEL. Você tende a realizar um turno completo perto do fim da rodada, de modo que, após colidir com seu alvo, você pode escolher um novo alvo com segurança, enquanto o anterior ainda está correndo na sua direção para voltar à distância corpo a corpo. Mesmo enfurecido, você só ataca com suas GARRAS como último recurso.",
  },
  {
    id: 17,
    name: "Mongpo",
    lineage: "Molheiro",
    stage: "Adulto",
    sizeDescription: "2 metros de altura em média",
    description:
      "O Mongpo caminha pelo deserto, sugando o ar frio e noturno pelo seu nariz enorme.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 2,
      poderoso: 0,
      preciso: 0,
      sagaz: 3,
    },
    skills: {
      agarrar: 0,
      armazenar: 0,
      assegurar: 0,
      atirar: 2,
      atravessar: 0,
      chamar: 1,
      curar: 2,
      estudar: 0,
      exibir: 2,
      golpear: 0,
      manufaturar: 0,
      procurar: 0,
    },
    traits: [
      {
        traitId: 4,
        level: 1,
      },
      {
        traitId: 50,
        level: 1,
      },
      {
        traitId: 72,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 23,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "CAUDA",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "CAUDA. Passiva: Na primeira vez em que você seria levado à morte, você finge que morreu e permanece caído. Comece O Banquete normalmente. Se uma criatura tocar ou aproximar-se de você, force a barra e comece A Caçada novamente. Você toma a iniciativa durante a primeira rodada (você continua Ferido 3 e morrerá na próxima vez que sofrer Dano). 10 ◆ Se Quebrada: Você mantém o efeito passivo dessa PARTE, mas perde APOSEMÁTICO.",
        broken: {
          description:
            "Você mantém o efeito passivo dessa PARTE, mas perde APOSEMÁTICO.",
        },
      },
      {
        id: 2,
        name: "CHIFRES",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "CHIFRES. Alcance: 1 (GOLPEAR LIGEIRO). ◆ Se Quebrados: Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "ligeiro",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano. 20",
        },
      },
      {
        id: 3,
        name: "NARIZ",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "NARIZ. Alcance: 2 (ATIRAR SAGAZ). Passiva: até o início do seu próximo turno, a criatura atingida por essa PARTE deve gastar 1 Ação adicional para Mover-se.                                                                      20 ◆ Se Quebrado: Alcance: 1 (ATIRAR SAGAZ ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 2,
          style: "sagaz",
          skill: "atirar",
        },
        broken: {
          description:
            "Alcance: 1 (ATIRAR SAGAZ ). Essa PARTE causa metade do Dano.",
        },
      },
    ],
    diet: "• Monstros Terrestres (Insetoíche, Larva de Insetoíche), criaturas voadores (Asaginga, Votra), sementes e grãos (Trigotérreo, Frutescama)",
    habitat: "• Deserto",
    behavior:
      "Se nenhuma criatura estiver Exposta, mire uma criatura que não estiver Amedrontada, já que predadores corajosos são suas maiores ameaças. Seu instinto é farejar e fugir. Mesmo afetado pelo frenesi, você é um criatura covarde e seus mísseis de meleca o ajudam a manter a distância do seu alvo. O efeito passivo da sua CAUDA permite-lhe enganar a morte e sobreviver a um golpe que, de outra forma, o mataria. Então, você pode puxar o tapete dos ferais, revelando que ainda está vivo. O novo combate provavelmente não vai durar muito, já que você está a um passo da morte, mas acrescenta uma etapa extra que torna sua luta surpreendente e memorável.",
  },
  {
    id: 18,
    name: "Myotak",
    lineage: "Padeiro",
    stage: "Adulto",
    sizeDescription: "4 metros de altura em média",
    description:
      "Um criatura da Linhagem dos Padeiros. Tem 4 metros de altura em média.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 3,
      poderoso: 2,
      preciso: 0,
      sagaz: 0,
    },
    skills: {
      agarrar: 1,
      armazenar: 0,
      assegurar: 1,
      atirar: 0,
      atravessar: 3,
      chamar: 1,
      curar: 0,
      estudar: 0,
      exibir: 0,
      golpear: 2,
      manufaturar: 0,
      procurar: 0,
    },
    traits: [
      {
        traitId: 9,
        level: 1,
      },
      {
        traitId: 30,
        level: 2,
      },
      {
        traitId: 44,
        level: 1,
      },
      {
        traitId: 63,
        level: 1,
      },
      {
        traitId: 74,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 6,
        level: 1,
      },
      {
        traitId: 33,
        level: 1,
      },
      {
        traitId: 37,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "CASCOS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "CASCOS. Alcance: 1 (GOLPEAR LIGEIRO). ◆ Se Quebrados: Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano. Você perde 1 nível                   20 de ESCALAR.",
        attack: {
          range: 1,
          style: "ligeiro",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano. Você perde 1 nível                   20 de ESCALAR.",
        },
      },
      {
        id: 2,
        name: "CHIFRES",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "CHIFRES. Alcance: 1 (GOLPEAR PODEROSO). Passiva: Você tem Vantagem para Atacar com essa PARTE após fazer uma INVESTIDA.                                                                                                    20 ◆S e Quebrados: Alcance: 1 (GOLPEAR PODEROSO). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "poderoso",
          skill: "golpear",
        },
      },
    ],
    diet: "• Folhagem (Luminusgo), frutas (Vagem de metro Lakkarakku), raízes (Raiz Coxim)",
    habitat:
      "• Montanha (Fundão, Trilha das Lamentações, Monte Zayyat, Cataratas do Yhayhe)",
    behavior:
      "Se nenhuma criatura estiver Exposta, mire a última criatura que o empurrou ou puxou, já que você enxerga disputas por posição como um desafio. Seu instinto é se aproveitar do terreno elevado. Quando está seguro em um terreno que você pode escalar, como falésias, use sua mobilidade superior para evitar ser cercado. Ataque com seus CASCOS durante seus turnos curtos, dançando ao redor de seus inimigos com VELOCIDADE, e então ataque com seus CHIFRES durante seu turno completo, perto do final da rodada. Afinal, é difícil manter a pressão sobre seu alvo depois de jogá-lo em outro terreno.",
  },
  {
    id: 19,
    name: "Onagung",
    lineage: "Molheiro",
    stage: "Adulto",
    sizeDescription: "Varia de 1 a 3 metros de altura",
    description:
      "Um criatura da Linhagem dos Molheiros. Aparecem em uma grande variedade de tamanhos.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 1,
      poderoso: 1,
      preciso: 1,
      sagaz: 3,
    },
    skills: {
      agarrar: 0,
      armazenar: 2,
      assegurar: 0,
      atirar: 2,
      atravessar: 0,
      chamar: 0,
      curar: 3,
      estudar: 0,
      exibir: 2,
      golpear: 0,
      manufaturar: 0,
      procurar: 1,
    },
    traits: [
      {
        traitId: 21,
        level: 1,
      },
      {
        traitId: 32,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 11,
        level: 1,
      },
      {
        traitId: 28,
        level: 1,
      },
      {
        traitId: 28,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "GELECA",
        durability: {
          current: 80,
          max: 80,
        },
        description:
          "GELECA. Alcance: 2 (ATIRAR SAGAZ). Passiva: Se você ATIRAR com essa PARTE, uma das suas outras PARTES perde 1d6 de Durabilidade.                                                                                80 ◆ Se Quebrado: Você morre.",
        attack: {
          range: 2,
          style: "sagaz",
          skill: "atirar",
        },
        broken: {
          description: "Você morre.",
        },
      },
      {
        id: 2,
        name: "PARTES ADICIONAIS",
        durability: {
          current: 0,
          max: 0,
        },
        description:
          "PARTES ADICIONAIS. Se estiver digerindo uma criatura, você tem todas as PARTES dele. Se estiver digerindo várias criaturas, você tem uma PARTE de cada um deles.",
        broken: {
          description:
            "Depende das PARTES que você tem. Se você não tiver PARTES, você morre.",
        },
      },
    ],
    diet: "• Monstros terrestres, carniça (Detritos)",
    habitat: "• Praia (Celário do Gigante), Montanha",
    behavior:
      "Se nenhuma criatura estiver Exposta, mire uma criatura que estiver Queimada, ou tenha um Traço ou Técnica que pode infligir QUEIMADO, já que calor chama a sua atenção. Seu instinto é imitar o(s) criatura(s) que está digerindo, até que não tenha outra opção a não ser disparar seus ossos como se fossem balas. Caçadas contra você costumam variar, sempre dependendo de sua última refeição, mas podem se tornar especialmente bizarras se você começar a misturar e combinar as PARTES e TRAÇOS de vários criaturas. As regras para criaturas diferentes nem sempre funcionam conforme estão escritas, então seja flexível e siga o que faz sentido no contexto.",
  },
  {
    id: 20,
    name: "Peliçalce",
    lineage: "Jardineiro",
    stage: "Adulto",
    sizeDescription: "3 metros de altura em média",
    description:
      "Um criatura da Linhagem dos Jardineiros. Tem, em média, 3 metros de altura até os ombros.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 3,
      poderoso: 0,
      preciso: 1,
      sagaz: 0,
    },
    skills: {
      agarrar: 0,
      armazenar: 0,
      assegurar: 1,
      atirar: 0,
      atravessar: 1,
      chamar: 0,
      curar: 0,
      estudar: 0,
      exibir: 2,
      golpear: 2,
      manufaturar: 0,
      procurar: 1,
    },
    traits: [
      {
        traitId: 16,
        level: 1,
      },
      {
        traitId: 44,
        level: 1,
      },
      {
        traitId: 74,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 37,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "CHIFRES",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "CHIFRES. Alcance: 1 (GOLPEAR LIGEIRO). Passiva: Se você usar INVESTIDA, dobre o Dano causado à outra criatura, mas não a si mesmo. Além disso, você tem Vantagem ao atacar até o fim do seu turno.                              20 ◆ Se Quebrados: Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "ligeiro",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR LIGEIRO ). Essa PARTE causa metade do Dano.",
        },
      },
      {
        id: 2,
        name: "PERNAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "PERNAS. Alcance: 1 (GOLPEAR PRECISO). ◆ Se Quebradas: Alcance: 1 (GOLPEAR PRECISO ). Essa PARTE causa metade do Dano. Você perde",
        attack: {
          range: 1,
          style: "preciso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PRECISO ). Essa PARTE causa metade do Dano. Você perde                              20",
        },
      },
    ],
    diet: "• Folhagem (videiraçúcar), sementes e grãos (Arroz Arbóreo) T",
    habitat: "• Arvoredo (Montes Nakwon, Musicampo, Bosque das estemunhas)",
    behavior:
      "Se nenhuma criatura estiver Exposta, mire numa criatura que estiver a 3 Pernadas de você, já que essa é a distância que um peliçalce rival manteria se quisesse lutar contra você. Seu instinto é usar CLARÃO e VELOCIDADE juntos sempre que possível, desorientando seus inimigos e mantendo-se longe do seu alcance antes de usar INVESTIDA para encurtar a distância e acertar seu alvo. Você raramente usa suas PERNAS para atacar, mas um chute Quebra-partes no momento certo pode devastar seus inimigos.",
  },
  {
    id: 21,
    name: "Pitangwa",
    lineage: "Padeiro",
    stage: "Adulto",
    sizeDescription: "3 metros de envergadura média",
    description:
      "Um criatura da Linhagem dos Padeiros. Tem uma envergadura média de 3 metros.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 1,
      poderoso: 0,
      preciso: 3,
      sagaz: 1,
    },
    skills: {
      agarrar: 0,
      armazenar: 0,
      assegurar: 0,
      atirar: 0,
      atravessar: 2,
      chamar: 1,
      curar: 0,
      estudar: 2,
      exibir: 1,
      golpear: 2,
      manufaturar: 1,
      procurar: 2,
    },
    traits: [
      {
        traitId: 65,
        level: 1,
      },
      {
        traitId: 70,
        level: 1,
      },
      {
        traitId: 76,
        level: 2,
      },
    ],
    additionalTraits: [
      {
        traitId: 30,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "ASAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "ASAS. Alcance: 1 (GOLPEAR LIGEIRO ). ◆ Se Quebrado: Alcance: 1 (GOLPEAR LIGEIRO ). Esta PARTE causa metade do Dano. Você perde 1 20 nível de VOAR.",
        attack: {
          range: 1,
          style: "ligeiro",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR LIGEIRO ). Esta PARTE causa metade do Dano. Você perde 1 20 nível de VOAR.",
        },
      },
      {
        id: 2,
        name: "GARRAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "GARRAS. Alcance: 1 (GOLPEAR SAGAZ ). ◆ Se Quebrado: Alcance: 1 (GOLPEAR SAGAZ ). Esta PARTE causa metade do Dano. Você perde ESCALAR.",
        attack: {
          range: 1,
          style: "sagaz",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR SAGAZ ). Esta PARTE causa metade do Dano. Você perde ESCALAR. 20",
        },
      },
      {
        id: 3,
        name: "BICO",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "BICO. Alcance: 1 (GOLPEAR PRECISO). Passiva: Se você causar Dano à Parte em uma PARTE quebrada, seu alvo fica Atordoado.                                                                                              20 ◆ Se Quebrado: Alcance: 1 (GOLPEAR PRECISO ). Esta PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "preciso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PRECISO ). Esta PARTE causa metade do Dano.",
        },
      },
    ],
    diet: "• Monstros terrestres (Leitesouro, Verme), seiva (Seiva de Espiralárvore)                                 Mo",
    habitat:
      "• Arvoredo(Pomar dos Sen, Bosque das Testemunhas), ntanhas (Fundão)",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha uma criatura com uma PARTE quebrada como alvo, já que você consegue perceber pontos fracos em superfícies inorgânicas. Seu instinto é focar em um ponto e bater nele, golpeando repetidamente até que ele quebre. É um grande azar ser a primeira criatura a chamar a sua atenção, já que é improvável que você troque de alvo sem uma distração séria, afinal, você está aqui para comer, e não lutar de forma justa. Você é um mestre de muitos tipos de Terreno, então alterne entre Céu, Chão, Dossel ou Falésias conforme seja necessário para ficar fora de perigo ou caçar seu alvo.",
  },
  {
    id: 22,
    name: "Pondon",
    lineage: "Amontoeiro",
    stage: "Adulto",
    sizeDescription: "2 metros de altura e comprimento variável",
    description:
      "Um criatura da Linhagem dos Amontoeiros. Tem em média 2 metros de altura e comprimento variável.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 1,
      preciso: 3,
      sagaz: 0,
    },
    skills: {
      agarrar: 0,
      armazenar: 3,
      assegurar: 1,
      atirar: 0,
      atravessar: 2,
      chamar: 0,
      curar: 0,
      estudar: 0,
      exibir: 0,
      golpear: 0,
      manufaturar: 0,
      procurar: 2,
    },
    traits: [
      {
        traitId: 6,
        level: 2,
      },
      {
        traitId: 31,
        level: 3,
      },
      {
        traitId: 70,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 41,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "BARRIGA",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "BARRIGA. Passiva: Você pode estar na sua forma gorda ou comprida. Em sua forma gorda, você recebe +2",
      },
      {
        id: 2,
        name: "GARRAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "GARRAS. Alcance: 1 (GOLPEAR PRECISO ou GOLPEAR LIGEIRO). Aumente o Alcance desta PARTE em 1 em sua forma longa.                                                                                              20 ◆ Se Quebradas: Alcance: 1 (GOLPEAR PRECISO ). Esta PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "preciso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PRECISO ). Esta PARTE causa metade do Dano.",
        },
      },
      {
        id: 3,
        name: "PRESAS",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "PRESAS. Alcance: 1 (GOLPEAR PODEROSO). ◆ Se Quebradas: Alcance: 1 (GOLPEAR PODEROSO ). Esta PARTE causa metade do Dano. Você perde 10 1 nível de ESCAVAR.",
        attack: {
          range: 1,
          style: "poderoso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PODEROSO ). Esta PARTE causa metade do Dano. Você perde 10 1 nível de ESCAVAR.",
        },
      },
    ],
    diet: "• Monstros terrestres (Geleca de Onagung, Verme)",
    habitat: "• Montanha",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha como alvo uma criatura que esteja cavando, já que o Subterrâneo é o seu domínio. Seu instinto é maximizar as forças de sua forma atual. Por padrão, você começa A Caçada em sua forma gorda, avançando com dificuldade enquanto tenta acertar uma pancada esmagadora com suas GARRAS ou PRESAS. Se ficar Amedrontado ou Ferido, mergulhe para o Subterrâneo — narrativamente, você pode presumir que haja um bocado de vermes lá embaixo para ativar sua mudança de forma. Use seu alcance mais longo para golpear criaturas em qualquer Terreno, enquanto demonstra as adaptações que o fazem o melhor escavador da Costa Sen.",
  },
  {
    id: 23,
    name: "Raizanguejo",
    lineage: "Molheiro",
    stage: "Adulto",
    sizeDescription:
      "2 metros de diâmetro, com o mais velho chegando a 12 metros",
    description:
      "Um criatura da Linhagem dos Molheiros. Tem em média 2 metros de diâmetro, com o mais velho chegando a 12 metros.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 2,
      preciso: 0,
      sagaz: 3,
    },
    skills: {
      agarrar: 2,
      armazenar: 2,
      assegurar: 1,
      atirar: 0,
      atravessar: 0,
      chamar: 0,
      curar: 3,
      estudar: 0,
      exibir: 1,
      golpear: 2,
      manufaturar: 0,
      procurar: 0,
    },
    traits: [
      {
        traitId: 10,
        level: 1,
      },
      {
        traitId: 31,
        level: 1,
      },
      {
        traitId: 39,
        level: 1,
      },
      {
        traitId: 58,
        level: 1,
      },
      {
        traitId: 64,
        level: 3,
      },
      {
        traitId: 66,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 28,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "GARRAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "GARRAS. Alcance: 1 (GOLPEAR PODEROSO ou GOLPEAR SAGAZ). ◆ Se Quebradas: Alcance: 1 (GOLPEAR SAGAZ ). Esta PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "poderoso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR SAGAZ ). Esta PARTE causa metade do Dano. 20",
        },
      },
      {
        id: 2,
        name: "OLHOS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "OLHOS. Esta PARTE não tem efeito adicional. ◆ Se Quebrados: Você perde PREDADOR DE EMBOSCADA.",
        broken: {
          description:
            "Você perde PREDADOR DE EMBOSCADA.                                                                            20",
        },
      },
      {
        id: 3,
        name: "TRONCO",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "TRONCO. Passiva: Enquanto estiver no Subterrâneo, você não pode se Mover exceto para Mudar de Terreno. Além disso, criaturas em outro Terreno não têm distância mínima de você, mas essa é a única PARTE que podem afetar com Dano à Parte. 20 ◆Se Quebrado: Você fica Exposto e perde FOTOSSÍNTESE. Você não pode usar REGENERAÇÃO nessa",
        broken: {
          description:
            "Você fica Exposto e perde FOTOSSÍNTESE. Você não pode usar REGENERAÇÃO nessa",
        },
      },
    ],
    diet: "• Monstros terrestres (Lapuni Selvagem, Verme), carniça",
    habitat: "• Arvoredo, Deserto (Vale do Açougueiro, Lago Esporádico)",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha como alvo uma criatura que esteja a 1 Pernada, já que você odeia se mover a menos que seja absolutamente necessário. Seu instinto é ficar parado, agarrando presas com suas GARRAS caso se aproximem e usando seus Traços defensivos para continuar saudável. A menos que as circunstâncias sejam excepcionais, você começa A Caçada Escondido e no Subsolo, e, devido ao seu TRONCO, pode Atacar da segurança da terra. Se estiver Ferido ou se criaturas puderem feri-lo à distância, você fica mais agressivo. Arraste-se para fora do solo se precisar partir para a ofensiva.",
  },
  {
    id: 24,
    name: "Rakuzar",
    lineage: "Pivoteiro",
    stage: "Adulto",
    sizeDescription: "3 metros de comprimento",
    description:
      "Um criatura da Linhagem dos Pivoteiros. Tem em média 3 metros de comprimento.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 1,
      poderoso: 0,
      preciso: 0,
      sagaz: 3,
    },
    skills: {
      agarrar: 0,
      armazenar: 0,
      assegurar: 0,
      atirar: 0,
      atravessar: 0,
      chamar: 0,
      curar: 1,
      estudar: 0,
      exibir: 1,
      golpear: 0,
      manufaturar: 0,
      procurar: 0,
    },
    traits: [
      {
        traitId: 34,
        level: 1,
      },
      {
        traitId: 35,
        level: 1,
      },
      {
        traitId: 53,
        level: 1,
      },
      {
        traitId: 64,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 23,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "BARRIGA",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "BARRIGA. Passiva: Enquanto estiver Expandido, você recebe +2 CHAMAR e pode receber níveis em PODEROSO iguais ao seu nível em SAGAZ.                                                                             10 ◆ Se Quebrada: Você remove EXPANDIR e não pode ficar Expandido.",
        broken: {
          description: "Você remove EXPANDIR e não pode ficar Expandido.",
        },
      },
      {
        id: 2,
        name: "CAUDA",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "CAUDA. Passiva: Se sofrer Dano, você pode reduzir a Durabilidade desta PARTE a 0 para não sofrer Dano. ◆ Se Quebrado: Esta PARTE não faz nada.",
        broken: {
          description: "Esta PARTE não faz nada. 10",
        },
      },
      {
        id: 3,
        name: "DENTES",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "DENTES. Alcance: 1 (GOLPEAR). ◆ Se Quebrados: Alcance: 1 (GOLPEAR ). Esta PARTE causa metade do Dano.",
        broken: {
          description:
            "Alcance: 1 (GOLPEAR ). Esta PARTE causa metade do Dano. 20",
        },
      },
    ],
    diet: "• Monstros voadores (Asarremo, Votra), folhagem (Palma de Cacto)",
    habitat: "• Deserto",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha como alvo a última criatura a fazer um CHAMAR, já que você duela com rivais de sua própria espécie por meio do som. Seu instinto é ficar Expandido o mais rápido e o máximo possível, para que possa usar sua voz bombástica para forçar seus inimigos à submissão com seus rugidos. Suas Partes são frágeis, mas elas só precisam de 1 de Durabilidade para não estarem mais quebradas. Priorize usar REGENERAÇÃO em sua BARRIGA, para que possa retornar à sua forma Expandida carregada de hormônios.",
  },
  {
    id: 25,
    name: "Satra",
    lineage: "Molheiro",
    stage: "Adulto",
    sizeDescription: "10 metros de comprimento",
    description:
      "Um criatura da Linhagem dos Molheiros. Tem em média 10 metros de comprimento.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 2,
      preciso: 1,
      sagaz: 3,
    },
    skills: {
      agarrar: 1,
      armazenar: 0,
      assegurar: 0,
      atirar: 0,
      atravessar: 0,
      chamar: 0,
      curar: 1,
      estudar: 1,
      exibir: 2,
      golpear: 3,
      manufaturar: 0,
      procurar: 0,
    },
    traits: [
      {
        traitId: 7,
        level: 3,
      },
      {
        traitId: 10,
        level: 1,
      },
      {
        traitId: 54,
        level: 1,
      },
      {
        traitId: 58,
        level: 1,
      },
      {
        traitId: 75,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 28,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "BARBILHÕES",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "BARBILHÕES. Esta PARTE não tem efeito adicional. ◆   Se Quebrados: Você perde PREDADOR DE EMBOSCADA e fica Exposto.",
        broken: {
          description:
            "Você perde PREDADOR DE EMBOSCADA e fica Exposto.                                                  10",
        },
      },
      {
        id: 2,
        name: "CAUDA",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "CAUDA. Alcance: 2 (GOLPEAR SAGAZ ). Passiva: Você não pode aplicar seu bônus de HABILIDADE quando Atacar com esta PARTE. ◆ Se Quebrado: Alcance: 1 (GOLPEAR SAGAZ ). Esta PARTE causa metade do Dano. Você não pode aplicar 20 seu bônus de HABILIDADE quando Atacar com esta PARTE.",
        attack: {
          range: 2,
          style: "sagaz",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR SAGAZ ). Esta PARTE causa metade do Dano. Você não pode aplicar 20 seu bônus de HABILIDADE quando Atacar com esta PARTE.",
        },
      },
      {
        id: 3,
        name: "DENTES",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "DENTES. Alcance: 1 (GOLPEAR). Passiva: Enquanto estiver Escondido, outras criaturas não sabem a que distância estão de você, e você não anuncia o que está fazendo quando gastar Ações para Mover ou Preparar. ◆ Se Quebrados: Alcance: 1 (GOLPEAR ). Esta PARTE causa metade do Dano. Você perde VENENO. Cada 10 vez que esta PARTE sofrer Dano à Parte depois de quebrada, você perde 1 nível de BIOLUMINESCÊNCIA. Na quarta vez que esta PARTE sofrer Dano à Parte depois de quebrada (isto é, quando tiver perdido todos os níveis de BIOLUMINESCÊNCIA), você perde CAMUFLAGEM.",
        broken: {
          description:
            "Alcance: 1 (GOLPEAR ). Esta PARTE causa metade do Dano. Você perde VENENO. Cada 10 vez que esta PARTE sofrer Dano à Parte depois de quebrada, você perde 1 nível de BIOLUMINESCÊNCIA. Na quarta vez que esta PARTE sofrer Dano à Parte depois de quebrada (isto é, quando tiver perdido todos os níveis de BIOLUMINESCÊNCIA), você perde CAMUFLAGEM.",
        },
      },
    ],
    diet: "• Monstros terrestres (Geleca de Onagung, Wooda Selvagem), criaturas aquáticos (Girinos de Sposu), carniça.",
    habitat:
      "• Montanha (Amethaninamizzet, Leylinha Sessão 1115, Bandejargênteas)",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha como alvo uma criatura Envenenada, já que seu VENENO reduz a velocidade de qualquer presa que escape da primeira mordida esmagadora de seus DENTES. Seu instinto é ficar imóvel como uma pedra. Frequentemente, você só Ataca se tiver tido a chance de Preparar durante os turnos anteriores, e prefere deixar que suas presas venham até você. Sua habilidade única para obscurecer informações enquanto estiver Escondido exigirá que improvise algumas regras. Por exemplo, um feral pode tentar Atacá-lo enquanto você não esteja em seu Alcance — cabe a você decidir se ele mantém suas ações ou as desperdiça, dependendo do tom do seu jogo.",
  },
  {
    id: 26,
    name: "Shakoi",
    lineage: "Peixeiro",
    stage: "Adulto",
    sizeDescription:
      "Entre 3 e 6 metros de comprimento (não contando os bicos)",
    description:
      "Um criatura da Linhagem dos Peixeiros. Os machos têm em média 3 metros de comprimento, e as fêmeas, até 6 (não contando seus bicos).",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 3,
      poderoso: 0,
      preciso: 2,
      sagaz: 0,
    },
    skills: {
      agarrar: 0,
      armazenar: 0,
      assegurar: 2,
      atirar: 0,
      atravessar: 2,
      chamar: 0,
      curar: 0,
      estudar: 1,
      exibir: 0,
      golpear: 2,
      manufaturar: 0,
      procurar: 1,
    },
    traits: [
      {
        traitId: 27,
        level: 1,
      },
      {
        traitId: 44,
        level: 1,
      },
      {
        traitId: 51,
        level: 3,
      },
      {
        traitId: 74,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 8,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "BICO",
        durability: {
          current: 30,
          max: 30,
        },
        description:
          "BICO. Alcance: 1 (GOLPEAR PRECISO ou GOLPEAR LIGEIRO). Passiva: Se fizer uma INVESTIDA, você pode Atacar com esta PARTE sem gastar Ações. Se não acertar, você se Move 3 Pernadas para longe de seu alvo.                 30 ◆ Se Quebrado: Alcance: 1 ( GOLPEAR LIGEIRO ). Esta PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "preciso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 ( GOLPEAR LIGEIRO ). Esta PARTE causa metade do Dano.",
        },
      },
      {
        id: 2,
        name: "RABO",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "RABO. Passiva: Se você fizer uma INVESTIDA, receba VOAR até o fim de seu turno. Se estiver no Céu ao final de seu turno, você cai de volta na água.                                                                                   20 ◆ Se Quebrado: Você fica Exposto.",
        broken: {
          description: "Você fica Exposto.",
        },
      },
    ],
    diet: "• Monstros aquáticos (Conchaspinho de Aso, Enguia Condutora, Lulesguicho, Nedou Xie, Peixe-bobo Marinho, Pratanguejo)",
    habitat: "• Praia (Baía de Aso, Paramar)",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha como alvo uma criatura com NADAR. O mundo aquático é seu foco, e você ignora criaturas terrestres até que tenha lidado com as ameaças em seu nível. Seu instinto é o de perfurar em direção ao seu alvo, fazendo um GOLPEAR PRECISO depois de sua INVESTIDA para incapacitá-lo, e então prosseguir com GOLPES LIGEIRO devastadores. Separe seu alvo de aliados usando VELOCIDADE e sua mobilidade superior para distanciar-se de outras criaturas. Como você é aquático, você nunca caminha no Chão, mas pode emergir com seu CAUDA caso enfrente presas que tenham VOAR.",
  },
  {
    id: 27,
    name: "Shulu Xie",
    lineage: "Açougueiro",
    stage: "Adulto",
    sizeDescription: "4 metros de comprimento, incluindo os tentáculos",
    description:
      "Um criatura da Linhagem dos Açougueiros. Tem em média 4 metros de comprimento, incluindo os tentáculos.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 2,
      poderoso: 0,
      preciso: 3,
      sagaz: 0,
    },
    skills: {
      agarrar: 1,
      armazenar: 0,
      assegurar: 0,
      atirar: 0,
      atravessar: 2,
      chamar: 0,
      curar: 0,
      estudar: 0,
      exibir: 3,
      golpear: 2,
      manufaturar: 1,
      procurar: 0,
    },
    traits: [
      {
        traitId: 14,
        level: 1,
      },
      {
        traitId: 52,
        level: 5,
      },
      {
        traitId: 76,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 23,
        level: 1,
      },
      {
        traitId: 38,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "SINO",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "SINO. Passiva: Gaste 1 Ação para transferir uma criatura Presa por seus Tentáculos para seu SINO. No começo de cada rodada, criaturas Presas por seu SINO sofrem 10 de Dano.                                                        20 ◆ Se Quebrado: Você perde NÃO-ME-TOQUE 5.",
        broken: {
          description: "Você perde NÃO-ME-TOQUE 5.",
        },
      },
      {
        id: 2,
        name: "SHULU WON",
        durability: {
          current: 30,
          max: 30,
        },
        description:
          "SHULU WON. Passiva: Criaturas sem VOAR precisam gastar 2 de Vigor para se Mover, além de outros custos. Além disso, criaturas podem entrar no Céu escalando.                                                                         30 ◆ Se Quebrado: Harmonia é reduzida em 1.",
        broken: {
          description: "Harmonia é reduzida em 1.",
        },
      },
      {
        id: 3,
        name: "TENTÁCULOS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "TENTÁCULOS. Alcance: 2 (GOLPEAR PRECISO ou GOLPEAR LIGEIRO). Se você causar Dano a uma criatura com esta PARTE, ela fica Presa. ◆ Se Quebrados: Alcance: 1 (GOLPEAR PRECISO ). Esta PARTE causa metade do Dano.",
        attack: {
          range: 2,
          style: "preciso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PRECISO ). Esta PARTE causa metade do Dano. 20",
        },
      },
    ],
    diet: "• Monstros terrestres (Verme), criaturas aquáticos (Inalalama Menor, Goby Guelrabença)",
    habitat: "• Praias",
    behavior:
      "Se nenhuma criatura estiver Presa ou Exposta, escolha como alvo uma criatura Ferida, uma vez que o cheiro de sangue é como você encontra comida. Seu instinto é flutuar passivamente acima do campo de batalha, deixando que sua armadura vítrea, seus estômagos ácidos e perigos ambientais enfraqueçam sua presa. Você é frequentemente encontrado acima de shulu wons, os corais de vidro de onde sua espécie nasce — ferais sem VOAR podem usar estas torres contra você, escalando-as para alcançá-lo no Céu. Mesmo que você esteja em frenesi, os shulu wons não estão, e ferais que danifiquem os corais arriscam causar sérios prejuízos ao ecossistema.",
  },
  {
    id: 28,
    name: "Sposu",
    lineage: "Churrasqueiro",
    stage: "Adulto",
    sizeDescription: "3 metros de comprimento",
    description:
      "Um criatura da Linhagem dos Churrasqueiros. Tem em média 3 metros de comprimento.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 3,
      poderoso: 0,
      preciso: 0,
      sagaz: 2,
    },
    skills: {
      agarrar: 0,
      armazenar: 2,
      assegurar: 2,
      atirar: 2,
      atravessar: 2,
      chamar: 0,
      curar: 0,
      estudar: 0,
      exibir: 1,
      golpear: 0,
      manufaturar: 2,
      procurar: 0,
    },
    traits: [
      {
        traitId: 7,
        level: 1,
      },
      {
        traitId: 16,
        level: 1,
      },
      {
        traitId: 18,
        level: 1,
      },
      {
        traitId: 30,
        level: 1,
      },
      {
        traitId: 51,
        level: 2,
      },
    ],
    additionalTraits: [
      {
        traitId: 11,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "BARBATANAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "BARBATANAS. Passiva: Se você estiver a até 0 Pernada de uma criatura, ela o arrasta junto toda vez que se Mover (Você pode escolher a qual criatura está agarrado se houver múltiplas a 0 Pernada).                                   20 ◆ Se Quebradas: Você perde ESCALAR e 1 nível em NADAR.",
        broken: {
          description: "Você perde ESCALAR e 1 nível em NADAR.",
        },
      },
      {
        id: 2,
        name: "ESPINHAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "ESPINHAS. Alcance: 2 (ATIRAR SAGAZ ). Passiva: Se você Atacar com esta PARTE e acertar, a PARTE em que mirou fica Queimada.                                                                                                  20 ◆ Se Quebradas: Alcance: 1 (ATIRAR SAGAZ ). Esta PARTE causa metade do Dano.",
        attack: {
          range: 2,
          style: "sagaz",
          skill: "atirar",
        },
        broken: {
          description:
            "Alcance: 1 (ATIRAR SAGAZ ). Esta PARTE causa metade do Dano.",
        },
      },
    ],
    diet: "• Monstros terrestres (Verme, carniça, frutos (Falso Pêssego Che )",
    habitat: "• Montanha",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha como alvo uma criatura Atordoada, já que você frequentemente atordoa suas presas antes de matá-las. Seu instinto é agarrar-se a uma criatura com suas BARBATANAS e então liberar um bombardeio de fagulhas contra seu alvo. Perceba que a criatura a 0 Pernada de você e seu alvo não são necessariamente os mesmos — um só está lhe dando uma carona, e o outro você quer levar para casa como refeição para a colônia. Tente realizar seu turno completo depois do turno do seu alvo, para que possa atordoá-lo de novo com seu CLARÃO, e mantenha seu foco nele durante a próxima rodada.",
  },
  {
    id: 29,
    name: "Syowari",
    lineage: "Amontoeiro",
    stage: "Adulto",
    sizeDescription: "6 metros de envergadura média",
    description:
      "Um criatura da Linhagem dos Amontoeiros. Tem uma envergadura média de 6 metros.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 2,
      poderoso: 0,
      preciso: 0,
      sagaz: 3,
    },
    skills: {
      agarrar: 0,
      armazenar: 3,
      assegurar: 0,
      atirar: 1,
      atravessar: 1,
      chamar: 0,
      curar: 1,
      estudar: 3,
      exibir: 0,
      golpear: 1,
      manufaturar: 3,
      procurar: 0,
    },
    traits: [
      {
        traitId: 14,
        level: 1,
      },
      {
        traitId: 45,
        level: 1,
      },
      {
        traitId: 76,
        level: 2,
      },
    ],
    additionalTraits: [
      {
        traitId: 8,
        level: 1,
      },
      {
        traitId: 11,
        level: 1,
      },
      {
        traitId: 73,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "ASAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "ASAS. Esta Parte não tem efeito adicional. ◆ Se Quebradas: Você perde 1 nível de VOAR e fica Exposto.",
        broken: {
          description:
            "Você perde 1 nível de VOAR e fica Exposto.                                                                  20",
        },
      },
      {
        id: 2,
        name: "BICO",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "BICO. Alcance: 1 (GOLPEAR LIGEIRO). ◆ Se Quebrado: Alcance: 1 (GOLPEAR LIGEIRO ). Esta PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "ligeiro",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR LIGEIRO ). Esta PARTE causa metade do Dano.                                             20",
        },
      },
      {
        id: 3,
        name: "GARRAS",
        durability: {
          current: 30,
          max: 30,
        },
        description:
          "GARRAS. Alcance: 1 (GOLPEAR SAGAZ). Passiva: Se você Atacar uma criatura com esta PARTE e acertar, pode usar LADRÃO para roubar seu UTENSÍLIO. Você pode usar o Utensílio como usaria uma de suas próprias PARTES. O UTENSÍLIO mantém qualquer Alcance ou Durabilidade que receba de Técnicas. Você só pode segurar um UTENSÍLIO de cada vez.                                                                                                     30 ◆ Se Quebradas: Alcance: 1 (GOLPEAR SAGAZ ). Esta PARTE causa metade do Dano. Se estiver segurando um UTENSÍLIO, você o derruba.",
        attack: {
          range: 1,
          style: "sagaz",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR SAGAZ ). Esta PARTE causa metade do Dano. Se estiver segurando um UTENSÍLIO, você o derruba.",
        },
      },
      {
        id: 4,
        name: "OLHOS",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "OLHOS. Passiva: Anote cada vez que um feral usar uma Técnica que custe Ações (isso exclui Técnicas Passivas e Técnicas que custem Vigor). Até o fim da Jornada, se você portar o UTENSÍLIO daquele feral, pode usar aquelas Técnicas.                10 ◆ Se Quebrados: Você não pode mais usar Técnicas.",
        broken: {
          description: "Você não pode mais usar Técnicas.",
        },
      },
    ],
    diet: "• Monstros terrestres (Cauda de Rakuzar), carniça",
    habitat: "• Deserto",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha como alvo uma criatura que tenha demonstrado uma nova Técnica recentemente, uma vez que você gosta de testar coisas novas. Seu instinto é observar como seu alvo luta, roubar seu UTENSÍLIO e copiar seus movimentos. A maioria dos ferais não pode Atacar ou usar suas Técnicas sem acesso a seu UTENSÍLIO, então, matilhas menores terão muito mais dificuldade para caçá-lo do que matilhas maiores.",
  },
  {
    id: 30,
    name: "Tanpo",
    lineage: "Amontoeiro",
    stage: "Adulto",
    sizeDescription: "4 metros de altura",
    description:
      "Um criatura da Linhagem dos Amontoeiros. Tem em média 4 metros de altura.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 2,
      poderoso: 3,
      preciso: 0,
      sagaz: 0,
    },
    skills: {
      agarrar: 0,
      armazenar: 2,
      assegurar: 0,
      atirar: 0,
      atravessar: 0,
      chamar: 0,
      curar: 1,
      estudar: 0,
      exibir: 0,
      golpear: 0,
      manufaturar: 2,
      procurar: 2,
    },
    traits: [
      {
        traitId: 5,
        level: 1,
      },
      {
        traitId: 6,
        level: 2,
      },
      {
        traitId: 44,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 13,
        level: 1,
      },
      {
        traitId: 37,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "LAMA",
        durability: {
          current: 30,
          max: 30,
        },
        description:
          "LAMA. Passiva: Você não pode ficar EXPOSTO. Esta PARTE sofre o dobro de Dano se estiver QUEIMADA ou se você estiver Debaixo d'agua.",
        broken: {
          description: "Você perde ARMADURA NATURAL, mas recebe +1 LIGEIRO",
        },
      },
      {
        id: 2,
        name: "PERNAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "PERNAS. Alcance: 1 (GOLPEAR PODEROSO). Passiva: Se sua LAMA não estiver quebrada, reduza à metade qualquer Dano à Parte sofrido por esta PARTE.                                                                        20 ◆ Se Quebradas: Alcance: 1 (GOLPEAR PODEROSO ). Esta PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "poderoso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PODEROSO ). Esta PARTE causa metade do Dano.",
        },
      },
      {
        id: 3,
        name: "PRESAS",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "PRESAS. Alcance: 1 (GOLPEAR LIGEIRO). ◆ Se Quebradas: Alcance: 1 (GOLPEAR PODEROSO ). Esta PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "ligeiro",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PODEROSO ). Esta PARTE causa metade do Dano. 10",
        },
      },
    ],
    diet: "• Folhagem (Brotos das Cinzas, Casca de Espiralárvore), frutos (Vagem de metro Lakkarakku), fungos, minerais (Argilafurda)                                                            C",
    habitat:
      "• Arvoredo (Terrenos Chafurdantes, Bosque das Testemunhas), Montanha (Trilha das Lamentações, ataratas do Yhayhe)",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha como alvo a última criatura a fazer um EXIBIR, uma vez que sua visão não é muito boa e e tem dificuldade de perceber criaturas que não estejam chamando atenção. Seu instinto é fazer uma INVESTIDA contra seu alvo e esmagá-lo com suas PERNAS. Sua solidez permite que você tenha uma estratégia relativamente simples em combate, e o ônus cabe aos seus oponentes para desvendarem como atravessar suas defesas. Se estiver Ferido, considere recuar para uma Área diferente, onde possa CHAFURDAR e recuperar sua LAMA para a Durabilidade máxima — tecnicamente, não há regras para isso, mas é um caso em que, como a Guia, você pode improvisar efeitos mecânicos segundo o que seja narrativamente apropriado.",
  },
  {
    id: 31,
    name: "Tatangwa",
    lineage: "Pivoteiro",
    stage: "Adulto",
    sizeDescription: "3 metros de envergadura média",
    description:
      "Um criatura da Linhagem dos Pivoteiros. Tem uma envergadura média de 3 metros.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 2,
      poderoso: 0,
      preciso: 0,
      sagaz: 3,
    },
    skills: {
      agarrar: 0,
      armazenar: 0,
      assegurar: 0,
      atirar: 0,
      atravessar: 0,
      chamar: 0,
      curar: 0,
      estudar: 1,
      exibir: 2,
      golpear: 3,
      manufaturar: 0,
      procurar: 2,
    },
    traits: [
      {
        traitId: 10,
        level: 1,
      },
      {
        traitId: 58,
        level: 1,
      },
      {
        traitId: 74,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 30,
        level: 1,
      },
      {
        traitId: 61,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "ASAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "ASAS. Alcance: 1 (GOLPEAR LIGEIRO). Passiva: Você pode Atacar usando o Estilo LIGEIRO múltiplas vezes no mesmo turno.                                                                                                       20 ◆ Se Quebradas: Alcance: 1 (GOLPEAR LIGEIRO). Esta PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "ligeiro",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR LIGEIRO). Esta PARTE causa metade do Dano.",
        },
      },
      {
        id: 2,
        name: "BICO",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "BICO. Alcance: 1 (GOLPEAR SAGAZ ). 20 ◆ Se Quebrado: Alcance: 1 (GOLPEAR SAGAZ). Esta PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "sagaz",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR SAGAZ). Esta PARTE causa metade do Dano.",
        },
      },
      {
        id: 3,
        name: "PENAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "PENAS. Passiva: Você começa a Caçada Escondido e sempre tem a iniciativa na primeira rodada. ◆ Se Quebradas: Você perde CAMUFLAGEM.",
        broken: {
          description:
            "Você perde CAMUFLAGEM.                                                                          20",
        },
      },
    ],
    diet: "• Monstros terrestres (Asaginga, Lapuni Selvagem), carniça",
    habitat: "• Arvoredo (Bosque das Testemunhas)",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha como alvo uma criatura Ferida, já que você é um caçador experiente e prático. Seu instinto é esgueirar-se o mais próximo que puder de seu alvo e dar o bote. Você não perde tempo exibindo-se ou fazendo ameaças — simplesmente ataca para matar, e isso o torna ainda mais assustador. Use CAMUFLAGEM com a maior frequência possível. Se suas PENAS quebrarem, mude de caçador furtivo para ágil, priorizando GOLPEAR LIGEIRO para que possa encerrar A Caçada antes que fique sem Vigor. Você é um inimigo muito mais desafiador do que outros criaturas do seu Nível, e aqueles que desejem caçá-lo devem preparar-se adequadamente.",
  },
  {
    id: 32,
    name: "Tsian Xie",
    lineage: "Churrasqueiro",
    stage: "Adulto",
    sizeDescription: "3 metros de comprimento, incluindo os tentáculos",
    description:
      "Um criatura da Linhagem dos Churrasqueiros. Tem em média 3 metros de comprimento, incluindo os tentáculos.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 3,
      preciso: 2,
      sagaz: 0,
    },
    skills: {
      agarrar: 1,
      armazenar: 0,
      assegurar: 0,
      atirar: 3,
      atravessar: 2,
      chamar: 0,
      curar: 0,
      estudar: 0,
      exibir: 0,
      golpear: 0,
      manufaturar: 1,
      procurar: 0,
    },
    traits: [
      {
        traitId: 14,
        level: 1,
      },
      {
        traitId: 71,
        level: 1,
      },
      {
        traitId: 76,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 23,
        level: 1,
      },
      {
        traitId: 38,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "SINO",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "SINO. Passiva: Dobre o Dano causado por seu SOPRO DE FOGO a criaturas Presas por seus TENTÁCULOS. ◆ Se Quebrado: Você perde SOPRO DE FOGO.",
        broken: {
          description: "Você perde SOPRO DE FOGO. 20",
        },
      },
      {
        id: 2,
        name: "TENTÁCULOS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "TENTÁCULOS. Alcance: 2 (GOLPEAR PRECISO). Se você causar Dano a uma criatura com esta PARTE, aquela criatura fica Presa.                                                                                                        20 ◆   Se Quebrados: Alcance: 1 (GOLPEAR PRECISO). Esta PARTE causa metade do Dano.",
        attack: {
          range: 2,
          style: "preciso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PRECISO). Esta PARTE causa metade do Dano.",
        },
      },
      {
        id: 3,
        name: "TSIAN WON",
        durability: {
          current: 30,
          max: 30,
        },
        description:
          "TSIAN WON. Passiva: No início de cada rodada, todas as PARTES de todas as Criaturas sem VOAR ficam Queimadas. Além disso, criaturas podem entrar no Céu escalando.                                                                        30 ◆ Se Quebrado: Harmonia é reduzida em 1.",
        broken: {
          description: "Harmonia é reduzida em 1.",
        },
      },
    ],
    diet: "• Monstros terrestres (Cauda de Rakuzar, Wooda Selvagem), criaturas voadores (Votra)",
    habitat: "• Deserto (Dunas Estrondosas, Maratsia, Mirante Memorial)",
    behavior:
      "Se nenhuma criatura estiver Presa ou Exposta, escolha como alvo uma criatura com uma PARTE Queimada, uma vez que você é atraído pelo cheiro de carne queimando. Seu instinto é flutuar para posicionar-se acima de sua presa antes de liberar toda a força de seu SOPRO DE FOGO contra o alvo abaixo de você. Agarrar seu alvo com seus TENTÁCULOS deixa isso ainda mais fácil, mas priorize usar seu SOPRO DE FOGO se você não tiver Ações suficientes para os dois. Sua Parte TSIAN WON não é parte do seu corpo. Em vez disso, ela representa os corais parecidos com magma sobre os quais você normalmente pode ser encontrado. Embora mais rasteiras do que as colônias de pólipos de seus primos, os shulu wons, os tsian wons ainda são altos o bastante para que criaturas possam escalá-las para alcançar você no Céu.",
  },
  {
    id: 33,
    name: "Uopang",
    lineage: "Peixeiro",
    stage: "Adulto",
    sizeDescription: "2 metros de altura",
    description:
      "Um criatura da Linhagem dos Peixeiros. Tem em média 2 metros de altura.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 2,
      poderoso: 2,
      preciso: 3,
      sagaz: 0,
    },
    skills: {
      agarrar: 2,
      armazenar: 0,
      assegurar: 0,
      atirar: 3,
      atravessar: 0,
      chamar: 0,
      curar: 2,
      estudar: 0,
      exibir: 0,
      golpear: 1,
      manufaturar: 0,
      procurar: 0,
    },
    traits: [
      {
        traitId: 5,
        level: 1,
      },
      {
        traitId: 50,
        level: 1,
      },
      {
        traitId: 64,
        level: 3,
      },
    ],
    additionalTraits: [
      {
        traitId: 11,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "CONCHA",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "CONCHA. Esta PARTE não tem efeito adicional. ◆ Se Quebrada: Você fica Exposto e perde ARMADURA NATURAL.",
        broken: {
          description: "Você fica Exposto e perde ARMADURA NATURAL. 10",
        },
      },
      {
        id: 2,
        name: "GARRA DIREITA",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "GARRA DIREITA. Alcance: 3 (ATIRAR PRECISO). ◆ Se Quebrada: Alcance: 1 (GOLPEAR LIGEIRO ). Você não pode usar REGENERAÇÃO nessa PARTE.",
        attack: {
          range: 3,
          style: "preciso",
          skill: "atirar",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR LIGEIRO ). Você não pode usar REGENERAÇÃO nessa PARTE. 20",
        },
      },
      {
        id: 3,
        name: "GARRA ESQUERDA",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "GARRA ESQUERDA. Alcance: 1 (GOLPEAR PODEROSO). Passiva: A primeira vez que sua GARRA DIREITA quebrar, arranque-a com esta PARTE e ganhe o seguinte efeito: “Depois que fizer um GOLPEAR PODEROSO com esta PARTE, você também causa [A] de Dano a todas as criaturas a 1 Pernada, exceto ao seu alvo.” ◆ Se Quebrada: Alcance: 1 (GOLPEAR PODEROSO ). Esta PARTE causa metade do Dano. Passiva: Se estiver 20 segurando sua GARRA DIREITA decepada, derrube-a. Se você usar REGENERAÇÃO nessa PARTE, pode pegá-la de novo.",
        attack: {
          range: 1,
          style: "poderoso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PODEROSO ). Esta PARTE causa metade do Dano. Passiva: Se estiver 20 segurando sua GARRA DIREITA decepada, derrube-a. Se você usar REGENERAÇÃO nessa PARTE, pode pegá-la de novo.",
        },
      },
    ],
    diet: "• Monstros terrestres (Vermes), criaturas voadores, criaturas aquáticos (Goby Guelrabença, Pratanguejo), carniça.",
    habitat: "• Praia, Montanha (Cataratas do Yhayhe)",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha como alvo uma criatura que tenha usado Mover ou o Estilo LIGEIRO na última rodada, já que seus olhos complexos são excelentes para rastrear movimento. Seu instinto é aproveitar ao máximo seu arsenal atual. Para ser claro, sua GARRA DIREITA não “quebra” de verdade. Em vez disso, você a arranca quando ela atingir 0 de Durabilidade, e a faz crescer novamente, em uma forma mais rígida essencialmente imune a Dano à Parte. Já a sua GARRA ESQUERDA, as regras para ela não cobrem todos os casos. Deixe que a ficção venha primeiro e decida o que será melhor se os ferais forem criativos.",
  },
  {
    id: 34,
    name: "Varithan",
    lineage: "Peixeiro",
    stage: "Adulto",
    sizeDescription: "6 metros de comprimento",
    description:
      "Um criatura da Linhagem dos Peixeiros. Tem em média 6 metros de comprimento.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 3,
      preciso: 1,
      sagaz: 0,
    },
    skills: {
      agarrar: 1,
      armazenar: 0,
      assegurar: 0,
      atirar: 0,
      atravessar: 2,
      chamar: 0,
      curar: 1,
      estudar: 0,
      exibir: 0,
      golpear: 0,
      manufaturar: 0,
      procurar: 3,
    },
    traits: [
      {
        traitId: 10,
        level: 1,
      },
      {
        traitId: 27,
        level: 1,
      },
      {
        traitId: 51,
        level: 2,
      },
    ],
    additionalTraits: [
      {
        traitId: 41,
        level: 1,
      },
      {
        traitId: 47,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "CABEÇA",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "CABEÇA. Alcance: 2 (GOLPEAR PODEROSO ). ◆ Se Quebrada: Alcance: 1 (GOLPEAR PODEROSO ). Esta PARTE causa metade do Dano. Você perde",
        attack: {
          range: 2,
          style: "poderoso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PODEROSO ). Esta PARTE causa metade do Dano. Você perde 20",
        },
      },
      {
        id: 2,
        name: "CAUDA",
        durability: {
          current: 30,
          max: 30,
        },
        description:
          "CAUDA. Alcance: 2 (GOLPEAR SAGAZ ). Passiva: A primeira vez que estiver Ferido, coma suas gônadas vestigiais. Até o final da Jornada, você ganha níveis em SAGAZ iguais aos seus níveis em PODEROSO. ◆ Se Quebrado: Alcance: 1 (GOLPEAR PODEROSO). Esta PARTE causa metade do Dano. Você perde 1 nível 30 de NADAR. Você não pode mais ganhar níveis em SAGAZ, mas mantém os níveis em SAGAZ se já os tiver.",
        attack: {
          range: 2,
          style: "sagaz",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PODEROSO). Esta PARTE causa metade do Dano. Você perde 1 nível 30 de NADAR. Você não pode mais ganhar níveis em SAGAZ, mas mantém os níveis em SAGAZ se já os tiver.",
        },
      },
    ],
    diet: "• Monstros aquáticos (Inalalama Menor, Goby Guelrabença, Pratanguejo, Girinos de Sposu)",
    habitat: "• Praias, Arvoredo (Rio Yhayhe)",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha como alvo uma criatura em um Terreno diferente, já que seu pescoço e corpo alongados permitem que você alcance para golpear à distância. Seu instinto é alternar entre a água e a terra para que seus predadores não possam contê-lo. Se estiver Ferido e entrar em seu modo SAGAZ, realize GOLPEAR SAGAZ primeiro para tentar ganhar Vantagem no GOLPEAR PODEROSO subsequente. Se for Ferido novamente, realize seu GOLPEAR SAGAZ por último para que possa continuar Escondido em segurança até o fim do seu turno.",
  },
  {
    id: 35,
    name: "Votra Enxame",
    lineage: "Padeiro",
    stage: "Adulto",
    sizeDescription: "3 metros de diâmetro em coletivo",
    description:
      "Um criatura da Linhagem dos Padeiros. Tem em média 3 metros de diâmetro em coletivo.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 1,
      poderoso: 0,
      preciso: 3,
      sagaz: 2,
    },
    skills: {
      agarrar: 0,
      armazenar: 0,
      assegurar: 2,
      atirar: 0,
      atravessar: 2,
      chamar: 1,
      curar: 0,
      estudar: 1,
      exibir: 2,
      golpear: 0,
      manufaturar: 0,
      procurar: 0,
    },
    traits: [
      {
        traitId: 3,
        level: 1,
      },
      {
        traitId: 21,
        level: 1,
      },
      {
        traitId: 26,
        level: 1,
      },
      {
        traitId: 34,
        level: 1,
      },
      {
        traitId: 76,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 29,
        level: 1,
      },
      {
        traitId: 47,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "ASAS",
        durability: {
          current: 25,
          max: 25,
        },
        description:
          "ASAS. Alcance: 1 (CHAMAR). Passiva: Se você Atacar com esta PARTE enquanto Expandido e acertar, seu alvo fica Preso. No começo de cada rodada, criaturas Presas por você sofrem 10 de Dano.                                       25 ◆ Se Quebrado: Alcance: 1 (CHAMAR ). Esta PARTE causa metade do Dano.",
        broken: {
          description: "Alcance: 1 (CHAMAR ). Esta PARTE causa metade do Dano.",
        },
      },
      {
        id: 2,
        name: "MANCHAS OCULARES",
        durability: {
          current: 25,
          max: 25,
        },
        description:
          "MANCHAS OCULARES. Passiva: Você pode gastar Sucessos em PRECISO para usar AMEAÇAR. ◆ Se Quebradas: Você perde AMEAÇAR. 25",
        broken: {
          description: "Você perde AMEAÇAR. 25",
        },
      },
    ],
    diet: "• Néctar (Néctar de Flor-de-Mar, Néctar de Florarcaica)",
    habitat: "• Praias (Praia das Mãos Alvas), Deserto",
    behavior:
      "Se nenhuma criatura estiver Presa ou Exposta, escolha como alvo uma criatura Confusa, já que você interpreta seus movimentos trôpegos como uma fraqueza. Seu instinto é desnortear sua presa antes de envolvê-la e superaquecê-la. Como você pode infligir até quatro Condições de cada vez, isso deve acontecer naturalmente. A alta Durabilidade de suas PARTES representa o quão difícil é mirar em qualquer parte específica do seu “corpo” em constante movimento. Da mesma forma, você faz CHAMAR (usando qualquer ESTILO) para Atacar, porque a dificuldade maior é coordenar o seu corpo para agir como um só, e não atingir o seu alvo.",
  },
  {
    id: 36,
    name: "Yudoubu",
    lineage: "Peixeiro",
    stage: "Adulto",
    sizeDescription: "3 metros de diâmetro quando inflado",
    description:
      "Um criatura da Linhagem dos Peixeiros. Tem em média 3 metros de diâmetro quando inflado.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 3,
      poderoso: 0,
      preciso: 0,
      sagaz: 2,
    },
    skills: {
      agarrar: 0,
      armazenar: 2,
      assegurar: 0,
      atirar: 3,
      atravessar: 1,
      chamar: 0,
      curar: 0,
      estudar: 0,
      exibir: 2,
      golpear: 0,
      manufaturar: 0,
      procurar: 0,
    },
    traits: [
      {
        traitId: 34,
        level: 1,
      },
      {
        traitId: 50,
        level: 1,
      },
      {
        traitId: 51,
        level: 1,
      },
      {
        traitId: 52,
        level: 3,
      },
    ],
    additionalTraits: [],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "BARRIGA",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "BARRIGA. Passiva: Se você se Mover no Chão, pode escorregar até 2 Pernadas para longe em vez de 1. ◆ Se Quebrada: Você fica Exposto.",
        broken: {
          description: "Você fica Exposto. 10",
        },
      },
      {
        id: 2,
        name: "BICO",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "BICO. Alcance: 1 (GOLPEAR LIGEIRO). Passiva: Se você causar Dano com esta PARTE, cause Dano à Parte em vez disso. Se você quebrar uma PARTE com esta PARTE, jogue seu alvo 3 Pernadas para longe.                             20 ◆ Se Quebrado: Alcance: 1 ( GOLPEAR LIGEIRO ). Esta PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "ligeiro",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 ( GOLPEAR LIGEIRO ). Esta PARTE causa metade do Dano.",
        },
      },
      {
        id: 3,
        name: "BOCHECHAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "BOCHECHAS. Alcance: 3 (ATIRAR SAGAZ). Passiva: Você só pode Atacar com esta PARTE enquanto estiver Expandido. Depois de realizar um ATIRAR com esta PARTE (acertando ou não), você perde Expandido e pode escorregar 1 Pernada para longe de seu alvo.                                                                              20 ◆ Se Quebradas: Esta PARTE não faz nada.",
        attack: {
          range: 3,
          style: "sagaz",
          skill: "atirar",
        },
        broken: {
          description: "Esta PARTE não faz nada.",
        },
      },
      {
        id: 4,
        name: "ESPINHOS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "ESPINHOS. Passiva: Você só pode usar NÃO-ME-TOQUE 3 enquanto estiver Expandido. Criaturas feridas por NÃO-ME-TOQUE 3 também ficam Envenenado 3.                                                                                 20 ◆ Se Quebrados: Você perde NÃO-ME-TOQUE 3.",
        broken: {
          description: "Você perde NÃO-ME-TOQUE 3.",
        },
      },
    ],
    diet: "• Monstros aquáticos (Ostra Real, Pratanguejo, Camarão-sabão, Solguejo)                                           Es",
    habitat:
      "• Praias (Ilha Berço, Planícies Ensaboadas), Deserto (Lago porádico)",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha como alvo uma criatura com uma PARTE não quebrada, uma vez que você não consegue diferenciar o movimento de uma garra de caranguejo de um Utensílio de arkaicaço. Seu instinto é escorregar pelas planícies enlameadas como um balão vazando, causando o máximo de caos enquanto passa. Se estiver cercado por criaturas hostis, tente terminar seu turno Expandido, já que isso desencoraja retaliações enquanto você foca sua mira para realizar outro ATIRAR.",
  },
  {
    id: 37,
    name: "Zaili",
    lineage: "Peixeiro",
    stage: "Adulto",
    sizeDescription: "4 metros de comprimento",
    description:
      "Um criatura da Linhagem dos Peixeiros. Tem em média 4 metros de comprimento.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 2,
      poderoso: 3,
      preciso: 0,
      sagaz: 0,
    },
    skills: {
      agarrar: 0,
      armazenar: 1,
      assegurar: 1,
      atirar: 0,
      atravessar: 1,
      chamar: 3,
      curar: 0,
      estudar: 2,
      exibir: 0,
      golpear: 0,
      manufaturar: 0,
      procurar: 0,
    },
    traits: [
      {
        traitId: 3,
        level: 1,
      },
      {
        traitId: 15,
        level: 1,
      },
      {
        traitId: 26,
        level: 1,
      },
      {
        traitId: 51,
        level: 2,
      },
    ],
    additionalTraits: [
      {
        traitId: 6,
        level: 1,
      },
      {
        traitId: 8,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "GARGANTA",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "GARGANTA. Esta PARTE não tem efeito adicional. ◆ Se Quebrada: Você perde ECOLOCALIZAÇÃO e CHOQUE ELÉTRICO custa 1 Ação adicional.",
        broken: {
          description:
            "Você perde ECOLOCALIZAÇÃO e CHOQUE ELÉTRICO custa 1 Ação adicional. 10",
        },
      },
      {
        id: 2,
        name: "NADADEIRAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "NADADEIRAS. Esta PARTE não tem efeito adicional. ◆ Se Quebradas: Custa 1 Ação adicional para se Mover no Chão.",
        broken: {
          description: "Custa 1 Ação adicional para se Mover no Chão. 20",
        },
      },
      {
        id: 3,
        name: "PRESAS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "PRESAS. Alcance: 1 (GOLPEAR PODEROSO). Passiva: Se realizar um GOLPEAR com esta PARTE e acertar, você pode usar CHOQUE ELÉTRICO imediatamente sem gastar ações. Se o fizer, só a criatura atingida por suas PRESAS fica Atordoada.                                                                                        20 ◆ Se Quebradas: Alcance: 1 (GOLPEAR PODEROSO ). Esta PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "poderoso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PODEROSO ). Esta PARTE causa metade do Dano.",
        },
      },
    ],
    diet: "• Monstros aquáticos (Goby Guelrabença, Lulesguicho, Ostra Real)",
    habitat: "• Praias (Baía de Aso, Ilha Berço, Planícies Ensaboadas)",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha como alvo uma criatura que esteja Atordoada, já que você reage rapidamente a qualquer abertura causada por seu CHOQUE ELÉTRICO. Seu instinto é não ter sutileza. Você é barulhento, direto e agressivo quando se sente ameaçado, e há uma simplicidade bela na sua combinação de TRAÇOS e PARTES.",
  },
  {
    id: 38,
    name: "Zaswang",
    lineage: "Pivoteiro",
    stage: "Adulto",
    sizeDescription: "4 metros de comprimento com tentáculos estendidos",
    description:
      "Um criatura da Linhagem dos Pivoteiros. Tem em média 4 metros de comprimento com tentáculos estendidos.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 0,
      preciso: 2,
      sagaz: 3,
    },
    skills: {
      agarrar: 2,
      armazenar: 0,
      assegurar: 0,
      atirar: 0,
      atravessar: 0,
      chamar: 0,
      curar: 2,
      estudar: 3,
      exibir: 3,
      golpear: 0,
      manufaturar: 0,
      procurar: 1,
    },
    traits: [
      {
        traitId: 4,
        level: 1,
      },
      {
        traitId: 10,
        level: 1,
      },
      {
        traitId: 30,
        level: 3,
      },
      {
        traitId: 75,
        level: 2,
      },
    ],
    additionalTraits: [
      {
        traitId: 8,
        level: 1,
      },
      {
        traitId: 32,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "BICO",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "BICO. Alcance: 1 (GOLPEAR SAGAZ ). ◆ Se Quebrado: Alcance: 1 (GOLPEAR SAGAZ ). Esta PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "sagaz",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR SAGAZ ). Esta PARTE causa metade do Dano. 20",
        },
      },
      {
        id: 2,
        name: "TENTÁCULOS",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "TENTÁCULOS. Alcance: 2 (GOLPEAR PRECISO). Se Atacar com essa PARTE e acertar, você pode puxar seu alvo 1 Pernada para perto.                                                                                               20 ◆ Se Quebrados: Alcance: 1 (GOLPEAR PRECISO ). Esta PARTE causa metade do Dano. Você perde",
        attack: {
          range: 2,
          style: "preciso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PRECISO ). Esta PARTE causa metade do Dano. Você perde",
        },
      },
    ],
    diet: "• Monstros terrestres (Verme), ovos (Ovo de Katang, Ovo de Wari)",
    habitat:
      "• Praia (Cidade-estação Tesouromar), Arvoredo, Deserto (Cidade-estação Bhusag)",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha como alvo uma criatura que esteja Envenenada, já que você reconhece quando sua mordida enfraquece uma criatura. Seu instinto é observar e aprender, já que sua inteligência o permite ser mais estratégico do que a maioria dos criaturas. Mantenha-se nas copas ou topos das árvores, onde criaturas que não podem ESCALAR têm dificuldade para alcançá-lo, e vá exaurindo suas presas. Tipicamente, você não usará APOSEMÁTICO até que esteja Ferido, não por razões práticas, mas por preferir não ficar Exposto, a menos que a situação seja séria. Uma vez que comece a usar APOSEMÁTICO, combine-a, se possível, com sua CAMUFLAGEM para mitigar suas desvantagens.",
  },
  {
    id: 39,
    name: "Zimmudo",
    lineage: "Jardineiro",
    stage: "Adulto",
    sizeDescription: "4 metros de altura",
    description:
      "Um criatura da Linhagem dos Jardineiros. Tem em média 4 metros de altura.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 0,
      preciso: 2,
      sagaz: 3,
    },
    skills: {
      agarrar: 2,
      armazenar: 0,
      assegurar: 3,
      atirar: 0,
      atravessar: 0,
      chamar: 0,
      curar: 3,
      estudar: 0,
      exibir: 0,
      golpear: 1,
      manufaturar: 0,
      procurar: 0,
    },
    traits: [
      {
        traitId: 21,
        level: 1,
      },
      {
        traitId: 42,
        level: 1,
      },
      {
        traitId: 69,
        level: 1,
      },
    ],
    additionalTraits: [
      {
        traitId: 24,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "GARGANTA",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "GARGANTA. Passiva: Cada vez que usar SEDATIVO, todas as criaturas a sua escolha ficam Confusas. ◆ Se Quebrada: Você perde SEDATIVO.",
        broken: {
          description: "Você perde SEDATIVO. 20",
        },
      },
      {
        id: 2,
        name: "GARRAS",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "GARRAS. Alcance: 1 (GOLPEAR PRECISO ou GOLPEAR SAGAZ ). ◆ Se Quebradas: Alcance: 1 (GOLPEAR PRECISO ). Esta PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "preciso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PRECISO ). Esta PARTE causa metade do Dano. 10",
        },
      },
    ],
    diet: "• Vegetação (Folhas de Ervafumo, Brotos de Ervafumo)",
    habitat: "• Montanha (Bosque da Ervafumo)",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha como alvo a última criatura a Atacar, já que isso raramente acontece ao seu redor. Seu instinto é sufocar a agressão daqueles à sua volta, usando os breves intervalos entre seus usos de SEDATIVO para partir para a ofensiva você mesmo. Aqueles que tentem contornar esse pacifismo forçado com TRAÇOS precisam lidar com sua habilidade para deixá-los Confusos — embora seja possível que ferais escapem disso usando sua própria receita contra você, preparando uma refeição com seu Ingrediente favorito, Broto de Ervafumo, que concede INABALÁVEL. Caçadas contra você podem ser bem esquisitas, mas é isso que faz delas únicas.",
  },
  {
    id: 40,
    name: "Ziziwen",
    lineage: "Molheiro",
    stage: "Adulto",
    sizeDescription: "2 metros de comprimento",
    description:
      "Um criatura da Linhagem dos Molheiros. Tem em média 2 metros de comprimento.",
    vigor: {
      current: 30,
      max: 30,
    },
    styles: {
      ligeiro: 0,
      poderoso: 0,
      preciso: 3,
      sagaz: 2,
    },
    skills: {
      agarrar: 0,
      armazenar: 1,
      assegurar: 0,
      atirar: 0,
      atravessar: 2,
      chamar: 0,
      curar: 0,
      estudar: 0,
      exibir: 2,
      golpear: 1,
      manufaturar: 0,
      procurar: 2,
    },
    traits: [
      {
        traitId: 14,
        level: 1,
      },
      {
        traitId: 63,
        level: 1,
      },
      {
        traitId: 76,
        level: 2,
      },
    ],
    additionalTraits: [
      {
        traitId: 47,
        level: 1,
      },
      {
        traitId: 57,
        level: 1,
      },
      {
        traitId: 68,
        level: 1,
      },
    ],
    conditions: [],
    parts: [
      {
        id: 1,
        name: "ABDÔMEN",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "ABDÔMEN. Passiva: Cada vez que usar SANGUESSUGA ou um Traço não Passivo obtido com Sanguessuga, cada criatura a 1 Pernada fica Amedrontada.                                                                                     20 ◆   Se Quebrado: Você fica Exposto.",
        broken: {
          description: "Você fica Exposto.",
        },
      },
      {
        id: 2,
        name: "ASAS",
        durability: {
          current: 10,
          max: 10,
        },
        description:
          "ASAS. Esta PARTE não tem efeito adicional. ◆ Se Quebradas: Você perde REFLEXOS NATURAIS e 1 nível em VOAR.",
        broken: {
          description:
            "Você perde REFLEXOS NATURAIS e 1 nível em VOAR.                                                               10",
        },
      },
      {
        id: 3,
        name: "PROBÓSCIDE",
        durability: {
          current: 20,
          max: 20,
        },
        description:
          "PROBÓSCIDE. Alcance: 1 (GOLPEAR PRECISO ou GOLPEAR SAGAZ). Passiva: Se você causar Dano a uma criatura com esta PARTE, pode usar Sanguessuga contra ela sem gastar Ações ou fazer um Teste.                                   20 ◆ Se Quebrado: Alcance: 1 (GOLPEAR PRECISO ). Esta PARTE causa metade do Dano.",
        attack: {
          range: 1,
          style: "preciso",
          skill: "golpear",
        },
        broken: {
          description:
            "Alcance: 1 (GOLPEAR PRECISO ). Esta PARTE causa metade do Dano.",
        },
      },
    ],
    diet: "• Sangue, néctar (Néctar de Taçaflauta)",
    habitat: "• Arvoredo",
    behavior:
      "Se nenhuma criatura estiver Exposta, escolha como alvo uma criatura que esteja Ferida, já que você é atraído pelo cheiro de sangue. Seu instinto é normalmente ser furtivo, bebendo sangue discretamente e voando para longe antes que seu hospedeiro perceba. Mas contra criaturas tão pequenas quanto ferais, você não se contém quanto a usar seu tamanho superior para prendê-los no chão e sugá- los até o fim. Use SANGUESSUGA com frequência, tanto para pegar suas presas desprevenidas com seus próprios TRAÇOS quanto para deixá-las Amedrontadas. Dependendo das circunstâncias, você pode começar A Caçada com um TRAÇO de qualquer criatura local, como um resquício de sua última refeição.",
  },
];

export const traitsById = Object.fromEntries(
  traitDefinitions.map((item) => [item.id, item]),
);
export const conditionsById = Object.fromEntries(
  conditionDefinitions.map((item) => [item.id, item]),
);
export const techniquesById = Object.fromEntries(
  techniqueDefinitions.map((item) => [item.id, item]),
);
export const utensilsById = Object.fromEntries(
  utensilDefinitions.map((item) => [item.id, item]),
);

// ============================================================================
// ESTILOS INICIAIS A PARTIR DO UTENSÍLIO
// ============================================================================

const ALL_STYLE_KEYS: StyleKey[] = ["ligeiro", "poderoso", "preciso", "sagaz"];

/**
 * Monta o objeto `FeralStyles` (3/2/1/1) completo a partir do Utensílio
 * escolhido e da opção de distribuição (0 ou 1) selecionada pelo jogador na
 * criação do Feral. Use isso para já preencher `IFeral.styles` antes de
 * chamar `saveFeral`.
 *
 * Caso o Utensílio informado não possua `initialStyleOptions` definidas,
 * retorna todos os Estilos em nível 1 como fallback seguro.
 */
export function buildFeralStylesFromUtensil(
  utensilId: UtensilKey,
  optionIndex: 0 | 1,
): FeralStyles {
  const utensil = utensilsById[utensilId] as IUtensilDefinition | undefined;
  const option = utensil?.initialStyleOptions?.[optionIndex];

  const styles = {} as FeralStyles;
  for (const styleKey of ALL_STYLE_KEYS) {
    if (option && styleKey === option.main) {
      styles[styleKey] = 3;
    } else if (option && styleKey === option.secondary) {
      styles[styleKey] = 2;
    } else {
      styles[styleKey] = 1;
    }
  }

  return styles;
}

// ============================================================================
// TÉCNICAS INICIAIS A PARTIR DO UTENSÍLIO
// ============================================================================

/**
 * Monta a lista de `ITechniqueState` iniciais do Feral a partir do Utensílio
 * escolhido: a Técnica que o Utensílio sempre concede + a Técnica opcional
 * escolhida pelo jogador dentre `techniqueOptionIds`. Use isso para já
 * preencher `IFeral.techniques` antes de chamar `saveFeral`.
 *
 * `chosenOptionTechniqueId` deve ser um dos ids presentes em
 * `techniqueOptionIds` do Utensílio; caso contrário (ou se o Utensílio não
 * tiver essas informações definidas), apenas a Técnica inicial é retornada,
 * quando existir.
 */
export function buildFeralTechniquesFromUtensil(
  utensilId: UtensilKey,
  chosenOptionTechniqueId?: ID,
): ITechniqueState[] {
  const utensil = utensilsById[utensilId] as IUtensilDefinition | undefined;
  if (!utensil) return [];

  const techniques: ITechniqueState[] = [];

  if (utensil.initialTechniqueId !== undefined) {
    techniques.push({ techniqueId: utensil.initialTechniqueId });
  }

  if (
    chosenOptionTechniqueId !== undefined &&
    utensil.techniqueOptionIds?.includes(chosenOptionTechniqueId)
  ) {
    techniques.push({ techniqueId: chosenOptionTechniqueId });
  }

  return techniques;
}
export const specialtiesById = Object.fromEntries(
  specialtyDefinitions.map((item) => [item.id, item]),
);
export const creaturesById = Object.fromEntries(
  creatureDefinitions.map((item) => [item.id, item]),
);
