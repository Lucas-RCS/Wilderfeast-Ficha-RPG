import { ArrowLeft, SearchX } from "lucide-react";

interface SheetNotFoundProps {
  label: string;
  onBack: () => void;
}

export function SheetNotFound({ label, onBack }: SheetNotFoundProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A1918] border border-[#383430]">
        <SearchX className="h-6 w-6 text-[#7A7065]" />
      </div>
      <div>
        <h2 className=" text-lg font-black text-[#F5EFEB]">
          {label} não encontrado
        </h2>
        <p className="mt-1 text-xs text-[#8F877D]">
          Este registro pode ter sido excluído ou o link está incorreto.
        </p>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-xl bg-[#242220] border border-[#383430] px-4 py-2.5 text-xs font-bold text-[#F5EFEB] hover:border-[#4D4741] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Hub
      </button>
    </div>
  );
}
