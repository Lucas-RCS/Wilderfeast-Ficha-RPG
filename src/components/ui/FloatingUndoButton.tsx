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
export function FloatingUndoButton({ visible, onUndo }: FloatingUndoButtonProps) {
  const [justUndone, setJustUndone] = useState(false);

  useEffect(() => {
    if (!visible) setJustUndone(false);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-fadeIn">
      <button
        type="button"
        onClick={() => {
          onUndo();
          setJustUndone(true);
          setTimeout(() => setJustUndone(false), 1200);
        }}
        className="inline-flex items-center gap-2 pl-3.5 pr-4 py-2.5 rounded-full bg-[#1A1918] border border-[#383430] shadow-xl shadow-black/40 text-xs font-bold text-[#F5EFEB] hover:border-[#FF9B42] hover:text-[#FF9B42] transition-colors"
      >
        <Undo2 className="w-4 h-4" />
        {justUndone ? "Alteração desfeita" : "Desfazer última alteração"}
      </button>
    </div>
  );
}
