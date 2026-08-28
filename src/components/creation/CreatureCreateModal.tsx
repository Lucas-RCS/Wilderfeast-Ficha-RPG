import { useState, type Dispatch, type SetStateAction } from "react";
import { PawPrint, Plus } from "lucide-react";
import type {
  ICreature,
  MonsterLineage,
  MonsterStage,
} from "../../types/types";
import { SKILLS, STYLES } from "../../data/wilderfeastData";
import {
  createEmptyCreatureDraft,
  createEmptyCreaturePart,
  finalizeCreatureCreation,
  getAllConditionOptions,
  getAllLineageOptions,
  getAllStageOptions,
  getAllTraitOptions,
  type ICreatureDraft,
} from "../../lib/creatureCreation";
import { WizardShell, type WizardStepDef } from "./WizardShell";
import {
  EmptyState,
  Field,
  NumberStepper,
  SectionTitle,
  inputClass,
} from "./FormControls";
import { ConditionPicker, TraitPicker } from "./TraitConditionPicker";
import { PartEditor } from "./PartEditor";

const STEPS: WizardStepDef[] = [
  { id: "basics", label: "Dados Básicos" },
  { id: "combat", label: "Estilos & Perícias" },
  { id: "traits", label: "Traços & Condições" },
  { id: "parts", label: "Partes do Corpo" },
  { id: "behavior", label: "Comportamento" },
];

interface CreatureCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (creature: ICreature) => void;
}

/** Validações leves por etapa, usadas apenas para guiar a navegação do wizard. */
function getStepErrors(step: number, draft: ICreatureDraft): string[] {
  switch (step) {
    case 0: {
      const errors: string[] = [];
      if (!draft.name.trim()) errors.push("Informe o nome da Criatura.");
      if (!draft.sizeDescription.trim())
        errors.push("Descreva o tamanho/porte da Criatura.");
      if (!draft.description.trim())
        errors.push("Escreva uma descrição geral da Criatura.");
      return errors;
    }
    case 3: {
      const errors: string[] = [];
      if (draft.parts.length === 0)
        errors.push("Cadastre ao menos uma Parte do corpo.");
      draft.parts.forEach((part, index) => {
        if (!part.name.trim())
          errors.push(`Informe o nome da Parte ${index + 1}.`);
      });
      return errors;
    }
    case 4: {
      const errors: string[] = [];
      if (!draft.diet.trim()) errors.push("Descreva a Dieta da Criatura.");
      if (!draft.habitat.trim()) errors.push("Descreva o Habitat da Criatura.");
      if (!draft.behavior.trim())
        errors.push("Descreva o Comportamento da Criatura.");
      return errors;
    }
    default:
      return [];
  }
}

export function CreatureCreateModal({
  isOpen,
  onClose,
  onCreated,
}: CreatureCreateModalProps) {
  const [draft, setDraft] = useState<ICreatureDraft>(createEmptyCreatureDraft);
  const [currentStep, setCurrentStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  function resetAndClose() {
    setDraft(createEmptyCreatureDraft());
    setCurrentStep(0);
    setFurthestStep(0);
    setErrors([]);
    onClose();
  }

  function goToStep(index: number) {
    setErrors([]);
    setCurrentStep(index);
  }

  function handleBack() {
    if (currentStep === 0) {
      resetAndClose();
      return;
    }
    goToStep(currentStep - 1);
  }

  function handleNext() {
    const stepErrors = getStepErrors(currentStep, draft);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }

    if (currentStep < STEPS.length - 1) {
      const next = currentStep + 1;
      setFurthestStep((current) => Math.max(current, next));
      goToStep(next);
      return;
    }

    const result = finalizeCreatureCreation(draft);
    if (result.errors.length > 0) {
      setErrors(result.errors);
      return;
    }

    onCreated(result.creature!);
    resetAndClose();
  }

  return (
    <WizardShell
      icon={<Plus className="w-5 h-5 text-[#FF9B42]" />}
      eyebrow="Criação de Criatura"
      title="Novo Registro do Bestiário"
      subtitle="Monte a ficha de combate e ecologia da Criatura em etapas."
      steps={STEPS}
      currentStep={currentStep}
      furthestStepReached={furthestStep}
      onStepSelect={goToStep}
      errors={errors}
      onClose={resetAndClose}
      onBack={handleBack}
      onNext={handleNext}
      isLastStep={currentStep === STEPS.length - 1}
      submitLabel="Salvar Criatura"
    >
      {currentStep === 0 && <BasicsStep draft={draft} setDraft={setDraft} />}
      {currentStep === 1 && <CombatStep draft={draft} setDraft={setDraft} />}
      {currentStep === 2 && <TraitsStep draft={draft} setDraft={setDraft} />}
      {currentStep === 3 && <PartsStep draft={draft} setDraft={setDraft} />}
      {currentStep === 4 && <BehaviorStep draft={draft} setDraft={setDraft} />}
    </WizardShell>
  );
}

