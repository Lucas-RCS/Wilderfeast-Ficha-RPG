import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import {
  ChefHat,
  Link2,
  PawPrint,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";
import type {
  IFeral,
  OriginDishType,
  SkillKey,
  SpecialtyKey,
  UtensilKey,
} from "../../types/types";
import {
  SKILLS,
  STYLES,
  creatureDefinitions,
} from "../../data/wilderfeastData";
import {
  createEmptyFeralDraft,
  finalizeFeralCreation,
  getAllSpecialtyOptions,
  getAllUtensilOptions,
  getSpecialtyCreationInfo,
  getUtensilCreationInfo,
  previewUtensilStyles,
  type IFeralConnectionDraft,
  type IFeralDraft,
  type IFeralOriginDraft,
} from "../../lib/feralCreation";
import { getAllFeralCards, getAllMatilhas } from "../../lib/storage";
import {
  ALL_ORIGIN_DISH_TYPES,
  ORIGIN_DISH_LABELS,
} from "../../types/wilderfeastTypes";
import { WizardShell, type WizardStepDef } from "./WizardShell";
import {
  ChoiceCard,
  Field,
  SectionTitle,
  cardClass,
  inputClass,
} from "./FormControls";
import { InfoTooltip } from "../ui/Tooltip";

const STEPS: WizardStepDef[] = [
  { id: "basics", label: "Dados Básicos" },
  { id: "utensil", label: "Utensílio & Técnicas" },
  { id: "specialty", label: "Especialidade & Traços" },
  { id: "origin", label: "Origem & Personalidade" },
  { id: "pack", label: "Matilha & Vínculos" },
];

interface FeralCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (feral: IFeral) => void;
}

/** Validações leves por etapa, usadas apenas para guiar a navegação do wizard. */
function getStepErrors(step: number, draft: IFeralDraft): string[] {
  switch (step) {
    case 0: {
      const errors: string[] = [];
      if (!draft.name.trim()) errors.push("Informe o nome do Feral.");
      if (!draft.pronouns.trim()) errors.push("Informe os pronomes do Feral.");
      if (!draft.appearance.trim())
        errors.push("Descreva a aparência do Feral.");
      return errors;
    }
    case 1: {
      const errors: string[] = [];
      if (!draft.utensilId) errors.push("Escolha um Utensílio de Arkaicaço.");
      return errors;
    }
    case 2: {
      const errors: string[] = [];
      if (!draft.specialtyId) errors.push("Escolha uma Especialidade.");
      if (draft.chosenTraitId === undefined)
        errors.push("Escolha o Traço inicial concedido pela Especialidade.");
      if (draft.importantMonsterId === undefined)
        errors.push("Escolha o Monstro Importante do Feral.");
      return errors;
    }
    case 3: {
      const errors: string[] = [];
      if (!draft.personality.is.trim() || !draft.personality.strivesToBe.trim())
        errors.push("Preencha a Personalidade (quem é e quem almeja ser).");
      if (!draft.origin.typicalIngredient.trim())
        errors.push("Descreva o Ingrediente típico da Origem.");
      if (!draft.origin.typicalSeasoning.trim())
        errors.push("Descreva o Tempero típico da Origem.");
      return errors;
    }
    default:
      return [];
  }
}

