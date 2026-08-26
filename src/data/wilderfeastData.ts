import { FeralSheet } from "../types";

export interface UtensilDefinition {
  name: "Barbante" | "Cutelo" | "Espeto" | "Luvas" | "Maçarico" | "Panela";
  description: string;
  theme: string;
  reach: number;
  baseDurability: number;
  styleOptions: Array<{ [key: string]: number }>;
  baseFixedStyles: { [key: string]: number };
  initialTechnique: string;
  initialTechniqueOptions: string[];
  personalitySuggestions: string[];
}

export const UTENSILS_DATA: Record<string, UtensilDefinition> = {
  Barbante: {
    name: "Barbante",
    description:
      "O utensílio mais versátil de arkaicaço. Trançado como rede, berço ou laço, e manejado como chicote ou garrote para conter monstros em frenesi.",
    theme: "Soluções criativas, controle e utilidade.",
    reach: 1,
    baseDurability: 20,
    styleOptions: [
      { ligeiro: 3, sagaz: 2 },
      { sagaz: 3, ligeiro: 2 },
    ],
    baseFixedStyles: { poderoso: 1, preciso: 1 },
    initialTechnique: "RÉDEA CURTA",
    initialTechniqueOptions: ["ARMADILHA", "CHICOTADA", "REPAROS EM CAMPO"],
    personalitySuggestions: [
      "consistente",
      "criativo",
      "flexível",
      "gentil",
      "quieto",
      "sábio",
    ],
  },
  Cutelo: {
    name: "Cutelo",
    description:
      "Com dois metros ou mais de lâmina pesada de pura liga de arkaicaço, é excepcional para decepar partes perigosas e realizar cirurgias anatômicas.",
    theme: "Golpes precisos e poderosos, anatomia e dano maciço.",
    reach: 1,
    baseDurability: 20,
    styleOptions: [
      { poderoso: 3, preciso: 2 },
      { preciso: 3, poderoso: 2 },
    ],
    baseFixedStyles: { ligeiro: 1, sagaz: 1 },
    initialTechnique: "CORTE LIMPO",
    initialTechniqueOptions: [
      "ESPADA GRANDE PRA CA***",
      "SEM DESPERDÍCIO",
      "TREINAMENTO MÉDICO",
    ],
    personalitySuggestions: [
      "brutal",
      "cuidadoso",
      "decisivo",
      "eficiente",
      "assustador",
      "prático",
    ],
  },
  Espeto: {
    name: "Espeto",
    description:
      "Estacas pontiagudas, tridentes ou garfos esguios de arkaicaço. Permitem movimentação acrobática, arremessos com fita e estocadas ágeis.",
    theme: "Constante movimento, velocidade e ataques precisos.",
    reach: 1,
    baseDurability: 20,
    styleOptions: [
      { preciso: 3, ligeiro: 2 },
      { ligeiro: 3, preciso: 2 },
    ],
    baseFixedStyles: { poderoso: 1, sagaz: 1 },
    initialTechnique: "SEQUÊNCIA DE MOVIMENTOS",
    initialTechniqueOptions: [
      "AGULHA E LINHA",
      "DESATOLAR",
      "ETIQUETA GASTRONÔMICA",
    ],
    personalitySuggestions: [
      "curioso",
      "delicado",
      "honrado",
      "esperançoso",
      "educado",
      "espontâneo",
    ],
  },
  Luvas: {
    name: "Luvas",
    description:
      "Equipamento de proteção com fibras de arkaicaço até os cotovelos, absorvendo impactos e desferindo pancadas contundentes no corpo a corpo.",
    theme: "Luta corpo a corpo cerrada, controle de monstros e proteção.",
    reach: 1,
    baseDurability: 20,
    styleOptions: [
      { poderoso: 3, ligeiro: 2 },
      { ligeiro: 3, poderoso: 2 },
    ],
    baseFixedStyles: { preciso: 1, sagaz: 1 },
    initialTechnique: "DE PERTINHO",
    initialTechniqueOptions: [
      "ALCANCE ENCOURAÇADO",
      "MÃOS LARGAS, PEGADA FORTE",
      "TÔ CONTIGO",
    ],
    personalitySuggestions: [
      "corajoso",
      "descontraído",
      "focado",
      "sincero",
      "compreensivo",
      "animado",
    ],
  },
  Maçarico: {
    name: "Maçarico",
    description:
      "Utensílio enigmático que canaliza chamas estelares e jatos térmicos azuis sem combustível, desafiando a lógica e operando à distância.",
    theme: "Controle à distância, queima de partes e engenharia antiga.",
    reach: 1,
    baseDurability: 20,
    styleOptions: [
      { preciso: 3, sagaz: 2 },
      { sagaz: 3, preciso: 2 },
    ],
    baseFixedStyles: { poderoso: 1, ligeiro: 1 },
    initialTechnique: "LINHA DE FOGO",
    initialTechniqueOptions: ["IGNIÇÃO RÁPIDA", "LUZ GUIA", "PREAQUECIMENTO"],
    personalitySuggestions: [
      "controlador",
      "paciente",
      "ardiloso",
      "reservado",
      "estudioso",
      "minucioso",
    ],
  },
  Panela: {
    name: "Panela",
    description:
      "Superfícies espelhadas e maciças de arkaicaço feitas para refeições comunitárias épicas e defesas impenetráveis que desviam golpes mortais.",
    theme: "Proteção aos aliados, postura defensiva e banquetes fartos.",
    reach: 1,
    baseDurability: 20,
    styleOptions: [
      { poderoso: 3, sagaz: 2 },
      { sagaz: 3, poderoso: 2 },
    ],
    baseFixedStyles: { preciso: 1, ligeiro: 1 },
    initialTechnique: "ESCUDO DE AÇO",
    initialTechniqueOptions: [
      "LANÇAMENTO RICOCHETE",
      "POSTURA APRUMADA",
      "SUPERFÍCIE ESPELHADA",
    ],
    personalitySuggestions: [
      "sereno",
      "generoso",
      "líder",
      "popular",
      "determinado",
      "cauteloso",
    ],
  },
};

export interface SpecialtyDefinition {
  name: string;
  theme: string;
  description: string;
  initialTraits: Array<{
    name: string;
    cost: string;
    description: string;
    type: "Passiva" | "Ação" | "Sucesso";
  }>;
  sampleMonsters: Array<{ name: string; species: string; relation: string }>;
}

