import React from "react";
import {
  Dna,
  Sparkles,
  Plus,
  Trash2,
  BookPlus,
  Search,
  CheckCircle2,
  Layers,
  Minus,
} from "lucide-react";
import { FeralSheet } from "../types";
import { ALL_TRAITS_COMPENDIUM } from "../data/wilderfeastData";

interface TraitsSectionProps {
  sheet: FeralSheet;
  onChange: (updated: Partial<FeralSheet>) => void;
  onShowToast: (message: string, onUndo?: () => void) => void;
}

export const TraitsSection: React.FC<TraitsSectionProps> = ({
  sheet,
  onChange,
  onShowToast,
}) => {
  const [showCompendiumPicker, setShowCompendiumPicker] = React.useState(false);
  const [compendiumSearch, setCompendiumSearch] = React.useState("");

  const handleAddCustomTrait = () => {
    const newTrait = {
      id: `trait-${Date.now()}`,
      name: "Novo Traço Monstruoso",
      level: 1,
      cost: "Passiva",
      description:
        "Descreva a mutação e os efeitos mecânicos e narrativos concedidos pela carne monstruosa...",
      notes: "",
      isMonstrous: true,
    };
    onChange({ traits: [...sheet.traits, newTrait] });
  };

  const handleAddFromCompendium = (
    compTrait: (typeof ALL_TRAITS_COMPENDIUM)[0],
  ) => {
    const newTrait = {
      id: `trait-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: compTrait.name,
      level: 1,
      cost: compTrait.cost,
      description: compTrait.description,
      notes: "",
      isStandard: compTrait.isStandard,
      isMonstrous: !compTrait.isStandard,
    };

    onChange({ traits: [...sheet.traits, newTrait] });
    onShowToast(`Traço "${compTrait.name}" adicionado à ficha!`);
  };

  const handleUpdateTrait = (
    id: string,
    fields: Partial<FeralSheet["traits"][0]>,
  ) => {
    const updated = sheet.traits.map((t) =>
      t.id === id ? { ...t, ...fields } : t,
    );
    onChange({ traits: updated });
  };

  const handleDeleteTrait = (id: string) => {
    const target = sheet.traits.find((t) => t.id === id);
    if (!target) return;

    if (target.isStandard) {
      onShowToast(
        "BRIO e TINO são traços padrão fundamentais e não devem ser excluídos.",
      );
      return;
    }

    const remaining = sheet.traits.filter((t) => t.id !== id);
    onChange({ traits: remaining });

    onShowToast(`Traço "${target.name}" removido.`, () => {
      onChange({ traits: [...remaining, target] });
    });
  };

  const standardTraits = sheet.traits.filter(
    (t) => t.isStandard || t.name === "BRIO" || t.name === "TINO",
  );
  const monstrousTraits = sheet.traits.filter(
    (t) => !t.isStandard && t.name !== "BRIO" && t.name !== "TINO",
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-8">
      {/* SECTION 1: TRAÇOS BÁSICOS & PADRÃO (BRIO & TINO) */}
      <div className="bg-[#1E1D1A] rounded-2xl p-5 sm:p-6 border-2 border-white/10 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Sparkles className="w-5 h-5 text-teal-400" />
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-amber-300">
              TRAÇOS PADRÃO (HUMANOS & CRIATURAS)
            </h2>
            <p className="text-xs text-zinc-400">
              Presentes em toda criatura viva (BRIO) e em todo ser humano
              (TINO). Gastam sucessos extras obtidos nos Testes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BRIO Card */}
          <div className="p-4 rounded-xl bg-black/30 border border-amber-700/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-display font-black text-sm text-amber-300 tracking-wider">
                BRIO
              </span>
              <span className="text-[11px] font-semibold font-code px-2 py-0.5 rounded-full bg-[#F28C28] text-white">
                Custo: 1 Sucesso
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              Aumenta o resultado do seu Dado de Ação{" "}
              <strong>[A] em +1 ponto</strong> por sucesso adicional gasto.
            </p>
            <p className="text-[11px] text-zinc-400 italic">
              Representa a vontade pura de viver, bater mais forte, correr mais
              rápido ou forçar o impacto.
            </p>
          </div>

          {/* TINO Card */}
          <div className="p-4 rounded-xl bg-black/30 border border-teal-700/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-display font-black text-sm text-teal-300 tracking-wider">
                TINO
              </span>
              <span className="text-[11px] font-semibold font-code px-2 py-0.5 rounded-full bg-[#16857A] text-white">
                Custo: 1 Sucesso
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              Estabeleça um <strong>detalhe relevante sobre a situação</strong>,
              ponto fraco do monstro ou conexão na narrativa.
            </p>
            <p className="text-[11px] text-zinc-400 italic">
              Representa a inteligência humana, perspicácia e leitura do
              ambiente.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: TRAÇOS MONSTRUOSOS & MUTAÇÕES */}
      <div className="space-y-4">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-white/10 pb-2">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-amber-300 flex items-center gap-2">
              <Dna className="w-5 h-5 text-teal-400" />
              MUTAÇÕES & TRAÇOS MONSTRUOSOS HERDADOS
            </h2>
            <p className="text-xs text-zinc-400">
              Qualidades adquiridas ao purificar e consumir monstros no Banquete
              Feral ou por mutação de linhagem.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCompendiumPicker(!showCompendiumPicker)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16857A] hover:bg-[#10635B] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <BookPlus className="w-3.5 h-3.5" />
              <span>
                {showCompendiumPicker
                  ? "Fechar Compêndio"
                  : "Adicionar do Livro"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleAddCustomTrait}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F28C28] hover:bg-[#D47318] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Traço</span>
            </button>
          </div>
        </div>

        {/* Compendium Trait Picker Drawer */}
        {showCompendiumPicker && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#15191C] border-2 border-teal-500/30 shadow-md space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-display font-bold text-sm text-teal-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                Catálogo de Traços Monstruosos (Apêndice A)
              </h3>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  value={compendiumSearch}
                  onChange={(e) => setCompendiumSearch(e.target.value)}
                  placeholder="Buscar traço por nome, custo ou efeito..."
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-zinc-700 text-xs bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
              {ALL_TRAITS_COMPENDIUM.filter((t) => !t.isStandard)
                .filter(
                  (t) =>
                    t.name
                      .toLowerCase()
                      .includes(compendiumSearch.toLowerCase()) ||
                    t.cost
                      .toLowerCase()
                      .includes(compendiumSearch.toLowerCase()) ||
                    t.description
                      .toLowerCase()
                      .includes(compendiumSearch.toLowerCase()),
                )
                .map((ct, idx) => {
                  const alreadyAdded = sheet.traits.some(
                    (t) => t.name.toUpperCase() === ct.name.toUpperCase(),
                  );
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#232220] border border-zinc-700/80 shadow-2xs flex flex-col justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-display font-bold text-xs text-amber-300">
                            {ct.name}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
                            {ct.cost}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-snug">
                          {ct.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddFromCompendium(ct)}
                        disabled={alreadyAdded}
                        className={`w-full py-1 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          alreadyAdded
                            ? "bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-default"
                            : "bg-[#16857A] hover:bg-[#10635B] text-white"
                        }`}
                      >
                        {alreadyAdded ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Já Adicionado</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Adicionar à Ficha</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Active Monstrous Traits List */}
        {monstrousTraits.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900/30 rounded-2xl border-2 border-dashed border-zinc-800 space-y-2">
            <p className="text-sm font-semibold text-zinc-400">
              Nenhum traço monstruoso adicional ainda.
            </p>
            <p className="text-xs text-zinc-400">
              Você ganha novos traços a partir da sua Especialidade e ao comer
              novos banquetes ferais no fim de cada caçada.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {monstrousTraits.map((trait) => (
              <div
                key={trait.id}
                className="bg-[#1E1D1A] rounded-2xl p-4 sm:p-5 border border-teal-500/20 shadow-xs hover:border-teal-500 transition-all flex flex-col justify-between gap-3 relative group"
              >
                {/* Header: Name, Level, Cost and Delete */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={trait.name}
                      onChange={(e) =>
                        handleUpdateTrait(trait.id, { name: e.target.value })
                      }
                      placeholder="Nome do Traço"
                      className="font-display font-bold text-sm sm:text-base text-teal-300 bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-teal-500 outline-none flex-1 pb-0.5"
                    />

                    {/* Level control if applicable */}
                    <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-lg border border-zinc-700">
                      <span className="text-[10px] font-bold text-zinc-500">
                        Nível
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateTrait(trait.id, {
                            level: Math.max(1, trait.level - 1),
                          })
                        }
                        className="text-zinc-500 hover:text-white p-0.5 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-code font-bold text-xs text-amber-300 w-4 text-center">
                        {trait.level}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateTrait(trait.id, {
                            level: trait.level + 1,
                          })
                        }
                        className="text-zinc-500 hover:text-white p-0.5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteTrait(trait.id)}
                      className="text-zinc-400 hover:text-red-400 p-1 transition-colors cursor-pointer"
                      title="Remover Traço"
                      aria-label={`Remover ${trait.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Cost Field */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-zinc-400">
                      Custo / Gatilho:
                    </span>
                    <input
                      type="text"
                      value={trait.cost}
                      onChange={(e) =>
                        handleUpdateTrait(trait.id, { cost: e.target.value })
                      }
                      placeholder="ex: Passiva, Custo: 1 Sucesso SAGAZ, 2 Ações..."
                      className="px-2.5 py-0.5 rounded-md bg-black/30 border border-teal-800 font-semibold text-teal-300 text-xs outline-none focus:ring-1 focus:ring-teal-500 flex-1 max-w-[240px]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Efeito da Mutação
                  </label>
                  <textarea
                    rows={3}
                    value={trait.description}
                    onChange={(e) =>
                      handleUpdateTrait(trait.id, {
                        description: e.target.value,
                      })
                    }
                    placeholder="Descreva o efeito e como o traço ajuda na situação..."
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-black/20 text-xs text-zinc-200 leading-relaxed outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                  />
                </div>

                {/* Notes */}
                <div>
                  <input
                    type="text"
                    value={trait.notes || ""}
                    onChange={(e) =>
                      handleUpdateTrait(trait.id, { notes: e.target.value })
                    }
                    placeholder="Monstro doador / detalhes de preparo..."
                    className="w-full px-2 py-1 rounded-lg border border-transparent hover:border-zinc-800 text-[11px] text-zinc-400 italic outline-none bg-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
