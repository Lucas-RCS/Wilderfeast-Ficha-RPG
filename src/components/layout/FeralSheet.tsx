import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Award,
  Check,
  FileText,
  Heart,
  Link2,
  Minus,
  Pencil,
  Plus,
  Sparkles,
  Swords,
  Target,
  Trash2,
  Users,
  Utensils,
  X,
  Beef,
  Layers,
  Flame,
  Sprout,
  Droplets,
  Wheat,
  Fish,
  Dna,
} from "lucide-react";

import type {
  ICreature,
  ID,
  IFeastRecord,
  IFeral,
  IFeralOrigin,
  IFeralUtensil,
  IImportantMonsterRelation,
  IJournalNote,
  IMatilha,
  IOriginConnection,
  IOriginDish,
  ITechniqueDefinition,
  ITechniqueTraining,
  ITraitDefinition,
  IUtensilDefinition,
  OriginDishType,
  PermanentReward,
  CostType,
  SkillKey,
  SpecialtyKey,
  StyleKey,
} from "../../types/types";

import {
  SKILLS,
  STYLES,
  STYLE_INFO,
  conditionDefinitions,
  creatureDefinitions,
  creaturesById,
  skillsList,
  specialtiesById,
  techniqueDefinitions,
  techniquesById,
  traitDefinitions,
  traitsById,
  utensilsById,
} from "../../data/wilderfeastData";

import {
  generateId,
  getAllFeralCards,
  getFeralById,
  saveFeral,
} from "../../lib/storage";

import {
  ALL_ORIGIN_DISH_TYPES,
  ORIGIN_DISH_LABELS,
} from "../../types/wilderfeastTypes";

import { useAutosaveEntity } from "../../hooks/useAutosaveEntity";
import { formatRelativeTime } from "../../hooks/useUtils";

import {
  Field,
  cardClass,
  inputClass,
} from "../../components/creation/FormControls";

import { SheetHeader } from "../../components/layout/SheetHeader";
import { SheetNotFound } from "../../components/layout/SheetNotFound";
import { FloatingUndoButton } from "../../components/ui/FloatingUndoButton";
import { InfoTooltip } from "../ui/Tooltip";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const COST_TYPE_LABELS: Record<CostType, string> = {
  acoes: "Ações",
  vigor: "Vigor",
  sucessos: "Sucessos",
};

interface ICustomEntry {
  id: ID;
  name: string;
  badge?: string;
  description: string;
  level?: number;
  maxLevel?: number | null;
}

type FeralSheetEntity = IFeral & {
  customTraits?: ICustomEntry[];
  customTechniques?: ICustomEntry[];
};

type CustomEntryKey = keyof Pick<
  FeralSheetEntity,
  "customTraits" | "customTechniques"
>;

function readCustom(
  entity: FeralSheetEntity,
  key: CustomEntryKey,
): ICustomEntry[] {
  return entity[key] ?? [];
}

const LINEAGE_META: Record<
  SpecialtyKey,
  {
    icon: ReactNode;
    text: string;
    bg: string;
    border: string;
  }
> = {
  Açougueiro: {
    icon: <Beef className="h-4 w-4" />,
    text: "text-red-300",
    bg: "bg-red-500/20",
    border: "border-red-500/60",
  },
  Amontoeiro: {
    icon: <Layers className="h-4 w-4" />,
    text: "text-stone-300",
    bg: "bg-stone-500/20",
    border: "border-stone-500/60",
  },
  Churrasqueiro: {
    icon: <Flame className="h-4 w-4" />,
    text: "text-orange-300",
    bg: "bg-orange-500/20",
    border: "border-orange-500/60",
  },
  Jardineiro: {
    icon: <Sprout className="h-4 w-4" />,
    text: "text-emerald-300",
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/60",
  },
  Molheiro: {
    icon: <Droplets className="h-4 w-4" />,
    text: "text-sky-300",
    bg: "bg-sky-500/20",
    border: "border-sky-500/60",
  },
  Padeiro: {
    icon: <Wheat className="h-4 w-4" />,
    text: "text-amber-300",
    bg: "bg-amber-500/20",
    border: "border-amber-500/60",
  },
  Peixeiro: {
    icon: <Fish className="h-4 w-4" />,
    text: "text-cyan-300",
    bg: "bg-cyan-500/20",
    border: "border-cyan-500/60",
  },
  Pivoteiro: {
    icon: <Dna className="h-4 w-4" />,
    text: "text-violet-300",
    bg: "bg-violet-500/20",
    border: "border-violet-500/60",
  },
};

// ============================================================================
// MODAL
// ============================================================================