export const SPECIALTIES_DATA: Record<string, SpecialtyDefinition> = {
  Açougueiro: {
    name: "Açougueiro",
    theme:
      "Monstros com apêndices metálicos ou minerais, comedores de detritos e carniceiros.",
    description:
      "Ferais-açougueiros não têm desconforto com a morte e suportam o peso dos golpes finais com firmeza e precisão anatômica.",
    initialTraits: [
      {
        name: "CHEIRO DE SANGUE",
        cost: "Passiva",
        type: "Passiva",
        description:
          "Você ganha Vantagem em todos os Testes durante a primeira rodada da Caçada caso o lado oponente tenha uma criatura Ferida.",
      },
      {
        name: "ARMADURA NATURAL",
        cost: "Passiva",
        type: "Passiva",
        description:
          "Você diminui à metade o Dano que sofre de GOLPEAR PODEROSO e de ATIRAR PODEROSO.",
      },
      {
        name: "CARNICEIRO",
        cost: "Passiva",
        type: "Passiva",
        description:
          "Você não pode ficar Envenenado por comida. Se Forragear (bem-sucedido ou não), você também ganha <H> porções de Detritos (Receba 1 Envenenado).",
      },
    ],
    sampleMonsters: [
      {
        name: "Cebola",
        species: "lapu-lapu",
        relation:
          "Afetuoso, cujo carinho entusiasmado pode deixar pele descoberta em carne-viva.",
      },
      {
        name: "Estraçalhador",
        species: "lobo-diadema",
        relation:
          "Ousado, a quem você dá os ossos que sobram depois de limpar a carne do gado.",
      },
      {
        name: "Ko, o Plácido",
        species: "shulu xie",
        relation:
          "Indecifrável, diagnosticado por você com frenesi em estágio inicial e sob seus cuidados.",
      },
      {
        name: "Maharla",
        species: "asewa",
        relation:
          "Cauteloso, a quem você raramente vê, mas deixa rolos de pele solta e enferrujada no território.",
      },
      {
        name: "Sol Poente",
        species: "kakwari",
        relation:
          "Altivo, desfila pelos jardins quando não está praticando para suas apresentações.",
      },
    ],
  },
  Amontoeiro: {
    name: "Amontoeiro",
    theme:
      "Monstros que acumulam comida em esconderijos, ninhos e covis elaborados.",
    description:
      "Ferais-amontoeiros dominam sal, fermentação e refrigeradores de arkaicaço para estocar e resistir aos invernos severos.",
    initialTraits: [
      {
        name: "CONSTRUTOR DE NINHO",
        cost: "Passiva",
        type: "Passiva",
        description:
          "Quando a matilha Acampa, você e seus parças podem manter todos os níveis de uma Condição em vez de removê-las.",
      },
      {
        name: "ENGOLIR INTEIRO",
        cost: "Custo: 1 Ação",
        type: "Ação",
        description:
          "Coma qualquer quantidade de Ingredientes para recuperar uma quantidade igual de Vigor. Você não ganha nenhum efeito bônus.",
      },
      {
        name: "HIBERNADOR",
        cost: "Passiva",
        type: "Passiva",
        description:
          "Cada nível de Descansado aumenta seu Vigor máximo em 2 em vez de 1.",
      },
    ],
    sampleMonsters: [
      {
        name: "Asapó",
        species: "lotangwa",
        relation:
          "Dedicada; o vínculo dela com outra fêmea era tão forte que você deu um ovo para criarem juntas.",
      },
      {
        name: "Bandido",
        species: "syowari",
        relation:
          "Rude e acumulador, cuja obsessão com objetos brilhantes levou-o a roubar seu utensílio várias vezes.",
      },
      {
        name: "Cho Contente",
        species: "tanpo",
        relation:
          "Gregário, cuja preferência por banhos de lama fez com que se tornasse mascote local.",
      },
      {
        name: "Migalhas",
        species: "pondon",
        relation:
          "Preguiçoso e escavador, que precisa de horas de escovação para desembaraçar os nós do pelo.",
      },
      {
        name: "Senhora Zida",
        species: "Gelaranha de Asig",
        relation:
          "Indiferente, que faz teias com tapeçarias que deixam qualquer um maravilhado.",
      },
    ],
  },
  Churrasqueiro: {
    name: "Churrasqueiro",
    theme:
      "Monstros que vivem com o fogo, geram calor e cozinham banquetes generosos e gordurosos.",
    description:
      "Priorizam sabores ricos, calor intenso e energia transbordante nas refeições.",
    initialTraits: [
      {
        name: "AMEAÇAR",
        cost: "Custo: 1 Sucesso PODEROSO",
        type: "Sucesso",
        description: "Uma criatura à sua escolha fica Amedrontada.",
      },
      {
        name: "CORPO QUENTE",
        cost: "Passiva",
        type: "Passiva",
        description:
          "No começo de cada turno, criaturas à sua escolha a até 0 Pernada sofrem 2 de Dano. Se estiver Preso por uma PARTE, essa PARTE fica Queimada. Suas PARTES não ficam Queimadas.",
      },
      {
        name: "SOPRO DE FOGO",
        cost: "Custo: 2 Ações",
        type: "Ação",
        description:
          "Faça um ATIRAR PODEROSO contra uma criatura a até 2 Pernadas. Se passar, cause [A] Dano à Parte e a PARTE alvejada fica Queimada.",
      },
    ],
    sampleMonsters: [
      {
        name: "Brasa",
        species: "hagsechu",
        relation:
          "Independente, que constantemente se mete em confusão quando você não está olhando.",
      },
      {
        name: "Caçafumaça",
        species: "hutangwa",
        relation:
          "Astuto e incendiário, cuja habilidade de atear fogo já foi usada por você.",
      },
      {
        name: "Capa Vermelha",
        species: "fagurila",
        relation:
          "Letárgico, ex-atração de circo aproveitando uma aposentadoria tranquila.",
      },
      {
        name: "Chan Tuai Sao",
        species: "tsian xie",
        relation:
          "Voraz, a quem o vilarejo oferece sacrifícios a cada lua cheia.",
      },
      {
        name: "Coisinha",
        species: "sposu",
        relation:
          "Destemido e espinhoso, que conquistou o melhor território de monstros maiores com pura audácia.",
      },
    ],
  },
  Jardineiro: {
    name: "Jardineiro",
    theme:
      "Monstros que gerenciam e cultivam a flora da Terra Una, rápidos ou defensivos com chifres e folhas.",
    description:
      "Ferais-jardineiros buscam dietas equilibradas com frutos-ferais, vegetais e harmonia com a vegetação.",
    initialTraits: [
      {
        name: "ACELERAR",
        cost: "Custo: 1 Sucesso LIGEIRO",
        type: "Sucesso",
        description: "Você pode se Mover sem gastar uma Ação.",
      },
      {
        name: "DIGESTÃO LENTA",
        cost: "Passiva",
        type: "Passiva",
        description:
          "Refeições com efeitos que duram até a sua próxima refeição duram até o fim da Jornada.",
      },
      {
        name: "INVESTIDA",
        cost: "Custo: 1 Ação",
        type: "Ação",
        description:
          "Escolha uma criatura a até 3 Pernadas. Você se Move a 0 Pernada dela e causa Dano a ela e a si mesmo igual ao número de Pernadas movidas.",
      },
    ],
    sampleMonsters: [
      {
        name: "Ceifeiro",
        species: "ko-ketak",
        relation:
          "Organizado, prefere que cada pedaço de alimento e toco esteja no lugar exato do seu covil.",
      },
      {
        name: "Coração Branco",
        species: "peliçalce",
        relation:
          "De outro mundo, a quem você perseguiu por anos na esperança de observar mais de perto.",
      },
      {
        name: "Meleca",
        species: "jama-jama",
        relation:
          "Confiante e frugívoro, pilhando campos enquanto você arca com os danos pacientemente.",
      },
      {
        name: "Mhen Tan",
        species: "golanuvem",
        relation:
          "Plácido monstro de suporte emocional cuja canção grave acalma os corações nervosos.",
      },
      {
        name: "Shu Shu",
        species: "zimmudo",
        relation:
          "Alheio, cujo bosque de bambu você salvou diversas vezes sem que ele sequer tenha percebido.",
      },
    ],
  },
  Molheiro: {
    name: "Molheiro",
    theme:
      "Monstros bizarros, secreções medicinais, viscosas, tóxicas ou recreativas.",
    description:
      "Ferais-molheiros têm a reputação de serem meticulosos e volúveis, temperando tudo a seu gosto inexplicável e infalível.",
    initialTraits: [
      {
        name: "DESORIENTANTE",
        cost: "Passiva",
        type: "Passiva",
        description:
          "Criaturas que o ataquem (quer sejam bem-sucedidas, quer falhem) ficam Confusas.",
      },
      {
        name: "ESCORREGADIO",
        cost: "Passiva",
        type: "Passiva",
        description: "Você não pode ficar Preso.",
      },
      {
        name: "VENENO",
        cost: "Custo: 1 Sucesso em ATIRAR ou GOLPEAR",
        type: "Sucesso",
        description:
          "A criatura atingida por seu ATIRAR ou GOLPEAR fica Envenenada.",
      },
    ],
    sampleMonsters: [
      {
        name: "Ghan, a Sombra",
        species: "ziziwen",
        relation:
          "Oportunista e hematófago, visto pelos habitantes locais como presságio mítico.",
      },
      {
        name: "Meio-pau",
        species: "raizanguejo",
        relation:
          "Paciente, instalou-se em um lugar inconveniente e não se moveu desde então.",
      },
      {
        name: "Popolama",
        species: "mongpo",
        relation:
          "Beligerante e gosmento, espirra muco grosso em você de maneira peculiarmente afetuosa.",
      },
      {
        name: "Sya Mai",
        species: "onagung",
        relation:
          "Amorfo e meticuloso, decide repentinamente que odeia sua comida favorita anterior.",
      },
      {
        name: "Tremendão",
        species: "satra",
        relation:
          "Tímido e bioluminescente, que você jurou um dia livrar das garras de um magistrado corrupto.",
      },
    ],
  },
  Padeiro: {
    name: "Padeiro",
    theme:
      "Monstros centenários, polinizadores, escavadores pacientes e especialistas em sobremesas e grãos.",
    description:
      "Conhecidos por sua resiliência inabalável, persistência e temperamento calmo.",
    initialTraits: [
      {
        name: "ENXAME",
        cost: "Passiva",
        type: "Passiva",
        description:
          "Se você ajudar uma criatura que também tem este Traço, ambos recuperam <H> de Vigor.",
      },
      {
        name: "POLINIZADOR",
        cost: "Custo: 1 Sucesso em PROCURAR",
        type: "Sucesso",
        description: "Harmonia aumenta em 1.",
      },
      {
        name: "ROBUSTO",
        cost: "Passiva",
        type: "Passiva",
        description:
          "Nada consegue empurrar ou puxar você, a menos que você permita ou esteja Preso.",
      },
    ],
    sampleMonsters: [
      {
        name: "Cacheado",
        species: "myotak",
        relation:
          "Genioso, que uma vez derrubou você de uma encosta por não querer dividir pães de mel.",
      },
      {
        name: "Huir",
        species: "chamig",
        relation:
          "Titânico e venerado, em cujas costas sua família viajou e viveu por gerações.",
      },
      {
        name: "Mãe-Mãe",
        species: "enxame votra",
        relation:
          "Venerado enxame coletivo cuidado pela sua família há gerações.",
      },
      {
        name: "Pãodoce",
        species: "mammudo",
        relation:
          "Gentil e encouraçado, que você acompanha em longas caminhadas calmas nas tardes.",
      },
      {
        name: "Pua Li",
        species: "pitangwa",
        relation:
          "Tranquilona e conversadora, objeto de décadas de estudos sobre cognição animal.",
      },
    ],
  },
  Peixeiro: {
    name: "Peixeiro",
    theme:
      "Monstros marinhos, lagos, rios e leviatãs aquáticos com guelras, barbatanas e eletricidade.",
    description:
      "Mutações conferem acesso a oceanos inexplorados, correntes tempestuosas e manobras velozes.",
    initialTraits: [
      {
        name: "CHOQUE ELÉTRICO",
        cost: "Custo: 2 Ações",
        type: "Ação",
        description:
          "Faça um CHAMAR LIGEIRO. Se passar, cada criatura a até 1 Pernada sofre [A] de Dano e fica Atordoada.",
      },
      {
        name: "ECOLOCALIZAÇÃO",
        cost: "Custo: 1 Sucesso em CHAMAR",
        type: "Sucesso",
        description: "Uma criatura à sua escolha fica Exposta.",
      },
      {
        name: "NADAR",
        cost: "Passiva",
        type: "Passiva",
        description: "Você pode nadar sem Desvantagem.",
      },
    ],
    sampleMonsters: [
      {
        name: "A Nu",
        species: "uopang",
        relation:
          "Solitário molusco que você mantém escondido e seguro de caçadores numa enseada rasa.",
      },
      {
        name: "Bochechões",
        species: "yudoubu",
        relation:
          "Písceo e crítico, com incrível habilidade de notar a má intenção de forasteiros.",
      },
      {
        name: "Comprido",
        species: "varithan",
        relation:
          "Brincalhão e serpentino, só come se você fizer uma brincadeira com a porção.",
      },
      {
        name: "Melodia",
        species: "shakoi",
        relation:
          "Esperto habitante oceânico que resgata relíquias e tesouros de antigos naufrágios.",
      },
      {
        name: "Pichi-Chi",
        species: "zaili",
        relation:
          "Filhote órfã e elétrica que você resgatou e adotou depois de encontrar na areia.",
      },
    ],
  },
  Pivoteiro: {
    name: "Pivoteiro",
    theme:
      "Monstros da metamorfose, camuflagem, mimetismo e regeneração constante.",
    description:
      "Ferais-versáteis que se adaptam a qualquer situação, mudando de forma e abordagem conforme a necessidade.",
    initialTraits: [
      {
        name: "CAMUFLAGEM",
        cost: "Custo: 1 Sucesso SAGAZ",
        type: "Sucesso",
        description: "Você fica Escondido.",
      },
      {
        name: "METAMORFOSE",
        cost: "Passiva",
        type: "Passiva",
        description:
          "Durante o Banquete, você pode perder este Traço permanentemente. Se fizer isso, ganhe +1 nível em dois ESTILOS, HABILIDADES ou TRAÇOS.",
      },
      {
        name: "REGENERAÇÃO",
        cost: "Custo: 1 Sucesso",
        type: "Sucesso",
        description:
          "Recupere 1 de Durabilidade de qualquer uma de suas PARTES.",
      },
    ],
    sampleMonsters: [
      {
        name: "Coveiro",
        species: "botabo",
        relation:
          "Assustador e urbano, com lampejos de inteligência que surpreendem a todos.",
      },
      {
        name: "Jovem Duke",
        species: "kala-kala",
        relation:
          "Mímico vocal criado em cativeiro que consegue imitar instrumentos e uivar por horas.",
      },
      {
        name: "Mata-Gigante",
        species: "tatangwa",
        relation:
          "Feroz e cauteloso, sobrevivente de caçadas a troféus cuja confiança você conquistou.",
      },
      {
        name: "Shim",
        species: "zaswang",
        relation:
          "Tentaculado e curioso, a quem você sempre presenteia com novas caixas quebra-cabeças.",
      },
      {
        name: "Zoujo",
        species: "rakuzar",
        relation:
          "Leal metamorfo, a única criatura que ainda o reconheceu após sua primeira grande mutação.",
      },
    ],
  },
};

