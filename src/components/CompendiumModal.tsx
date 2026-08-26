import React from "react";
import {
  BookOpen,
  X,
  Search,
  Utensils,
  Sparkles,
  Dna,
  Activity,
  FileText,
} from "lucide-react";
import {
  UTENSILS_DATA,
  ALL_CONDITIONS_DATA,
  ALL_TECHNIQUES_COMPENDIUM,
  ALL_TRAITS_COMPENDIUM,
} from "../data/wilderfeastData";

interface CompendiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompendiumModal: React.FC<CompendiumModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = React.useState<
    "regras" | "utensilios" | "tecnicas" | "tracos" | "condicoes"
  >("regras");
  const [search, setSearch] = React.useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#1C1B18] w-full max-w-4xl rounded-3xl border-2 border-white/15 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#13335C] text-white p-4 sm:p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F28C28] rounded-xl text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg tracking-wide">
                COMPÊNDIO & REGRAS DE WILDERFEAST
              </h3>
              <p className="text-xs text-amber-200">
                Guia Rápido Oficial para Mestres e Jogadores
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation & Search */}
        <div className="p-4 bg-black/30 border-b border-zinc-800 flex flex-col sm:flex-row gap-3 items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              {
                id: "regras",
                label: "Regras Básicas",
                icon: <FileText className="w-3.5 h-3.5" />,
              },
              {
                id: "utensilios",
                label: "Utensílios",
                icon: <Utensils className="w-3.5 h-3.5" />,
              },
              {
                id: "tecnicas",
                label: "Técnicas",
                icon: <Sparkles className="w-3.5 h-3.5" />,
              },
              {
                id: "tracos",
                label: "Traços",
                icon: <Dna className="w-3.5 h-3.5" />,
              },
              {
                id: "condicoes",
                label: "Condições",
                icon: <Activity className="w-3.5 h-3.5" />,
              },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === t.id
                    ? "bg-[#13335C] text-white shadow-xs"
                    : "bg-zinc-800 text-zinc-300 hover:bg-amber-100 border border-zinc-700"
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar em todo o livro..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-700 text-xs bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-[#F28C28]"
            />
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-zinc-300 text-xs sm:text-sm leading-relaxed">
          {/* TAB 1: REGRAS BÁSICAS */}
          {activeTab === "regras" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-black/30 border border-zinc-700 space-y-2">
                <h4 className="font-display font-black text-sm text-amber-300 uppercase tracking-wide">
                  COMO FUNCIONA O TESTE DE WILDERFEAST (Página 14)
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-200">
                  <li>
                    <strong>Declare a Ação:</strong> O jogador descreve o que
                    seu feral está tentando fazer na ficção.
                  </li>
                  <li>
                    <strong>Escolha o Estilo (Pilha de d6):</strong> O estilo
                    determina quantos dados de 6 faces você rola (de 1 a 5).
                  </li>
                  <li>
                    <strong>Escolha a Habilidade (Bônus +0 a +3):</strong> Se
                    aplicável, a Habilidade adiciona seu valor como bônus fixo.
                  </li>
                  <li>
                    <strong>Role o Dado de Ação [A]:</strong> Role 1d8 (ou 1d20
                    em Frenesi / Chamado Selvagem). Ele define o dano ou alcance
                    de efeito.
                  </li>
                  <li>
                    <strong>Avalie os Sucessos:</strong> Qualquer d6 que tire{" "}
                    <strong>5 ou 6</strong> é 1 Sucesso. Se a soma de (Bônus da
                    Habilidade + Sucessos) for suficiente, você tem êxito!
                  </li>
                  <li>
                    <strong>Gaste Sucessos Extras:</strong> Use sucessos a mais
                    para ativar <strong>BRIO</strong> (+1 ponto no dado de ação
                    [A]), <strong>TINO</strong> (estabelecer detalhe) ou ativar{" "}
                    <strong>Traços</strong>.
                  </li>
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-800 border border-zinc-700 space-y-2">
                  <h4 className="font-display font-bold text-xs text-red-400 uppercase">
                    VIGOR, DANO E FERIMENTOS (Página 50)
                  </h4>
                  <p className="text-xs leading-relaxed">
                    Quando você sofre dano, subtraia do seu Vigor. Se seu Vigor
                    chegar a 0, você recebe 1 nível de <strong>FERIDO</strong> e
                    seu Vigor é restaurado ao máximo! Ao atingir Ferido 3, seu
                    Vigor permanece em 0 e você corre sério risco de vida.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-800 border border-zinc-700 space-y-2">
                  <h4 className="font-display font-bold text-xs text-teal-400 uppercase">
                    A TRILHA & O RECESSO (Página 58)
                  </h4>
                  <p className="text-xs leading-relaxed">
                    A Jornada tem três fases: <strong>A Trilha</strong> (viagem,
                    forrageamento e pistas), <strong>A Caçada</strong> (combate
                    visceral contra o monstro frenético) e{" "}
                    <strong>O Banquete & Recesso</strong> (purificação, cozinhar
                    a carne e adquirir novas mutações e técnicas).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UTENSÍLIOS */}
          {activeTab === "utensilios" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(UTENSILS_DATA).map((utKey) => {
                const u = UTENSILS_DATA[utKey];
                return (
                  <div
                    key={utKey}
                    className="p-4 rounded-2xl bg-zinc-800 border border-zinc-700 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-sm text-amber-300">
                        {u.name}
                      </h4>
                      <span className="text-[11px] font-code font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300">
                        Alcance {u.reach}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-orange-400 italic">
                      {u.theme}
                    </p>
                    <p className="text-xs leading-relaxed text-zinc-300">
                      {u.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: TÉCNICAS */}
          {activeTab === "tecnicas" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ALL_TECHNIQUES_COMPENDIUM.filter(
                (t) =>
                  t.name.toLowerCase().includes(search.toLowerCase()) ||
                  t.description.toLowerCase().includes(search.toLowerCase()) ||
                  t.utensil.toLowerCase().includes(search.toLowerCase()),
              ).map((t, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-zinc-800 border border-zinc-700 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-amber-300">
                      {t.name}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-950 text-teal-300">
                      {t.level}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-orange-400">
                    {t.cost} • {t.utensil}
                  </div>
                  <p className="text-xs text-zinc-300 leading-snug">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: TRAÇOS */}
          {activeTab === "tracos" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ALL_TRAITS_COMPENDIUM.filter(
                (t) =>
                  t.name.toLowerCase().includes(search.toLowerCase()) ||
                  t.description.toLowerCase().includes(search.toLowerCase()),
              ).map((t, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-zinc-800 border border-zinc-700 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-teal-300">
                      {t.name}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300">
                      {t.cost}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-snug">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: CONDIÇÕES */}
          {activeTab === "condicoes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ALL_CONDITIONS_DATA.filter(
                (c) =>
                  c.name.toLowerCase().includes(search.toLowerCase()) ||
                  c.description.toLowerCase().includes(search.toLowerCase()),
              ).map((c, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-zinc-800 border border-zinc-700 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-xs text-amber-300 uppercase">
                      {c.name}
                    </span>
                    <span className="text-[10px] font-semibold text-zinc-500 font-code">
                      Máx Nível: {c.maxLevel}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-snug">
                    {c.description}
                  </p>
                  <div className="text-[11px] text-teal-400 italic pt-1 border-t border-zinc-700/60">
                    <strong>Cura:</strong> {c.removeInfo}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
