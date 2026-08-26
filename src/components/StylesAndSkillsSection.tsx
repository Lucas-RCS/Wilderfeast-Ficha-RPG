import React from "react";
import {
  Dices,
  Flame,
  Sparkles,
  Zap,
  Crosshair,
  HelpCircle,
  Plus,
  Minus,
} from "lucide-react";
import { FeralSheet, StyleKey, SkillKey } from "../types";

interface StylesAndSkillsSectionProps {
  sheet: FeralSheet;
  onChange: (updated: Partial<FeralSheet>) => void;
  onQuickRoll: (style: StyleKey, skill?: SkillKey) => void;
}

export const StylesAndSkillsSection: React.FC<StylesAndSkillsSectionProps> = ({
  sheet,
  onChange,
  onQuickRoll,
}) => {
  const [activeTooltip, setActiveTooltip] = React.useState<string | null>(null);

  const updateStyle = (key: StyleKey, delta: number) => {
    const current = sheet.styles[key];
    const next = Math.max(1, Math.min(5, current + delta));
    onChange({
      styles: {
        ...sheet.styles,
        [key]: next,
      },
    });
  };

  const setStyleDirect = (key: StyleKey, val: number) => {
    const next = Math.max(1, Math.min(5, isNaN(val) ? 1 : val));
    onChange({
      styles: {
        ...sheet.styles,
        [key]: next,
      },
    });
  };

  const updateSkill = (key: SkillKey, delta: number) => {
    const current = sheet.skills[key];
    const next = Math.max(0, Math.min(3, current + delta));
    onChange({
      skills: {
        ...sheet.skills,
        [key]: next,
      },
    });
  };

  const setSkillDirect = (key: SkillKey, val: number) => {
    const next = Math.max(0, Math.min(3, isNaN(val) ? 0 : val));
    onChange({
      skills: {
        ...sheet.skills,
        [key]: next,
      },
    });
  };

  const stylesMeta: Array<{
    key: StyleKey;
    name: string;
    description: string;
    keywords: string;
    color: string;
    badgeBg: string;
    icon: React.ReactNode;
  }> = [
    {
      key: "ligeiro",
      name: "LIGEIRO",
      description: "Ser rápido, enérgico, alerta ou hábil.",
      keywords: "Velocidade, agilidade, esquiva e destreza.",
      color: "border-amber-500 text-amber-400",
      badgeBg: "bg-amber-500",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      key: "poderoso",
      name: "PODEROSO",
      description: "Ser forte, tenaz, firme ou grosseiro.",
      keywords: "Força bruta, impacto pesado, tenacidade e vigor.",
      color: "border-red-600 text-red-400",
      badgeBg: "bg-red-600",
      icon: <Flame className="w-5 h-5" />,
    },
    {
      key: "preciso",
      name: "PRECISO",
      description: "Ser calmo, metódico, focado ou acurado.",
      keywords: "Mira cuidadosa, anatomia, cirurgia e atenção aos detalhes.",
      color: "border-blue-600 text-blue-400",
      badgeBg: "bg-blue-600",
      icon: <Crosshair className="w-5 h-5" />,
    },
    {
      key: "sagaz",
      name: "SAGAZ",
      description: "Ser sutil, dissimulado, técnico ou astuto.",
      keywords: "Furtividade, armadilhas, fintas e artimanhas.",
      color: "border-emerald-600 text-emerald-400",
      badgeBg: "bg-emerald-600",
      icon: <Sparkles className="w-5 h-5" />,
    },
  ];

  const skillsMeta: Array<{
    key: SkillKey;
    name: string;
    summary: string;
    example: string;
  }> = [
    {
      key: "agarrar",
      name: "AGARRAR",
      summary: "Segurar firme, agarrar criaturas ou objetos.",
      example:
        "Faça um AGARRAR PODEROSO para arrancar suprimentos das presas de um monstro, ou AGARRAR LIGEIRO para roubar chaves em perseguição.",
    },
    {
      key: "armazenar",
      name: "ARMAZENAR",
      summary: "Possuir ou acumular recursos, guardá-los em segurança.",
      example:
        "Faça um ARMAZENAR PRECISO para ter o presente perfeito para um coletor, ou ARMAZENAR SAGAZ para enterrar ovos em segurança.",
    },
    {
      key: "assegurar",
      name: "ASSEGURAR",
      summary: "Acalmar ou encorajar criaturas, inclusive a si mesmo.",
      example:
        "Faça um ASSEGURAR PODEROSO para conter um monstro até que se acalme, ou ASSEGURAR LIGEIRO para renovar a confiança do seu parça.",
    },
    {
      key: "atirar",
      name: "ATIRAR",
      summary: "Atacar à distância, cuspir ou lançar projéteis.",
      example:
        "Faça um ATIRAR PRECISO para acertar uma criatura na asa, ou ATIRAR LIGEIRO para disparar um jato d’água veloz.",
    },
    {
      key: "atravessar",
      name: "ATRAVESSAR",
      summary: "Cruzar distâncias, viajar por terrenos acidentados.",
      example:
        "Faça um ATRAVESSAR PODEROSO para cruzar lama funda, ou ATRAVESSAR SAGAZ para esgueirar-se por jardins guardados.",
    },
    {
      key: "chamar",
      name: "CHAMAR",
      summary:
        "Comunicar-se com monstros, vocalizar, usar Traços sobrenaturais.",
      example:
        "Faça um CHAMAR PRECISO para ecolocalização nos arredores, ou CHAMAR SAGAZ para imitar o canto de uma ave.",
    },
    {
      key: "curar",
      name: "CURAR",
      summary: "Tratar ou curar ferimentos, venenos e toxinas.",
      example:
        "Faça um CURAR PODEROSO para metabolizar uma toxina letal, ou CURAR PRECISO para suturar um corte anatômico.",
    },
    {
      key: "estudar",
      name: "ESTUDAR",
      summary: "Obter conhecimento, avaliar situações, ler pistas e história.",
      example:
        "Faça um ESTUDAR LIGEIRO para identificar um monstro de relance, ou ESTUDAR SAGAZ para observar uma fera sem que perceba.",
    },
    {
      key: "exibir",
      name: "EXIBIR",
      summary: "Fazer uma demonstração, chamar atenção, dar um show.",
      example:
        "Faça um EXIBIR LIGEIRO para cortar vegetais em velocidade vertiginosa, ou EXIBIR SAGAZ para intimidar com uma pose assustadora.",
    },
    {
      key: "golpear",
      name: "GOLPEAR",
      summary: "Atacar de perto, desferir golpes corpo a corpo.",
      example:
        "Faça um GOLPEAR PODEROSO para descarregar toda a sua força, ou GOLPEAR SAGAZ para emboscar pelas costas.",
    },
    {
      key: "manufaturar",
      name: "MANUFATURAR",
      summary: "Criar ou reparar objetos, tecer armadilhas e cozinhar.",
      example:
        "Faça um MANUFATURAR PODEROSO para erguer uma cerca de contenção, ou MANUFATURAR PRECISO para reparar mecanismos de arkaicaço.",
    },
    {
      key: "procurar",
      name: "PROCURAR",
      summary: "Encontrar coisas, rastros, comida, ervas e forragear.",
      example:
        "Faça um PROCURAR PRECISO para distinguir um monstro no rebanho, ou PROCURAR LIGEIRO para coletar peixes rápidos na maré.",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-8">
      {/* SECTION 1: OS QUATRO ESTILOS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-white/10 pb-2">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-amber-300 flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#FF9B42]" />
              ESTILOS (Atributos Primários)
            </h2>
            <p className="text-xs text-zinc-400">
              Cada nível em um Estilo concede <strong>1d6</strong> na sua pilha
              de dados para os Testes. (Varia de 1 a 5).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stylesMeta.map((st) => {
            const val = sheet.styles[st.key];
            return (
              <div
                key={st.key}
                className="bg-[#1E1D1A] rounded-2xl p-4 sm:p-5 border-2 border-white/10 shadow-sm flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden group"
              >
                {/* Decorative top accent line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${st.badgeBg}`}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={st.color}>{st.icon}</span>
                      <h3 className="font-display font-black text-base sm:text-lg tracking-wider text-white">
                        {st.name}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-code">
                      {val}d6
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-snug">
                    {st.description}
                  </p>
                </div>

                {/* Interactive Counter Controls */}
                <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-col gap-3">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateStyle(st.key, -1)}
                      disabled={val <= 1}
                      className="w-9 h-9 rounded-xl bg-zinc-800 text-white border border-white/10 hover:bg-[#F28C28] hover:text-white hover:border-[#F28C28] disabled:opacity-40 disabled:hover:bg-amber-50 disabled:hover:text-[#B0A497] flex items-center justify-center font-bold text-lg transition-all active:scale-95 cursor-pointer"
                      title="Diminuir Estilo"
                      aria-label={`Diminuir ${st.name}`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={val}
                      onChange={(e) =>
                        setStyleDirect(st.key, parseInt(e.target.value, 10))
                      }
                      className="w-14 h-10 text-center font-display font-black text-2xl text-amber-300 bg-black/30 rounded-xl border border-white/15 outline-none focus:ring-2 focus:ring-[#F28C28]"
                    />

                    <button
                      type="button"
                      onClick={() => updateStyle(st.key, 1)}
                      disabled={val >= 5}
                      className="w-9 h-9 rounded-xl bg-zinc-800 text-white border border-white/10 hover:bg-[#F28C28] hover:text-white hover:border-[#F28C28] disabled:opacity-40 disabled:hover:bg-amber-50 disabled:hover:text-[#B0A497] flex items-center justify-center font-bold text-lg transition-all active:scale-95 cursor-pointer"
                      title="Aumentar Estilo"
                      aria-label={`Aumentar ${st.name}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dice visual representation (d6s) */}
                  <div className="flex items-center justify-center gap-1.5 py-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                          i < val
                            ? "bg-[#F28C28] border-[#D47318] text-white shadow-xs scale-105"
                            : "bg-zinc-800 border-zinc-700 opacity-30"
                        }`}
                      >
                        {i < val && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#22201D]" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Roll shortcut button */}
                  <button
                    type="button"
                    onClick={() => onQuickRoll(st.key)}
                    className="w-full py-1.5 px-3 rounded-lg bg-[#173F73]/10 hover:text-white hover:bg-[#F28C28] text-amber-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                  >
                    <Dices className="w-3.5 h-3.5" />
                    <span>Rolar com {st.name}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: AS 12 HABILIDADES */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-white/10 pb-2">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-amber-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              HABILIDADES (Competências Ferais)
            </h2>
            <p className="text-xs text-zinc-400">
              Cada nível de Habilidade adiciona <strong>+1 ponto</strong> de
              bônus aos seus Testes. Você pode combinar qualquer Habilidade com
              qualquer Estilo.
            </p>
          </div>
          <div className="text-xs text-zinc-400 font-medium">
            Níveis variam de +0 a +3
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {skillsMeta.map((sk) => {
            const val = sheet.skills[sk.key];
            const isInfoOpen = activeTooltip === sk.key;

            return (
              <div
                key={sk.key}
                className="bg-[#1E1D1A] rounded-xl p-3.5 border border-white/10 shadow-xs hover:border-[#16857A]/40 transition-all flex flex-col justify-between gap-2.5 relative"
              >
                {/* Header with Title & Info Toggle */}
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xs sm:text-sm text-amber-200 tracking-wide">
                    {sk.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTooltip(isInfoOpen ? null : sk.key)}
                    className="text-zinc-400 hover:text-teal-400 transition-colors p-1 cursor-pointer"
                    title="Ver descrição e exemplos"
                    aria-label={`Ajuda sobre ${sk.name}`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-zinc-300 leading-tight">
                  {sk.summary}
                </p>

                {/* Interactive Tooltip Overlay */}
                {isInfoOpen && (
                  <div className="p-2.5 rounded-lg bg-teal-950/80 border border-teal-800 text-[11px] text-teal-200 space-y-1 animate-in fade-in duration-150">
                    <p className="font-semibold text-teal-300">
                      Exemplo do Livro:
                    </p>
                    <p className="italic leading-snug">{sk.example}</p>
                  </div>
                )}

                {/* Value adjuster & Pips */}
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  {/* Pips */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((pip) => (
                      <div
                        key={pip}
                        className={`w-3 h-3 rounded-full border transition-all ${
                          pip <= val
                            ? "border-teal-700 bg-teal-500 shadow-xs"
                            : "bg-zinc-800 border-zinc-700"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateSkill(sk.key, -1)}
                      disabled={val <= 0}
                      className="w-7 h-7 rounded-lg bg-zinc-800 text-white border border-white/10 hover:bg-teal-600 hover:text-white disabled:opacity-30 flex items-center justify-center font-bold text-xs transition-all active:scale-95 cursor-pointer"
                      title="Diminuir Habilidade"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <span className="font-code font-bold text-sm w-7 text-center text-amber-300">
                      +{val}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateSkill(sk.key, 1)}
                      disabled={val >= 3}
                      className="w-7 h-7 rounded-lg bg-zinc-800 text-white border border-white/10 hover:bg-teal-600 hover:text-white disabled:opacity-30 flex items-center justify-center font-bold text-xs transition-all active:scale-95 cursor-pointer"
                      title="Aumentar Habilidade"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
