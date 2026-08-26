import React from "react";
import { BookOpen } from "lucide-react";

interface FloatingControlsProps {
  onOpenCompendium: () => void;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  onOpenCompendium,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 print:hidden flex items-center gap-2">
      <button
        id="btn-floating-compendium"
        type="button"
        onClick={onOpenCompendium}
        className="px-4 py-2.5 rounded-full bg-[#13335C] hover:bg-[#0E2644] text-white font-bold text-xs flex items-center gap-2 shadow-xl border border-[#2B6CB0] transition-all hover:scale-105"
        title="Consultar Regras e Compêndio"
      >
        <BookOpen className="w-4 h-4 text-[#FF9B42]" />
        <span>Compêndio de Regras</span>
      </button>
    </div>
  );
};
