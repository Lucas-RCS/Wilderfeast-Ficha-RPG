import React from "react";
import {
  Heart,
  ShieldAlert,
  Plus,
  Minus,
  Sparkles,
  AlertOctagon,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { FeralSheet } from "../types";
import { ALL_CONDITIONS_DATA } from "../data/wilderfeastData";

interface VigorAndConditionsSectionProps {
  sheet: FeralSheet;
  onChange: (updated: Partial<FeralSheet>) => void;
  onShowToast: (message: string, onUndo?: () => void) => void;
}

export const VigorAndConditionsSection: React.FC<
  VigorAndConditionsSectionProps
> = ({ sheet, onChange, onShowToast }) => {
  const [selectedConditionToAdd, setSelectedConditionToAdd] =
    React.useState("");

  const updateVigor = (delta: number) => {
    let current = sheet.vigor.current + delta;
    const max = sheet.vigor.max;

    // Check Ferido 3 check
    const feridoCondition = sheet.conditions.find((c) =>
      c.name.toLowerCase().includes("ferido"),
    );
    if (feridoCondition && feridoCondition.level >= 3) {
      if (delta > 0) {
        onShowToast(
          "Enquanto estiver Ferido 3, seu Vigor permanece em 0 e não pode ser recuperado até sair de Ferido 3.",
        );
        return;
      }
    }

    if (current <= 0) {
      // Rule from Page 50: Vigor reaches 0 -> gain 1 level of Ferido, then Vigor restored to max!
      current = max;
      handleApplyCondition("Ferido", 1);
      onShowToast(
        "VIGOR ZERADO! Você recebeu a Condição FERIDO e seu Vigor foi restaurado ao máximo.",
        undefined,
      );
    } else if (current > max) {
      current = max;
    }

    onChange({
      vigor: {
        ...sheet.vigor,
        current: Math.max(0, current),
      },
    });
  };

  const setVigorDirect = (val: number) => {
    const current = Math.max(0, isNaN(val) ? 0 : val);
    onChange({
      vigor: {
        ...sheet.vigor,
        current,
      },
    });
  };

  const setMaxVigor = (val: number) => {
    const max = Math.max(1, isNaN(val) ? 20 : val);
    onChange({
      vigor: {
        ...sheet.vigor,
        max,
        current: Math.min(sheet.vigor.current, max),
      },
    });
  };

  const handleApplyCondition = (name: string, levelChange = 1) => {
    const def = ALL_CONDITIONS_DATA.find(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );
    const existingIndex = sheet.conditions.findIndex(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );

    if (existingIndex >= 0) {
      const existing = sheet.conditions[existingIndex];
      const maxLvl = def?.maxLevel ?? 99;
      const newLevel = Math.min(maxLvl, existing.level + levelChange);

      const updated = [...sheet.conditions];
      updated[existingIndex] = {
        ...existing,
        level: newLevel,
      };
      onChange({ conditions: updated });
    } else {
      const newCond = {
        id: `cond-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: def?.name || name,
        level: levelChange,
        description: def?.description || "Condição especial.",
        notes: def?.removeInfo || "",
      };
      onChange({ conditions: [...sheet.conditions, newCond] });
    }
  };

  const handleRemoveConditionLevel = (id: string, removeAll = false) => {
    const target = sheet.conditions.find((c) => c.id === id);
    if (!target) return;

    if (removeAll || target.level <= 1) {
      const remaining = sheet.conditions.filter((c) => c.id !== id);
      onChange({ conditions: remaining });
      onShowToast(`Condição "${target.name}" removida.`, () => {
        onChange({ conditions: [...remaining, target] });
      });
    } else {
      const updated = sheet.conditions.map((c) =>
        c.id === id ? { ...c, level: c.level - 1 } : c,
      );
      onChange({ conditions: updated });
    }
  };

  const updateHarmony = (delta: number) => {
    const current = sheet.packState.harmony;
    const max = sheet.packState.maxHarmony;
    const next = Math.max(0, Math.min(max, current + delta));

    // If drops to 0, feral gains Dissonante!
    if (next === 0 && current > 0) {
      handleApplyCondition("Dissonante", 1);
      onShowToast(
        "A Harmonia da matilha chegou a 0! Você recebeu a Condição DISSONANTE (Desvantagem em todos os testes).",
      );
    } else if (next > 0 && current === 0) {
      // Remove Dissonante automatically
      const withoutDissonante = sheet.conditions.filter(
        (c) => c.name.toLowerCase() !== "dissonante",
      );
      onChange({
        conditions: withoutDissonante,
        packState: {
          ...sheet.packState,
          harmony: next,
        },
      });
      onShowToast(
        "Harmonia restaurada acima de 0! A Condição DISSONANTE foi removida.",
      );
      return;
    }

    onChange({
      packState: {
        ...sheet.packState,
        harmony: next,
      },
    });
  };

  const feridoLevel =
    sheet.conditions.find((c) => c.name.toLowerCase() === "ferido")?.level || 0;
  const isDissonant = sheet.conditions.some(
    (c) => c.name.toLowerCase() === "dissonante",
  );
  const vigorPercent = Math.min(
    100,
    Math.max(0, (sheet.vigor.current / Math.max(1, sheet.vigor.max)) * 100),
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-8">
      {/* TOP ROW: VIGOR & HARMONIA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VIGOR CARD (2 Cols) */}
        <div className="lg:col-span-2 bg-[#1E1D1A] rounded-2xl p-5 sm:p-6 border-2 border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />
              <div>
                <h2 className="font-display font-bold text-lg sm:text-xl text-amber-300">
                  VIGOR & ENERGIA
                </h2>
                <p className="text-xs text-zinc-400">
                  Saúde e vitalidade. Se o Vigor chegar a 0 por Dano ou gasto de
                  Técnicas, você recebe 1 nível de <strong>FERIDO</strong> e seu
                  Vigor é restaurado ao máximo!
                </p>
              </div>
            </div>

            {/* Ferido State Badge */}
            {feridoLevel > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-red-950/80 border border-red-400 text-red-300 rounded-xl text-xs font-bold font-code animate-bounce">
                <AlertOctagon className="w-4 h-4" />
                <span>FERIDO {feridoLevel} / 3</span>
              </div>
            )}
          </div>

          {/* Vigor Display & Progress */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Nível de Vitalidade
              </span>
              <div className="flex items-baseline gap-1 font-code">
                <span
                  className={`text-3xl sm:text-4xl font-black ${sheet.vigor.current <= 5 ? "text-red-500" : "text-amber-300"}`}
                >
                  {sheet.vigor.current}
                </span>
                <span className="text-zinc-400 text-xl font-bold">/</span>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={sheet.vigor.max}
                  onChange={(e) => setMaxVigor(parseInt(e.target.value, 10))}
                  className="w-14 text-center font-code font-bold text-lg text-zinc-300 bg-transparent border-b border-dashed border-zinc-400 outline-none"
                  title="Editar Vigor Máximo (padrão 20, ou aumentado por Descansado / Banha)"
                />
              </div>
            </div>

            {/* Health Bar */}
            <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden border border-zinc-700 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  sheet.vigor.current <= 5
                    ? "bg-gradient-to-r from-red-600 to-rose-500"
                    : sheet.vigor.current <= 10
                      ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                      : "bg-gradient-to-r from-[#16857A] to-emerald-500"
                }`}
                style={{ width: `${vigorPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Buttons Grid */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800">
            {/* Quick Damage */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-red-400 mr-1">
                Dano / Gasto:
              </span>
              <button
                type="button"
                onClick={() => updateVigor(-1)}
                className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-600 hover:text-white text-red-300 border border-red-800 text-xs font-bold font-code transition-all cursor-pointer active:scale-95"
              >
                -1
              </button>
              <button
                type="button"
                onClick={() => updateVigor(-2)}
                className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-600 hover:text-white text-red-300 border border-red-800 text-xs font-bold font-code transition-all cursor-pointer active:scale-95"
                title="Consequência padrão de falha (-2 Vigor)"
              >
                -2
              </button>
              <button
                type="button"
                onClick={() => updateVigor(-5)}
                className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-600 hover:text-white text-red-300 border border-red-800 text-xs font-bold font-code transition-all cursor-pointer active:scale-95"
              >
                -5
              </button>
            </div>

            {/* Direct Input */}
            <input
              type="number"
              min={0}
              max={sheet.vigor.max}
              value={sheet.vigor.current}
              onChange={(e) => setVigorDirect(parseInt(e.target.value, 10))}
              className="w-16 h-9 text-center font-code font-bold text-base bg-black/30 rounded-xl border border-white/15 outline-none focus:ring-2 focus:ring-red-500"
            />

            {/* Quick Heal */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-emerald-400 mr-1">
                Cura / Refeição:
              </span>
              <button
                type="button"
                onClick={() => updateVigor(1)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-600 hover:text-white text-emerald-300 border border-emerald-800 text-xs font-bold font-code transition-all cursor-pointer active:scale-95"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => updateVigor(5)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-600 hover:text-white text-emerald-300 border border-emerald-800 text-xs font-bold font-code transition-all cursor-pointer active:scale-95"
              >
                +5
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    vigor: { ...sheet.vigor, current: sheet.vigor.max },
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-code transition-all cursor-pointer active:scale-95 shadow-xs"
                title="Restaurar Vigor Máximo"
              >
                Máx
              </button>
            </div>
          </div>
        </div>

        {/* HARMONIA DA MATILHA CARD (1 Col) */}
        <div className="bg-[#1E1D1A] rounded-2xl p-5 sm:p-6 border-2 border-white/10 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-display font-bold text-base text-amber-300">
                  HARMONIA DA MATILHA
                </h3>
                <span className="text-[11px] text-zinc-500">
                  Recurso compartilhado
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mt-2">
              Representa o vínculo do grupo com a natureza. Diminui ao falhar
              após virar o bicho ou ajudar parças; aumenta ao dividir refeições.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/30 border border-amber-700/30 space-y-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateHarmony(-1)}
                disabled={sheet.packState.harmony <= 0}
                className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-amber-500 hover:text-white disabled:opacity-30 flex items-center justify-center font-bold text-base transition-all cursor-pointer active:scale-95"
                title="Diminuir Harmonia (-1)"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 font-code">
                <span
                  className={`text-3xl font-black ${sheet.packState.harmony === 0 ? "text-red-500 animate-pulse" : "text-amber-300"}`}
                >
                  {sheet.packState.harmony}
                </span>
                <span className="text-zinc-400 text-lg font-bold">/</span>
                <span className="text-zinc-300 text-lg font-bold">
                  {sheet.packState.maxHarmony}
                </span>
              </div>

              <button
                type="button"
                onClick={() => updateHarmony(1)}
                disabled={sheet.packState.harmony >= sheet.packState.maxHarmony}
                className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-amber-500 hover:text-white disabled:opacity-30 flex items-center justify-center font-bold text-base transition-all cursor-pointer active:scale-95"
                title="Aumentar Harmonia (+1)"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {sheet.packState.harmony === 0 && (
              <span className="text-[11px] text-red-400 font-bold flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                Harmonia em 0: Ferais ficam Dissonantes!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: CONDIÇÕES DO PERSONAGEM */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-white/10 pb-2">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-amber-300 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-orange-500" />
              CONDIÇÕES EM JOGO
            </h2>
            <p className="text-xs text-zinc-400">
              Efeitos temporários ou progressivos acumulados durante a Trilha e
              a Caçada. Se receber uma condição que já possui, seu nível aumenta
              em +1.
            </p>
          </div>

          <div className="text-xs text-zinc-500 font-medium">
            {sheet.conditions.length} ativa
            {sheet.conditions.length === 1 ? "" : "s"}
          </div>
        </div>

        {/* Quick Add Condition Badge Tray */}
        <div className="bg-[#1E1D1A] rounded-2xl p-4 border border-white/10 shadow-xs space-y-2">
          <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            Adicionar Condição Rápida (Clique para aplicar):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_CONDITIONS_DATA.map((cond) => {
              const active = sheet.conditions.find(
                (c) => c.name.toLowerCase() === cond.name.toLowerCase(),
              );
              return (
                <button
                  key={cond.name}
                  type="button"
                  onClick={() => handleApplyCondition(cond.name, 1)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer active:scale-95 ${
                    active
                      ? "bg-amber-600 text-white shadow-xs scale-105"
                      : "bg-zinc-800 text-zinc-300 hover:bg-[#F28C28] hover:text-white border border-zinc-700"
                  }`}
                  title={cond.description}
                >
                  <span>{cond.name}</span>
                  {active && (
                    <span className="bg-black/30 text-white px-1.5 py-0.2 rounded-full text-[10px] font-code">
                      {active.level}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Conditions Cards */}
        {sheet.conditions.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900/30 rounded-2xl border-2 border-dashed border-zinc-800 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-zinc-300">
              Nenhuma condição ativa no momento.
            </p>
            <p className="text-xs text-zinc-400">
              Você está são, descansado e pronto para a próxima caçada.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sheet.conditions.map((cond) => {
              const def = ALL_CONDITIONS_DATA.find(
                (c) => c.name.toLowerCase() === cond.name.toLowerCase(),
              );
              const isFerido = cond.name.toLowerCase() === "ferido";
              const isDissonante = cond.name.toLowerCase() === "dissonante";

              return (
                <div
                  key={cond.id}
                  className={`rounded-2xl p-4 border shadow-xs flex flex-col justify-between gap-3 transition-all ${
                    isFerido
                      ? "bg-red-950/40 border-red-800"
                      : isDissonante
                        ? "bg-purple-950/40 border-purple-800"
                        : "bg-[#1E1D1A] border-zinc-700"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-black text-sm text-amber-300 uppercase tracking-wide">
                          {cond.name}
                        </span>
                        <span className="text-xs font-code font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                          Nível {cond.level}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveConditionLevel(cond.id, false)
                          }
                          className="w-6 h-6 rounded-md bg-zinc-800 hover:bg-zinc-200 text-zinc-300 flex items-center justify-center text-xs font-bold cursor-pointer"
                          title="Diminuir 1 nível"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyCondition(cond.name, 1)}
                          className="w-6 h-6 rounded-md bg-zinc-800 hover:bg-zinc-200 text-zinc-300 flex items-center justify-center text-xs font-bold cursor-pointer"
                          title="Aumentar 1 nível"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveConditionLevel(cond.id, true)
                          }
                          className="text-zinc-400 hover:text-red-600 p-1 cursor-pointer"
                          title="Remover condição por completo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-snug font-medium">
                      {cond.description || def?.description}
                    </p>
                  </div>

                  {/* Removal Rules */}
                  {(cond.notes || def?.removeInfo) && (
                    <div className="p-2 rounded-lg bg-black/20 text-[11px] text-zinc-400 space-y-0.5">
                      <span className="font-bold text-amber-300">
                        Como remover:{" "}
                      </span>
                      <p className="italic leading-tight">
                        {cond.notes || def?.removeInfo}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