function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`max-h-[85vh] w-full ${
          wide ? "max-w-2xl" : "max-w-md"
        } overflow-y-auto rounded-2xl border border-[#383430] bg-[#1A1918] p-5 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-black uppercase tracking-wide text-[#F5EFEB]">
            {title}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-[#8F877D] transition-colors hover:bg-[#242220] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

// ============================================================================
// TABS
// ============================================================================

interface TabDef {
  key: FeralTabKey;
  label: string;
  icon: typeof Award;
  count: number;
  color: string;
}

function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[];
  active: FeralTabKey;
  onChange: (key: FeralTabKey) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-[#302D29] bg-[#171615] p-2">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        const Icon = tab.icon;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            style={
              isActive
                ? {
                    borderColor: `${tab.color}66`,
                    backgroundColor: `${tab.color}1F`,
                    color: tab.color,
                  }
                : undefined
            }
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[11px] font-black uppercase tracking-wide transition-colors ${
              isActive
                ? ""
                : "border-transparent text-[#8F877D] hover:bg-[#1E1D1B] hover:text-[#F5EFEB]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" style={{ color: tab.color }} />

            {tab.label}
            {tab.key !== "habilidades" && (
              <span
                className="rounded-full px-1.5 py-0.5 text-[9px] font-black"
                style={{
                  backgroundColor: isActive ? `${tab.color}33` : "#242220",
                  color: isActive ? tab.color : "#8F877D",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// PLACEHOLDER
// ============================================================================

function Placeholder({
  icon: Icon,
  message,
  hint,
}: {
  icon: typeof Award;
  message: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#383430] bg-[#171615]/60 px-6 py-10 text-center">
      <Icon className="h-7 w-7 text-[#4A433C]" />

      <p className="text-xs font-bold text-[#8F877D]">{message}</p>

      {hint && <p className="max-w-xs text-[10px] text-[#5E564D]">{hint}</p>}
    </div>
  );
}

// ============================================================================
// ENTRY POINT
// ============================================================================

interface FeralSheetProps {
  feralId: ID;
  onBack: () => void;
  onDeleted: () => void;
}

function FeralSheet({
  feralId,
  onBack,
  onDeleted: _onDeleted,
}: FeralSheetProps) {
  const initial = getFeralById(feralId);

  if (!initial) {
    return <SheetNotFound label="Feral" onBack={onBack} />;
  }

  return <FeralSheetView key={feralId} initial={initial} onBack={onBack} />;
}

type FeralTabKey = "habilidades" | "tecnicas" | "tracos" | "feras" | "diario";

function FeralSheetView({
  initial,
  onBack,
}: {
  initial: IFeral;
  onBack: () => void;
}) {
  const { entity, update, undo, canUndo, lastSavedAt, isPending } =
    useAutosaveEntity<FeralSheetEntity>({
      initial,
      save: saveFeral,
    });

  const feralOptions = useMemo(() => getAllFeralCards(), []);
  const [activeTab, setActiveTab] = useState<FeralTabKey>("habilidades");

  const specialtyName =
    specialtiesById[entity.specialtyId]?.name ?? entity.specialtyId;

  const utensilDef = utensilsById[entity.utensil.utensilId] as
    | IUtensilDefinition
    | undefined;

  const updateSheet = (patch: Partial<FeralSheetEntity>) => update(patch);

  const customTraits = readCustom(entity, "customTraits");

  const customTechniques = readCustom(entity, "customTechniques");

  const tabs: TabDef[] = [
    {
      key: "habilidades",
      label: "1. Habilidades",
      icon: Award,
      count: skillsList.length,
      color: "#FF9B42",
    },
    {
      key: "tecnicas",
      label: "2. Técnicas",
      icon: Swords,
      count: entity.techniques.length + customTechniques.length,
      color: "#89B5F7",
    },
    {
      key: "tracos",
      label: "3. Traços & Mutações",
      icon: Sparkles,
      count: entity.traits.length + customTraits.length,
      color: "#6FCF97",
    },
    {
      key: "feras",
      label: "4. Feras & Banquetes",
      icon: Users,
      count: entity.feastHistory.length,
      color: "#E08A3C",
    },
    {
      key: "diario",
      label: "5. Diário & Notas",
      icon: FileText,
      count: entity.notes.length,
      color: "#B0A497",
    },
  ];
  const lineageMeta = LINEAGE_META[entity.specialtyId as SpecialtyKey];
  return (
    <div className="min-h-screen w-full bg-[#121110] pb-24 text-[#F5EFEB]">
      <SheetHeader
        eyebrow="Ficha de Feral"
        accent="blue"
        avatarUrl={entity.avatarUrl ?? ""}
        onAvatarChange={(avatarUrl) =>
          update({
            avatarUrl: avatarUrl || undefined,
          })
        }
        avatarFallback={
          entity.name.trim() ? entity.name.trim()[0].toUpperCase() : "?"
        }
        titleValue={entity.name}
        onTitleChange={(name) => update({ name })}
        titlePlaceholder="Nome do Feral"
        onBack={onBack}
        lastSavedAt={lastSavedAt}
        isPending={isPending}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={entity.pronouns}
              onChange={(e) => update({ pronouns: e.target.value })}
              placeholder="pronomes"
              className="w-28 border-b border-transparent bg-transparent text-xs font-medium text-[#B0A497] outline-none transition-colors hover:border-[#383430] focus:border-[#FF9B42]"
            />

            <span
              className={` inline-flex items-center gap-1 rounded-full border ${lineageMeta?.border ?? "border-[#2B6CB0]/40"} ${lineageMeta?.bg ?? "bg-[#13335C]/20"} px-2.5 py-1 text-[10px] font-bold ${lineageMeta?.text ?? "text-[#89B5F7]"} `}
            >
              {lineageMeta?.icon ?? <Target className="h-3 w-3" />}
              {specialtyName}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full border border-[#383430] bg-[#1A1918] px-2.5 py-1 text-[10px] font-bold text-[#FF9B42]">
              <Utensils className="h-3 w-3" />
              {utensilDef?.name ?? entity.utensil.utensilId}
            </span>
          </div>
        }
      />

      <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[380px_1fr] xl:grid-cols-[620px_1fr]">
          {/* ================= COLUNA ESQUERDA ================= */}
          <div className="space-y-4">
            <section className={cardClass}>
              <StatHeader
                icon={<Heart />}
                color="#E5484D"
                title="Vigor (Saúde)"
                value={entity.vigor.current}
                max={entity.vigor.max}
                onMaxChange={(max) =>
                  update({
                    vigor: {
                      ...entity.vigor,
                      max,
                      current: clamp(entity.vigor.current, 0, max),
                    },
                  })
                }
                tooltip="Sua reserva de energia física. Se chegar a 0, você recebe 1 nível de Ferido e seu Vigor é restaurado ao máximo! Com Ferido 3, você corre risco mortal."
                category="Combate"
              />

              <VigorEditor
                vigor={entity.vigor}
                onChange={(vigor) => update({ vigor })}
              />
            </section>

            <section className={cardClass}>
              <StatHeader
                icon={<Utensils />}
                color="#7EA8E0"
                title={"Durabilidade do " + (utensilDef?.name ?? "Utensílio")}
                value={entity.utensil.durability.current}
                max={entity.utensil.durability.max}
                onMaxChange={(max) =>
                  update({
                    utensil: {
                      ...entity.utensil,
                      durability: {
                        ...entity.utensil.durability,
                        max,
                        current: clamp(
                          entity.utensil.durability.current,
                          0,
                          max,
                        ),
                      },
                    },
                  })
                }
                tooltip="Usar técnicas ou bloquear ataques pesados consome Durabilidade. Quando chega a 0, o Utensílio quebra e passa a sofrer penalidades até ser reparado."
                category="Equipamento"
              />

              <UtensilEditor
                utensil={entity.utensil}
                definition={utensilDef}
                onChange={(utensil) => update({ utensil })}
              />
            </section>

            <section className={cardClass}>
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black uppercase tracking-wide text-[#F5EFEB]">
                    Estilos de Ação
                  </h3>

                  <InfoTooltip
                    title="Estilos de Ação"
                    category="Regras Básicas"
                    description="Vão de 1 a 5. Cada ponto em um Estilo adiciona um d6 à pilha de dados rolada quando você age daquela forma. Combine Estilo + Perícia em cada teste."
                  />
                </div>

                <span className="text-[9px] font-bold uppercase tracking-wide text-[#5E564D]">
                  Pilha de dados d6
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.entries(STYLES).map(([key, style]) => {
                  const info = STYLE_INFO[key] ?? {
                    description: "",
                    tooltip: "Estilo de ação do Feral.",
                  };

                  return (
                    <StyleCard
                      key={key}
                      name={style.name}
                      color={style.color}
                      description={info.description}
                      tooltip={info.tooltip}
                      value={entity.styles[key as StyleKey]}
                      min={1}
                      max={5}
                      onChange={(value) =>
                        update({
                          styles: {
                            ...entity.styles,
                            [key]: value,
                          },
                        })
                      }
                    />
                  );
                })}
              </div>
            </section>

            <section className={cardClass}>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black uppercase tracking-wide text-[#F5EFEB]">
                    Condições de Status
                  </h3>

                  <InfoTooltip
                    title="Condições de Status"
                    category="Regras Básicas"
                    description="Efeitos temporários que afetam o Feral durante a Caçada (fadiga, veneno, medo, etc). Clique para ativar e ajuste o nível quando aplicável."
                  />
                </div>

                <span className="text-[9px] font-bold uppercase tracking-wide text-[#5E564D]">
                  {entity.conditions.length} ativa
                  {entity.conditions.length === 1 ? "" : "s"}
                </span>
              </div>

              <ConditionsGrid
                selected={entity.conditions}
                onToggle={(conditionId) =>
                  update({
                    conditions: entity.conditions.some(
                      (c) => c.conditionId === conditionId,
                    )
                      ? entity.conditions.filter(
                          (c) => c.conditionId !== conditionId,
                        )
                      : [
                          ...entity.conditions,
                          {
                            conditionId,
                            level: 1,
                          },
                        ],
                  })
                }
                onLevelChange={(conditionId, level) =>
                  update({
                    conditions: entity.conditions.map((c) =>
                      c.conditionId === conditionId ? { ...c, level } : c,
                    ),
                  })
                }
              />
            </section>
          </div>

          {/* ================= COLUNA DIREITA ================= */}
          <div className="min-w-0 space-y-4">
            <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />

            {activeTab === "habilidades" && (
              <HabilidadesPanel
                skills={entity.skills}
                onChange={(skills) => update({ skills })}
              />
            )}

            {activeTab === "tecnicas" && (
              <TecnicasPanel
                known={entity.techniques}
                custom={customTechniques}
                training={entity.techniqueTraining}
                onToggle={(techniqueId) =>
                  update({
                    techniques: entity.techniques.some(
                      (t) => t.techniqueId === techniqueId,
                    )
                      ? entity.techniques.filter(
                          (t) => t.techniqueId !== techniqueId,
                        )
                      : [...entity.techniques, { techniqueId }],
                  })
                }
                onTrainingChange={(techniqueTraining) =>
                  update({
                    techniqueTraining,
                  })
                }
                onAddCustom={(entryData) =>
                  updateSheet({
                    customTechniques: [
                      {
                        id: generateId(),
                        ...entryData,
                      },
                      ...customTechniques,
                    ],
                  })
                }
                onEditCustom={(id, patch) =>
                  updateSheet({
                    customTechniques: customTechniques.map((c) =>
                      c.id === id ? { ...c, ...patch } : c,
                    ),
                  })
                }
                onRemoveCustom={(id) =>
                  updateSheet({
                    customTechniques: customTechniques.filter(
                      (c) => c.id !== id,
                    ),
                  })
                }
              />
            )}

            {activeTab === "tracos" && (
              <TracosPanel
                selected={entity.traits}
                custom={customTraits}
                onToggleLibrary={(traitId) =>
                  update({
                    traits: entity.traits.some((t) => t.traitId === traitId)
                      ? entity.traits.filter((t) => t.traitId !== traitId)
                      : [
                          ...entity.traits,
                          {
                            traitId,
                            level: 1,
                          },
                        ],
                  })
                }
                onLevelChange={(traitId, level) =>
                  update({
                    traits: entity.traits.map((t) =>
                      t.traitId === traitId ? { ...t, level } : t,
                    ),
                  })
                }
                onAddCustom={(entryData) =>
                  updateSheet({
                    customTraits: [
                      {
                        id: generateId(),
                        ...entryData,
                      },
                      ...customTraits,
                    ],
                  })
                }
                onEditCustom={(id, patch) =>
                  updateSheet({
                    customTraits: customTraits.map((c) =>
                      c.id === id ? { ...c, ...patch } : c,
                    ),
                  })
                }
                onRemoveCustom={(id) =>
                  updateSheet({
                    customTraits: customTraits.filter((c) => c.id !== id),
                  })
                }
              />
            )}

            {activeTab === "feras" && (
              <FerasPanel
                records={entity.feastHistory}
                onAdd={(record) =>
                  update({
                    feastHistory: [record, ...entity.feastHistory],
                  })
                }
                onRemove={(id) =>
                  update({
                    feastHistory: entity.feastHistory.filter(
                      (r) => r.id !== id,
                    ),
                  })
                }
              />
            )}

            {activeTab === "diario" && (
              <DiarioPanel
                entity={entity}
                update={update}
                feralOptions={feralOptions}
              />
            )}
          </div>
        </div>
      </main>

      <FloatingUndoButton visible={canUndo} onUndo={undo} />
    </div>
  );
}

function StatHeader({
  icon,
  color,
  title,
  value,
  max,
  tooltip,
  category,
  onMaxChange,
}: {
  icon: ReactNode;
  color: string;
  title: string;
  value: number;
  max: number;
  category: string;
  tooltip: string;
  onMaxChange: (max: number) => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black"
          style={{
            color,
          }}
        >
          {icon}
        </span>

        <h3 className="truncate text-xs font-black uppercase tracking-wide text-[#F5EFEB]">
          {title}
        </h3>

        <InfoTooltip title={title} description={tooltip} category={category} />
      </div>

      <div className="flex shrink-0 items-baseline gap-1">
        <span className="text-lg font-black leading-none text-[#F5EFEB]">
          {value}
        </span>

        <span className="text-xs font-bold text-[#7A7065]">/</span>

        <input
          type="number"
          min={1}
          value={max}
          onChange={(e) => onMaxChange(Math.max(1, Number(e.target.value)))}
          aria-label={`${title} máximo`}
          className="
            w-10
            border-none
            bg-transparent
            p-0
            text-xs
            font-bold
            text-[#7A7065]
            outline-none
            appearance-none
            focus:text-[#B0A497]
          "
        />
        <span className="text-xs font-bold text-[#7A7065]">MAX</span>
      </div>
    </div>
  );
}

// ============================================================================
// VIGOR
// ============================================================================

function VigorEditor({
  vigor,
  onChange,
}: {
  vigor: IFeral["vigor"];
  onChange: (vigor: IFeral["vigor"]) => void;
}) {
  const percentage =
    vigor.max > 0 ? clamp((vigor.current / vigor.max) * 100, 0, 100) : 0;

  const updateCurrent = (value: number) => {
    onChange({
      ...vigor,
      current: clamp(value, 0, vigor.max),
    });
  };

  return (
    <div className="w-full space-y-3">
      <div className="relative w-full">
        <input
          type="range"
          min={0}
          max={vigor.max}
          value={vigor.current}
          onChange={(e) => updateCurrent(Number(e.target.value))}
          className="
            vigor-slider
            block
            h-3
            w-full
            cursor-pointer
            appearance-none
            rounded-full
            bg-[#2B2825]
            outline-none
          "
          style={{
            background: `linear-gradient(
              to right,
              #c22424 0%,
              #ff7e42 ${percentage}%,
              #2B2825 ${percentage}%,
              #2B2825 100%
            )`,
          }}
        />

        <style>
          {`
            .vigor-slider::-webkit-slider-runnable-track {
              height: 12px;
              border-radius: 9999px;
              background: transparent;
            }

            .vigor-slider::-moz-range-track {
              height: 12px;
              border-radius: 9999px;
              background: transparent;
            }

            .vigor-slider::-webkit-slider-thumb {
              appearance: none;
              width: 20px;
              height: 20px;
              margin-top: -4px;
              border-radius: 9999px;
              border: 3px solid #171514;
              background: #F2E9DE;
              box-shadow:
                0 0 0 1px rgba(255,255,255,0.08),
                0 3px 8px rgba(0,0,0,0.35);
            }

            .vigor-slider::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 9999px;
              border: 3px solid #171514;
              background: #F2E9DE;
              box-shadow:
                0 0 0 1px rgba(255,255,255,0.08),
                0 3px 8px rgba(0,0,0,0.35);
            }

            .vigor-slider:focus-visible::-webkit-slider-thumb {
              box-shadow:
                0 0 0 3px rgba(255,155,66,0.2),
                0 3px 8px rgba(0,0,0,0.35);
            }

            .vigor-slider:focus-visible::-moz-range-thumb {
              box-shadow:
                0 0 0 3px rgba(255,155,66,0.2),
                0 3px 8px rgba(0,0,0,0.35);
            }
          `}
        </style>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        <QuickStepButton
          label="-5"
          onClick={() => updateCurrent(vigor.current - 5)}
        />

        <QuickStepButton
          label="−"
          onClick={() => updateCurrent(vigor.current - 1)}
        />

        <div className="flex min-w-0 items-center justify-center rounded-lg bg-[#211F1D] px-2 py-2">
          <input
            type="number"
            min={0}
            max={vigor.max}
            value={vigor.current}
            onChange={(e) => updateCurrent(Number(e.target.value))}
            className="
              w-full
              min-w-0
              bg-transparent
              text-center
              text-sm
              font-black
              text-[#E8E0D6]
              outline-none
            "
          />
        </div>

        <QuickStepButton
          label="+"
          onClick={() => updateCurrent(vigor.current + 1)}
        />

        <QuickStepButton
          label="+5"
          onClick={() => updateCurrent(vigor.current + 5)}
        />
      </div>
    </div>
  );
}

// ============================================================================
// QUICK STEP
// ============================================================================

function QuickStepButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer shrink-0 rounded-lg border border-[#383430] bg-[#242220] px-2.5 py-1.5 text-[10px] font-black text-[#D8CFC4] transition-colors hover:border-[#FF9B42] hover:text-[#FF9B42]"
    >
      {label}
    </button>
  );
}

// ============================================================================
// UTENSÍLIO
// ============================================================================

function UtensilEditor({
  utensil,
  definition,
  onChange,
}: {
  utensil: IFeralUtensil;
  definition?: IUtensilDefinition;
  onChange: (utensil: IFeralUtensil) => void;
}) {
  const percentage =
    utensil.durability.max > 0
      ? clamp(
          (utensil.durability.current / utensil.durability.max) * 100,
          0,
          100,
        )
      : 0;

  const isBroken = utensil.durability.current <= 0;

  const updateCurrent = (value: number) => {
    onChange({
      ...utensil,
      durability: {
        ...utensil.durability,
        current: clamp(value, 0, utensil.durability.max),
      },
    });
  };

  return (
    <div className="w-full space-y-3">
      <div className="relative w-full">
        <input
          type="range"
          min={0}
          max={utensil.durability.max}
          value={utensil.durability.current}
          onChange={(e) => updateCurrent(Number(e.target.value))}
          className="
            utensil-slider
            block
            h-3
            w-full
            cursor-pointer
            appearance-none
            rounded-full
            bg-[#2B2825]
            outline-none
          "
          style={{
            background: `linear-gradient(
              to right,
              #3d71a1 0%,
              #71a3e6 ${percentage}%,
              #2B2825 ${percentage}%,
              #2B2825 100%
            )`,
          }}
        />

        <style>
          {`
            .utensil-slider::-webkit-slider-runnable-track {
              height: 12px;
              border-radius: 9999px;
              background: transparent;
            }

            .utensil-slider::-moz-range-track {
              height: 12px;
              border-radius: 9999px;
              background: transparent;
            }

            .utensil-slider::-webkit-slider-thumb {
              appearance: none;
              width: 20px;
              height: 20px;
              margin-top: -4px;
              border-radius: 9999px;
              border: 3px solid #171514;
              background: #F2E9DE;
              box-shadow:
                0 0 0 1px rgba(255,255,255,0.08),
                0 3px 8px rgba(0,0,0,0.35);
            }

            .utensil-slider::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 9999px;
              border: 3px solid #171514;
              background: #F2E9DE;
              box-shadow:
                0 0 0 1px rgba(255,255,255,0.08),
                0 3px 8px rgba(0,0,0,0.35);
            }

            .utensil-slider:focus-visible::-webkit-slider-thumb {
              box-shadow:
                0 0 0 3px rgba(126,168,224,0.2),
                0 3px 8px rgba(0,0,0,0.35);
            }

            .utensil-slider:focus-visible::-moz-range-thumb {
              box-shadow:
                0 0 0 3px rgba(126,168,224,0.2),
                0 3px 8px rgba(0,0,0,0.35);
            }
          `}
        </style>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        <QuickStepButton
          label="-5"
          onClick={() => updateCurrent(utensil.durability.current - 5)}
        />

        <QuickStepButton
          label="−"
          onClick={() => updateCurrent(utensil.durability.current - 1)}
        />

        <div className="flex min-w-0 items-center justify-center rounded-lg bg-[#211F1D] text-center px-2 py-2">
          <input
            type="number"
            min={0}
            max={utensil.durability.max}
            value={utensil.durability.current}
            onChange={(e) => updateCurrent(Number(e.target.value))}
            className="
              w-full
              min-w-0
              bg-transparent
              text-center
              text-sm
              font-black
              text-[#E8E0D6]
              outline-none
            "
          />
        </div>

        <QuickStepButton
          label="+"
          onClick={() => updateCurrent(utensil.durability.current + 1)}
        />

        <QuickStepButton
          label="+5"
          onClick={() => updateCurrent(utensil.durability.current + 5)}
        />
      </div>

      {isBroken && definition && (
        <div className="rounded-lg bg-[#2B1A16] px-3 py-2 text-[11px] text-[#F0C4A8]">
          <span className="font-bold">Quebrado: </span>
          {definition.brokenDescription}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ESTILOS — cartão individual
// ============================================================================

function StyleCard({
  name,
  description,
  color,
  tooltip,
  value,
  min,
  max,
  onChange,
}: {
  name: string;
  color: string;
  description: string;
  tooltip: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div
      className={`rounded-xl border bg-[#1E1D1B] p-3`}
      style={{ borderColor: color }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-black text-[#F5EFEB]">{name}</p>

          <InfoTooltip title={name} category="Estilo" description={tooltip} />
        </div>

        <span
          className={`shrink-0 rounded-md  px-1.5 py-0.5 text-[9px] font-black text-[#fff]`}
          style={{ backgroundColor: color }}
        >
          {value}d6
        </span>
      </div>

      <p className="mt-1 text-[10px] leading-relaxed text-[#8F877D]">
        {description}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1">
          {Array.from({ length: max }).map((_, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: i < value ? "#FF9B42" : "#3A3530",
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChange(clamp(value - 1, min, max))}
            className="rounded-md border border-[#383430] bg-[#242220] p-1 text-[#D8CFC4] hover:border-[#FF9B42] hover:text-[#FF9B42]"
          >
            <Minus className="h-3 w-3" />
          </button>

          <button
            type="button"
            onClick={() => onChange(clamp(value + 1, min, max))}
            className="rounded-md border border-[#383430] bg-[#242220] p-1 text-[#D8CFC4] hover:border-[#FF9B42] hover:text-[#FF9B42]"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CONDIÇÕES
// ============================================================================

function ConditionsGrid({
  selected,
  onToggle,
  onLevelChange,
}: {
  selected: Array<{
    conditionId: ID;
    level: number;
  }>;
  onToggle: (conditionId: ID) => void;
  onLevelChange: (conditionId: ID, level: number) => void;
}) {
  const selectedById = useMemo(
    () =>
      new Map(selected.map((condition) => [condition.conditionId, condition])),
    [selected],
  );

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {conditionDefinitions.map((condition) => {
        const conditionOption = condition as {
          id: ID;
          name: string;
          description?: string;
        };

        const active = selectedById.get(conditionOption.id);

        return (
          <div
            key={String(conditionOption.id)}
            className={`
              group flex h-12 min-w-0 items-center gap-2
              rounded-xl border px-2.5
              transition-all duration-150
              ${
                active
                  ? `
                    border-[#8F3B2F]/70
                    bg-[#2A1C18]
                  `
                  : `
                    border-[#383430]
                    bg-[#1E1D1B]
                    hover:border-[#4A433C]
                    hover:bg-[#211F1D]
                  `
              }
            `}
          >
            {/* Área clicável da condição */}
            <button
              type="button"
              onClick={() => onToggle(conditionOption.id)}
              title={conditionOption.description ?? conditionOption.name}
              className="flex min-w-0 flex-1 items-center gap-2 text-left focus:outline-none"
            >
              <span
                className={`
                  h-1.5 w-1.5 shrink-0 rounded-full
                  transition-all duration-150
                  ${
                    active
                      ? "bg-[#D96B4C] shadow-[0_0_7px_rgba(217,107,76,0.55)]"
                      : "bg-[#4C4640] group-hover:bg-[#655D55]"
                  }
                `}
              />

              <span
                className={`
                  min-w-0 truncate text-[10px] font-black uppercase
                  tracking-wide transition-colors
                  ${
                    active
                      ? "text-[#F0C4A8]"
                      : "text-[#B0A497] group-hover:text-[#D8CFC4]"
                  }
                `}
              >
                {conditionOption.name}
              </span>
            </button>

            {/* Tooltip fica fora do botão da condição */}
            <InfoTooltip
              title={conditionOption.name}
              description={conditionOption.description ?? ""}
              category="Condição"
            />

            {/* Controles de nível */}
            {active && (
              <div
                className="
                  flex shrink-0 items-center gap-0.5
                  rounded-lg border border-[#49312A]
                  bg-[#211A17]
                  p-0.5
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    onLevelChange(
                      conditionOption.id,
                      Math.max(1, active.level - 1),
                    )
                  }
                  disabled={active.level <= 1}
                  className="
                    flex h-5 w-5 items-center justify-center
                    rounded-md text-[#a09891]
                    transition-colors
                    hover:bg-[#38251F]
                    hover:text-[#F0C4A8]
                    disabled:pointer-events-none
                    disabled:opacity-25
                  "
                  aria-label={`Diminuir nível de ${conditionOption.name}`}
                >
                  <Minus className="h-3 w-3" />
                </button>

                <span
                  className="
                    min-w-[24px] px-0.5 text-center
                    text-[9px] font-black tabular-nums
                    text-[#F0C4A8]
                  "
                >
                  {active.level}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    onLevelChange(conditionOption.id, active.level + 1)
                  }
                  className="
                    flex h-5 w-5 items-center justify-center
                    rounded-md text-[#a09891]
                    transition-colors
                    hover:bg-[#38251F]
                    hover:text-[#F0C4A8]
                  "
                  aria-label={`Aumentar nível de ${conditionOption.name}`}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// TAB 1 — HABILIDADES
// ============================================================================

function HabilidadesPanel({
  skills,
  onChange,
}: {
  skills: IFeral["skills"];
  onChange: (skills: IFeral["skills"]) => void;
}) {
  return (
    <section className={cardClass}>
      <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black uppercase tracking-wide text-[#F5EFEB]">
            Habilidades do Feral
          </h3>

          <InfoTooltip
            title="Habilidades do Feral"
            category="Regras Básicas"
            description="Cada Habilidade vai de +0 a +3. O bônus é somado diretamente ao resultado do Dado de Ação [A] em testes daquele tipo."
          />
        </div>

        <span className="rounded-lg border border-[#FF9B42]/40 bg-[#2B1A16] px-3 py-1.5 text-[10px] font-black text-[#FF9B42]">
          Teste = Estilo (dados) + Habilidade (+bônus)
        </span>
      </div>

      <p className="mb-4 text-[11px] text-[#8F877D]">
        O bônus da habilidade é somado diretamente ao resultado do Dado de Ação
        [A] nos testes.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {skillsList.map((skill) => {
          const value = skills[skill.key];

          return (
            <div
              key={skill.key}
              className="rounded-xl border border-[#383430] bg-[#1E1D1B] p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <p className="text-[11px] font-black text-[#F5EFEB]">
                    {skill.name}
                  </p>

                  <InfoTooltip
                    title={skill.name}
                    category="Habilidade"
                    description={skill.tooltipHelp}
                  />
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...skills,
                        [skill.key]: clamp(value - 1, 0, 3),
                      })
                    }
                    className="rounded-md border border-[#383430] bg-[#242220] p-1 text-[#D8CFC4] hover:border-[#FF9B42] hover:text-[#FF9B42]"
                  >
                    <Minus className="h-3 w-3" />
                  </button>

                  <span
                    className={`min-w-[30px] rounded-md px-1.5 py-0.5 text-center text-[10px] font-black ${
                      value > 0
                        ? "bg-[#2E6F63]/30 text-[#6FCF97]"
                        : "bg-[#242220] text-[#7A7065]"
                    }`}
                  >
                    +{value}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...skills,
                        [skill.key]: clamp(value + 1, 0, 3),
                      })
                    }
                    className="rounded-md border border-[#383430] bg-[#242220] p-1 text-[#D8CFC4] hover:border-[#FF9B42] hover:text-[#FF9B42]"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <p className="mt-1.5 text-[10px] leading-relaxed text-[#8F877D]">
                {skill.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#FF9B42]/25 bg-[#241B12] px-3.5 py-3">
        <span className="mt-0.5 text-[#FF9B42]">ⓘ</span>

        <p className="text-[10px] leading-relaxed text-[#D8CFC4]">
          <span className="font-black text-[#FF9B42]">
            Dica de Caçador Feral:
          </span>{" "}
          Na criação de personagem, distribua seus pontos entre as perícias que
          melhor representam seu passado humano e sua afinidade de monstro. Cada
          feral preparado começa com +1 em três Habilidades diferentes e +0 nas
          Habilidades restantes
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// TAB 2 — TÉCNICAS
// ============================================================================

function formatTechniqueCost(
  cost: ITechniqueDefinition["cost"],
): string | null {
  if (!cost) return null;

  return `${cost.amount} ${COST_TYPE_LABELS[cost.type] ?? cost.type}`;
}

function techniqueLevelClass(level: ITechniqueDefinition["level"]): string {
  switch (level) {
    case "Iniciante":
      return "border-[#2E6F63]/40 bg-[#153029]/70 text-[#6FCF97]";

    case "Intermediária":
      return "border-[#89B5F7]/40 bg-[#13335C]/60 text-[#89B5F7]";

    case "Avançada":
      return "border-[#A98AFF]/40 bg-[#2B2145]/60 text-[#C2B3FF]";
  }
}

function techniqueLevelIndicator(level: ITechniqueDefinition["level"]): string {
  switch (level) {
    case "Iniciante":
      return "bg-[#6FCF97]";

    case "Intermediária":
      return "bg-[#89B5F7]";

    case "Avançada":
      return "bg-[#A98AFF]";
  }
}

function TecnicasPanel({
  known,
  custom,
  training,
  onToggle,
  onTrainingChange,
  onAddCustom,
  onEditCustom,
  onRemoveCustom,
}: {
  known: IFeral["techniques"];
  custom: ICustomEntry[];
  training?: ITechniqueTraining;
  onToggle: (techniqueId: ID) => void;
  onTrainingChange: (training: ITechniqueTraining | undefined) => void;
  onAddCustom: (entry: Omit<ICustomEntry, "id">) => void;
  onEditCustom: (id: ID, patch: Partial<ICustomEntry>) => void;
  onRemoveCustom: (id: ID) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ICustomEntry | null>(null);

  const knownEntries = useMemo(
    () =>
      known
        .map((selection) => {
          const definition = techniquesById[selection.techniqueId] as
            | ITechniqueDefinition
            | undefined;

          return definition
            ? {
                selection,
                definition,
              }
            : null;
        })
        .filter(
          (
            entry,
          ): entry is {
            selection: IFeral["techniques"][number];
            definition: ITechniqueDefinition;
          } => Boolean(entry),
        ),
    [known],
  );

  const total = knownEntries.length + custom.length;

  const openCreateModal = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEditModal = (entry: ICustomEntry) => {
    setEditing(entry);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <section className={cardClass}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#13335C]/60 text-[#89B5F7]">
            <Swords className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-black uppercase tracking-wide text-[#F5EFEB]">
              Técnicas de Utensílio ({total})
            </h3>
          </div>

          <InfoTooltip
            title="Técnicas de Utensílio"
            category="Combate"
            description="Manobras táticas e golpes especiais executados com o Utensílio de Arkaicaço. Escolha uma Técnica da biblioteca ou crie uma manobra personalizada."
          />
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="
            inline-flex items-center gap-2
            rounded-xl border border-[#2B6CB0]/40
            bg-[#13335C]/40 px-3.5 py-2
            text-xs font-black text-[#89B5F7]
            transition-all duration-150
            hover:border-[#89B5F7]/70
            hover:bg-[#183D69]
            active:scale-[0.98]
          "
        >
          <Plus className="h-4 w-4" />
          Nova Técnica
        </button>
      </div>

      {knownEntries.length > 0 && (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {knownEntries.map(({ selection, definition }) => (
            <TechniqueCard
              key={`lib-${definition.id}`}
              technique={definition}
              onRemove={() => onToggle(selection.techniqueId)}
            />
          ))}
        </div>
      )}

      {custom.length > 0 && (
        <div
          className={
            knownEntries.length > 0
              ? "mt-2.5 grid gap-2.5 sm:grid-cols-2"
              : "grid gap-2.5 sm:grid-cols-2"
          }
        >
          {custom.map((entry) => (
            <TechniqueCard
              key={entry.id}
              custom={entry}
              onEdit={() => openEditModal(entry)}
              onRemove={() => onRemoveCustom(entry.id)}
            />
          ))}
        </div>
      )}

      {total === 0 && (
        <Placeholder
          icon={Swords}
          message="Nenhuma Técnica registrada ainda."
          hint="Adicione uma Técnica da biblioteca ou crie uma manobra personalizada."
        />
      )}

      {modalOpen && (
        <AddTechniqueModal
          known={known}
          editing={editing}
          onToggleLibrary={onToggle}
          onSaveCustom={(data) => {
            if (editing) {
              onEditCustom(editing.id, data);
            } else {
              onAddCustom(data);
            }

            closeModal();
          }}
          onClose={closeModal}
        />
      )}
    </section>
  );
}

function TechniqueCard({
  technique,
  custom,
  onEdit,
  onRemove,
}: {
  technique?: ITechniqueDefinition;
  custom?: ICustomEntry;
  onEdit?: () => void;
  onRemove: () => void;
}) {
  const isCustom = Boolean(custom);
  const name = technique?.name ?? custom?.name ?? "Técnica";
  const description = technique?.description ?? custom?.description ?? "";
  const costLabel = technique ? formatTechniqueCost(technique.cost) : null;

  return (
    <div
      className={`
        group relative overflow-hidden
        rounded-xl border bg-[#1E1D1B]
        transition-all duration-150
        border-[#383430]
        hover:border-[#89B5F7]/50
        hover:bg-[#201F1D]
        }
      `}
    >
      <div
        className={`
          absolute inset-y-0 left-0 w-0.5 bg-[#4D7EBA]}
        `}
      />

      <div className="flex min-w-0 items-start gap-3 p-3.5">
        <div
          className={`
            mt-0.5 flex h-8 w-8 shrink-0
            items-center justify-center
            rounded-lg border
            border-[#89B5F7]/25 bg-[#13335C]/50 text-[#89B5F7]"
          `}
        >
          <Swords className="h-4 w-4 text-[#89B5F7]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="truncate text-[11px] font-black uppercase tracking-wide text-[#F5EFEB]">
                  {name}
                </p>

                {technique?.level && (
                  <span
                    className={`
                      inline-flex shrink-0
                      items-center gap-1.5
                      rounded-md border
                      px-1.5 py-0.5
                      text-[8px] font-black
                      uppercase tracking-wide
                      ${techniqueLevelClass(technique.level)}
                    `}
                  >
                    <span
                      className={`
                        h-1.5 w-1.5 rounded-full
                        ${techniqueLevelIndicator(technique.level)}
                      `}
                    />

                    {technique.level}
                  </span>
                )}

                {isCustom && custom?.badge && (
                  <span className="rounded-md bg-[#242220] px-1.5 py-0.5 text-[9px] font-black text-[#6FCF97]">
                    {custom.badge}
                  </span>
                )}

                {isCustom && !custom?.badge && (
                  <span className="rounded-md bg-[#242220] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-[#6FCF97]">
                    Personalizada
                  </span>
                )}

                {costLabel && (
                  <span className="rounded-md bg-[#242220] px-1.5 py-0.5 text-[9px] font-black text-[#89B5F7]">
                    {costLabel}
                  </span>
                )}

                {technique?.utensils && technique.utensils.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {technique.utensils.map((utensil) => (
                      <span
                        key={String(utensil)}
                        className="rounded-md border border-[#383430] bg-[#171615] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-[#7A7065]"
                      >
                        {utensil}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  aria-label={`Editar ${name}`}
                  className="rounded-lg p-1.5 text-[#6D655D] transition-colors hover:bg-[#242220] hover:text-[#F5EFEB]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}

              <InfoTooltip
                title={name}
                category="Técnica"
                description={description}
              />

              <button
                type="button"
                onClick={onRemove}
                aria-label={`Remover ${name}`}
                className="rounded-lg p-1.5 text-[#6D655D] transition-colors hover:bg-[#2B1F1C] hover:text-[#D97867]"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <p className="text-[10px] leading-relaxed text-[#a7a19a]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ModeTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-wide transition-colors ${
        active
          ? "border-[#89B5F7]/50 bg-[#13335C]/40 text-[#89B5F7]"
          : "border-[#383430] bg-[#1E1D1B] text-[#8F877D] hover:text-[#F5EFEB]"
      }`}
    >
      {label}
    </button>
  );
}

function AddTechniqueModal({
  known,
  editing,
  onToggleLibrary,
  onSaveCustom,
  onClose,
}: {
  known: IFeral["techniques"];
  editing: ICustomEntry | null;
  onToggleLibrary: (techniqueId: ID) => void;
  onSaveCustom: (data: Omit<ICustomEntry, "id">) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"biblioteca" | "personalizada">(
    editing ? "personalizada" : "biblioteca",
  );

  const [search, setSearch] = useState("");

  const [name, setName] = useState(editing?.name ?? "");

  const [badge, setBadge] = useState(editing?.badge ?? "");

  const [description, setDescription] = useState(editing?.description ?? "");

  const knownTechniqueIds = useMemo(
    () => new Set(known.map(({ techniqueId }) => techniqueId)),
    [known],
  );

  const filteredTechniques = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return techniqueDefinitions;
    }

    return techniqueDefinitions.filter((technique) => {
      const searchableText = [
        technique.name,
        technique.description,
        technique.level,
        formatTechniqueCost(technique.cost) ?? "",
        ...(technique.utensils ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [search]);

  function handleSaveCustom() {
    const normalizedName = name.trim();

    if (!normalizedName) return;

    onSaveCustom({
      name: normalizedName,
      badge: badge.trim() || undefined,
      description: description.trim(),
    });
  }

  return (
    <Modal
      title={editing ? "Editar Técnica" : "Nova Técnica"}
      onClose={onClose}
      wide
    >
      {!editing && (
        <div className="mb-4 flex rounded-xl border border-[#383430] bg-[#171615] p-1">
          <ModeTab
            label="Biblioteca"
            active={mode === "biblioteca"}
            onClick={() => setMode("biblioteca")}
          />

          <ModeTab
            label="Personalizada"
            active={mode === "personalizada"}
            onClick={() => setMode("personalizada")}
          />
        </div>
      )}

      {mode === "biblioteca" && !editing ? (
        <div className="space-y-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar técnica..."
            className="
              w-full rounded-xl
              border border-[#383430]
              bg-[#171615]
              px-3 py-2.5
              text-xs text-[#F5EFEB]
              outline-none
              placeholder:text-[#625A53]
              transition-colors
              focus:border-[#89B5F7]/60
            "
          />

          <div className="flex items-center justify-between px-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#625A53]">
              {filteredTechniques.length} resultado
              {filteredTechniques.length === 1 ? "" : "s"}
            </span>

            <span className="text-[9px] font-bold uppercase tracking-wider text-[#89B5F7]">
              {known.length} selecionada
              {known.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
            {filteredTechniques.map((technique) => {
              const isKnown = knownTechniqueIds.has(technique.id);

              return (
                <button
                  key={String(technique.id)}
                  type="button"
                  onClick={() => onToggleLibrary(technique.id)}
                  className={`
                      flex w-full items-start
                      gap-3 rounded-xl border p-3
                      text-left
                      transition-all duration-150
                      ${
                        isKnown
                          ? "border-[#89B5F7]/60 bg-[#13335C]/40"
                          : "border-[#383430] bg-[#1E1D1B] hover:border-[#89B5F7]/40"
                      }
                    `}
                >
                  <span
                    className={`
                        mt-0.5 flex h-7 w-7
                        shrink-0 items-center
                        justify-center rounded-lg
                        border
                        ${
                          isKnown
                            ? "border-[#89B5F7]/50 bg-[#89B5F7]/10 text-[#89B5F7]"
                            : "border-[#383430] bg-[#171615] text-[#5E564D]"
                        }
                      `}
                  >
                    {isKnown ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Swords className="h-3.5 w-3.5" />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-black text-[#F5EFEB]">
                        {technique.name}
                      </span>

                      <span
                        className={`
                            rounded-md border
                            px-1.5 py-0.5
                            text-[8px] font-black
                            uppercase tracking-wide
                            ${techniqueLevelClass(technique.level)}
                          `}
                      >
                        {technique.level}
                      </span>

                      {technique.cost && (
                        <span className="rounded-md bg-[#242220] px-1.5 py-0.5 text-[9px] font-black text-[#89B5F7]">
                          {formatTechniqueCost(technique.cost)}
                        </span>
                      )}
                    </span>

                    <span className="mt-1 block text-[10px] leading-relaxed text-[#8F877D]">
                      {technique.description}
                    </span>

                    {technique.utensils && technique.utensils.length > 0 && (
                      <span className="mt-2 flex flex-wrap gap-1">
                        {technique.utensils.map((utensil) => (
                          <span
                            key={String(utensil)}
                            className="rounded-md border border-[#383430] bg-[#171615] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-[#7A7065]"
                          >
                            {utensil}
                          </span>
                        ))}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}

            {filteredTechniques.length === 0 && (
              <Placeholder
                icon={Swords}
                message="Nenhuma técnica encontrada."
                hint="Tente buscar pelo nome, nível, custo ou utensílio."
              />
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <Field label="Nome" required>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Corte Ascendente"
              className={inputClass}
            />
          </Field>

          <Field label="Selo / Custo" hint="Opcional. Ex: Passiva · 1 Sucesso">
            <input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Ex: Passiva · 1 Sucesso"
              className={inputClass}
            />
          </Field>

          <Field label="Descrição">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} min-h-24 resize-y`}
              placeholder="Descreva o efeito da Técnica..."
            />
          </Field>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl px-3.5 py-2
                text-xs font-bold
                text-[#8F877D]
                transition-colors
                hover:bg-[#242220]
                hover:text-[#F5EFEB]
              "
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSaveCustom}
              disabled={!name.trim()}
              className="
                inline-flex items-center gap-1.5
                rounded-xl border
                border-[#2B6CB0]/40
                bg-[#13335C] px-3.5 py-2
                text-xs font-black text-white
                transition-all
                hover:bg-[#184073]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Check className="h-3.5 w-3.5" />

              {editing ? "Salvar alterações" : "Adicionar Técnica"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ============================================================================
// CARTÃO GENÉRICO
// ============================================================================

function EntryCard({
  name,
  badge,
  description,
  onEdit,
  onRemove,
}: {
  name: string;
  badge?: string;
  description: string;
  onEdit?: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#383430] bg-[#1E1D1B] p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[11px] font-black uppercase tracking-wide text-[#F5EFEB]">
            {name}
          </p>

          {badge && (
            <span className="rounded-md bg-[#242220] px-1.5 py-0.5 text-[9px] font-black text-[#89B5F7]">
              {badge}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg p-1.5 text-[#8F877D] hover:bg-[#242220] hover:text-[#F5EFEB]"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg p-1.5 text-[#B0645A] hover:bg-[#5C2626]/40 hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {description && (
        <p className="mt-1.5 border-t border-[#302D29] pt-1.5 text-[10px] leading-relaxed text-[#8F877D]">
          {description}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// TAB 3 — TRAÇOS & MUTAÇÕES
// ============================================================================

// ============================================================================
// TAB 3 — TRAÇOS & MUTAÇÕES
// ============================================================================

function formatTraitCost(cost: ITraitDefinition["cost"]): string | null {
  if (!cost) return null;

  return `${cost.amount} ${COST_TYPE_LABELS[cost.type] ?? cost.type}`;
}

function TracosPanel({
  selected,
  custom,
  onToggleLibrary,
  onLevelChange,
  onAddCustom,
  onEditCustom,
  onRemoveCustom,
}: {
  selected: Array<{
    traitId: ID;
    level: number;
  }>;
  custom: ICustomEntry[];
  onToggleLibrary: (traitId: ID) => void;
  onLevelChange: (traitId: ID, level: number) => void;
  onAddCustom: (entry: Omit<ICustomEntry, "id">) => void;
  onEditCustom: (id: ID, patch: Partial<ICustomEntry>) => void;
  onRemoveCustom: (id: ID) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ICustomEntry | null>(null);

  const libraryEntries = useMemo(
    () =>
      selected
        .map((selection) => {
          const definition = traitsById[selection.traitId] as
            | ITraitDefinition
            | undefined;

          return definition
            ? {
                selection,
                definition,
              }
            : null;
        })
        .filter(
          (
            entry,
          ): entry is {
            selection: {
              traitId: ID;
              level: number;
            };
            definition: ITraitDefinition;
          } => Boolean(entry),
        ),
    [selected],
  );

  const total = libraryEntries.length + custom.length;

  const openCreateModal = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEditModal = (entry: ICustomEntry) => {
    setEditing(entry);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <section className={cardClass}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2E6F63]/15 text-[#6FCF97]">
            <Sparkles className="h-4 w-4" />
          </div>

          <h3 className="truncate text-sm font-black uppercase tracking-wide text-[#F5EFEB]">
            Traços & Mutações ({total})
          </h3>

          <InfoTooltip
            title="Traços & Mutações Biológicas"
            category="Mutações"
            description="Poderes e mutações corporais herdadas do consumo de monstros."
          />
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="
            inline-flex items-center gap-2
            rounded-xl border border-[#2E6F63]/40
            bg-[#153029]/60 px-3.5 py-2
            text-xs font-black text-[#6FCF97]
            transition-all
            hover:border-[#6FCF97]/70
            hover:bg-[#1A3A31]
          "
        >
          <Plus className="h-4 w-4" />
          Novo Traço
        </button>
      </div>

      {(libraryEntries.length > 0 || custom.length > 0) && (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {libraryEntries.map(({ selection, definition }) => (
            <TraitCard
              key={`library-${definition.id}`}
              trait={definition}
              level={selection.level}
              onLevelChange={(level) => onLevelChange(selection.traitId, level)}
              onRemove={() => onToggleLibrary(selection.traitId)}
            />
          ))}

          {custom.map((entry) => (
            <TraitCard
              key={`custom-${entry.id}`}
              custom={entry}
              level={Math.max(1, entry.level ?? 1)}
              onLevelChange={(level) =>
                onEditCustom(entry.id, {
                  level,
                })
              }
              onEdit={() => openEditModal(entry)}
              onRemove={() => onRemoveCustom(entry.id)}
            />
          ))}
        </div>
      )}

      {total === 0 && (
        <Placeholder
          icon={Sparkles}
          message="Nenhum Traço ou Mutação registrado ainda."
          hint="Adicione um Traço da biblioteca ou crie uma mutação personalizada."
        />
      )}

      {modalOpen && (
        <AddTraitModal
          selected={selected}
          editing={editing}
          onToggleLibrary={onToggleLibrary}
          onLevelChange={onLevelChange}
          onSaveCustom={(data) => {
            if (editing) {
              onEditCustom(editing.id, data);
            } else {
              onAddCustom(data);
            }

            closeModal();
          }}
          onClose={closeModal}
        />
      )}
    </section>
  );
}

function TraitCard({
  trait,
  custom,
  level,
  onLevelChange,
  onEdit,
  onRemove,
}: {
  trait?: ITraitDefinition;
  custom?: ICustomEntry;
  level: number;
  onLevelChange: (level: number) => void;
  onEdit?: () => void;
  onRemove: () => void;
}) {
  const isCustom = Boolean(custom);
  const name = trait?.name ?? custom?.name ?? "Traço";
  const description = trait?.description ?? custom?.description ?? "";
  const costLabel = trait ? formatTraitCost(trait.cost) : custom?.badge;
  const maxLevel = trait?.maxLevel ?? custom?.maxLevel ?? null;
  const canDecrease = level > 1;
  const canIncrease = maxLevel == null || level < maxLevel;

  const decreaseLevel = () => {
    if (!canDecrease) return;

    onLevelChange(Math.max(1, level - 1));
  };

  const increaseLevel = () => {
    if (!canIncrease) return;

    onLevelChange(maxLevel == null ? level + 1 : Math.min(maxLevel, level + 1));
  };

  return (
    <div
      className={`
        group relative overflow-hidden
        rounded-xl border bg-[#1E1D1B]
        transition-all duration-150 border-[#2E6F63]/40 hover:border-[#2E6F63]/70 hover:bg-[#201F1D]"}
      `}
    >
      <div
        className={`
          absolute inset-y-0 left-0 w-0.5 bg-[#6FCF97]"}
        `}
      />

      <div className="flex min-w-0 items-start gap-3 p-3.5">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#2E6F63]/30 bg-[#153029]/60 text-[#6FCF97]">
          <Sparkles className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-[11px] font-black uppercase tracking-wide text-[#F5EFEB]">
                  {name}
                </p>

                {costLabel && (
                  <span className="rounded-md bg-[#242220] px-1.5 py-0.5 text-[9px] font-black text-[#89B5F7]">
                    {costLabel}
                  </span>
                )}

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider">
                      Nível
                    </span>

                    <div className="flex items-center rounded-lg border border-[#383430] bg-[#171615] p-0.5">
                      <button
                        type="button"
                        onClick={decreaseLevel}
                        disabled={!canDecrease}
                        className="
                    flex h-5 w-5
                    items-center justify-center
                    rounded-md text-[#a09891]
                    transition-colors
                    hover:bg-[#242220]
                    hover:text-[#F0C4A8]
                    disabled:pointer-events-none
                    disabled:opacity-25
                  "
                        aria-label={`Diminuir nível de ${name}`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>

                      <span className="min-w-[22px] px-0.5 text-center text-[10px] font-black tabular-nums text-[#6FCF97]">
                        {level}
                      </span>

                      <button
                        type="button"
                        onClick={increaseLevel}
                        disabled={!canIncrease}
                        className="
                    flex h-5 w-5
                    items-center justify-center
                    rounded-md text-[#a09891]
                    transition-colors
                    hover:bg-[#242220]
                    hover:text-[#6FCF97]
                    disabled:pointer-events-none
                    disabled:opacity-25
                  "
                        aria-label={`Aumentar nível de ${name}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {maxLevel != null && (
                    <span className="text-[9px] font-bold text-[#625A53]">
                      Máx. {maxLevel}
                    </span>
                  )}
                </div>

                {isCustom && (
                  <span className="rounded-md bg-[#242220] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-[#6FCF97]">
                    Personalizado
                  </span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  aria-label={`Editar ${name}`}
                  className="rounded-lg p-1.5 text-[#6D655D] transition-colors hover:bg-[#242220] hover:text-[#F5EFEB]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}

              <InfoTooltip
                title={name}
                category="Traço"
                description={description}
              />

              <button
                type="button"
                onClick={onRemove}
                aria-label={`Remover ${name}`}
                className="rounded-lg p-1.5 text-[#6D655D] transition-colors hover:bg-[#2B1F1C] hover:text-[#D97867]"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {description && (
            <p className="mt-2 text-[10px] leading-relaxed text-[#a7a19a]">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function AddTraitModal({
  selected,
  editing,
  onToggleLibrary,
  onLevelChange,
  onSaveCustom,
  onClose,
}: {
  selected: Array<{
    traitId: ID;
    level: number;
  }>;
  editing: ICustomEntry | null;
  onToggleLibrary: (traitId: ID) => void;
  onLevelChange: (traitId: ID, level: number) => void;
  onSaveCustom: (data: Omit<ICustomEntry, "id">) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"biblioteca" | "personalizada">(
    editing ? "personalizada" : "biblioteca",
  );

  const [search, setSearch] = useState("");

  const [name, setName] = useState(editing?.name ?? "");

  const [badge, setBadge] = useState(editing?.badge ?? "");

  const [description, setDescription] = useState(editing?.description ?? "");

  const [level, setLevel] = useState(editing?.level ?? 1);

  const [maxLevel, setMaxLevel] = useState<number | "">(
    editing?.maxLevel ?? "",
  );

  const selectedTraitsById = useMemo(
    () => new Map(selected.map((trait) => [trait.traitId, trait])),
    [selected],
  );

  const filteredTraits = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return traitDefinitions;
    }

    return traitDefinitions.filter((trait) => {
      const searchableText = [
        trait.name,
        trait.description,
        formatTraitCost(trait.cost) ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [search]);

  function handleSaveCustom() {
    const normalizedName = name.trim();

    if (!normalizedName) return;

    const normalizedMax =
      maxLevel === "" ? undefined : Math.max(1, Number(maxLevel));

    const normalizedLevel =
      normalizedMax != null
        ? clamp(Math.max(1, level), 1, normalizedMax)
        : Math.max(1, level);

    onSaveCustom({
      name: normalizedName,
      badge: badge.trim() || undefined,
      description: description.trim(),
      level: normalizedLevel,
      maxLevel: normalizedMax,
    });
  }

  return (
    <Modal
      title={editing ? "Editar Traço" : "Novo Traço"}
      onClose={onClose}
      wide
    >
      {!editing && (
        <div className="mb-4 flex rounded-xl border border-[#383430] bg-[#171615] p-1">
          <ModeTab
            label="Biblioteca"
            active={mode === "biblioteca"}
            onClick={() => setMode("biblioteca")}
          />

          <ModeTab
            label="Personalizado"
            active={mode === "personalizada"}
            onClick={() => setMode("personalizada")}
          />
        </div>
      )}

      {mode === "biblioteca" && !editing ? (
        <div className="space-y-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar traço..."
            className="
              w-full rounded-xl
              border border-[#383430]
              bg-[#171615]
              px-3 py-2.5
              text-xs text-[#F5EFEB]
              outline-none
              placeholder:text-[#625A53]
              transition-colors
              focus:border-[#2E6F63]/70
            "
          />

          <div className="flex items-center justify-between px-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#625A53]">
              {filteredTraits.length} resultado
              {filteredTraits.length === 1 ? "" : "s"}
            </span>

            <span className="text-[9px] font-bold uppercase tracking-wider text-[#6FCF97]">
              {selected.length} selecionado
              {selected.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
            {filteredTraits.map((trait) => {
              const selectedTrait = selectedTraitsById.get(trait.id);

              const isSelected = Boolean(selectedTrait);

              return (
                <div
                  key={String(trait.id)}
                  className={`
                      rounded-xl border p-3
                      transition-all
                      ${
                        isSelected
                          ? "border-[#2E6F63]/70 bg-[#15302B]"
                          : "border-[#383430] bg-[#1E1D1B] hover:border-[#4A433C]"
                      }
                    `}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleLibrary(trait.id)}
                      className={`
                          mt-0.5 flex h-7 w-7
                          shrink-0 items-center
                          justify-center rounded-lg
                          border
                          ${
                            isSelected
                              ? "border-[#2E6F63]/60 bg-[#2E6F63]/20 text-[#6FCF97]"
                              : "border-[#383430] bg-[#171615] text-transparent hover:border-[#6FCF97]/40"
                          }
                        `}
                      aria-label={
                        isSelected
                          ? `Remover ${trait.name}`
                          : `Adicionar ${trait.name}`
                      }
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-[11px] font-black text-[#F5EFEB]">
                          {trait.name}
                        </p>

                        {trait.cost && (
                          <span className="rounded-md bg-[#242220] px-1.5 py-0.5 text-[9px] font-black text-[#89B5F7]">
                            {formatTraitCost(trait.cost)}
                          </span>
                        )}

                        {trait.maxLevel != null && (
                          <span className="rounded-md bg-[#242220] px-1.5 py-0.5 text-[9px] font-black text-[#6FCF97]">
                            Máx. {trait.maxLevel}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-[10px] leading-relaxed text-[#8F877D]">
                        {trait.description}
                      </p>

                      {isSelected && selectedTrait && (
                        <div className="mt-2 flex items-center justify-between border-t border-[#2E6F63]/20 pt-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#625A53]">
                            Nível {selectedTrait.level}
                          </span>

                          <div className="flex items-center gap-0.5 rounded-lg border border-[#2E6F63]/30 bg-[#171615] p-0.5">
                            <button
                              type="button"
                              onClick={() =>
                                onLevelChange(
                                  trait.id,
                                  Math.max(1, selectedTrait.level - 1),
                                )
                              }
                              disabled={selectedTrait.level <= 1}
                              className="flex h-5 w-5 items-center justify-center rounded-md text-[#a09891] hover:bg-[#242220] hover:text-[#F0C4A8] disabled:pointer-events-none disabled:opacity-25"
                            >
                              <Minus className="h-3 w-3" />
                            </button>

                            <span className="min-w-[22px] text-center text-[9px] font-black text-[#6FCF97]">
                              {selectedTrait.level}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                onLevelChange(
                                  trait.id,
                                  trait.maxLevel != null
                                    ? Math.min(
                                        trait.maxLevel,
                                        selectedTrait.level + 1,
                                      )
                                    : selectedTrait.level + 1,
                                )
                              }
                              disabled={
                                trait.maxLevel != null &&
                                selectedTrait.level >= trait.maxLevel
                              }
                              className="flex h-5 w-5 items-center justify-center rounded-md text-[#a09891] hover:bg-[#242220] hover:text-[#6FCF97] disabled:pointer-events-none disabled:opacity-25"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredTraits.length === 0 && (
              <Placeholder
                icon={Sparkles}
                message="Nenhum traço encontrado."
                hint="Tente buscar por nome, efeito ou custo."
              />
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <Field label="Nome" required>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Garras Retráteis"
              className={inputClass}
            />
          </Field>

          <Field label="Selo / Custo" hint="Opcional.">
            <input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Ex: Passiva"
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Nível inicial">
              <input
                type="number"
                min={1}
                value={level}
                onChange={(e) => setLevel(Math.max(1, Number(e.target.value)))}
                className={inputClass}
              />
            </Field>

            <Field label="Nível máximo" hint="Opcional.">
              <input
                type="number"
                min={1}
                value={maxLevel}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "") {
                    setMaxLevel("");
                    return;
                  }

                  const parsed = Number(value);

                  setMaxLevel(
                    Number.isFinite(parsed) ? Math.max(1, parsed) : "",
                  );
                }}
                className={inputClass}
                placeholder="Sem limite"
              />
            </Field>
          </div>

          <Field label="Descrição">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} min-h-24 resize-y`}
              placeholder="Descreva o efeito do Traço..."
            />
          </Field>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-3.5 py-2 text-xs font-bold text-[#8F877D] transition-colors hover:bg-[#242220] hover:text-[#F5EFEB]"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSaveCustom}
              disabled={!name.trim()}
              className="
                inline-flex items-center
                gap-1.5 rounded-xl
                border border-[#2E6F63]/40
                bg-[#2E6F63]
                px-3.5 py-2
                text-xs font-black text-white
                transition-all
                hover:bg-[#357C6F]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Check className="h-3.5 w-3.5" />

              {editing ? "Salvar alterações" : "Adicionar Traço"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
// ============================================================================
// TAB 4 — FERAS & BANQUETES
// ============================================================================

function describeReward(reward: PermanentReward): string {
  if (reward.type === "style") return `+1 Estilo: ${STYLES[reward.key].name}`;

  if (reward.type === "skill") return `+1 Perícia: ${SKILLS[reward.key].name}`;

  return `Traço: ${traitsById[reward.traitId]?.name ?? "—"}`;
}

function FerasPanel({
  records,
  onAdd,
  onRemove,
}: {
  records: IFeastRecord[];
  onAdd: (record: IFeastRecord) => void;
  onRemove: (id: ID) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className={cardClass}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black uppercase tracking-wide text-[#F5EFEB]">
            Banquete Feral ({records.length})
          </h3>

          <InfoTooltip
            title="Banquete Feral"
            category="Companheiros"
            description="Registro das Criaturas banqueteadas e as recompensas permanentes obtidas em cada Banquete."
          />
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E08A3C]/40 bg-[#2B1A16] px-3.5 py-2 text-xs font-black text-[#E08A3C] transition-colors hover:border-[#E08A3C]"
        >
          <Plus className="h-4 w-4" />
          Registrar Banquete
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {records.map((record) => {
          const monster = creaturesById[record.monsterId] as
            | ICreature
            | undefined;

          return (
            <div
              key={record.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-[#383430] bg-[#1E1D1B] p-3.5"
            >
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold text-[#F5EFEB]">
                  {record.dishName || "Banquete sem nome"}
                </p>

                <p className="mt-0.5 text-[10px] text-[#8F877D]">
                  {monster?.name ?? "Criatura desconhecida"}
                  {record.date ? ` · ${record.date}` : ""}
                </p>

                <p className="mt-1 text-[10px] font-bold text-[#FF9B42]">
                  {describeReward(record.permanentReward)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemove(record.id)}
                className="shrink-0 rounded-lg p-1.5 text-[#B0645A] hover:bg-[#5C2626]/40 hover:text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {records.length === 0 && (
        <Placeholder
          icon={Users}
          message="Nenhum Banquete registrado ainda."
          hint="Registre a Criatura banqueteada e a recompensa permanente obtida."
        />
      )}

      {modalOpen && (
        <Modal title="Registrar Banquete" onClose={() => setModalOpen(false)}>
          <FeastRecordForm
            onAdd={(record) => {
              onAdd(record);
              setModalOpen(false);
            }}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </section>
  );
}

function FeastRecordForm({
  onAdd,
  onCancel,
}: {
  onAdd: (record: IFeastRecord) => void;
  onCancel: () => void;
}) {
  const [monsterId, setMonsterId] = useState("");

  const [dishName, setDishName] = useState("");

  const [date, setDate] = useState("");

  const [rewardType, setRewardType] =
    useState<PermanentReward["type"]>("trait");

  const [styleKey, setStyleKey] = useState<StyleKey>("ligeiro");

  const [skillKey, setSkillKey] = useState<SkillKey>("agarrar");

  const [traitId, setTraitId] = useState("");

  const canSubmit =
    monsterId !== "" && (rewardType !== "trait" || traitId !== "");

  function handleSubmit() {
    if (!canSubmit) return;

    const permanentReward: PermanentReward =
      rewardType === "style"
        ? {
            type: "style",
            key: styleKey,
          }
        : rewardType === "skill"
          ? {
              type: "skill",
              key: skillKey,
            }
          : {
              type: "trait",
              traitId: Number(traitId),
            };

    onAdd({
      id: generateId(),
      monsterId: Number(monsterId),
      dishName: dishName.trim() || undefined,
      date: date || undefined,
      permanentReward,
    });
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Criatura" required>
          <select
            value={monsterId}
            onChange={(e) => setMonsterId(e.target.value)}
            className={inputClass}
          >
            <option value="">Selecionar...</option>

            {creatureDefinitions.map((creature) => (
              <option key={creature.id} value={creature.id}>
                {creature.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Nome do prato" hint="Opcional">
          <input
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Data" hint="Opcional">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Tipo de recompensa">
          <select
            value={rewardType}
            onChange={(e) =>
              setRewardType(e.target.value as PermanentReward["type"])
            }
            className={inputClass}
          >
            <option value="trait">Traço</option>

            <option value="style">Estilo</option>

            <option value="skill">Perícia</option>
          </select>
        </Field>
      </div>

      {rewardType === "style" && (
        <Field label="Estilo">
          <select
            value={styleKey}
            onChange={(e) => setStyleKey(e.target.value as StyleKey)}
            className={inputClass}
          >
            {Object.entries(STYLES).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      {rewardType === "skill" && (
        <Field label="Perícia">
          <select
            value={skillKey}
            onChange={(e) => setSkillKey(e.target.value as SkillKey)}
            className={inputClass}
          >
            {Object.entries(SKILLS).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      {rewardType === "trait" && (
        <Field label="Traço" required>
          <select
            value={traitId}
            onChange={(e) => setTraitId(e.target.value)}
            className={inputClass}
          >
            <option value="">Selecionar...</option>

            {traitDefinitions.map((trait) => (
              <option key={trait.id} value={trait.id}>
                {trait.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#55A99A]/40 bg-[#2E6F63] px-3.5 py-2 text-xs font-black text-white transition-colors hover:bg-[#357C6F] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Check className="h-3.5 w-3.5" />
          Adicionar
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-2 text-xs font-bold text-[#B0A497] hover:text-[#F5EFEB]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// TAB 5 — DIÁRIO & NOTAS
// ============================================================================

function DiarioPanel({
  entity,
  update,
  feralOptions,
}: {
  entity: IFeral;
  update: (patch: Partial<IFeral>) => void;
  feralOptions: ReturnType<typeof getAllFeralCards>;
}) {
  const [section, setSection] = useState<"historia" | "notas">("notas");

  return (
    <section className={cardClass}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black uppercase tracking-wide text-[#F5EFEB]">
            Diário & Notas
          </h3>

          <InfoTooltip
            title="Diário & Notas"
            category="Campanha"
            description="Anotações livres sobre a jornada do Feral, além da História pessoal: Origem, Personalidade, Monstro Importante e Matilha."
          />
        </div>

        <div className="flex gap-2">
          <ModeTab
            label="Anotações"
            active={section === "notas"}
            onClick={() => setSection("notas")}
          />

          <ModeTab
            label="História"
            active={section === "historia"}
            onClick={() => setSection("historia")}
          />
        </div>
      </div>

      {section === "notas" ? (
        <JournalNotesEditor
          notes={entity.notes}
          onChange={(notes) => update({ notes })}
        />
      ) : (
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h4 className="text-[11px] font-black uppercase tracking-wide text-[#B0A497]">
                Origem
              </h4>

              <InfoTooltip
                title="Origem"
                description="Os marcos que moldaram o Feral: os pratos de Criação, Iniciação e Ambição, além da terra natal e uma conexão com outro Feral."
              />
            </div>

            <OriginEditor
              origin={entity.origin}
              onChange={(origin) => update({ origin })}
              feralOptions={feralOptions}
              selfId={entity.id}
            />
          </div>

          <div>
            <h4 className="mb-2 text-[11px] font-black uppercase tracking-wide text-[#B0A497]">
              Personalidade
            </h4>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="É...">
                <input
                  value={entity.personality.is}
                  onChange={(e) =>
                    update({
                      personality: {
                        ...entity.personality,
                        is: e.target.value,
                      },
                    })
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Busca ser...">
                <input
                  value={entity.personality.strivesToBe}
                  onChange={(e) =>
                    update({
                      personality: {
                        ...entity.personality,
                        strivesToBe: e.target.value,
                      },
                    })
                  }
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-[11px] font-black uppercase tracking-wide text-[#B0A497]">
              Monstro Importante
            </h4>

            <ImportantMonsterEditor
              value={entity.importantMonster}
              onChange={(importantMonster) =>
                update({
                  importantMonster,
                })
              }
            />
          </div>
        </div>
      )}
    </section>
  );
}

const ORIGIN_DISH_META: {
  key: "creation" | "initiation" | "ambition";
  type: OriginDishType;
}[] = [
  {
    key: "creation",
    type: "criacao",
  },
  {
    key: "initiation",
    type: "iniciacao",
  },
  {
    key: "ambition",
    type: "ambicao",
  },
];

function OriginEditor({
  origin,
  onChange,
  feralOptions,
  selfId,
}: {
  origin: IFeralOrigin;
  onChange: (origin: IFeralOrigin) => void;
  feralOptions: ReturnType<typeof getAllFeralCards>;
  selfId: ID;
}) {
  function updateDish(
    key: "creation" | "initiation" | "ambition",
    patch: Partial<IOriginDish>,
  ) {
    onChange({
      ...origin,
      [key]: {
        ...origin[key],
        ...patch,
      },
    });
  }

  function updateConnection(patch: Partial<IOriginConnection>) {
    onChange({
      ...origin,
      connection: {
        ...origin.connection,
        ...patch,
      },
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {ORIGIN_DISH_META.map(({ key, type }) => {
          const dish = origin[key];

          return (
            <div
              key={key}
              className="space-y-3 rounded-xl border border-[#383430] bg-[#1E1D1B] p-3.5"
            >
              <p className="text-[10px] font-black uppercase tracking-wider text-[#FF9B42]">
                {ORIGIN_DISH_LABELS[type]}
              </p>

              <Field label="Descrição">
                <textarea
                  value={dish.description}
                  onChange={(e) =>
                    updateDish(key, {
                      description: e.target.value,
                    })
                  }
                  className={`${inputClass} min-h-20 resize-y text-xs`}
                />
              </Field>

              <Field label="Bônus de Perícia">
                <select
                  value={dish.skillBonus}
                  onChange={(e) =>
                    updateDish(key, {
                      skillBonus: e.target.value as SkillKey,
                    })
                  }
                  className={inputClass}
                >
                  {Object.entries(SKILLS).map(([skill, meta]) => (
                    <option key={skill} value={skill}>
                      {meta.name}
                    </option>
                  ))}
                </select>
              </Field>

              {key === "initiation" && (
                <Field label="Criatura do 1º Banquete">
                  <select
                    value={dish.monsterId ?? ""}
                    onChange={(e) =>
                      updateDish(key, {
                        monsterId: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="">Selecionar...</option>

                    {creatureDefinitions.map((creature) => (
                      <option key={creature.id} value={creature.id}>
                        {creature.name}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              <Field label="Notas" hint="Opcional">
                <input
                  value={dish.notes ?? ""}
                  onChange={(e) =>
                    updateDish(key, {
                      notes: e.target.value || undefined,
                    })
                  }
                  className={inputClass}
                />
              </Field>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Terra natal" hint="Opcional">
          <input
            value={origin.homeland ?? ""}
            onChange={(e) =>
              onChange({
                ...origin,
                homeland: e.target.value || undefined,
              })
            }
            className={inputClass}
          />
        </Field>

        <Field label="Ingrediente típico">
          <input
            value={origin.typicalIngredient}
            onChange={(e) =>
              onChange({
                ...origin,
                typicalIngredient: e.target.value,
              })
            }
            className={inputClass}
          />
        </Field>

        <Field label="Tempero típico">
          <input
            value={origin.typicalSeasoning}
            onChange={(e) =>
              onChange({
                ...origin,
                typicalSeasoning: e.target.value,
              })
            }
            className={inputClass}
          />
        </Field>
      </div>

      <div className="rounded-xl border border-[#302D29] bg-[#171615] p-3.5">
        <div className="mb-3 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-[#38C2B3]" />

          <p className="text-[11px] font-black uppercase tracking-wide text-[#89B5F7]">
            Conexão com outro Feral
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Feral parceiro">
            <select
              value={origin.connection.partnerFeralId || ""}
              onChange={(e) =>
                updateConnection({
                  partnerFeralId: e.target.value ? Number(e.target.value) : 0,
                })
              }
              className={inputClass}
            >
              <option value="">Nenhum</option>

              {feralOptions
                .filter((f) => f.id !== selfId)
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
            </select>
          </Field>

          <Field label="Prato associado">
            <select
              value={origin.connection.dish}
              onChange={(e) =>
                updateConnection({
                  dish: e.target.value as OriginDishType,
                })
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

        <div className="mt-3">
          <Field label="Descrição da conexão">
            <textarea
              value={origin.connection.description}
              onChange={(e) =>
                updateConnection({
                  description: e.target.value,
                })
              }
              className={`${inputClass} min-h-16 resize-y text-xs`}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

function ImportantMonsterEditor({
  value,
  onChange,
}: {
  value: IImportantMonsterRelation;
  onChange: (value: IImportantMonsterRelation) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Criatura">
        <select
          value={value.monsterId}
          onChange={(e) =>
            onChange({
              ...value,
              monsterId: Number(e.target.value),
            })
          }
          className={inputClass}
        >
          {creatureDefinitions.map((creature) => (
            <option key={creature.id} value={creature.id}>
              {creature.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Relação">
        <input
          value={value.description}
          onChange={(e) =>
            onChange({
              ...value,
              description: e.target.value,
            })
          }
          className={inputClass}
        />
      </Field>
    </div>
  );
}

function MatilhaMembershipEditor({
  matilhas,
  currentMatilha,
  onJoin,
  onLeave,
}: {
  matilhas: IMatilha[];
  currentMatilha: IMatilha | undefined;
  onJoin: (matilhaId: ID) => void;
  onLeave: () => void;
}) {
  return (
    <div className="space-y-3">
      {currentMatilha ? (
        <div className="flex items-center justify-between rounded-xl border border-[#2B6CB0]/40 bg-[#13335C]/20 px-3.5 py-3">
          <div>
            <p className="text-[11px] font-bold text-[#F5EFEB]">
              {currentMatilha.name}
            </p>

            <p className="text-[10px] text-[#8F877D]">
              {currentMatilha.memberIds.length} membro
              {currentMatilha.memberIds.length === 1 ? "" : "s"}
            </p>
          </div>

          <button
            type="button"
            onClick={onLeave}
            className="rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-[#B0645A] transition-colors hover:bg-[#5C2626]/40 hover:text-white"
          >
            Sair
          </button>
        </div>
      ) : (
        <p className="text-[11px] text-[#8F877D]">
          Este Feral não pertence a nenhuma Matilha no momento.
        </p>
      )}

      {matilhas.length > 0 && (
        <Field
          label={currentMatilha ? "Trocar de Matilha" : "Entrar em uma Matilha"}
        >
          <select
            value=""
            onChange={(e) => e.target.value && onJoin(Number(e.target.value))}
            className={inputClass}
          >
            <option value="">Selecionar...</option>

            {matilhas
              .filter((m) => m.id !== currentMatilha?.id)
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
          </select>
        </Field>
      )}
    </div>
  );
}

function JournalNotesEditor({
  notes,
  onChange,
}: {
  notes: IJournalNote[];
  onChange: (notes: IJournalNote[]) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  function addNote(note: IJournalNote) {
    onChange([note, ...notes]);
    setModalOpen(false);
  }

  function removeNote(id: ID) {
    onChange(notes.filter((note) => note.id !== id));
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-[#383430] bg-[#242220] px-3.5 py-2 text-xs font-black text-[#F5EFEB] transition-colors hover:border-[#FF9B42]"
      >
        <Plus className="h-4 w-4 text-[#FF9B42]" />
        Nova Anotação
      </button>

      <div className="grid gap-3 sm:grid-cols-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className="space-y-1.5 rounded-xl border border-[#383430] bg-[#1E1D1B] p-3.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[11px] font-black text-[#F5EFEB]">
                  {note.title || "Sem título"}
                </p>

                <span className="text-[9px] font-bold uppercase tracking-wide text-[#7A7065]">
                  {note.category}
                </span>
              </div>

              <button
                type="button"
                onClick={() => removeNote(note.id)}
                className="shrink-0 rounded-lg p-1.5 text-[#B0645A] hover:bg-[#5C2626]/40 hover:text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="text-[10px] leading-relaxed text-[#B0A497]">
              {note.content}
            </p>

            <p className="text-[9px] text-[#5E564D]">
              {formatRelativeTime(note.createdAt)}
            </p>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <Placeholder
          icon={FileText}
          message="Nenhuma anotação registrada ainda."
          hint="Registre descobertas, eventos e memórias da jornada do Feral."
        />
      )}

      {modalOpen && (
        <Modal title="Nova Anotação" onClose={() => setModalOpen(false)}>
          <NewNoteForm onAdd={addNote} onCancel={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

function NewNoteForm({
  onAdd,
  onCancel,
}: {
  onAdd: (note: IJournalNote) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");

  const [category, setCategory] = useState("Geral");

  const [content, setContent] = useState("");

  function handleSubmit() {
    onAdd({
      id: generateId(),
      title,
      category,
      content,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <Field label="Título">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Categoria">
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Conteúdo">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="O que aconteceu..."
          className={`${inputClass} min-h-28 resize-y`}
        />
      </Field>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#383430] bg-[#242220] px-3.5 py-2 text-xs font-black text-[#F5EFEB] transition-colors hover:border-[#FF9B42]"
        >
          <Check className="h-3.5 w-3.5" />
          Adicionar
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-2 text-xs font-bold text-[#B0A497] hover:text-[#F5EFEB]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default FeralSheet;
