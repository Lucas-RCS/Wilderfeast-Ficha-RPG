import React from "react";
import {
  Swords,
  X,
  RotateCcw,
  Footprints,
  Zap,
  Crosshair,
  CheckCircle2,
} from "lucide-react";
import { FeralSheet } from "../types";

interface CombatTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheet: FeralSheet;
  onApplyDamageToVigor: (dmg: number) => void;
}

export const CombatTrackerModal: React.FC<CombatTrackerModalProps> = ({
  isOpen,
  onClose,
  sheet,
  onApplyDamageToVigor,
}) => {
  const [round, setRound] = React.useState(1);
  const [usedActions, setUsedActions] = React.useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [distancePernadas, setDistancePernadas] = React.useState(1);
  const [targetPart, setTargetPart] = React.useState("Couraça Central");
  const [frenzyLevel, setFrenzyLevel] = React.useState(1);

  if (!isOpen) return null;

  const toggleAction = (index: number) => {
    const updated = [...usedActions];
    updated[index] = !updated[index];
    setUsedActions(updated);
  };

  const handleNextRound = () => {
    setRound((prev) => prev + 1);
    setUsedActions([false, false, false]);
  };

  const handleResetCombat = () => {
    setRound(1);
    setUsedActions([false, false, false]);
    setDistancePernadas(1);
    setFrenzyLevel(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#1C1B18] w-full max-w-xl rounded-3xl border-2 border-white/15 shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="bg-red-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-600 rounded-xl text-white shadow-xs">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg tracking-wide">
                PAINEL DE COMBATE & FRENESI
              </h3>
              <p className="text-xs text-red-200">
                Acompanhamento rápido de Ações, Pernadas (Distância) e Rodadas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetCombat}
              className="p-1.5 rounded-lg hover:bg-white/15 text-red-200 hover:text-white transition-colors cursor-pointer"
              title="Reiniciar Combate"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Round & Actions Tracker */}
          <div className="p-4 rounded-2xl bg-black/30 border border-red-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm text-amber-300">
                  RODADA ATUAL:
                </span>
                <span className="font-code font-black text-xl text-red-400">
                  #{round}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextRound}
                className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
              >
                Próxima Rodada ➔
              </button>
            </div>

            {/* Action Points Checkboxes */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Ações do seu Turno (3 Ações por padrão):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {usedActions.map((used, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleAction(idx)}
                    className={`p-3 rounded-xl border text-center font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      used
                        ? "bg-zinc-800 text-zinc-400 border-zinc-300 line-through"
                        : "bg-zinc-800 text-red-400 border-red-800/80 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {used ? (
                        <CheckCircle2 className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <Zap className="w-4 h-4 text-amber-500" />
                      )}
                      <span>Ação {idx + 1}</span>
                    </div>
                    <span className="text-[10px] font-normal opacity-80">
                      {used ? "Gasta" : "Disponível"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pernadas & Distance Tracker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Footprints className="w-4 h-4 text-[#FF9B42]" />
                Distância até o Alvo (Pernadas)
              </label>
              <span className="text-xs font-code font-bold text-teal-400">
                {distancePernadas === 1
                  ? "1 Pernada (Corpo a Corpo)"
                  : `${distancePernadas} Pernadas (Distância)`}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((dist) => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => setDistancePernadas(dist)}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                    distancePernadas === dist
                      ? "bg-[#13335C] text-white border-[#173F73] shadow-xs ring-2 ring-[#F28C28]"
                      : "bg-zinc-800 text-zinc-300 border-zinc-700"
                  }`}
                >
                  <div className="text-sm font-code">{dist}</div>
                  <div className="text-[10px] opacity-80">
                    {dist === 1
                      ? "Corpo a Corpo"
                      : dist === 2
                        ? "Médio"
                        : dist === 3
                          ? "Longo"
                          : "Extremo"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Monster Part Targeted */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-red-600" />
              PARTE do Monstro Alvejada
            </label>
            <input
              type="text"
              value={targetPart}
              onChange={(e) => setTargetPart(e.target.value)}
              placeholder="ex: Mandíbula de Arkaicaço, Asas, Cauda, Espinho Venenoso..."
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-700 text-xs bg-black/20 text-white font-medium outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-[11px] text-zinc-400">
              Quando a Durabilidade de uma PARTE zera, ela é Quebrada,
              desativando Traços perigosos do monstro!
            </p>
          </div>

          {/* Quick Apply Damage to Character */}
          <div className="p-3.5 rounded-xl bg-black/30 border border-zinc-700 space-y-2">
            <span className="text-xs font-bold text-amber-200">
              Sofrer Dano Rápido no seu Vigor:
            </span>
            <div className="flex items-center gap-2">
              {[2, 3, 5, 8].map((dmg) => (
                <button
                  key={dmg}
                  type="button"
                  onClick={() => onApplyDamageToVigor(dmg)}
                  className="flex-1 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-600 hover:text-white text-red-300 text-xs font-code font-bold transition-all cursor-pointer active:scale-95"
                >
                  -{dmg}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