interface StepProps {
  draft: ICreatureDraft;
  setDraft: Dispatch<SetStateAction<ICreatureDraft>>;
}

// ============================================================================
// ETAPA 1 — DADOS BÁSICOS
// ============================================================================

function BasicsStep({ draft, setDraft }: StepProps) {
  const lineageOptions = getAllLineageOptions();
  const stageOptions = getAllStageOptions();

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="01"
        title="Dados Básicos"
        subtitle="Nome, linhagem, estágio de vida e descrição geral da Criatura."
      />
      <div className="grid sm:grid-cols-1 gap-4">
        <Field label="Nome" required>
          <input
            value={draft.name}
            onChange={(e) =>
              setDraft((current) => ({ ...current, name: e.target.value }))
            }
            className={inputClass}
            placeholder="Ex.: Corvo-Fanha"
          />
        </Field>
        <Field label="Avatar" hint="Opcional. PNG, JPG ou WEBP.">
          <div className="group relative overflow-hidden rounded-2xl border border-[#383430] bg-[#1A1918] transition-all duration-300 hover:border-[#5A5149]">
            <input
              id="feral-avatar"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                const reader = new FileReader();

                reader.onload = (event) => {
                  const result = event.target?.result;

                  if (typeof result !== "string") return;

                  setDraft((current) => ({
                    ...current,
                    avatarUrl: result,
                  }));
                };

                reader.readAsDataURL(file);
              }}
            />

            <label htmlFor="feral-avatar" className="block cursor-pointer">
              {draft.avatarUrl ? (
                <div className="relative aspect-[16/7] overflow-hidden">
                  <img
                    src={draft.avatarUrl}
                    alt={draft.name || "Preview do avatar"}
                    className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-[1.03]
            "
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FF9B42]">
                        Avatar selecionado
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#F5EFEB]">
                        Clique para trocar a imagem
                      </p>
                    </div>

                    <div className="shrink-0 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#F5EFEB] backdrop-blur-sm">
                      Alterar
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-44 flex-col items-center justify-center px-6 py-8 text-center transition-colors duration-300 group-hover:bg-[#211F1D]">
                  <div
                    className="
            mb-4
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            border
            border-[#4A433D]
            bg-[#211F1D]
            text-[#8A4A4A]
            shadow-[0_8px_30px_rgba(0,0,0,0.18)]
            transition-all
            duration-300
            group-hover:scale-105
            group-hover:border-[#5A5149]
            group-hover:text-[#FF9B42]
          "
                  >
                    <PawPrint className="h-7 w-7" />
                  </div>

                  <p className="text-sm font-bold text-[#F5EFEB]">
                    Escolha uma imagem para o avatar
                  </p>

                  <p className="mt-1 max-w-sm text-[11px] leading-relaxed text-[#7A7065]">
                    Clique aqui para selecionar uma imagem do seu dispositivo.
                  </p>

                  <span
                    className="
            mt-4
            rounded-xl
            border
            border-[#3C3833]
            bg-[#211F1D]
            px-4
            py-2
            text-[10px]
            font-black
            uppercase
            tracking-wider
            text-[#B0A497]
            transition-colors
            group-hover:border-[#FF9B42]/40
            group-hover:text-[#FF9B42]
          "
                  >
                    Selecionar imagem
                  </span>
                </div>
              )}
            </label>
          </div>
        </Field>
        <Field label="Linhagem">
          <select
            value={draft.lineage}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                lineage: e.target.value as MonsterLineage,
              }))
            }
            className={inputClass}
          >
            {lineageOptions.map((lineage) => (
              <option key={lineage} value={lineage}>
                {lineage}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Estágio de vida">
          <select
            value={draft.stage}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                stage: e.target.value as MonsterStage,
              }))
            }
            className={inputClass}
          >
            {stageOptions.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tamanho / porte" required>
          <input
            value={draft.sizeDescription}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                sizeDescription: e.target.value,
              }))
            }
            className={inputClass}
            placeholder="Ex.: 1,5 metro de envergadura"
          />
        </Field>
        <Field label="Vigor máximo">
          <input
            type="number"
            min={1}
            value={draft.vigorMax}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                vigorMax: Math.max(1, Number(e.target.value)),
              }))
            }
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Descrição" required>
        <textarea
          value={draft.description}
          onChange={(e) =>
            setDraft((current) => ({ ...current, description: e.target.value }))
          }
          className={`${inputClass} min-h-28 resize-y`}
        />
      </Field>
    </div>
  );
}

