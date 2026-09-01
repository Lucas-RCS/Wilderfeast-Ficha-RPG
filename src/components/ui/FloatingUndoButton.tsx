import { useEffect, useState } from "react";
import { Undo2 } from "lucide-react";

interface FloatingUndoButtonProps {
  visible: boolean;
  onUndo: () => void;
}

/**
 * Fica ancorado no canto inferior direito da tela. Aparece por alguns
 * segundos a cada novo lote de edições salvo, dando tempo de desfazer sem
 * poluir a tela permanentemente.
 */
export function FloatingUndoButton({
  visible,
  onUndo,
}: FloatingUndoButtonProps) {
  const [justUndone, setJustUndone] = useState(false);

  useEffect(() => {
    if (!visible) setJustUndone(false);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed top-16 right-4 z-40 animate-fadeIn sm:right-6">
      <button
        type="button"
        onClick={() => {
          onUndo();
          setJustUndone(true);
          setTimeout(() => setJustUndone(false), 1200);
        }}
        className="inline-flex items-center cursor-pointer gap-2 pl-3.5 pr-4 py-2.5 rounded-full bg-[#1A1918] border border-[#383430] text-[11px] sm:text-xs font-bold text-[#F5EFEB] hover:border-[#FF9B42] hover:text-[#FF9B42] transition-colors"
      >
        <Undo2 className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline">
          {justUndone ? "Alteração desfeita" : "Desfazer última alteração"}
        </span>
        <span className="sm:hidden">
          {justUndone ? "Desfeito" : "Desfazer"}
        </span>
      </button>
    </div>
  );
}