export const ALL_CONDITIONS_DATA = [
  {
    name: "Amedrontado",
    maxLevel: null,
    description: "Depois de realizar qualquer Teste, reduza [A] por X.",
    removeInfo:
      "Durante seu turno, você ou um parça podem gastar 3 de Vigor para fazer um ASSEGURAR (qualquer Estilo) para remover [A] níveis em um Sucesso. Também remove todos os níveis após recuar.",
  },
  {
    name: "Atordoado",
    maxLevel: null,
    description: "Você tem X Ações a menos no começo do seu turno.",
    removeInfo:
      "Remova 1 nível se estiver iniciando um turno curto, ou todos os níveis ao começar um turno completo.",
  },
  {
    name: "Confuso",
    maxLevel: null,
    description:
      "Para cada vez que utilizar um TRAÇO ativo (não-Passivo e não Brio/Tino), você sofre X de Dano.",
    removeInfo:
      "Remova 1 nível se completar um turno curto sem usar Traço ativo; remova todos os níveis se fizer um turno completo sem usar Traço ativo (não pode remover no mesmo turno em que recebeu).",
  },
  {
    name: "Convalescente",
    maxLevel: 6,
    description:
      "Apenas monstros. Ignora outras Condições e não recupera Vigor naturalmente.",
    removeInfo:
      "Elimine 1 nível se recuperar o Vigor dela ao máximo com comida de sua dieta.",
  },
  {
    name: "Descansado",
    maxLevel: null,
    description: "Seu Vigor máximo aumenta em X (ou +2X se tiver Hibernador).",
    removeInfo:
      "Remova todos os níveis se ficar Ferido. Se ficar Fadigado, remova níveis de ambas 1-para-1.",
  },
  {
    name: "Dissonante",
    maxLevel: 1,
    description:
      "Seus pensamentos e instintos estão em conflito. Você tem Desvantagem em todos os Testes.",
    removeInfo:
      "Remova automaticamente assim que a Harmonia da matilha aumentar e deixar de ser 0.",
  },
  {
    name: "Envenenado",
    maxLevel: null,
    description: "No início de cada rodada, você sofre X de Dano.",
    removeInfo:
      "Durante o turno, você ou um parça podem gastar 1 Ação para CURAR (qualquer Estilo), removendo [A] níveis em caso de Sucesso.",
  },
  {
    name: "Escondido",
    maxLevel: 1,
    description:
      "Você Ataca com Vantagem, e criaturas Atacam você com Desvantagem. Não pode ser alvo inicial de monstros.",
    removeInfo:
      "Remova depois de fazer qualquer Teste. Se ficar Exposto enquanto Escondido, remova ambas.",
  },
  {
    name: "Expandido",
    maxLevel: 1,
    description:
      "Aumenta de tamanho. Trate todas as criaturas como se estivessem 1 Pernada mais próximas de você.",
    removeInfo: "Remova gastando 1 Ação durante o seu turno.",
  },
  {
    name: "Exposto",
    maxLevel: 1,
    description: "Você sofre Dano dobrado.",
    removeInfo:
      "Remova se você Levantar a Guarda ou sofrer Dano durante A Caçada.",
  },
  {
    name: "Fadigado",
    maxLevel: null,
    description: "Seu Vigor máximo diminui em X.",
    removeInfo:
      "Se ficar Descansado enquanto Fadigado, remova níveis de ambas em base 1-para-1. Remova ao Acampar ou no Recesso.",
  },
  {
    name: "Ferido",
    maxLevel: 3,
    description:
      "Nível 1: Fraqueza aparente. Nível 2: Não pode gastar Vigor. Nível 3: Vigor 0, fora de ação se caído; se forçar a barra morre no próximo dano.",
    removeInfo:
      "Remova 1 nível durante o Recesso ou com ações especiais/refeições que removam Ferido (Balsamel, etc).",
  },
  {
    name: "Preso",
    maxLevel: 1,
    description:
      "Puxado para 0 Pernada da criatura. Não pode se Mover e tem Desvantagem em todos os Testes.",
    removeInfo:
      "Remova se a Parte que o mantém Preso sofrer Dano à Parte, ou se for puxado/empurrado para longe.",
  },
  {
    name: "Queimado",
    maxLevel: 1,
    description:
      "Afeta PARTES / UTENSÍLIO. Desvantagem ao atacar com essa Parte.",
    removeInfo:
      "Remova ao recuperar Durabilidade dessa Parte ou ao entrar em Debaixo d’água / Subterrâneo.",
  },
  {
    name: "Revigorado",
    maxLevel: null,
    description: "No começo de cada rodada, recupere X Vigor.",
    removeInfo: "Remova 1 nível no início de cada rodada após a recuperação.",
  },
];

