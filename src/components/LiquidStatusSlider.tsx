import React from "react";
import { Minus, Plus } from "lucide-react";

interface LiquidStatusSliderProps {
  label: string;
  current: number;
  max: number;
  min?: number;
  onChange: (value: number) => void;
  onMaxChange?: (max: number) => void;
  colorTheme?: "red" | "teal" | "orange" | "blue" | "amber";
  subtext?: string;
  allowMaxEdit?: boolean;
  idPrefix?: string;
}

export const LiquidStatusSlider: React.FC<LiquidStatusSliderProps> = ({
  label,
  current,
  max,
  min = 0,
  onChange,
  onMaxChange,
  colorTheme = "red",
  subtext,
  allowMaxEdit = true,
  idPrefix = "slider",
}) => {
  // Safe percentage calculation
  const safeMax = Math.max(1, max);
  const safeCurrent = Math.max(min, Math.min(safeMax, current));
  const percentage = Math.max(
    0,
    Math.min(100, Math.round((safeCurrent / safeMax) * 100)),
  );

  const handleStep = (step: number) => {
    const next = Math.max(min, Math.min(safeMax, safeCurrent + step));
    onChange(next);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onChange(Math.max(min, Math.min(safeMax, val)));
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1 && onMaxChange) {
      onMaxChange(val);
      if (safeCurrent > val) {
        onChange(val);
      }
    }
  };

  // Color schemes
  const themes = {
    red: {
      liquid: "from-red-600 via-rose-500 to-amber-500",
      liquidDark: "from-red-700 via-rose-600 to-amber-600",
      wave: "bg-red-400/40",
      glow: "shadow-red-500/20",
      border: "border-red-900/40",
      textAccent: "text-red-400",
      bgTrack: "bg-black/40",
      badge: "bg-red-950/60 text-red-200",
    },
    teal: {
      liquid: "from-teal-600 via-emerald-500 to-cyan-400",
      liquidDark: "from-teal-700 via-emerald-600 to-cyan-500",
      wave: "bg-teal-300/40",
      glow: "shadow-teal-500/20",
      border: "border-teal-900/40",
      textAccent: "text-teal-400",
      bgTrack: "bg-black/40",
      badge: "bg-teal-950/60 text-teal-200",
    },
    orange: {
      liquid: "from-[#F28C28] via-amber-500 to-yellow-400",
      liquidDark: "from-[#D47318] via-amber-600 to-yellow-500",
      wave: "bg-amber-300/40",
      glow: "shadow-orange-500/20",
      border: "border-orange-900/40",
      textAccent: "text-[#FF9B42]",
      bgTrack: "bg-black/40",
      badge: "bg-orange-950/60 text-orange-200",
    },
    blue: {
      liquid: "from-[#173F73] via-blue-600 to-sky-400",
      liquidDark: "from-[#102B50] via-blue-700 to-sky-500",
      wave: "bg-blue-300/40",
      glow: "shadow-blue-500/20",
      border: "border-blue-900/40",
      textAccent: "text-sky-300",
      bgTrack: "bg-black/40",
      badge: "bg-blue-950/60 text-blue-200",
    },
    amber: {
      liquid: "from-amber-600 via-yellow-500 to-orange-400",
      liquidDark: "from-amber-700 via-yellow-600 to-orange-500",
      wave: "bg-yellow-300/40",
      glow: "shadow-amber-500/20",
      border: "border-amber-900/40",
      textAccent: "text-amber-300",
      bgTrack: "bg-black/40",
      badge: "bg-amber-950/60 text-amber-200",
    },
  };

  const currentTheme = themes[colorTheme] || themes.red;

  return (
    <div className="w-full bg-[#1A1917] rounded-2xl p-3.5 sm:p-4 border border-zinc-800 shadow-xs">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div>
          <span className="text-[11px] font-display font-black tracking-wider uppercase text-zinc-400">
            {label}
          </span>
          {subtext && (
            <p className="text-[10px] text-zinc-500 -mt-0.5">{subtext}</p>
          )}
        </div>

        {/* Counter Display & Quick Controls */}
        <div className="flex items-center gap-1.5 bg-zinc-800/80 px-2 py-1 rounded-xl border border-zinc-700/60">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            disabled={safeCurrent <= min}
            className="w-6 h-6 flex items-center justify-center rounded-lg bg-zinc-700 text-zinc-200 shadow-xs hover:bg-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
            aria-label={`Diminuir ${label}`}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1 text-xs font-code font-bold px-1">
            <input
              type="number"
              id={`${idPrefix}-current`}
              value={safeCurrent}
              onChange={handleInputChange}
              min={min}
              max={safeMax}
              className={`w-10 text-center bg-transparent font-black text-sm outline-none focus:ring-1 focus:ring-[#F28C28] rounded ${currentTheme.textAccent}`}
            />
            <span className="text-zinc-500">/</span>
            {allowMaxEdit && onMaxChange ? (
              <input
                type="number"
                id={`${idPrefix}-max`}
                value={safeMax}
                onChange={handleMaxInputChange}
                min={1}
                max={999}
                className="w-10 text-center bg-transparent text-zinc-400 text-xs font-semibold outline-none focus:ring-1 focus:ring-[#F28C28] rounded"
                title="Editar valor máximo"
              />
            ) : (
              <span className="text-zinc-400 text-xs">{safeMax}</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleStep(1)}
            disabled={safeCurrent >= safeMax}
            className="w-6 h-6 flex items-center justify-center rounded-lg bg-zinc-700 text-zinc-200 shadow-xs hover:bg-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
            aria-label={`Aumentar ${label}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Liquid Reservoir Track Container */}
      <div
        className={`relative w-full h-7 rounded-xl ${currentTheme.bgTrack} ${currentTheme.border} border overflow-hidden flex items-center p-0.5 shadow-inner`}
      >
        {/* Animated Liquid Fill Bar */}
        <div
          className={`h-full rounded-lg bg-gradient-to-r ${currentTheme.liquid} dark:${currentTheme.liquidDark} relative transition-all duration-300 ease-out flex items-center justify-end pr-2 overflow-hidden shadow-xs`}
          style={{ width: `${percentage}%` }}
        >
          {/* Surface Wave Shimmer */}
          <div className="absolute inset-0 opacity-25 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.7)_50%,transparent_100%)] animate-[pulse_2s_infinite]" />

          {/* Surface Meniscus line */}
          {percentage > 0 && percentage < 100 && (
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/60 shadow-[0_0_8px_white]" />
          )}
        </div>

        {/* Overlay Center Percentage */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] font-code font-bold tracking-wider text-zinc-200 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs border border-white/20">
            {percentage}%
          </span>
        </div>

        {/* Native Interactive Range Overlay for Dragging */}
        <input
          type="range"
          min={min}
          max={safeMax}
          value={safeCurrent}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label={`Ajustar ${label}`}
        />
      </div>
    </div>
  );
};
