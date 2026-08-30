import React from "react";
import { BookOpen } from "lucide-react";

interface RulesButtonProps {
  onOpen: () => void;
}

export const RulesButton: React.FC<RulesButtonProps> = ({ onOpen }) => {
  return (
    <button
      id="btn-floating-rules"
      type="button"
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-40 px-4 py-2.5 cursor-pointer rounded-full bg-[#13335C] hover:bg-[#0E2644] text-white font-bold text-xs flex items-center gap-2 shadow-xl border border-[#2B6CB0] transition-all hover:scale-105"
      title="Consultar Regras e Compêndio"
    >
      <BookOpen className="w-4 h-4 text-[#FF9B42]" />
      <span>Compêndio de Regras</span>
    </button>
  );
};