// ============================================================================
// ETAPA 2 — ESTILOS & PERÍCIAS
// ============================================================================

function CombatStep({ draft, setDraft }: StepProps) {
  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="02"
        title="Estilos & Perícias"
        subtitle="Os valores estruturais usados nos testes e ataques da Criatura."
      />
      <div>
        <h4 className="font-serif font-black text-sm text-[#89B5F7] mb-2.5">
          Estilos{" "}
          <span className="text-[#7A7065] font-sans font-normal text-[10px]">
            (0 a 5)
          </span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(STYLES).map(([key, meta]) => (
            <NumberStepper
              key={key}
              label={meta.name}
              min={0}
              max={5}
              value={draft.styles[key as keyof typeof draft.styles]}
              onChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  styles: { ...current.styles, [key]: value },
                }))
              }
            />
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-serif font-black text-sm text-[#89B5F7] mb-2.5">
          Perícias{" "}
          <span className="text-[#7A7065] font-sans font-normal text-[10px]">
            (0 a 3)
          </span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(SKILLS).map(([key, meta]) => (
            <NumberStepper
              key={key}
              label={meta.name}
              min={0}
              max={3}
              value={draft.skills[key as keyof typeof draft.skills]}
              onChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  skills: { ...current.skills, [key]: value },
                }))
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ETAPA 3 — TRAÇOS & CONDIÇÕES
// ============================================================================

function TraitsStep({ draft, setDraft }: StepProps) {
  const allTraits = getAllTraitOptions();
  const allConditions = getAllConditionOptions();

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="03"
        title="Traços & Condições"
        subtitle="Separe Traços principais dos adicionais e registre Condições já ativas, se houver."
      />
      <TraitPicker
        title="Traços principais"
        allTraits={allTraits}
        selected={draft.traits}
        onToggle={(traitId) =>
          setDraft((current) => ({
            ...current,
            traits: current.traits.some((t) => t.traitId === traitId)
              ? current.traits.filter((t) => t.traitId !== traitId)
              : [...current.traits, { traitId, level: 1 }],
          }))
        }
        onLevelChange={(traitId, level) =>
          setDraft((current) => ({
            ...current,
            traits: current.traits.map((t) =>
              t.traitId === traitId ? { ...t, level } : t,
            ),
          }))
        }
      />
      <TraitPicker
        title="Traços adicionais"
        hint="Traços extras adquiridos ao longo da progressão da Criatura."
        allTraits={allTraits}
        selected={draft.additionalTraits}
        onToggle={(traitId) =>
          setDraft((current) => ({
            ...current,
            additionalTraits: current.additionalTraits.some(
              (t) => t.traitId === traitId,
            )
              ? current.additionalTraits.filter((t) => t.traitId !== traitId)
              : [...current.additionalTraits, { traitId, level: 1 }],
          }))
        }
        onLevelChange={(traitId, level) =>
          setDraft((current) => ({
            ...current,
            additionalTraits: current.additionalTraits.map((t) =>
              t.traitId === traitId ? { ...t, level } : t,
            ),
          }))
        }
      />
      <ConditionPicker
        title="Condições"
        hint="Opcional. Condições que a Criatura já inicia sofrendo."
        allConditions={allConditions}
        selected={draft.conditions}
        onToggle={(conditionId) =>
          setDraft((current) => ({
            ...current,
            conditions: current.conditions.some(
              (c) => c.conditionId === conditionId,
            )
              ? current.conditions.filter((c) => c.conditionId !== conditionId)
              : [...current.conditions, { conditionId, level: 1 }],
          }))
        }
        onLevelChange={(conditionId, level) =>
          setDraft((current) => ({
            ...current,
            conditions: current.conditions.map((c) =>
              c.conditionId === conditionId ? { ...c, level } : c,
            ),
          }))
        }
      />
    </div>
  );
}