export const ALL_TECHNIQUES_COMPENDIUM = [
  // BARBANTE
  {
    name: "RÉDEA CURTA",
    utensil: "Barbante",
    level: "Iniciante" as const,
    cost: "3 de Vigor",
    description:
      "Escolha entre puxar a si mesmo 1 Pernada em direção a uma criatura, ou puxar um parça 1 Pernada para mais perto de você.",
  },
  {
    name: "ARMADILHA",
    utensil: "Barbante",
    level: "Iniciante" as const,
    cost: "2 Ações",
    description:
      "Faça um MANUFATURAR SAGAZ. Se passar, na próxima vez em que uma criatura hostil se Mover na sua direção, ela sofre [A] Dano à Parte e não pode se Mover até o início do próximo turno.",
  },
  {
    name: "CHICOTADA",
    utensil: "Barbante",
    level: "Iniciante" as const,
    cost: "Passiva",
    description: 'Seu Barbante recebe: "Alcance: 2 (GOLPEAR)".',
  },
  {
    name: "REPAROS EM CAMPO",
    utensil: "Barbante",
    level: "Iniciante" as const,
    cost: "2 Ações",
    description:
      "Escolha um parça a até 0 Pernada e faça um MANUFATURAR LIGEIRO. Se passar, recupere [A] Durabilidade do UTENSÍLIO do parça escolhido.",
  },
  {
    name: "ARREIOS DE SEGURANÇA",
    utensil: "Barbante",
    level: "Intermediária" as const,
    cost: "Passiva",
    description:
      "Se sofrer Dano durante a Trilha, seu Vigor não pode ficar menor que 1.",
  },
  {
    name: "CESTA ABUNDANTE",
    utensil: "Barbante",
    level: "Intermediária" as const,
    cost: "1 de Vigor",
    description:
      "Se você Forrageia com sucesso, pode escolher um ESTILO diferente do que usou para Forragear. Se fizer isso, colha ingredientes que correspondam a esse ESTILO.",
  },
  {
    name: "FIO EMARANHADO",
    utensil: "Barbante",
    level: "Intermediária" as const,
    cost: "3 de Vigor",
    description:
      "Se você Atacar uma criatura e acertar, ela tem Desvantagem em seu próximo Ataque.",
  },
  {
    name: "CORRENTES DE PRATA PRENDEM O MUNDO",
    utensil: "Barbante",
    level: "Avançada" as const,
    cost: "5 de Vigor",
    description:
      "Se você Atacar uma criatura e acertar, ela fica Presa pelo seu BARBANTE. Enquanto a criatura estiver Presa, você não pode Atacar. No começo de cada rodada, gaste 5 de Vigor ou remova a Condição.",
  },
  {
    name: "PRINCÍPIO DA FORMA INCONSTANTE",
    utensil: "Barbante",
    level: "Avançada" as const,
    cost: "Variável",
    description: "Aprenda uma Técnica de qualquer outro UTENSÍLIO.",
  },

  // CUTELO
  {
    name: "CORTE LIMPO",
    utensil: "Cutelo",
    level: "Iniciante" as const,
    cost: "4 Ações",
    description:
      "Faça um GOLPEAR PODEROSO ou GOLPEAR PRECISO contra criatura a até 1 Pernada. Se acertar, cause [A] × 2 Dano à Parte. Se falhar, fique Exposto.",
  },
  {
    name: "ESPADA GRANDE PRA CA***",
    utensil: "Cutelo",
    level: "Iniciante" as const,
    cost: "3 de Vigor",
    description: "Um humano à sua escolha fica Amedrontado.",
  },
  {
    name: "SEM DESPERDÍCIO",
    utensil: "Cutelo",
    level: "Iniciante" as const,
    cost: "Passiva",
    description:
      'Depois que terminar O Banquete, você ganha 1 porção de "O Melhor Pedaço" (Receba +1 em qualquer ESTILO).',
  },
  {
    name: "TREINAMENTO MÉDICO",
    utensil: "Cutelo",
    level: "Iniciante" as const,
    cost: "Passiva",
    description:
      "Uma vez por Recesso, escolha um parça para remover 1 nível de Ferido.",
  },
  {
    name: "ESTUDANTE DE OSSOS",
    utensil: "Cutelo",
    level: "Intermediária" as const,
    cost: "Passiva",
    description:
      "Você tem Vantagem quando Ataca qualquer monstro que sua matilha matou durante a Jornada anterior.",
  },
  {
    name: "MARCA DO CIRURGIÃO",
    utensil: "Cutelo",
    level: "Intermediária" as const,
    cost: "5 de Vigor",
    description:
      "Escolha a PARTE de uma criatura. Aquela PARTE perde o dobro de Durabilidade quando sofre Dano até quebrar ou usar novamente.",
  },
  {
    name: "SEM MEDO DA MORTE",
    utensil: "Cutelo",
    level: "Intermediária" as const,
    cost: "Passiva",
    description: "Você pode gastar Vigor enquanto estiver Ferido 2.",
  },
  {
    name: "BESTA ENSANGUENTADA",
    utensil: "Cutelo",
    level: "Avançada" as const,
    cost: "Passiva",
    description:
      "Você pode ficar Ferido 4. Quando estiver Ferido 2 ou mais, você sofre os efeitos do nível anterior.",
  },
  {
    name: "LÂMINA INEVITÁVEL",
    utensil: "Cutelo",
    level: "Avançada" as const,
    cost: "10 de Vigor",
    description:
      "Se você GOLPEAR, recebe 1 Sucesso automático. Não pode usar se virar o bicho.",
  },

  // ESPETO
  {
    name: "SEQUÊNCIA DE MOVIMENTOS",
    utensil: "Espeto",
    level: "Iniciante" as const,
    cost: "5 de Vigor",
    description: "Você ganha uma Ação extra se estiver na Caçada.",
  },
  {
    name: "AGULHA E LINHA",
    utensil: "Espeto",
    level: "Iniciante" as const,
    cost: "Passiva",
    description:
      'Seu Espeto recebe: "Alcance: 2 (ATIRAR)". Se acertar um ATIRAR com ele, pode se mover 1 Pernada em direção ao alvo.',
  },
  {
    name: "DESATOLAR",
    utensil: "Espeto",
    level: "Iniciante" as const,
    cost: "3 de Vigor",
    description: "Você pode refazer um ATRAVESSAR.",
  },
  {
    name: "ETIQUETA GASTRONÔMICA",
    utensil: "Espeto",
    level: "Iniciante" as const,
    cost: "3 de Vigor",
    description:
      "Escolha uma Comunidade humana. A Guia diz uma ação que fará com que o vejam bem e uma que fará com que não gostem de você.",
  },
  {
    name: "ESPETINHO MISTO",
    utensil: "Espeto",
    level: "Intermediária" as const,
    cost: "Passiva",
    description:
      "Quando sua matilha Acampa e prepara uma refeição, a refeição pode ter um efeito adicional.",
  },
  {
    name: "PONTO DE PRESSÃO",
    utensil: "Espeto",
    level: "Intermediária" as const,
    cost: "5 de Vigor",
    description:
      "Se você causar Dano à Parte, a PARTE alvejada torna-se temporariamente quebrada até o final do próximo turno do Monstro.",
  },
  {
    name: "SALTO COM VARA",
    utensil: "Espeto",
    level: "Intermediária" as const,
    cost: "1 de Vigor",
    description:
      "Até o início de sua próxima rodada, você ganha 1 nível em VOAR.",
  },
  {
    name: "LANÇA SEM SOMBRA",
    utensil: "Espeto",
    level: "Avançada" as const,
    cost: "Passiva",
    description:
      "Durante a primeira rodada da Caçada, você tem um turno mesmo que o Monstro tenha a iniciativa e recebe 3 Ações em vez de 1.",
  },
  {
    name: "NESSA LONGA ESTRADA DA VIDA",
    utensil: "Espeto",
    level: "Avançada" as const,
    cost: "4 de Vigor",
    description:
      "Antes de um Evento começar, a Guia gera um Evento adicional do mesmo tipo para você escolher.",
  },

  // LUVAS
  {
    name: "DE PERTINHO",
    utensil: "Luvas",
    level: "Iniciante" as const,
    cost: "Passiva",
    description:
      "Você tem Vantagem em GOLPEAR contra criaturas a 0 Pernada de você.",
  },
  {
    name: "ALCANCE ENCOURAÇADO",
    utensil: "Luvas",
    level: "Iniciante" as const,
    cost: "Passiva",
    description:
      "Você não sofre Dano de TRAÇOS Passivos (como CORPO QUENTE ou NÃO-ME-TOQUE).",
  },
  {
    name: "MÃOS LARGAS, PEGADA FORTE",
    utensil: "Luvas",
    level: "Iniciante" as const,
    cost: "2 de Vigor",
    description:
      "Até o início de sua próxima rodada, você ganha 1 nível em um dos seguintes Traços: ESCALAR, ESCAVAR ou NADAR.",
  },
  {
    name: "TÔ CONTIGO",
    utensil: "Luvas",
    level: "Iniciante" as const,
    cost: "2 de Vigor",
    description:
      "Escolha criatura Convalescente ou Ferida a 0 Pernada. Você a carrega. Enquanto a carregar, não pode Atacar e sofre o dano no lugar dela (+3 Vigor se for monstro).",
  },
  {
    name: "INVESTIDA HILÁRIA",
    utensil: "Luvas",
    level: "Intermediária" as const,
    cost: "Passiva",
    description:
      "Para cada Pernada que você se Move na direção do Monstro, você fica Revigorado.",
  },
  {
    name: "O VELHO JAB E DIRETO",
    utensil: "Luvas",
    level: "Intermediária" as const,
    cost: "Passiva",
    description:
      "Se você atingir uma criatura com um GOLPEAR LIGEIRO e depois um GOLPEAR PODEROSO no mesmo turno, a criatura fica Atordoada.",
  },
  {
    name: "PEGADA FIRME",
    utensil: "Luvas",
    level: "Intermediária" as const,
    cost: "Passiva",
    description:
      "Se você estiver a 0 Pernada de um monstro, ele não pode se distanciar de você sem puxá-lo junto.",
  },
  {
    name: "500 SOCOS DERRUBAM OS CÉUS",
    utensil: "Luvas",
    level: "Avançada" as const,
    cost: "1 Sucesso em GOLPEAR LIGEIRO",
    description:
      "Receba −1 em LIGEIRO até o final do seu turno e pode Atacar imediatamente usando LIGEIRO de novo sem gastar Ações.",
  },
  {
    name: "ME DÊ SUA FORÇA, PARÇA",
    utensil: "Luvas",
    level: "Avançada" as const,
    cost: "5 de Vigor",
    description:
      "Se GOLPEAR PODEROSO, aumente [A] em <H>. Parças podem gastar 5 de Vigor para adicionar <H> novamente se todos gastarem.",
  },

  // MAÇARICO
  {
    name: "LINHA DE FOGO",
    utensil: "Maçarico",
    level: "Iniciante" as const,
    cost: "Passiva",
    description: 'Seu Maçarico recebe: "Alcance: 3 (ATIRAR)".',
  },
  {
    name: "IGNIÇÃO RÁPIDA",
    utensil: "Maçarico",
    level: "Iniciante" as const,
    cost: "Passiva",
    description:
      "Quando sua matilha Acampa e cozinha uma refeição, você pode cozinhar uma refeição adicional.",
  },
  {
    name: "LUZ GUIA",
    utensil: "Maçarico",
    level: "Iniciante" as const,
    cost: "Passiva",
    description:
      "Se você fizer um ATRAVESSAR e passar, o próximo parça que fizer um ATRAVESSAR tem Vantagem.",
  },
  {
    name: "PREAQUECIMENTO",
    utensil: "Maçarico",
    level: "Iniciante" as const,
    cost: "3 de Vigor",
    description:
      "Escolha um parça a até 0 Pernada. Até o fim da rodada, se ele causar Dano à Parte, aquela PARTE também fica Queimada.",
  },
  {
    name: "FLAMBAR",
    utensil: "Maçarico",
    level: "Intermediária" as const,
    cost: "3 Ações",
    description:
      "Escolha criatura a até 3 Pernadas. Na próxima vez que causar Dano à Parte nela, cada uma de suas PARTES perde [A] de Durabilidade e fica Queimada.",
  },
  {
    name: "MECANISMO COMPATÍVEL",
    utensil: "Maçarico",
    level: "Intermediária" as const,
    cost: "Passiva",
    description:
      "Vantagem para estudar/operar artefatos de arkaicaço. Uma vez por Recesso, um parça pode Treinar sem gastar Ações.",
  },
  {
    name: "VIGILÂNCIA",
    utensil: "Maçarico",
    level: "Intermediária" as const,
    cost: "2 de Vigor",
    description:
      "Até o próximo turno, na primeira vez que uma criatura se Mover na sua direção, você pode ATIRAR SAGAZ nela causando [A] Dano à Parte.",
  },
  {
    name: "DAS CINZAS, CRESCEM SEMENTES",
    utensil: "Maçarico",
    level: "Avançada" as const,
    cost: "Passiva",
    description:
      "Se a Saúde de uma Comunidade chegar a 0, inicia Desafio VA 20 no Recesso para restaurar 1 de Saúde.",
  },
  {
    name: "EXPLOSÃO TERMONUCLEAR ARKAFOGO",
    utensil: "Maçarico",
    level: "Avançada" as const,
    cost: "3 Ações",
    description:
      "Uma vez por Jornada: no começo do próximo turno, o alvo e criaturas a 1 Pernada sofrem 20 de Dano e todas as PARTES ficam Queimadas.",
  },

  // PANELA
  {
    name: "ESCUDO DE AÇO",
    utensil: "Panela",
    level: "Iniciante" as const,
    cost: "Passiva",
    description:
      "A Durabilidade máxima de sua Panela aumenta em 30 (Total 50).",
  },
  {
    name: "LANÇAMENTO RICOCHETE",
    utensil: "Panela",
    level: "Iniciante" as const,
    cost: "Passiva",
    description:
      'Sua Panela recebe: "Alcance: 2 (ATIRAR)". Se causar 10+ Dano com ATIRAR, o alvo fica Atordoado.',
  },
  {
    name: "POSTURA APRUMADA",
    utensil: "Panela",
    level: "Iniciante" as const,
    cost: "Passiva",
    description:
      "Ao recuperar Vigor, você também pode remover um nível de qualquer Condição exceto Ferido ou Dissonante.",
  },
  {
    name: "SUPERFÍCIE ESPELHADA",
    utensil: "Panela",
    level: "Iniciante" as const,
    cost: "Passiva",
    description: "Você pode Provocar de qualquer distância.",
  },
  {
    name: "PORÇÃO GENEROSA",
    utensil: "Panela",
    level: "Intermediária" as const,
    cost: "Passiva",
    description:
      "Quando a matilha Acampa e serve refeição fresca, você também prepara um Lanche de igual Vigor sem efeitos adicionais.",
  },
  {
    name: "VEM PRA CIMA!",
    utensil: "Panela",
    level: "Intermediária" as const,
    cost: "2 de Vigor",
    description: "Se você Atacar e acertar, pode Provocar sem gastar Ações.",
  },
  {
    name: "SE ORIENTA!",
    utensil: "Panela",
    level: "Intermediária" as const,
    cost: "2 Ações",
    description:
      "Cause 1 de Dano a um parça a 0 Pernada. Ele remove todos os níveis de Confuso, Fadigado, Amedrontado e Atordoado.",
  },
  {
    name: "UNIDOS VENCEREMOS",
    utensil: "Panela",
    level: "Avançada" as const,
    cost: "Passiva",
    description:
      "Se um parça recuperar Vigor, você recupera uma quantidade igual de Vigor.",
  },
  {
    name: "O DOLORIDO É VER VOCÊ SOFRER",
    utensil: "Panela",
    level: "Avançada" as const,
    cost: "Passiva",
    description: "Se Provocar, você pode Levantar a Guarda sem gastar Ações.",
  },

  // COMPARTILHADAS LIGEIRAS (Luvas, Espeto, Barbante)
  {
    name: "COMBO RÁPIDO",
    utensil: "Compartilhada (Ligeiro)",
    level: "Intermediária" as const,
    cost: "Passiva",
    description:
      "Você pode Atacar usando o Estilo LIGEIRO múltiplas vezes no mesmo turno.",
  },
  {
    name: "INVESTIDA VIOLENTA",
    utensil: "Compartilhada (Ligeiro)",
    level: "Intermediária" as const,
    cost: "1 Vigor / Pernada",
    description:
      "Antes de atacar, mova quantas Pernadas quiser até o alvo e afaste-se o mesmo número depois. Gaste 1 Vigor por Pernada.",
  },
  {
    name: "ISSO É PRA HOJE",
    utensil: "Compartilhada (Ligeiro)",
    level: "Intermediária" as const,
    cost: "Passiva",
    description:
      "Uma vez por Recesso, você pode trabalhar num Projeto sem gastar Ações.",
  },

  // COMPARTILHADAS PODEROSAS (Cutelo, Luvas, Panela)
  {
    name: "BASE SÓLIDA",
    utensil: "Compartilhada (Poderoso)",
    level: "Intermediária" as const,
    cost: "1 Ação",
    description:
      "Seu turno acaba. Você tem Vantagem no seu próximo Teste. Se mover antes, perde a Vantagem.",
  },
  {
    name: "EU AGUENTO",
    utensil: "Compartilhada (Poderoso)",
    level: "Intermediária" as const,
    cost: "Passiva",
    description:
      "Se você se tornar o alvo de um Monstro, recupere <H> de Vigor.",
  },
  {
    name: "UTENSÍLIO REFORÇADO",
    utensil: "Compartilhada (Poderoso)",
    level: "Intermediária" as const,
    cost: "Passiva",
    description: "A Durabilidade máxima dos seus UTENSÍLIOS aumenta em 10.",
  },

  // COMPARTILHADAS PRECISAS (Cutelo, Espeto, Maçarico)
  {
    name: "PONTO FRACO",
    utensil: "Compartilhada (Preciso)",
    level: "Intermediária" as const,
    cost: "2 de Vigor",
    description:
      "A próxima vez que você causar Dano a uma PARTE quebrada, seu alvo fica Exposto.",
  },
  {
    name: "PORÇÕES EXATAS",
    utensil: "Compartilhada (Preciso)",
    level: "Intermediária" as const,
    cost: "Passiva",
    description:
      "Ao Acampar, se um parça ultrapassar o limite máximo de Vigor com a refeição, faça um Lanche com o excedente.",
  },
  {
    name: "TRAÇOS TÊNUES",
    utensil: "Compartilhada (Preciso)",
    level: "Intermediária" as const,
    cost: "Passiva",
    description:
      "No início de cada rodada de viagem, você pode fazer uma pergunta à Guia sobre o Monstro como se tivesse Rastros Frescos.",
  },

  // COMPARTILHADAS SAGAZES (Panela, Maçarico, Barbante)
  {
    name: "APAVORAR",
    utensil: "Compartilhada (Sagaz)",
    level: "Intermediária" as const,
    cost: "3 de Vigor",
    description:
      "A próxima vez que Atacar usando SAGAZ, em vez de Dano à Parte, você faz o alvo ficar Amedrontado [A].",
  },
  {
    name: "LARGAR A ISCA",
    utensil: "Compartilhada (Sagaz)",
    level: "Intermediária" as const,
    cost: "2 Ações",
    description:
      "Seu UTENSÍLIO perde 1d6 de Durabilidade e você fica Escondido (não pode usar se estiver quebrado).",
  },
  {
    name: "MUTAÇÕES DISFARÇADAS",
    utensil: "Compartilhada (Sagaz)",
    level: "Intermediária" as const,
    cost: "3 de Vigor",
    description:
      "Até a próxima vez que virar o bicho ou usar Traço além de Brio ou Tino, você se passa por não feral.",
  },
];

