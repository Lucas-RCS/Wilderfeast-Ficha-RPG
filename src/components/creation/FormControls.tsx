import type { ReactNode } from "react";
import { AlertTriangle, Check, Minus, Plus } from "lucide-react";

// ============================================================================
// CLASSES BASE COMPARTILHADAS
// ============================================================================

export const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl bg-[#1A1918] border border-[#383430] hover:border-[#4D4741] focus:border-[#FF9B42] focus:ring-1 focus:ring-[#FF9B42] text-sm text-[#F5EFEB] placeholder-[#7A7065] font-medium transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed";

export const cardClass = "rounded-2xl bg-[#1A1918] border border-[#383430] p-4";

// ============================================================================
// FIELD — rótulo + descrição + controle
// ============================================================================

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, required, hint, children }: FieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-[#B0A497]">
        {label}
        {required && <span className="text-[#FF9B42]">*</span>}
      </span>
      {children}
      {hint && <span className="block text-[10px] text-[#7A7065]">{hint}</span>}
    </label>
  );
}

// ============================================================================
// SECTION TITLE — cabeçalho de cada etapa
// ============================================================================

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function SectionTitle({ eyebrow, title, subtitle }: SectionTitleProps) {
  return (
    <div className="pb-3 border-b border-[#2B2825]">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF9B42]">
        {eyebrow}
      </span>
      <h3 className="text-lg  font-black text-[#89B5F7] mt-0.5">{title}</h3>
      {subtitle && (
        <p className="text-xs text-[#B0A497] mt-1 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// CHOICE CARD — cartão selecionável (usado em listas de opção única/múltipla)
// ============================================================================

interface ChoiceCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  badge?: string;
}

export function ChoiceCard({
  title,
  description,
  selected,
  onSelect,
  badge,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-3.5 rounded-xl border transition-colors ${
        selected
          ? "border-[#FF9B42] bg-[#2B2216]"
          : "border-[#383430] bg-[#1E1D1B] hover:border-[#4D4741]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs font-black text-[#F5EFEB]">{title}</span>
          {badge && (
            <span className="ml-2 text-[9px] uppercase tracking-wider font-bold text-[#89B5F7]">
              {badge}
            </span>
          )}
        </div>
        {selected && <Check className="w-4 h-4 text-[#FF9B42] shrink-0" />}
      </div>
      {description && (
        <p className="text-[11px] text-[#8F877D] mt-1.5 leading-relaxed">
          {description}
        </p>
      )}
    </button>
  );
}

// ============================================================================
// NUMBER STEPPER — controle de nível numérico (Estilos, Perícias)
// ============================================================================

interface NumberStepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function NumberStepper({
  label,
  value,
  min,
  max,
  onChange,
}: NumberStepperProps) {
  return (
    <div className="rounded-xl bg-[#1E1D1B] border border-[#383430] px-3 py-2.5">
      <p className="text-[10px] uppercase font-black text-[#9E958B] mb-1.5">
        {label}
      </p>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-7 h-7 rounded-lg bg-[#242220] border border-[#383430] flex items-center justify-center text-[#B0A497] hover:text-[#F5EFEB] hover:border-[#4D4741] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-lg font-black text-[#F5EFEB] w-6 text-center">
          {value}
        </span>
        <button
          type="button"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-7 h-7 rounded-lg bg-[#242220] border border-[#383430] flex items-center justify-center text-[#B0A497] hover:text-[#F5EFEB] hover:border-[#4D4741] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// INLINE STEPPER — controle compacto de min/max (ex: Harmonia da Matilha)
// ============================================================================

interface InlineStepperProps {
  label: string;
  value: number;
  min?: number;
  max?: number | null;
  onChange: (value: number) => void;
  accent?: string;
}

export function InlineStepper({
  label,
  value,
  min = 0,
  max,
  onChange,
  accent = "#FF9B42",
}: InlineStepperProps) {
  const canDecrease = value > min;
  const canIncrease = max == null || value < max;

  return (
    <div
      className="flex items-center justify-between gap-2"
      style={{ borderColor: `${accent}33` }}
    >
      <span className="text-[9px] font-bold uppercase tracking-wider text-[#cdc6c1]">
        {label}
      </span>

      <div
        className="flex items-center gap-0.5 rounded-lg border bg-[#171615] p-0.5"
        style={{ borderColor: `${accent}4D` }}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={!canDecrease}
          className="flex h-5 w-5 items-center justify-center rounded-md text-[#81776E] hover:bg-[#242220] hover:text-[#F0C4A8] disabled:pointer-events-none disabled:opacity-25"
        >
          <Minus className="h-3 w-3" />
        </button>

        <span
          className="min-w-[22px] text-center text-[9px] font-black"
          style={{ color: accent }}
        >
          {value}
        </span>

        <button
          type="button"
          onClick={() =>
            onChange(max != null ? Math.min(max, value + 1) : value + 1)
          }
          disabled={!canIncrease}
          className="flex h-5 w-5 items-center justify-center rounded-md text-[#81776E] hover:bg-[#242220] hover:text-[#6FCF97] disabled:pointer-events-none disabled:opacity-25"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// ERROR SUMMARY — pendências de validação da etapa/wizard
// ============================================================================

interface ErrorSummaryProps {
  errors: string[];
}

export function ErrorSummary({ errors }: ErrorSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#7A3428] bg-[#2B1A16] px-4 py-3 flex gap-2.5">
      <AlertTriangle className="w-4 h-4 text-[#FF9B42] shrink-0 mt-0.5" />
      <ul className="text-xs text-[#F0C4A8] space-y-1">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// EMPTY STATE — usado em listas dinâmicas vazias (ex.: Partes)
// ============================================================================

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#383430] p-6 text-center text-xs text-[#7A7065]">
      {message}
    </div>
  );
}