export function FeralCreateModal({
  isOpen,
  onClose,
  onCreated,
}: FeralCreateModalProps) {
  const [draft, setDraft] = useState<IFeralDraft>(createEmptyFeralDraft);
  const [currentStep, setCurrentStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const utensilOptions = useMemo(() => getAllUtensilOptions(), []);
  const specialtyOptions = useMemo(() => getAllSpecialtyOptions(), []);
  const feralOptions = useMemo(
    () => (isOpen ? getAllFeralCards() : []),
    [isOpen],
  );
  const matilhaOptions = useMemo(
    () => (isOpen ? getAllMatilhas() : []),
    [isOpen],
  );

  const utensilInfo = draft.utensilId
    ? getUtensilCreationInfo(draft.utensilId)
    : undefined;
  const specialtyInfo = draft.specialtyId
    ? getSpecialtyCreationInfo(draft.specialtyId)
    : undefined;

  if (!isOpen) return null;

  function resetAndClose() {
    setDraft(createEmptyFeralDraft());
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

    const result = finalizeFeralCreation(draft);
    if (result.errors.length > 0) {
      setErrors(result.errors);
      return;
    }

    onCreated(result.feral!);
    resetAndClose();
  }

  return (
    <WizardShell
      icon={<ChefHat className="w-5 h-5 text-[#FF9B42]" />}
      eyebrow="Criação de Feral"
      title="Novo Personagem"
      subtitle="Monte a ficha em etapas — o Utensílio e a Especialidade já preenchem as regras automáticas."
      steps={STEPS}
      currentStep={currentStep}
      furthestStepReached={furthestStep}
      onStepSelect={goToStep}
      errors={errors}
      onClose={resetAndClose}
      onBack={handleBack}
      onNext={handleNext}
      isLastStep={currentStep === STEPS.length - 1}
      submitLabel="Salvar Feral"
    >
      {currentStep === 0 && <BasicsStep draft={draft} setDraft={setDraft} />}
      {currentStep === 1 && (
        <UtensilStep
          draft={draft}
          setDraft={setDraft}
          utensilOptions={utensilOptions}
          utensilInfo={utensilInfo}
        />
      )}
      {currentStep === 2 && (
        <SpecialtyStep
          draft={draft}
          setDraft={setDraft}
          specialtyOptions={specialtyOptions}
          specialtyInfo={specialtyInfo}
        />
      )}
      {currentStep === 3 && <OriginStep draft={draft} setDraft={setDraft} />}
      {currentStep === 4 && (
        <PackStep
          draft={draft}
          setDraft={setDraft}
          feralOptions={feralOptions}
          matilhaOptions={matilhaOptions}
        />
      )}
    </WizardShell>
  );
}

// ============================================================================
// ETAPA 1 — DADOS BÁSICOS
// ============================================================================

interface StepProps {
  draft: IFeralDraft;
  setDraft: Dispatch<SetStateAction<IFeralDraft>>;
}

function BasicsStep({ draft, setDraft }: StepProps) {
  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="01"
        title="Dados Básicos"
        subtitle="As informações que aparecem no cartão e no topo da ficha."
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nome" required>
          <input
            value={draft.name}
            onChange={(e) =>
              setDraft((current) => ({ ...current, name: e.target.value }))
            }
            className={inputClass}
            placeholder="Ex.: Kaia Dente-de-Ferro"
          />
        </Field>
        <Field label="Pronomes" required>
          <input
            value={draft.pronouns}
            onChange={(e) =>
              setDraft((current) => ({ ...current, pronouns: e.target.value }))
            }
            className={inputClass}
            placeholder="ela/dela"
          />
        </Field>
      </div>
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
                  <Utensils className="h-7 w-7" />
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
      <Field label="Aparência" required>
        <textarea
          value={draft.appearance}
          onChange={(e) =>
            setDraft((current) => ({ ...current, appearance: e.target.value }))
          }
          className={`${inputClass} min-h-28 resize-y`}
          placeholder="Características físicas, roupas, marcas, presença..."
        />
      </Field>
    </div>
  );
}

// ============================================================================
// ETAPA 2 — UTENSÍLIO & TÉCNICAS
// ============================================================================

interface UtensilStepProps extends StepProps {
  utensilOptions: ReturnType<typeof getAllUtensilOptions>;
  utensilInfo: ReturnType<typeof getUtensilCreationInfo>;
}