export const ALL_TRAITS_COMPENDIUM = [
  {
    name: "BRIO",
    cost: "Custo: 1 Sucesso",
    description: "Aumente o resultado do seu Dado de Ação [A] em 1.",
    isStandard: true,
  },
  {
    name: "TINO",
    cost: "Custo: 1 Sucesso",
    description:
      "Estabeleça um detalhe relevante sobre a situação ou fraqueza na narrativa.",
    isStandard: true,
  },
  {
    name: "AMEAÇAR",
    cost: "Custo: 1 Sucesso PODEROSO",
    description: "Uma criatura à sua escolha fica Amedrontada.",
  },
  {
    name: "APOSEMÁTICO",
    cost: "Custo: 2 Ações",
    description:
      "Faça um EXIBIR (qualquer Estilo). Você fica Exposto e uma criatura à sua escolha fica Amedrontada [A].",
  },
  {
    name: "ARMADURA NATURAL",
    cost: "Passiva",
    description:
      "Você reduz à metade o Dano causado por GOLPEAR PODEROSO e ATIRAR PODEROSO.",
  },
  {
    name: "BANHA",
    cost: "Passiva",
    description:
      "Seu Vigor máximo aumenta em 10 (nível 1 apenas na Trilha, nível 2 em combate também).",
  },
  {
    name: "BIOLUMINESCÊNCIA",
    cost: "Custo: 1 Sucesso SAGAZ",
    description: "Uma criatura à sua escolha fica Confusa (Nível 1 a 3).",
  },
  {
    name: "BRINCALHÃO",
    cost: "Custo: 1 Sucesso",
    description:
      "Harmonia aumenta em 1 durante o Recesso (pode exceder o máximo).",
  },
  {
    name: "CABEÇADA",
    cost: "Custo: 1 Sucesso",
    description:
      "Depois de atacar, empurre a criatura para 1 Pernada de você. Se estiver voando ou escalando, cai no Chão.",
  },
  {
    name: "CAMUFLAGEM",
    cost: "Custo: 1 Sucesso SAGAZ",
    description: "Você fica Escondido.",
  },
  {
    name: "CARNICEIRO",
    cost: "Passiva",
    description:
      "Imune a envenenamento por comida. Ao Forragear, recebe <H> porções de Detritos.",
  },
  {
    name: "CATAR PIOLHO",
    cost: "Passiva",
    description:
      "Se ajudar um parça a ASSEGURAR, CHAMAR ou EXIBIR e passarem, Harmonia aumenta em 1.",
  },
  {
    name: "CHAFURDAR",
    cost: "Passiva",
    description:
      "Quando você Acampa, pode restaurar uma PARTE/Utensílio para sua Durabilidade máxima.",
  },
  {
    name: "CHEIRO DE SANGUE",
    cost: "Passiva",
    description:
      "Vantagem em todos os Testes na 1ª rodada da Caçada se o oponente tiver criatura Ferida.",
  },
  {
    name: "CHOQUE ELÉTRICO",
    cost: "Custo: 2 Ações",
    description:
      "Faça um CHAMAR LIGEIRO. Se passar, criaturas a até 1 Pernada sofrem [A] de Dano e ficam Atordoadas.",
  },
  {
    name: "CLARÃO",
    cost: "Custo: 2 Ações",
    description:
      "Faça um EXIBIR LIGEIRO. Se passar, uma criatura fica Atordoada e Confusa [A].",
  },
  {
    name: "CONSTRUTOR DE NINHO",
    cost: "Passiva",
    description:
      "Ao Acampar, a matilha pode manter níveis de Condições em vez de removê-las.",
  },
  {
    name: "CORPO QUENTE",
    cost: "Passiva",
    description:
      "No começo da rodada, criaturas a 0 Pernada sofrem 2 Dano. Se Preso, a Parte fica Queimada. Suas Partes não queimam.",
  },
  {
    name: "CULTIVADOR",
    cost: "Passiva",
    description: "Dobre os efeitos recebidos por ceder sua porção do Banquete.",
  },
  {
    name: "DEFENSOR DO REBANHO",
    cost: "Passiva",
    description:
      "Se Agrupar com uma criatura, ambos podem Levantar a Guarda sem gastar Ações.",
  },
  {
    name: "DESORIENTAR",
    cost: "Passiva",
    description:
      "Criaturas que o atacam (acertando ou errando) ficam Confusas.",
  },
  {
    name: "DEVORADOR DE ENERGIA",
    cost: "Passiva",
    description:
      "Se passar o Recesso perto de uma leylinha, recupera 10 Vigor (Convalescente) ou remove 1 Ferido extra.",
  },
  {
    name: "DIETA GENERALISTA",
    cost: "Passiva",
    description:
      "Pode ignorar o efeito adicional de uma refeição para dobrar a recuperação de Vigor como se tivesse Tempero.",
  },
  {
    name: "DIETA SELETIVA",
    cost: "Passiva",
    description:
      "Nomeie 1 Ingrediente: receba <H> porções dele no começo de cada Recesso e ao Reabastecer.",
  },
  {
    name: "DIGESTÃO LENTA",
    cost: "Passiva",
    description:
      "Efeitos de refeições que duram até a próxima refeição duram até o fim da Jornada.",
  },
  {
    name: "ECOLOCALIZAÇÃO",
    cost: "Custo: 1 Sucesso em CHAMAR",
    description: "Uma criatura à sua escolha fica Exposta.",
  },
  {
    name: "ELETRORRECEPTIVIDADE",
    cost: "Passiva",
    description: "Criaturas Escondidas não ganham Vantagem se atacarem você.",
  },
  {
    name: "ENGOLIR INTEIRO",
    cost: "Custo: 1 Ação",
    description:
      "Coma qualquer quantidade de Ingredientes para recuperar quantidade igual de Vigor.",
  },
  {
    name: "ENXAME",
    cost: "Passiva",
    description:
      "Se ajudar criatura com este Traço, ambos recuperam <H> de Vigor.",
  },
  {
    name: "ESCALAR",
    cost: "Passiva",
    description:
      "Pode escalar sem Desvantagem (nível 2: move 2 Pernadas; nível 3: Vantagem em Atravessar).",
  },
  {
    name: "ESCAVAR",
    cost: "Passiva",
    description:
      "Pode escavar/cavar (nível 2: move 2 Pernadas; nível 3: Vantagem em Atravessar).",
  },
  {
    name: "ESCORREGADIO",
    cost: "Passiva",
    description: "Você não pode ficar Preso.",
  },
  {
    name: "ESTASE",
    cost: "Passiva",
    description:
      "Ao quase morrer, entra em estase. Matilha pode revivê-lo com projeto no Recesso (Desafio VA 10+).",
  },
  {
    name: "EXPANDIR",
    cost: "Custo: 1 Ação",
    description: "Você fica Expandido.",
  },
  {
    name: "EXPLOSÃO SÔNICA",
    cost: "Passiva",
    description:
      "Quando Atacar, você pode usar a habilidade CHAMAR em vez de Atirar ou Golpear.",
  },
  {
    name: "FAMINTO",
    cost: "Custo: 1 de Harmonia",
    description: "Role novamente o seu Dado de Ação.",
  },
  {
    name: "FERMENTADOR",
    cost: "Passiva",
    description:
      "Ao comer refeição, em vez de Vigor, pode receber níveis de Revigorado iguais à metade do Vigor.",
  },
  {
    name: "FLUTUANTE",
    cost: "Passiva",
    description: "Desde que possa voar, pode ignorar os Traços de Área.",
  },
  {
    name: "FOTOSSÍNTESE",
    cost: "Custo: 3 Ações",
    description:
      "Se tiver acesso ao Céu, recupere seu Vigor para o valor máximo.",
  },
  {
    name: "GIGANTESCO",
    cost: "Passiva",
    description:
      "Trate todas as criaturas como se estivessem 3 Pernadas mais próximas de você.",
  },
  {
    name: "HIBERNADOR",
    cost: "Passiva",
    description:
      "Cada nível de Descansado aumenta seu Vigor máximo em 2 em vez de 1.",
  },
  {
    name: "INABALÁVEL",
    cost: "Passiva",
    description: "Você não pode ficar Confuso.",
  },
  {
    name: "INCANSÁVEL",
    cost: "Custo: 1 Sucesso PODEROSO",
    description: "Remova <H> Fadigado e recupere <H> de Vigor.",
  },
  {
    name: "INVESTIDA",
    cost: "Custo: 1 Ação",
    description:
      "Move até 3 Pernadas até o alvo (0 Pernada) e causa Dano a ele e a si mesmo igual às Pernadas movidas.",
  },
  {
    name: "LADRÃO",
    cost: "Custo: 1 Sucesso SAGAZ",
    description:
      "Roube um Ingrediente, Lanche ou criatura Presa a 1 Pernada de você.",
  },
  {
    name: "MERGULHAR",
    cost: "Custo: 1 Ação",
    description:
      "Mova-se para 0 Pernada de uma criatura em terreno abaixo de você.",
  },
  {
    name: "METAMORFOSE",
    cost: "Passiva",
    description:
      "No Banquete, perca este Traço permanentemente para ganhar +1 em dois Estilos, Habilidades ou Traços.",
  },
  {
    name: "MIGRADOR",
    cost: "Passiva",
    description: "Você tem Vantagem para ATRAVESSAR em áreas onde já esteve.",
  },
  {
    name: "MIMETISMO VOCAL",
    cost: "Custo: 2 Ações",
    description:
      "Faça um CHAMAR SAGAZ: cause Confuso [A], Amedrontado [A], ou [A] dano e Atordoado a todos a 1 Pernada.",
  },
  {
    name: "MIRA INSTINTIVA",
    cost: "Custo: 1 Sucesso em ATIRAR",
    description: "A criatura atingida por ATIRAR fica Atordoada.",
  },
  {
    name: "NADAR",
    cost: "Passiva",
    description:
      "Pode nadar sem Desvantagem (nível 2: move 2 Pernadas; nível 3: Vantagem em Atravessar).",
  },
  {
    name: "NÃO-ME-TOQUE",
    cost: "Passiva",
    description:
      "Se uma criatura fizer Agarrar ou Golpear contra você, cause 1 Dano por nível deste Traço nela.",
  },
  {
    name: "OSTENTAR",
    cost: "Custo: 2 Ações",
    description:
      "Faça um EXIBIR PODEROSO. Se passar, aliados escolhidos restauram [A] em Vigor.",
  },
  {
    name: "PACIÊNCIA",
    cost: "Passiva",
    description: "Você pode Preparar até 3 vezes por turno.",
  },
  {
    name: "PARASITA DE NINHADA",
    cost: "Passiva",
    description:
      "Em Projetos de Recesso, escolha um NPC para contribuir com um teste.",
  },
  {
    name: "PERSEGUIÇÃO DO PREDADOR",
    cost: "Passiva",
    description:
      "Se mover em direção a uma criatura, ganhe Vantagem ao Atacá-la até o fim do turno.",
  },
  {
    name: "POLINIZADOR",
    cost: "Custo: 1 Sucesso em PROCURAR",
    description: "Harmonia da matilha aumenta em 1.",
  },
  {
    name: "PREDADOR DE EMBOSCADA",
    cost: "Passiva",
    description:
      "Se Atacar enquanto estiver Escondido, você causa o dobro do Dano.",
  },
  {
    name: "PREDADOR RESISTENTE",
    cost: "Custo: 1 Sucesso PODEROSO ou LIGEIRO",
    description: "Uma criatura à sua escolha fica Fadigada.",
  },
  {
    name: "PREDADOR SOCIÁVEL",
    cost: "Passiva",
    description:
      "Se Agrupar com uma criatura, ela tem Vantagem na próxima vez que Atacar.",
  },
  {
    name: "PROFESSOR",
    cost: "Custo: 1 Sucesso PRECISO",
    description:
      "Até o fim da rodada, parças têm Vantagem na mesma Habilidade usada para ativar este Traço.",
  },
  {
    name: "RECUO",
    cost: "Custo: 1 Sucesso PODEROSO ou PRECISO",
    description:
      "Levante a guarda sem gastar Ações (não pode se mover até o próximo turno).",
  },
  {
    name: "REFLEXOS NATURAIS",
    cost: "Passiva",
    description: "Reduz à metade o Dano de GOLPEAR LIGEIRO e ATIRAR LIGEIRO.",
  },
  {
    name: "REGENERAÇÃO",
    cost: "Custo: 1 Sucesso",
    description:
      "Recupere 1 de Durabilidade por nível em uma de suas PARTES/Utensílio.",
  },
  {
    name: "RESISTENTE A IMPACTO",
    cost: "Passiva",
    description: "Você não pode ficar Atordoado.",
  },
  {
    name: "ROBUSTO",
    cost: "Passiva",
    description:
      "Nada pode empurrá-lo ou puxá-lo a menos que você permita ou esteja Preso.",
  },
  {
    name: "SACRIFÍCIO PARENTAL",
    cost: "Passiva",
    description:
      "No Recesso, em vez de remover Ferido 1, pode Trabalhar num Projeto sem gastar Ações.",
  },
  {
    name: "SANGUESSUGA",
    cost: "Custo: 3 Ações",
    description:
      "GOLPEAR PRECISO contra alvo a 1 Pernada: copie 1 nível em um Estilo, Habilidade ou Traço dele até o fim da Jornada.",
  },
  {
    name: "SEDATIVO",
    cost: "Custo: 1 Ação",
    description:
      "Até seu próximo turno, todas as criaturas precisam gastar +1 Ação para Atacar.",
  },
  {
    name: "SENTIDOS AGUÇADOS",
    cost: "Custo: 1 Sucesso PRECISO",
    description: "Uma criatura à sua escolha fica Exposta.",
  },
  {
    name: "SOPRO DE FOGO",
    cost: "Custo: 2 Ações",
    description:
      "ATIRAR PODEROSO a até 2 Pernadas: cause [A] Dano à Parte e queime a PARTE alvejada.",
  },
  {
    name: "TANATOSE",
    cost: "Passiva",
    description:
      "Se estiver Ferido 3 caído, pode forçar a barra no fim do turno (e vice-versa).",
  },
  {
    name: "TECE-TEIAS",
    cost: "Custo: 2 Ações",
    description:
      "Faça MANUFATURAR SAGAZ: próxima criatura hostil que mover na sua direção sofre [A] Dano à Parte e fica imóvel.",
  },
  {
    name: "TERRITORIAL",
    cost: "Passiva",
    description:
      "Você tem Vantagem em todos os Testes contra intrusos na sua Toca.",
  },
  {
    name: "VELOCIDADE",
    cost: "Custo: 1 Sucesso LIGEIRO",
    description: "Você pode se Mover sem gastar uma Ação.",
  },
  {
    name: "VENENO",
    cost: "Custo: 1 Sucesso em ATIRAR ou GOLPEAR",
    description: "A criatura atingida fica Envenenada (níveis 1 a 3).",
  },
  {
    name: "VOAR",
    cost: "Passiva",
    description:
      "Você pode voar (nível 2: move 2 Pernadas; nível 3: Vantagem em Atravessar).",
  },
];

