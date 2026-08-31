import { useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  Cloud,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";

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

const MAX_AVATAR_MB = 3;

const ACCENT_STYLES = {
  blue: {
    primary: "#89B5F7",
    soft: "#13335C",
    ring: "ring-[#89B5F7]/30",
    border: "border-[#2B6CB0]/50",
    glow: "shadow-[0_0_34px_rgba(43,108,176,0.12)]",
  },
  red: {
    primary: "#FF8B7A",
    soft: "#5C2626",
    ring: "ring-[#FF8B7A]/30",
    border: "border-[#9B2C2C]/50",
    glow: "shadow-[0_0_34px_rgba(155,44,44,0.12)]",
  },
} as const;

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
  const theme = ACCENT_STYLES[accent];

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Selecione uma imagem válida.");
      return;
    }

    if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
      setError(`Máximo ${MAX_AVATAR_MB}MB.`);
      return;
    }

    setError(null);

    const reader = new FileReader();

    reader.onload = (event) => {
      onChange(
        typeof event.target?.result === "string" ? event.target.result : "",
      );
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="relative shrink-0 ">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        title="Trocar avatar"
        className={`group cursor-pointer relative grid h-[72px] w-[72px] place-items-center overflow-hidden rounded-2xl bg-[#1A1918] transition-all duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 ${theme.ring} sm:h-[88px] sm:w-[88px] sm:rounded-[20px] lg:h-[96px] lg:w-[96px]`}
        style={{
          boxShadow: `inset 0 0 0 1px ${theme.primary}45`,
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.07),transparent_50%),#1D1B19]  text-3xl font-black sm:text-4xl"
            style={{ color: theme.primary }}
          >
            {fallback}
          </span>
        )}

        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <span className="absolute bottom-1.5 right-1.5 grid h-7 w-7 place-items-center rounded-lg bg-black/65 text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <Camera className="h-3.5 w-3.5" />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            handleFile(file);
          }

          e.currentTarget.value = "";
        }}
      />

      {error && (
        <p className="absolute left-0 top-full z-20 mt-2 w-40 rounded-lg border border-[#7A4034] bg-[#251715] px-2 py-1.5 text-[9px] font-semibold leading-tight text-[#FFB29D] shadow-xl">
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
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3B3935] bg-[#1A1918]/80 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#B0A497] shadow-sm">
        <Cloud className="h-3.5 w-3.5 animate-pulse" />
        Salvando
      </span>
    );
  }

  if (!lastSavedAt) return null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#275442]/70 bg-[#10251D]/80 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#7DD7AB] shadow-sm">
      <Check className="h-3.5 w-3.5" />
      Salvo{" "}
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
  const theme = ACCENT_STYLES[accent];

  return (
    <header className="sticky top-0 z-30 w-full bg-[#121110]/95 backdrop-blur-xl">
      <div className="relative w-full">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-80"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${theme.primary}30 20%, ${theme.primary}80 50%, ${theme.primary}30 80%, transparent 100%)`,
          }}
        />

        <div className="flex w-full items-center gap-2 px-2.5 pt-2 sm:px-3.5">
          <button
            type="button"
            onClick={onBack}
            title="Voltar ao Hub"
            className="group cursor-pointer grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-transparent text-[#8F877D] transition-all duration-200 hover:border-[#383430] hover:bg-[#242220] hover:text-[#F5EFEB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#89B5F7]/30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="h-4 w-px bg-[#383430]" />

          <div className="flex min-w-0 items-center gap-1.5">
            <Sparkles
              className="h-3.5 w-3.5"
              style={{ color: theme.primary }}
            />

            <p className="truncate text-[9px] font-black uppercase tracking-[0.22em] text-[#8F877D]">
              {eyebrow}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <AutosaveIndicator
              lastSavedAt={lastSavedAt}
              isPending={isPending}
            />

            {actions && (
              <div className="hidden items-center gap-2 sm:flex">{actions}</div>
            )}

            {actions && (
              <div className="sm:hidden">
                <details className="relative">
                  <summary className="grid h-8 w-8 cursor-pointer list-none place-items-center rounded-lg border border-[#383430] bg-[#1C1A18] text-[#B0A497] transition-colors hover:bg-[#242220] hover:text-[#F5EFEB]">
                    <MoreHorizontal className="h-4 w-4" />
                  </summary>

                  <div className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-40 rounded-xl border border-[#383430] bg-[#1A1918] p-1.5 shadow-2xl">
                    {actions}
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>

        <div className="relative w-full px-3 py-2 sm:px-5 sm:py-2 lg:px-7 lg:py-2 pb-1 lg:pb-1 sm:pb-1">
          <div className="flex w-full items-center gap-4 sm:gap-5">
            <HeaderAvatar
              avatarUrl={avatarUrl}
              onChange={onAvatarChange}
              fallback={avatarFallback}
              accent={accent}
            />

            <div className="min-w-0 flex-1">
              <input
                value={titleValue}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder={titlePlaceholder}
                className="block w-full min-w-0 font-medium text-2xl font-black text-[#F5EFEB] outline-none placeholder:text-[#4D4741] sm:text-3xl lg:text-[2.1rem] border-b border-transparent bg-transparent text-xs font-medium text-[#B0A497] outline-none transition-colors hover:border-[#383430] focus:border-[#FF9B42]"
              />

              {subtitle && (
                <div className="mt-2.5 flex min-w-0 flex-wrap items-center gap-1.5 sm:mt-3">
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 sm:mt-5">
            <span
              className="h-px w-8 opacity-50 sm:w-10"
              style={{ backgroundColor: theme.primary }}
            />

            <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#64615d]">
              Detalhes da ficha
            </span>

            <span className="h-px flex-1 bg-[#2e2c2a]" />
          </div>
        </div>
      </div>
    </header>
  );
}
