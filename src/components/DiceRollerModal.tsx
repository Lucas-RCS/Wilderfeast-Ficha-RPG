import React from "react";
import { Dices, X, TrendingUp, TrendingDown } from "lucide-react";
import { FeralSheet, StyleKey, SkillKey, RollResult } from "../types";
import { executeWilderfeastRoll } from "../lib/diceRoller";

interface DiceRollerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheet: FeralSheet;
  initialStyle?: StyleKey;
  initialSkill?: SkillKey;
  onSaveRollHistory?: (result: RollResult) => void;
}

export const DiceRollerModal: React.FC<DiceRollerModalProps> = ({
  isOpen,
  onClose,
  sheet,
  initialStyle,
  initialSkill,
  onSaveRollHistory,
}) => {
  const [selectedStyle, setSelectedStyle] = React.useState<StyleKey>(
    initialStyle || "ligeiro",
  );
  const [selectedSkill, setSelectedSkill] = React.useState<SkillKey | "none">(
    initialSkill || "none",
  );
  const [actionDieType, setActionDieType] = React.useState<"d8" | "d20">("d8");
  const [hasAdvantage, setHasAdvantage] = React.useState(false);
  const [hasDisadvantage, setHasDisadvantage] = React.useState(false);
  const [modifier, setModifier] = React.useState(0);
  const [rollReason, setRollReason] = React.useState(
    "Ação em Combate ou Trilha",
  );

  const [isRolling, setIsRolling] = React.useState(false);
  const [currentResult, setCurrentResult] = React.useState<RollResult | null>(
    null,
  );
  const [history, setHistory] = React.useState<RollResult[]>([]);

  React.useEffect(() => {
    if (initialStyle) setSelectedStyle(initialStyle);
    if (initialSkill) setSelectedSkill(initialSkill);
  }, [initialStyle, initialSkill]);

  if (!isOpen) return null;

  const stylePool = sheet.styles[selectedStyle] || 1;
  const skillBonus =
    selectedSkill !== "none" ? sheet.skills[selectedSkill] || 0 : 0;

  const handleRoll = () => {
    setIsRolling(true);

    setTimeout(() => {
      const result = executeWilderfeastRoll({
        styleName: selectedStyle.toUpperCase(),
        styleDiceCount: stylePool,
        skillName:
          selectedSkill !== "none" ? selectedSkill.toUpperCase() : undefined,
        skillBonus,
        actionDieType,
        hasAdvantage,
        hasDisadvantage,
        modifier,
        reason: rollReason,
      });

      setCurrentResult(result);
      setHistory((prev) => [result, ...prev.slice(0, 4)]);
      if (onSaveRollHistory) onSaveRollHistory(result);
      setIsRolling(false);
    }, 350);
  };

  const handleAdvantageToggle = () => {
    if (!hasAdvantage) {
      setHasAdvantage(true);
      setHasDisadvantage(false);
    } else {
      setHasAdvantage(false);
    }
  };

  const handleDisadvantageToggle = () => {
    if (!hasDisadvantage) {
      setHasDisadvantage(true);
      setHasAdvantage(false);
    } else {
      setHasDisadvantage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#1C1B18] w-full max-w-xl rounded-3xl border-2 border-white/15 shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="bg-[#13335C] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F28C28] rounded-xl text-white shadow-xs">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg tracking-wide">
                ROLADOR DE DADOS FERAIS
              </h3>
              <p className="text-xs text-amber-200/90">
                Wilderfeast: Pilha de Estilo (d6) + Dado de Ação (
                {actionDieType})
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

        {/* Content Body */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Reason / Context input */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Motivo do Teste / Ação
            </label>
            <input
              type="text"
              value={rollReason}
              onChange={(e) => setRollReason(e.target.value)}
              placeholder="ex: GOLPEAR o monstro, curar parça, agarrar a corda..."
              className="w-full px-3 py-1.5 rounded-xl border border-zinc-700 text-xs bg-black/20 text-white font-medium outline-none focus:ring-2 focus:ring-[#F28C28]"
            />
          </div>

          {/* 1. Escolha do Estilo */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
              1. Escolha o Estilo (Pilha de d6s)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["ligeiro", "poderoso", "preciso", "sagaz"] as StyleKey[]).map(
                (st) => {
                  const isSel = selectedStyle === st;
                  const pool = sheet.styles[st];
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStyle(st)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs capitalize transition-all cursor-pointer ${
                        isSel
                          ? "bg-[#13335C] text-white border-[#173F73] shadow-sm ring-2 ring-[#F28C28]"
                          : "bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-amber-100"
                      }`}
                    >
                      <div>{st}</div>
                      <div className="text-[11px] font-code opacity-80 mt-0.5">
                        {pool}d6
                      </div>
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* 2. Escolha da Habilidade */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
              2. Escolha a Habilidade (Bônus de Sucesso)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedSkill("none")}
                className={`px-2 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  selectedSkill === "none"
                    ? "bg-teal-700 text-white border-teal-700"
                    : "bg-zinc-800 text-zinc-300 border-zinc-700"
                }`}
              >
                Sem Habilidade (+0)
              </button>

              {(Object.keys(sheet.skills) as SkillKey[]).map((sk) => {
                const isSel = selectedSkill === sk;
                const bonus = sheet.skills[sk];
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => setSelectedSkill(sk)}
                    className={`px-2 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      isSel
                        ? "bg-teal-700 text-white border-teal-700 shadow-2xs ring-1 ring-teal-400"
                        : "bg-zinc-800/60 text-zinc-300 border-zinc-700 hover:bg-teal-950/40"
                    }`}
                  >
                    <span>{sk}</span>
                    <span className="ml-1 text-[10px] font-code font-bold text-teal-400">
                      +{bonus}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Dado de Ação & Modificadores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
            {/* Action Die Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                Dado de Ação [A]
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActionDieType("d8")}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    actionDieType === "d8"
                      ? "bg-[#F28C28] text-white border-[#F28C28] shadow-xs"
                      : "bg-zinc-800 text-zinc-300 border-zinc-700"
                  }`}
                >
                  d8 (Feral Normal)
                </button>
                <button
                  type="button"
                  onClick={() => setActionDieType("d20")}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    actionDieType === "d20"
                      ? "bg-red-600 text-white border-red-600 shadow-xs"
                      : "bg-zinc-800 text-zinc-300 border-zinc-700"
                  }`}
                >
                  d20 (Frenesi / Chefe)
                </button>
              </div>
            </div>

            {/* Advantage / Disadvantage */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                Vantagem / Desvantagem
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAdvantageToggle}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    hasAdvantage
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-emerald-50"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Vantagem (+1d6)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDisadvantageToggle}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    hasDisadvantage
                      ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                      : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-rose-50"
                  }`}
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Desvantagem</span>
                </button>
              </div>
            </div>
          </div>

          {/* ROLL TRIGGER BUTTON */}
          <button
            type="button"
            onClick={handleRoll}
            disabled={isRolling}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#F28C28] hover:bg-[#D47318] active:scale-98 text-white font-display font-black text-base sm:text-lg tracking-wider shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Dices className={`w-6 h-6 ${isRolling ? "animate-spin" : ""}`} />
            <span>
              {isRolling ? "Rolando os Dados Ferais..." : "ROLAR TESTE FERAL"}
            </span>
          </button>

          {/* RESULT BREAKDOWN DISPLAY */}
          {currentResult && (
            <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border-2 border-white/10 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-display font-bold text-sm text-amber-300">
                  Resultado do Teste:
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    currentResult.isSuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-amber-600 text-white"
                  }`}
                >
                  {currentResult.isSuccess ? "SUCESSO!" : "FALHA!"}
                </span>
              </div>

              {/* Total Score & Action Die */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">
                    Dado de Ação [A]
                  </span>
                  <div className="text-2xl font-black font-code text-orange-400">
                    {currentResult.actionDieRoll}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-code">
                    (Dano / Efeito)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">
                    Sucessos Extras
                  </span>
                  <div className="text-2xl font-black font-code text-teal-400">
                    {currentResult.extraSuccesses}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-code">
                    (Brio / Tino / Traços)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">
                    Total do Teste
                  </span>
                  <div className="text-2xl font-black font-code text-amber-300">
                    {currentResult.totalScore}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-code">
                    ([A] + Bônus)
                  </span>
                </div>
              </div>

              {/* Dice Pool Visuals */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-500">
                  Dados da Pilha de Estilo:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(currentResult.styleDiceRolls || []).map((d, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center font-code font-black text-sm shadow-2xs ${
                        d >= 5
                          ? "bg-emerald-500 border-emerald-600 text-white"
                          : "bg-zinc-800 border-zinc-700 text-zinc-200"
                      }`}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcome summary explanation */}
              <div className="p-3 rounded-xl bg-zinc-800/80 text-xs text-zinc-300 leading-relaxed space-y-1">
                <p className="font-semibold text-amber-300">
                  {currentResult.outcomeSummary}
                </p>
                {(currentResult.extraSuccesses ?? 0) > 0 && (
                  <p className="text-[11px] text-teal-400">
                    💡 Você tem {currentResult.extraSuccesses} sucesso
                    {(currentResult.extraSuccesses ?? 0) > 1 ? "s" : ""} extra
                    para gastar em <strong>BRIO</strong> (+
                    {currentResult.extraSuccesses} no dano [A]),{" "}
                    <strong>TINO</strong> (detalhe narrativo) ou ativar Traços!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
