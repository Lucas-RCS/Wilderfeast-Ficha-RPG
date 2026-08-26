import React from "react";
import {
  Utensils,
  Wrench,
  Plus,
  Trash2,
  BookPlus,
  Sparkles,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Layers,
} from "lucide-react";
import { FeralSheet } from "../types";
import {
  UTENSILS_DATA,
  ALL_TECHNIQUES_COMPENDIUM,
} from "../data/wilderfeastData";

interface UtensilAndTechniquesSectionProps {
  sheet: FeralSheet;
  onChange: (updated: Partial<FeralSheet>) => void;
  onShowToast: (message: string, onUndo?: () => void) => void;
}

export const UtensilAndTechniquesSection: React.FC<
  UtensilAndTechniquesSectionProps
> = ({ sheet, onChange, onShowToast }) => {
  const [levelFilter, setLevelFilter] = React.useState<string>("all");
  const [showCompendiumPicker, setShowCompendiumPicker] = React.useState(false);
  const [compendiumSearch, setCompendiumSearch] = React.useState("");

  const currentUtensilDef =
    UTENSILS_DATA[sheet.utensil.type] || UTENSILS_DATA["Cutelo"];

  const updateUtensil = (fields: Partial<FeralSheet["utensil"]>) => {
    onChange({
      utensil: {
        ...sheet.utensil,
        ...fields,
      },
    });
  };

  const handleSelectUtensilType = (type: string) => {
    const def = UTENSILS_DATA[type];
    if (!def) return;

    // Check if maxDurability should update (e.g., Panela + Escudo de Aço or standard 20)
    const newMaxDurability = type === "Panela" ? 50 : 20;

    updateUtensil({
      type,
      customName: sheet.utensil.customName || `${type} de Arkaicaço`,
      reach: def.reach,
      maxDurability: newMaxDurability,
      currentDurability: Math.min(
        sheet.utensil.currentDurability,
        newMaxDurability,
      ),
    });
  };

  const handleDurabilityDelta = (delta: number) => {
    const next = Math.max(
      0,
      Math.min(
        sheet.utensil.maxDurability,
        sheet.utensil.currentDurability + delta,
      ),
    );
    updateUtensil({ currentDurability: next });
  };

  const handleRepairUtensil = () => {
    handleDurabilityDelta(1);
    onShowToast(
      "Reparo efetuado (+1 Durabilidade). Custo em combate: 2 Ações.",
    );
  };

  const handleFullRepair = () => {
    updateUtensil({ currentDurability: sheet.utensil.maxDurability });
    onShowToast("Utensílio totalmente restaurado para a durabilidade máxima!");
  };

  const handleAddCustomTechnique = () => {
    const newTech = {
      id: `tech-${Date.now()}`,
      name: "Nova Técnica",
      level: "Iniciante" as const,
      cost: "2 Ações",
      description:
        "Descreva os efeitos mecânicos e narrativos desta técnica...",
      notes: "",
      utensil: sheet.utensil.type,
    };

    onChange({
      techniques: [...sheet.techniques, newTech],
    });
  };

  const handleAddFromCompendium = (
    compTech: (typeof ALL_TECHNIQUES_COMPENDIUM)[0],
  ) => {
    const newTech = {
      id: `tech-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: compTech.name,
      level: compTech.level,
      cost: compTech.cost,
      description: compTech.description,
      notes: `Utensílio: ${compTech.utensil}`,
      utensil: compTech.utensil,
    };

    onChange({
      techniques: [...sheet.techniques, newTech],
    });

    onShowToast(`Técnica "${compTech.name}" adicionada!`);
  };

  const handleUpdateTechnique = (
    id: string,
    fields: Partial<FeralSheet["techniques"][0]>,
  ) => {
    const updated = sheet.techniques.map((t) =>
      t.id === id ? { ...t, ...fields } : t,
    );
    onChange({ techniques: updated });
  };

  const handleDeleteTechnique = (id: string) => {
    const target = sheet.techniques.find((t) => t.id === id);
    if (!target) return;

    const remaining = sheet.techniques.filter((t) => t.id !== id);
    onChange({ techniques: remaining });

    onShowToast(`Técnica "${target.name}" removida.`, () => {
      onChange({ techniques: [...remaining, target] });
    });
  };

  const filteredTechniques = sheet.techniques.filter((t) => {
    if (levelFilter === "all") return true;
    return t.level === levelFilter;
  });

  const durabilityPct = Math.min(
    100,
    Math.max(
      0,
      (sheet.utensil.currentDurability /
        Math.max(1, sheet.utensil.maxDurability)) *
        100,
    ),
  );
  const isBroken = sheet.utensil.currentDurability <= 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-8">
      {/* SECTION 1: UTENSÍLIO DE ARKAICAÇO */}
      <div className="bg-[#1E1D1A] rounded-2xl p-5 sm:p-6 border-2 border-white/10 shadow-sm space-y-5">
        {/* Utensil Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-[#FF9B42]" />
              <h2 className="font-display font-bold text-lg sm:text-xl text-amber-300">
                UTENSÍLIO DE ARKAICAÇO (PARTE DO FERAL)
              </h2>
            </div>
            <p className="text-xs text-zinc-400">
              Metal prateado e regenerativo que serve tanto como arma colossal
              de caça quanto ferramenta de preparo culinário.
            </p>
          </div>

          {/* Quick Repair actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRepairUtensil}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-[#F28C28] hover:text-white text-amber-200 border border-white/10 text-xs font-semibold transition-all cursor-pointer active:scale-95"
              title="Consertar 1 de Durabilidade (Custo: 2 Ações em combate)"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Consertar (+1)</span>
            </button>
            <button
              type="button"
              onClick={handleFullRepair}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-600 hover:text-white text-emerald-300 border border-emerald-700 text-xs font-semibold transition-all cursor-pointer active:scale-95"
              title="Restaurar toda a Durabilidade no Acampamento ou Recesso"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Restaurar Máx</span>
            </button>
          </div>
        </div>

        {/* Utensil Core Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Utensil Type & Name */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                Tipo de Utensílio
              </label>
              <select
                value={sheet.utensil.type}
                onChange={(e) => handleSelectUtensilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#232220] text-white font-bold text-sm focus:ring-2 focus:ring-[#F28C28] outline-none cursor-pointer"
              >
                {Object.keys(UTENSILS_DATA).map((ut) => (
                  <option key={ut} value={ut}>
                    {ut} — {UTENSILS_DATA[ut].theme}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                Nome Personalizado
              </label>
              <input
                type="text"
                value={sheet.utensil.customName}
                onChange={(e) => updateUtensil({ customName: e.target.value })}
                placeholder="ex: O Grande Cortador dos Ermos..."
                className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-black/20 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-[#F28C28]"
              />
            </div>
          </div>

          {/* Stats: Reach & Durability */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                Alcance em Combate
              </label>
              <span className="text-xs font-code font-bold text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800">
                {sheet.utensil.reach} Pernada
                {sheet.utensil.reach > 1 ? "s" : ""} (GOLPEAR/ATIRAR)
              </span>
            </div>

            {/* Durability Tracker */}
            <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-200">
                  Durabilidade Atual:
                </span>
                <span className="font-code font-bold text-sm text-white">
                  {sheet.utensil.currentDurability} /{" "}
                  {sheet.utensil.maxDurability}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                <div
                  className={`h-full transition-all duration-300 ${
                    isBroken
                      ? "bg-red-600"
                      : durabilityPct < 30
                        ? "bg-amber-500"
                        : "bg-[#16857A]"
                  }`}
                  style={{ width: `${durabilityPct}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDurabilityDelta(-5)}
                    className="px-2 py-1 bg-red-950/60 hover:bg-red-200 text-red-300 rounded font-code text-xs font-bold transition-colors cursor-pointer"
                    title="-5 Durabilidade"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDurabilityDelta(-1)}
                    className="p-1 bg-red-950/60 hover:bg-red-200 text-red-300 rounded font-code text-xs font-bold transition-colors cursor-pointer"
                    title="-1 Durabilidade"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="number"
                  min={0}
                  max={sheet.utensil.maxDurability}
                  value={sheet.utensil.currentDurability}
                  onChange={(e) =>
                    updateUtensil({
                      currentDurability: Math.max(
                        0,
                        Math.min(
                          sheet.utensil.maxDurability,
                          parseInt(e.target.value, 10) || 0,
                        ),
                      ),
                    })
                  }
                  className="w-14 h-8 text-center font-code font-bold text-base text-white bg-black/40 rounded-lg border border-zinc-700"
                />

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDurabilityDelta(1)}
                    className="p-1 bg-emerald-950/60 hover:bg-emerald-200 text-emerald-300 rounded font-code text-xs font-bold transition-colors cursor-pointer"
                    title="+1 Durabilidade"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDurabilityDelta(5)}
                    className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-200 text-emerald-300 rounded font-code text-xs font-bold transition-colors cursor-pointer"
                    title="+5 Durabilidade"
                  >
                    +5
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Broken Status Warning */}
          <div className="space-y-2 flex flex-col justify-between">
            <div className="p-3 rounded-xl bg-black/20 border border-white/10 text-xs text-zinc-300 space-y-1.5">
              <p className="font-semibold text-amber-200">
                Sobre o {currentUtensilDef.name}:
              </p>
              <p className="leading-relaxed text-[11px]">
                {currentUtensilDef.description}
              </p>
            </div>

            {/* Warning if broken */}
            {isBroken ? (
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start gap-2 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">UTENSÍLIO QUEBRADO!</span>
                  <p className="text-[11px]">
                    Se tiver Alcance adicional de técnicas, reduz a 1. Esta
                    PARTE causa metade do Dano.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Utensílio intacto e operacional</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: TÉCNICAS DO UTENSÍLIO */}
      <div className="space-y-4">
        {/* Techniques Header & Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-white/10 pb-2">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-amber-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF9B42]" />
              TÉCNICAS DE COMBATE & UTILIDADE
            </h2>
            <p className="text-xs text-zinc-400">
              Técnicas são Traços especiais correspondentes ao seu Utensílio,
              adquiridas por treinamento durante o Recesso.
            </p>
          </div>

          {/* Action Buttons */}
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
              onClick={handleAddCustomTechnique}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F28C28] hover:bg-[#D47318] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Técnica</span>
            </button>
          </div>
        </div>

        {/* Compendium Quick Picker Drawer */}
        {showCompendiumPicker && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#181715] border-2 border-teal-500/30 shadow-md space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-display font-bold text-sm text-amber-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                Catálogo Oficial de Técnicas do Livro
              </h3>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  value={compendiumSearch}
                  onChange={(e) => setCompendiumSearch(e.target.value)}
                  placeholder="Buscar técnica por nome, utensílio ou custo..."
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-zinc-700 text-xs bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
              {ALL_TECHNIQUES_COMPENDIUM.filter(
                (t) =>
                  t.name
                    .toLowerCase()
                    .includes(compendiumSearch.toLowerCase()) ||
                  t.utensil
                    .toLowerCase()
                    .includes(compendiumSearch.toLowerCase()) ||
                  t.cost
                    .toLowerCase()
                    .includes(compendiumSearch.toLowerCase()) ||
                  t.description
                    .toLowerCase()
                    .includes(compendiumSearch.toLowerCase()),
              ).map((ct, idx) => {
                const alreadyAdded = sheet.techniques.some(
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
                          {ct.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 mb-1.5">
                        <span className="font-semibold text-orange-400">
                          ({ct.cost})
                        </span>
                        <span>•</span>
                        <span>{ct.utensil}</span>
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
                          <span>Já Adicionada</span>
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

        {/* Level Filters */}
        <div className="flex items-center gap-2 text-xs font-semibold overflow-x-auto pb-1">
          <span className="text-zinc-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filtrar:
          </span>
          {["all", "Iniciante", "Intermediária", "Avançada"].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                levelFilter === lvl
                  ? "bg-[#13335C] text-white shadow-xs"
                  : "bg-zinc-800 text-zinc-300 hover:bg-amber-100/50 border border-zinc-700"
              }`}
            >
              {lvl === "all" ? "Todas as Técnicas" : lvl}
            </button>
          ))}
        </div>

        {/* Techniques Active List */}
        {filteredTechniques.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900/30 rounded-2xl border-2 border-dashed border-zinc-800 space-y-2">
            <p className="text-sm font-semibold text-zinc-400">
              Nenhuma técnica encontrada neste filtro.
            </p>
            <p className="text-xs text-zinc-400">
              Clique em "+ Adicionar do Livro" para escolher técnicas oficiais
              ou "Criar Técnica" para inventar uma.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTechniques.map((tech) => (
              <div
                key={tech.id}
                className="bg-[#1E1D1A] rounded-2xl p-4 sm:p-5 border border-white/10 shadow-xs hover:border-[#F28C28]/40 transition-all flex flex-col justify-between gap-3 relative group"
              >
                {/* Top: Name, Level, Cost, and Delete */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={tech.name}
                      onChange={(e) =>
                        handleUpdateTechnique(tech.id, { name: e.target.value })
                      }
                      placeholder="Nome da Técnica"
                      className="font-display font-bold text-sm sm:text-base text-amber-300 bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-[#F28C28] outline-none flex-1 pb-0.5"
                    />

                    <div className="flex items-center gap-2">
                      <select
                        value={tech.level}
                        onChange={(e) =>
                          handleUpdateTechnique(tech.id, {
                            level: e.target.value as any,
                          })
                        }
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700 text-amber-200 outline-none cursor-pointer"
                      >
                        <option value="Iniciante">Iniciante</option>
                        <option value="Intermediária">Intermediária</option>
                        <option value="Avançada">Avançada</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleDeleteTechnique(tech.id)}
                        className="text-zinc-400 hover:text-red-400 p-1 transition-colors cursor-pointer"
                        title="Remover Técnica"
                        aria-label={`Remover ${tech.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Cost Field */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-zinc-400">Custo:</span>
                    <input
                      type="text"
                      value={tech.cost}
                      onChange={(e) =>
                        handleUpdateTechnique(tech.id, { cost: e.target.value })
                      }
                      placeholder="ex: 2 Ações, 3 de Vigor, Passiva..."
                      className="px-2.5 py-0.5 rounded-md bg-black/30 border border-zinc-700 font-semibold text-orange-400 text-xs outline-none focus:ring-1 focus:ring-[#F28C28] flex-1 max-w-[200px]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Efeito da Técnica
                  </label>
                  <textarea
                    rows={3}
                    value={tech.description}
                    onChange={(e) =>
                      handleUpdateTechnique(tech.id, {
                        description: e.target.value,
                      })
                    }
                    placeholder="Descreva o efeito..."
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-black/20 text-xs text-zinc-200 leading-relaxed outline-none focus:ring-1 focus:ring-[#F28C28] resize-none"
                  />
                </div>

                {/* Notes if any */}
                <div>
                  <input
                    type="text"
                    value={tech.notes || ""}
                    onChange={(e) =>
                      handleUpdateTechnique(tech.id, { notes: e.target.value })
                    }
                    placeholder="Observações adicionais / gatilhos..."
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