export const ORIGIN_TABLE_CREATION = [
  {
    roll: 1,
    text: "Estévia Selvagem, você forrageou enquanto brincava na vegetação baixa. Seus pais lhe disseram para nunca pegar uma segunda antes de terminar a primeira.",
    skill: "procurar",
  },
  {
    roll: 2,
    text: "Peixe Salgado, seco ao sol preso entre os seus dentes enquanto você subia pelas cordas. Seu capitão não gostava de fogo no navio.",
    skill: "agarrar",
  },
  {
    roll: 3,
    text: "Queijo e uma fatia de pão, comidos enquanto seu rebanho de wooda balia à sua volta. Em dias agradáveis, você mastigava devagar aproveitando a brisa.",
    skill: "atravessar",
  },
  {
    roll: 4,
    text: "Cozido Fino, servido da cozinha comunitária da cidade-estação. Havia órfãos reunidos ao redor das estações para pedir esmolas.",
    skill: "golpear",
  },
  {
    roll: 5,
    text: "Fraldinha decorada com folha d’ouro. Seu jantar sempre chegava quente da cozinha da mansão, mas os olhares da família eram frios.",
    skill: "armazenar",
  },
  {
    roll: 6,
    text: "Massa folhada trançada, salpicada com canela. Com sua voz rouca de anunciar produtos, você sempre roubou um pedaço no fim do turno no mercado.",
    skill: "chamar",
  },
  {
    roll: 7,
    text: "Chá de Flor de Menta, que alivia dores e machucados. O apotecário ensinou os usos de todas as plantas que você trazia para ele.",
    skill: "curar",
  },
  {
    roll: 8,
    text: "Bolinhos no vapor, comidos enquanto você esperava. Você jantou na varanda todas as noites por um ano até aceitar que seus pais não voltariam.",
    skill: "assegurar",
  },
  {
    roll: 9,
    text: "Laranjas-melão, tão grandes quanto uma cabeça, colhidas dos jardins do templo. Você servia as fatias em pratos que você mesmo fazia.",
    skill: "manufaturar",
  },
  {
    roll: 10,
    text: "Carne-seca na sela, feita da carne que caçou na trilha. Sua montaria monstruosa ainda vive ao seu lado.",
    skill: "atirar",
  },
  {
    roll: 11,
    text: "Verduras cozidas e um copo de leite, servidos no internato do Cartel em uma dieta supostamente otimizada pela ciência.",
    skill: "curar",
  },
  {
    roll: 12,
    text: "Ovos mexidos, com pedacinhos de casca. Quando treinava malabarismo, seu mentor o fazia comer todos os ovos caídos.",
    skill: "exibir",
  },
  {
    roll: 13,
    text: "Peixe-Cão, decorado para parecer milagroso. Se o golpe falhasse, comia a refeição e tentava de novo na manhã seguinte.",
    skill: "exibir",
  },
  {
    roll: 14,
    text: "Vegetais fermentados, perfumados com tempero. Os aldeões sempre compartilhavam picles caseiros.",
    skill: "manufaturar",
  },
  {
    roll: 15,
    text: "Arroz duro e insosso misturado com serragem pelos guardas da prisão. Você comia para ter forças para fugir.",
    skill: "golpear",
  },
  {
    roll: 16,
    text: "Macarrão frito com cebolinha e linguiça. Nos dias de caça farta, irmãos brigavam pelos melhores pedaços.",
    skill: "atirar",
  },
  {
    roll: 17,
    text: "Cozido estridente, roubado dos trens com um companheiro clandestino. Os vagões eram sua maior despensa.",
    skill: "atravessar",
  },
  {
    roll: 18,
    text: "Caranguejos do rio escaldados, pescados com as próprias mãos no mangue com dedos cheios de cortes.",
    skill: "agarrar",
  },
  {
    roll: 19,
    text: "Bolos de feijão estampados com selos sagrados que você aprendeu a desenhar de cabeça.",
    skill: "assegurar",
  },
  {
    roll: 20,
    text: "Vermes que se contorciam em sua boca. Guardiões usavam você para explorar os mistérios mais profundos do mundo.",
    skill: "estudar",
  },
];

