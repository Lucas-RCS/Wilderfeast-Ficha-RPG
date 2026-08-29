import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

interface ConfirmButtonProps {
  label: string;
  confirmLabel?: string;
  onConfirm: () => void;
  className?: string;
}

/**
 * Primeiro clique arma a ação e mostra um aviso por alguns segundos;
 * um segundo clique dentro desse tempo confirma. Clicar fora ou deixar
 * o tempo passar cancela.
 */
export function ConfirmButton({
  label,
  confirmLabel = "Clique novamente para confirmar",
  onConfirm,
  className = "",
}: ConfirmButtonProps) {
  const [armed, setArmed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleClick() {
    if (!armed) {
      setArmed(true);
      timeoutRef.current = setTimeout(() => setArmed(false), 3000);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setArmed(false);
    onConfirm();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        armed
          ? `inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#5C2626] border border-[#9B2C2C] text-xs font-bold text-white transition-colors ${className}`
          : `inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#B0645A] hover:bg-[#5C2B26]/30 transition-colors ${className}`
      }
    >
      {armed ? (
        <>
          <AlertTriangle className="w-3.5 h-3.5" />
          {confirmLabel}
        </>
      ) : (
        <>
          <Trash2 className="w-3.5 h-3.5" />
          {label}
        </>
      )}
    </button>
  );
}