function UtensilStep({
  draft,
  setDraft,
  utensilOptions,
  utensilInfo,
}: UtensilStepProps) {
  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="02"
        title="Utensílio & Técnicas"
        subtitle="O Utensílio define a distribuição inicial de Estilos (3/2/1/1) e concede Técnicas de origem."
      />

      <Field label="Utensílio de Arkaicaço" required>
        <div className="grid sm:grid-cols-3 gap-2.5">
          {utensilOptions.map((utensil) => (
            <ChoiceCard
              key={utensil.id}
              title={utensil.name}
              selected={draft.utensilId === utensil.id}
              onSelect={() =>
                setDraft((current) => ({
                  ...current,
                  utensilId: utensil.id as UtensilKey,
                  styleOptionIndex: 0,
                  chosenTechniqueId: undefined,
                }))
              }
            />
          ))}
        </div>
      </Field>

      {utensilInfo && (
        <>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className=" font-black text-sm text-[#89B5F7]">
                Distribuição de Estilos
              </h4>
              <span className="text-[10px] uppercase tracking-wider text-[#7A7065]">
                Escolha 1 opção
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {(utensilInfo.styleOptions ?? []).map((option, index) => {
                const optionIndex = index as 0 | 1;
                const selected = draft.styleOptionIndex === optionIndex;
                const resultingStyles = draft.utensilId
                  ? previewUtensilStyles(draft.utensilId, optionIndex)
                  : undefined;

                return (
                  <button
                    key={`${option.main}-${option.secondary}`}
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        styleOptionIndex: optionIndex,
                      }))
                    }
                    className={`p-4 rounded-2xl border text-left transition-colors ${
                      selected
                        ? "border-[#FF9B42] bg-[#2B2216]"
                        : "border-[#383430] bg-[#1E1D1B] hover:border-[#4D4741]"
                    }`}
                  >
                    <span className="text-[11px] font-black uppercase text-[#FF9B42]">
                      Opção {index + 1}
                    </span>
                    <div className="grid grid-cols-4 gap-1.5 mt-2.5">
                      {resultingStyles &&
                        Object.entries(STYLES).map(([key, meta]) => (
                          <div
                            key={key}
                            className="rounded-lg bg-[#171615] border border-[#302D29] px-1.5 py-1.5 text-center"
                          >
                            <p className="text-[8px] uppercase text-[#8D847B]">
                              {meta.name}
                            </p>
                            <p className="text-base font-black text-[#F5EFEB]">
                              {
                                resultingStyles[
                                  key as keyof typeof resultingStyles
                                ]
                              }
                            </p>
                          </div>
                        ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#FF9B42]" />
                <h4 className=" font-black text-sm text-[#89B5F7]">
                  Técnica concedida
                </h4>
              </div>
              {utensilInfo.initialTechnique ? (
                <div>
                  <p className="text-xs font-bold text-[#F5EFEB]">
                    {utensilInfo.initialTechnique.name}
                  </p>
                  <p className="text-[11px] text-[#8F877D] mt-1 leading-relaxed">
                    {utensilInfo.initialTechnique.description}
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-[#7A7065]">
                  Este Utensílio não concede Técnica automática.
                </p>
              )}
            </div>

            <div className={cardClass}>
              <h4 className=" font-black text-sm text-[#89B5F7] mb-2">
                Escolha 1 Técnica adicional
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {utensilInfo.optionalTechniques.map((technique) => (
                  <ChoiceCard
                    key={technique.id}
                    title={technique.name}
                    description={technique.description}
                    selected={draft.chosenTechniqueId === technique.id}
                    onSelect={() =>
                      setDraft((current) => ({
                        ...current,
                        chosenTechniqueId:
                          current.chosenTechniqueId === technique.id
                            ? undefined
                            : technique.id,
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// ETAPA 3 — ESPECIALIDADE & TRAÇOS
// ============================================================================

interface SpecialtyStepProps extends StepProps {
  specialtyOptions: ReturnType<typeof getAllSpecialtyOptions>;
  specialtyInfo: ReturnType<typeof getSpecialtyCreationInfo>;
}

function SpecialtyStep({
  draft,
  setDraft,
  specialtyOptions,
  specialtyInfo,
}: SpecialtyStepProps) {
  const monsterChoices = specialtyInfo?.importantMonsterOptions.length
    ? specialtyInfo.importantMonsterOptions
    : creatureDefinitions;

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="03"
        title="Especialidade & Traços"
        subtitle="A Especialidade concede a escolha de 1 Traço inicial e sugere um Monstro Importante."
      />

      <Field label="Especialidade" required>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {specialtyOptions.map((specialty) => (
            <ChoiceCard
              key={specialty.id}
              title={specialty.name}
              description={specialty.description}
              selected={draft.specialtyId === specialty.id}
              onSelect={() =>
                setDraft((current) => ({
                  ...current,
                  specialtyId: specialty.id as SpecialtyKey,
                  chosenTraitId: undefined,
                  importantMonsterId: undefined,
                }))
              }
            />
          ))}
        </div>
      </Field>

      {specialtyInfo && (
        <Field label="Traço inicial" required>
          <div className="grid sm:grid-cols-3 gap-2.5">
            {specialtyInfo.traitOptions.map((trait) => (
              <ChoiceCard
                key={trait.id}
                title={trait.name}
                description={trait.description}
                selected={draft.chosenTraitId === trait.id}
                onSelect={() =>
                  setDraft((current) => ({
                    ...current,
                    chosenTraitId: trait.id,
                  }))
                }
              />
            ))}
          </div>
        </Field>
      )}

      {draft.specialtyId && (
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-3">
            <PawPrint className="w-4 h-4 text-[#38C2B3]" />
            <h4 className=" font-black text-sm text-[#89B5F7]">
              Monstro Importante
            </h4>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Criatura" required>
              <select
                value={draft.importantMonsterId ?? ""}
                onChange={(e) =>
                  setDraft((current) => ({
                    ...current,
                    importantMonsterId: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
                className={inputClass}
              >
                <option value="">Selecionar...</option>
                {monsterChoices.map((monster) => (
                  <option key={monster.id} value={monster.id}>
                    {monster.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Relação">
              <input
                value={draft.importantMonsterDescription}
                onChange={(e) =>
                  setDraft((current) => ({
                    ...current,
                    importantMonsterDescription: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Por que essa criatura importa para o Feral?"
              />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ETAPA 4 — ORIGEM & PERSONALIDADE
// ============================================================================

const ORIGIN_DISH_KEYS: {
  key: "creationDescription" | "initiationDescription" | "ambitionDescription";
  skillKey:
    | "creationSkillBonus"
    | "initiationSkillBonus"
    | "ambitionSkillBonus";
  type: OriginDishType;
  description: string;
}[] = [
  {
    key: "creationDescription",
    skillKey: "creationSkillBonus",
    type: "criacao",
    description:
      "Considere sua herança quando imaginar o prato que define a sua infância.",
  },
  {
    key: "initiationDescription",
    skillKey: "initiationSkillBonus",
    type: "iniciacao",
    description:
      "Considere seu treinamento (ou falta dele) quando imaginar o prato que o fez um feral.",
  },
  {
    key: "ambitionDescription",
    skillKey: "ambitionSkillBonus",
    type: "ambicao",
    description:
      "Considere seus objetivos quando imaginar o prato que você mais quer comer.",
  },
];

function OriginStep({ draft, setDraft }: StepProps) {
  const updateOrigin = (patch: Partial<IFeralOriginDraft>) =>
    setDraft((current) => ({
      ...current,
      origin: { ...current.origin, ...patch },
    }));

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="04"
        title="Origem & Personalidade"
        subtitle="Os marcos que explicam de onde o Feral veio, o que busca e quem ele é."
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Você é..." required>
          <input
            value={draft.personality.is}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                personality: { ...current.personality, is: e.target.value },
              }))
            }
            className={inputClass}
            placeholder="Ex: Direta e destemida"
          />
        </Field>
        <Field label="Busca ser..." required>
          <input
            value={draft.personality.strivesToBe}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                personality: {
                  ...current.personality,
                  strivesToBe: e.target.value,
                },
              }))
            }
            className={inputClass}
            placeholder="Ex: Alguém em quem a Matilha confie de olhos fechados"
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-1 gap-4">
        {ORIGIN_DISH_KEYS.map(({ key, skillKey, type, description }) => (
          <div key={type} className={cardClass}>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#FF9B42]">
                {ORIGIN_DISH_LABELS[type]}
              </p>
              <InfoTooltip
                title={ORIGIN_DISH_LABELS[type]}
                category="Origem"
                description={description}
              />
            </div>
            <div className="space-y-3">
              <Field label="Descrição">
                <textarea
                  value={draft.origin[key]}
                  onChange={(e) => updateOrigin({ [key]: e.target.value })}
                  className={`${inputClass} min-h-24 resize-y`}
                  placeholder="Descreva o prato e o que ele significa para você."
                />
              </Field>
            </div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Ingrediente típico">
          <input
            value={draft.origin.typicalIngredient}
            onChange={(e) =>
              updateOrigin({ typicalIngredient: e.target.value })
            }
            className={inputClass}
          />
        </Field>
        <Field label="Tempero típico">
          <input
            value={draft.origin.typicalSeasoning}
            onChange={(e) => updateOrigin({ typicalSeasoning: e.target.value })}
            className={inputClass}
          />
        </Field>
      </div>
    </div>
  );
}

// ============================================================================
// ETAPA 5 — MATILHA & VÍNCULOS
// ============================================================================

interface PackStepProps extends StepProps {
  feralOptions: ReturnType<typeof getAllFeralCards>;
  matilhaOptions: ReturnType<typeof getAllMatilhas>;
}

function PackStep({
  draft,
  setDraft,
  feralOptions,
  matilhaOptions,
}: PackStepProps) {
  const updateConnection = (patch: Partial<IFeralConnectionDraft>) =>
    setDraft((current) => ({
      ...current,
      connection: { ...current.connection, ...patch },
    }));

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="05"
        title="Matilha & Vínculos"
        subtitle="Associe o Feral a uma Matilha existente e registre uma conexão com outro membro. Ambos os campos são opcionais."
      />

      <Field
        label="Matilha"
        hint="Opcional. O Feral será adicionado aos membros dela."
      >
        <select
          value={draft.matilhaId ?? ""}
          onChange={(e) =>
            setDraft((current) => ({
              ...current,
              matilhaId: e.target.value ? Number(e.target.value) : undefined,
            }))
          }
          className={inputClass}
        >
          <option value="">Nenhuma Matilha</option>
          {matilhaOptions.map((matilha) => (
            <option key={matilha.id} value={matilha.id}>
              {matilha.name}
            </option>
          ))}
        </select>
      </Field>

      <div className={cardClass}>
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="w-4 h-4 text-[#38C2B3]" />
          <h4 className=" font-black text-sm text-[#89B5F7]">
            Conexão com outro Feral
          </h4>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Feral parceiro" hint="Opcional">
            <select
              value={draft.connection.partnerFeralId ?? ""}
              onChange={(e) =>
                updateConnection({
                  partnerFeralId: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className={inputClass}
            >
              <option value="">Nenhum</option>
              {feralOptions.map((feral) => (
                <option key={feral.id} value={feral.id}>
                  {feral.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Prato associado">
            <select
              value={draft.connection.dish}
              onChange={(e) =>
                updateConnection({ dish: e.target.value as OriginDishType })
              }
              className={inputClass}
            >
              {ALL_ORIGIN_DISH_TYPES.map((dish) => (
                <option key={dish} value={dish}>
                  {ORIGIN_DISH_LABELS[dish]}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Descrição da conexão">
            <textarea
              value={draft.connection.description}
              onChange={(e) =>
                updateConnection({ description: e.target.value })
              }
              className={`${inputClass} min-h-20 resize-y`}
              placeholder="Como essa relação nasceu e o que ela significa hoje."
            />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl bg-[#1A1918] border border-[#383430] p-4 text-xs text-[#8F877D] flex gap-3">
        <Users className="w-4 h-4 text-[#38C2B3] shrink-0 mt-0.5" />
        <p>
          A Matilha não guarda uma cópia do Feral: ao salvar, apenas o ID do
          novo Feral é adicionado à lista de membros da Matilha escolhida.
        </p>
      </div>
    </div>
  );
}