export const ORIGIN_TABLE_INITIATION = [
  {
    roll: 1,
    text: "Com seus pais guiando suas mãos, honrando o juramento sagrado de proteger os ermos.",
    skill: "manufaturar",
  },
  {
    roll: 2,
    text: "Com seus pais confirmando sua vontade, adotado por ferais que hesitaram em forçá-lo a esta vida.",
    skill: "assegurar",
  },
  {
    roll: 3,
    text: "Com seus pais rosnando, confusos. Adotado por monstros, aprendeu coisas humanas para protegê-los.",
    skill: "chamar",
  },
  {
    roll: 4,
    text: "Com seus pais em silêncio e rostos pálidos. Bocas demais para alimentar fizeram você partir para a trilha.",
    skill: "procurar",
  },
  {
    roll: 5,
    text: "Diagnosticado com o frenesi, juntou-se à matilha sob a condição de mantê-lo sob controle.",
    skill: "curar",
  },
  {
    roll: 6,
    text: "Para salvar sua vila, estudou tudo sobre o monstro em frenesi antes de cozinhá-lo e comê-lo.",
    skill: "estudar",
  },
  {
    roll: 7,
    text: "Para vingar sua vila destruída. Quando matou e comeu o monstro, a carne tinha gosto de cinzas.",
    skill: "atirar",
  },
  {
    roll: 8,
    text: "Para destruir a ganância dos vizinhos que ameaçavam a terra, fez da selva parte de si para salvá-la.",
    skill: "exibir",
  },
  {
    roll: 9,
    text: "Como punição por um crime terrível: servir como feral ou ser entregue ao Cartel.",
    skill: "golpear",
  },
  {
    roll: 10,
    text: "Para evitar punição fugindo de casa, comer qualquer carne encontrada era o único jeito de sobreviver.",
    skill: "agarrar",
  },
  {
    roll: 11,
    text: "Por ordem do seu oficial do exército. Dentre todos os soldados do experimento, só você sobreviveu.",
    skill: "atirar",
  },
  {
    roll: 12,
    text: "Após assinar um contrato com patrono rico prometendo riquezas pela caçada.",
    skill: "armazenar",
  },
  {
    roll: 13,
    text: "Para curar seu corpo após lesão grave ou doença debilitante onde o banquete era a única cura.",
    skill: "curar",
  },
  {
    roll: 14,
    text: "Para estudar a Lei Una em primeira mão como acadêmico pesquisador.",
    skill: "estudar",
  },
  {
    roll: 15,
    text: "Para ver a Terra Una e transformar o corpo para sobreviver aos ermos.",
    skill: "atravessar",
  },
  {
    roll: 16,
    text: "Com a cria no colo, jurou acolher e criar o filhote órfão do monstro que abateu.",
    skill: "chamar",
  },
  {
    roll: 17,
    text: "Marcado por presságio ao nascer, recebeu treinamento desde a juventude.",
    skill: "armazenar",
  },
  {
    roll: 18,
    text: "Acidentalmente: comeu carne de monstro infectado sem saber até as mutações começarem.",
    skill: "procurar",
  },
  {
    roll: 19,
    text: "Pela glória da caçada: no primeiro combate descobriu que nunca se sentiu tão vivo.",
    skill: "golpear",
  },
  {
    roll: 20,
    text: "Em luto pelo melhor amigo morto pelo frenesi, tornou-se feral em sua homenagem.",
    skill: "assegurar",
  },
];

