import { useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Camera, Check, Cloud } from "lucide-react";

interface SheetHeaderProps {
  eyebrow: string;
  accent: "blue" | "red";
  avatarUrl: string;
  onAvatarChange: (dataUrl: string) => void;
  avatarFallback: string;
  titleValue: string;
  onTitleChange: (value: string) => void;
  titlePlaceholder: string;
  subtitle?: ReactNode;
  onBack: () => void;
  lastSavedAt: Date | null;
  isPending: boolean;
  actions?: ReactNode;
}

const ACCENT_RING: Record<SheetHeaderProps["accent"], string> = {
  blue: "border-[#2B6CB0]/50 hover:border-[#3A7FC9]",
  red: "border-[#9B2C2C]/50 hover:border-[#C9524F]",
};

const MAX_AVATAR_MB = 3;

function HeaderAvatar({
  avatarUrl,
  onChange,
  fallback,
  accent,
}: {
  avatarUrl: string;
  onChange: (dataUrl: string) => void;
  fallback: string;
  accent: SheetHeaderProps["accent"];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Selecione uma imagem.");
      return;
    }
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
      setError(`Máximo ${MAX_AVATAR_MB}MB.`);
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      onChange(typeof event.target?.result === "string" ? event.target.result : "");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        title="Trocar avatar"
        className={`group relative block w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 bg-[#1A1918] transition-colors ${ACCENT_RING[accent]}`}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-serif text-3xl font-black text-[#89B5F7]">
            {fallback}
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="w-5 h-5 text-white" />
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {error && (
        <p className="absolute top-full mt-1 w-24 text-[9px] leading-tight text-[#FF9B42]">
          {error}
        </p>
      )}
    </div>
  );
}

function AutosaveIndicator({
  lastSavedAt,
  isPending,
}: {
  lastSavedAt: Date | null;
  isPending: boolean;
}) {
  if (isPending) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#B0A497]">
        <Cloud className="w-3.5 h-3.5 animate-pulse" />
        Salvando...
      </span>
    );
  }

  if (!lastSavedAt) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#5FA88A]">
      <Check className="w-3.5 h-3.5" />
      Salvo às{" "}
      {lastSavedAt.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  );
}

export function SheetHeader({
  eyebrow,
  accent,
  avatarUrl,
  onAvatarChange,
  avatarFallback,
  titleValue,
  onTitleChange,
  titlePlaceholder,
  subtitle,
  onBack,
  lastSavedAt,
  isPending,
  actions,
}: SheetHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#2B2825] bg-[#121110]/95 backdrop-blur px-4 sm:px-6 py-4">
      <div className="mx-auto flex max-w-5xl items-start gap-4">
        <button
          type="button"
          onClick={onBack}
          title="Voltar ao Hub"
          className="mt-1 shrink-0 rounded-xl p-2 text-[#B0A497] transition-colors hover:bg-[#242220] hover:text-[#F5EFEB]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <HeaderAvatar
          avatarUrl={avatarUrl}
          onChange={onAvatarChange}
          fallback={avatarFallback}
          accent={accent}
        />

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF9B42]">
            {eyebrow}
          </p>
          <input
            value={titleValue}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={titlePlaceholder}
            className="w-full truncate bg-transparent font-serif text-2xl sm:text-3xl font-black text-[#89B5F7] outline-none placeholder-[#4D4741] border-b border-transparent hover:border-[#383430] focus:border-[#FF9B42] transition-colors"
          />
          {subtitle && <div className="mt-2">{subtitle}</div>}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <AutosaveIndicator lastSavedAt={lastSavedAt} isPending={isPending} />
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
