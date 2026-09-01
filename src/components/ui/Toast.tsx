import { Check } from "lucide-react";

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 z-50 mx-auto flex max-w-sm items-center gap-2 rounded-xl border border-[#2B6CB0] bg-[#13335C] px-4 py-3 text-xs font-bold text-white shadow-2xl animate-fadeIn sm:left-auto sm:mx-0 sm:bottom-6 sm:right-6">
      <Check className="w-4 h-4 shrink-0 text-[#FF9B42]" />
      <span className="min-w-0">{message}</span>
    </div>
  );
}

export default Toast;