export const ORIGIN_TABLE_AMBITION = [
  {
    roll: 1,
    text: "Cumbucas de arroz-maluco em mesa acolhedora, esperando um dia confiar em alguém para partilhar.",
    skill: "procurar",
  },
  {
    roll: 2,
    text: "Um sanduíche em piquenique na árvore da infância, querendo presenciar o dia em que a árvore se curar.",
    skill: "agarrar",
  },
  {
    roll: 3,
    text: "Carpaccio de caça caçado pelo monstro jovem sob seus cuidados, sabendo que ele agora pode se cuidar.",
    skill: "chamar",
  },
  {
    roll: 4,
    text: "Carne assada de um monstro zênite, consumida onde ele caiu, cantando seu nome pela eternidade.",
    skill: "exibir",
  },
  {
    roll: 5,
    text: "Salada verde fresca do seu próprio jardim, querendo cultivar tanto quanto sabe caçar.",
    skill: "manufaturar",
  },
  {
    roll: 6,
    text: "Uma antiga receita de família mantida em segredo.",
    skill: "manufaturar",
  },
  {
    roll: 7,
    text: "Compotas de luxo roubadas do Cartel e compartilhadas com os rebeldes em um banquete triunfal.",
    skill: "atirar",
  },
  {
    roll: 8,
    text: "Um caneco de hidromel com um feral lendário que admira, contando histórias de cada troféu.",
    skill: "armazenar",
  },
  {
    roll: 9,
    text: "Água de uma nascente no pico mais alto do mundo após escalar até o topo.",
    skill: "atravessar",
  },
  {
    roll: 10,
    text: "Bem-casados de pêssego com seu amor na cabeceira da mesa, torcendo para que as mutações não impeçam isso.",
    skill: "assegurar",
  },
  {
    roll: 11,
    text: "Vinho brindando à vitória após humilhar seus inimigos diante de grande plateia.",
    skill: "exibir",
  },
  {
    roll: 12,
    text: "Uma refeição com ingredientes que ninguém nunca provou antes em toda a Terra Una.",
    skill: "procurar",
  },
  {
    roll: 13,
    text: "Pratos com crostas de especiarias das cozinhas do palácio para saber como vive a nobreza.",
    skill: "armazenar",
  },
  {
    roll: 14,
    text: "Prato criado por seu antigo mestre que confiou a receita há muito tempo.",
    skill: "estudar",
  },
  {
    roll: 15,
    text: "Tortas roubadas diretamente do prato de um gigante.",
    skill: "agarrar",
  },
  {
    roll: 16,
    text: "Doces confeitados de uma terra distante e lendária.",
    skill: "atravessar",
  },
  {
    roll: 17,
    text: "Chá preparado ao estilo do Cartel que gigantes reservam para reuniões de negócios.",
    skill: "curar",
  },
  {
    roll: 18,
    text: "Maçãs-do-amor compartilhadas como oferenda a um monstro sagrado.",
    skill: "chamar",
  },
  {
    roll: 19,
    text: "Um pedaço do verme tétrico de além dos pórticos esquecidos.",
    skill: "estudar",
  },
  {
    roll: 20,
    text: "O coração cru de um gigante diante de seu próprio povo.",
    skill: "golpear",
  },
];

export const DEFAULT_NEW_CHARACTER: FeralSheet = {
  id: "char-default-1",
  version: 1,
  lastSaved: new Date().toISOString(),
  identity: {
    name: "Feral Sem Nome",
    pronouns: "ele/dele",
    specialty: "Açougueiro",
    packName: "Matilha da Fogueira Solitária",
    packArchetype: "Matilha Livre",
    appearance:
      "Cabelos revoltos, olhos cor de âmbar selvagem e marcas leves de mutação na pele.",
    denDescription: "Acampamento móvel de tendas nas bordas da floresta.",
    notes: "Um feral recém-iniciado na trilha da culinária monstruosa.",
  },
  styles: {
    ligeiro: 1,
    poderoso: 3,
    preciso: 2,
    sagaz: 1,
  },
  skills: {
    agarrar: 1,
    armazenar: 0,
    assegurar: 0,
    atirar: 0,
    atravessar: 1,
    chamar: 0,
    curar: 0,
    estudar: 1,
    exibir: 0,
    golpear: 0,
    manufaturar: 0,
    procurar: 0,
  },
  utensil: {
    type: "Cutelo",
    customName: "Cutelo de Arkaicaço Pesado",
    reach: 1,
    currentDurability: 20,
    maxDurability: 20,
    notes: "Lâmina afiada e pesada com marcas de corte antigo.",
  },
  techniques: [
    {
      id: "tech-initial-1",
      name: "CORTE LIMPO",
      level: "Iniciante",
      cost: "4 Ações",
      description:
        "Faça um GOLPEAR PODEROSO ou GOLPEAR PRECISO contra uma criatura a até 1 Pernada de distância. Se acertar, cause [A] × 2 Dano à Parte. Se falhar, você fica Exposto.",
    },
    {
      id: "tech-initial-2",
      name: "SEM DESPERDÍCIO",
      level: "Iniciante",
      cost: "Passiva",
      description:
        "Depois que terminar O Banquete, você ganha 1 porção deste Ingrediente: O Melhor Pedaço (Receba +1 em qualquer ESTILO).",
    },
  ],
  traits: [
    {
      id: "trait-brio",
      name: "BRIO",
      level: 1,
      cost: "Custo: 1 Sucesso",
      description: "Aumente o resultado do Dado de Ação [A] em 1.",
      isStandard: true,
    },
    {
      id: "trait-tino",
      name: "TINO",
      level: 1,
      cost: "Custo: 1 Sucesso",
      description: "Estabeleça um detalhe relevante sobre a situação na cena.",
      isStandard: true,
    },
    {
      id: "trait-spec-1",
      name: "CHEIRO DE SANGUE",
      level: 1,
      cost: "Passiva",
      description:
        "Você ganha Vantagem em todos os Testes durante a primeira rodada da Caçada caso o lado oponente tenha uma criatura Ferida.",
      isMonstrous: true,
    },
  ],
  vigor: {
    current: 20,
    max: 20,
  },
  conditions: [],
  personality: {
    adjectives: "Cuidadoso, prático e faminto",
    drive:
      "Aprender as técnicas culinárias de cada região e defender seus parças",
    flaw: "Relutância em recuar mesmo quando os monstros superam o grupo",
    habits: "Morde a ponta da colher para verificar a temperatura do cozido",
    youAre: "cuidadoso e prático",
    butYouTryToBe: "decisivo e corajoso",
    tags: ["vigilante", "amigo fiel", "faminto por novidades"],
  },
  familiarBeasts: [
    {
      id: "fb-initial-1",
      name: "Cebola",
      species: "lapu-lapu",
      connectionLevel: 1,
      skills: "Aquecimento de refeições e alarme noturno",
      personality: "Dócil, brincalhão e comilona",
      relation: "Companheiro carinhoso",
      description:
        "Lapu-lapu jovem de lã de aço macia que adora cochilar perto das brasas da fogueira.",
    },
  ],
  food: {
    typicalDish: "Gyoza de peixe selvagem com ervas frescas",
    typicalSeasoning: "Pimenta jao seca em flocos",
  },
  origin: {
    background: "Cozinheiro de guarnição e assistente de forja.",
    reasonForBecomingFeral:
      "Cozinhou com amor um monstro abatido para salvar seus irmãos do inverno rigoroso.",
    missedPast:
      "O cheiro reconfortante da manteiga derretida na cozinha de sua família.",
    creation: "Sopa de arroz com vegetais colhidos na encosta do rio.",
    creationSkill: "procurar",
    initiation: "Cozinhou com amor um monstro abatido para salvar seus irmãos.",
    initiationSkill: "curar",
    ambition: "Provar o banquete de um monstro zênite lendário.",
    ambitionSkill: "golpear",
  },
  connection: {
    partnerName: "Companheiro de Matilha",
    dishReference: "Ensopado de inverno compartilhado",
    description:
      "Dividiram a última porção de comida durante uma nevasca severa.",
  },
  feastHistory: [],
  notes: [],
  notesList: [
    {
      id: "note-1",
      createdAt: "Início da Campanha",
      title: "Primeiros Rastros na Trilha",
      content:
        "Nossa matilha avistou rastros frescos perto da ravina. O aroma das ervas indica que uma caçada se aproxima.",
      category: "Sessão",
    },
  ],
  packState: {
    harmony: 3,
    maxHarmony: 6,
    currentPernada: 1,
    currentTerrain: "Chão",
  },
};