// ============================================================================
// ETAPA 4 — PARTES DO CORPO
// ============================================================================

function PartsStep({ draft, setDraft }: StepProps) {
  function addPart() {
    setDraft((current) => ({
      ...current,
      parts: [...current.parts, createEmptyCreaturePart()],
    }));
  }

  function updatePart(
    index: number,
    patch: Partial<ICreatureDraft["parts"][number]>,
  ) {
    setDraft((current) => ({
      ...current,
      parts: current.parts.map((part, i) =>
        i === index ? { ...part, ...patch } : part,
      ),
    }));
  }

  function removePart(index: number) {
    setDraft((current) => ({
      ...current,
      parts: current.parts.filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="04"
        title="Partes do Corpo"
        subtitle="Cada Parte pode ter Durabilidade própria, Ataque e um efeito para quando for quebrada."
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#8F877D]">
          {draft.parts.length} parte{draft.parts.length === 1 ? "" : "s"}{" "}
          cadastrada
          {draft.parts.length === 1 ? "" : "s"}.
        </p>
        <button
          type="button"
          onClick={addPart}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#242220] border border-[#383430] text-xs font-black text-[#F5EFEB] hover:border-[#FF9B42] transition-colors"
        >
          <Plus className="w-4 h-4 text-[#FF9B42]" />
          Adicionar Parte
        </button>
      </div>

      <div className="space-y-3">
        {draft.parts.map((part, index) => (
          <PartEditor
            key={part.id}
            index={index}
            part={part}
            onChange={(patch) => updatePart(index, patch)}
            onRemove={() => removePart(index)}
          />
        ))}
        {draft.parts.length === 0 && (
          <EmptyState message="Nenhuma Parte cadastrada. Adicione ao menos uma para continuar." />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// ETAPA 5 — COMPORTAMENTO
// ============================================================================

function BehaviorStep({ draft, setDraft }: StepProps) {
  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="05"
        title="Comportamento"
        subtitle="A ecologia da Criatura: o que come, onde vive e como reage durante a Caçada."
      />
      <div className="grid sm:grid-cols-1 gap-4">
        <Field label="Dieta" required>
          <textarea
            value={draft.diet}
            onChange={(e) =>
              setDraft((current) => ({ ...current, diet: e.target.value }))
            }
            className={`${inputClass} min-h-20 resize-y`}
          />
        </Field>
        <Field label="Habitat" required>
          <textarea
            value={draft.habitat}
            onChange={(e) =>
              setDraft((current) => ({ ...current, habitat: e.target.value }))
            }
            className={`${inputClass} min-h-20 resize-y`}
          />
        </Field>
        <Field label="Comportamento" required>
          <textarea
            value={draft.behavior}
            onChange={(e) =>
              setDraft((current) => ({ ...current, behavior: e.target.value }))
            }
            className={`${inputClass} min-h-20 resize-y`}
          />
        </Field>
      </div>
    </div>
  );
}
