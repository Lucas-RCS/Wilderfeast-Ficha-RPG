import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { ErrorSummary } from "./FormControls";

export interface WizardStepDef {
  id: string;
  label: string;
}

interface WizardShellProps {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
  steps: WizardStepDef[];
  currentStep: number;
  furthestStepReached: number;
  onStepSelect: (index: number) => void;
  errors: string[];
  onClose: () => void;
  onBack: () => void;
  onNext: () => void;
  isLastStep: boolean;
  submitLabel: string;
  children: ReactNode;
}

export function WizardShell({
  icon,
  eyebrow,
  title,
  subtitle,
  steps,
  currentStep,
  furthestStepReached,
  onStepSelect,
  errors,
  onClose,
  onBack,
  onNext,
  isLastStep,
  submitLabel,
  children,
}: WizardShellProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
      />

      <section className="relative w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl bg-[#171615] border border-[#383430] shadow-2xl text-[#F5EFEB]">
        {/* HEADER */}
        <header className="px-5 sm:px-6 py-5 border-b border-[#2B2825] bg-[#1A1918] shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#13335C] border border-[#2B6CB0]/40 flex items-center justify-center shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF9B42]">
                  {eyebrow}
                </p>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-[#89B5F7] leading-tight">
                  {title}
                </h2>
                <p className="text-xs text-[#B0A497] mt-1">{subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#B0A497] hover:text-[#F5EFEB] hover:bg-[#242220] shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* STEPPER */}
          <div className="grid gap-1.5 mt-5" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
            {steps.map((item, index) => {
              const isReachable = index <= furthestStepReached;
              const isActive = index === currentStep;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={!isReachable}
                  onClick={() => isReachable && onStepSelect(index)}
                  className="text-left disabled:cursor-not-allowed group"
                >
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      index <= currentStep
                        ? "bg-[#FF9B42]"
                        : "bg-[#302D29] group-enabled:group-hover:bg-[#4D4741]"
                    }`}
                  />
                  <p
                    className={`mt-1.5 hidden sm:block text-[10px] font-black uppercase tracking-wide truncate ${
                      isActive
                        ? "text-[#F5EFEB]"
                        : isReachable
                          ? "text-[#B0A497]"
                          : "text-[#5A544C]"
                    }`}
                  >
                    {item.label}
                  </p>
                </button>
              );
            })}
          </div>
        </header>

        {/* CONTEÚDO DA ETAPA */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 space-y-5">
          {children}
          <ErrorSummary errors={errors} />
        </div>

        {/* FOOTER */}
        <footer className="px-5 sm:px-6 py-4 border-t border-[#2B2825] bg-[#1A1918] flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#242220] border border-[#383430] text-xs font-bold text-[#B0A497] hover:text-[#F5EFEB] hover:border-[#4D4741] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === 0 ? "Cancelar" : "Voltar"}
          </button>

          <span className="text-[10px] font-black uppercase tracking-wider text-[#7A7065]">
            Etapa {currentStep + 1} de {steps.length}
          </span>

          {isLastStep ? (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E6F63] border border-[#55A99A]/40 text-white text-xs font-black hover:bg-[#357C6F] transition-colors"
            >
              <Check className="w-4 h-4" />
              {submitLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#13335C] border border-[#2B6CB0]/40 text-white text-xs font-black hover:bg-[#0E2644] transition-colors"
            >
              Continuar
              <ArrowRight className="w-4 h-4 text-[#FF9B42]" />
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}
