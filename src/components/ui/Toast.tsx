import { Check } from "lucide-react";

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#13335C] text-white font-bold text-xs shadow-2xl border border-[#2B6CB0] flex items-center gap-2 animate-fadeIn">
      <Check className="w-4 h-4 text-[#FF9B42]" />
      <span>{message}</span>
    </div>
  );
}

export default Toast;
