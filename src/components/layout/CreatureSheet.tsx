import { useState } from "react";
import type { ReactNode } from "react";
import {
  Award,
  Check,
  ChevronDown,
  HelpCircle,
  Layers,
  Leaf,
  Minus,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import type {
  ICreature,
  ID,
  MonsterLineage,
  MonsterStage,
  SkillKey,
  StyleKey,
} from "../../types/types";
import {
  STYLES,
  traitsById,
  conditionDefinitions,
  skillsList,
  STYLE_INFO,
} from "../../data/wilderfeastData";
import {
  deleteCreature,
  generateId,
  getCreatureById,
  saveCreature,
} from "../../lib/storage";
import {
  ALL_MONSTER_LINEAGES,
  ALL_MONSTER_STAGES,
} from "../../types/wilderfeastTypes";
import { useAutosaveEntity } from "../../hooks/useAutosaveEntity";
import {
  Field,
  cardClass,
  inputClass,
} from "../../components/creation/FormControls";
import { PartEditor } from "../../components/creation/PartEditor";
import { createEmptyCreaturePart } from "../../lib/creatureCreation";
import { SheetHeader } from "../../components/layout/SheetHeader";
import { SheetNotFound } from "../../components/layout/SheetNotFound";
import { FloatingUndoButton } from "../../components/ui/FloatingUndoButton";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

// ============================================================================
// EXTENSÕES "LIVRES" (traços 100% personalizados, criados pelo usuário)
// ============================================================================

interface ICustomEntry {
  id: string;
  name: string;
  badge?: string;
  description: string;
  category: "principal" | "adicional";
}

function readCustom<T>(entity: unknown, key: string): T[] {
  const value = (entity as Record<string, unknown>)[key];
  return Array.isArray(value) ? (value as T[]) : [];
}

// ============================================================================
// TOOLTIP / INFO
// ============================================================================

function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((current) => !current);
        }}
        className="text-[#7A7065] transition-colors hover:text-[#FF9B42]"
        aria-label="Ajuda"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      {open && (
        <span className="absolute left-1/2 top-full z-50 mt-2 w-60 -translate-x-1/2 rounded-lg border border-[#383430] bg-[#1A1918] p-3 text-[10px] leading-relaxed text-[#D8CFC4] shadow-2xl">
          {text}
        </span>
      )}
    </span>
  );
}

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
        className={`max-h-[85vh] w-full ${wide ? "max-w-2xl" : "max-w-md"} overflow-y-auto rounded-2xl border border-[#383430] bg-[#1A1918] p-5 shadow-2xl`}
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
  key: string;
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
  active: string;
  onChange: (key: string) => void;
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
            <Icon
              className="h-3.5 w-3.5"
              style={isActive ? { color: tab.color } : undefined}
            />
            {tab.label}
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-black"
              style={{
                backgroundColor: isActive ? `${tab.color}33` : "#242220",
                color: isActive ? tab.color : "#8F877D",
              }}
            >
              {tab.count}
            </span>
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

interface CreatureSheetProps {
  creatureId: ID;
  onBack: () => void;
  onDeleted: () => void;
}

/** Ponto de entrada: carrega a Creature do storage e trata o caso de "não encontrada". */
function CreatureSheet({ creatureId, onBack, onDeleted }: CreatureSheetProps) {
  const initial = getCreatureById(creatureId);

  if (!initial) {
    return <SheetNotFound label="Criatura" onBack={onBack} />;
  }

  return (
    <CreatureSheetView
      key={creatureId}
      initial={initial}
      onBack={onBack}
      onDeleted={onDeleted}
    />
  );
}

type CreatureTabKey = "pericias" | "tracos" | "partes" | "ecologia";

function CreatureSheetView({
  initial,
  onBack,
  onDeleted,
}: {
  initial: ICreature;
  onBack: () => void;
  onDeleted: () => void;
}) {
  const { entity, update, undo, canUndo, lastSavedAt, isPending } =
    useAutosaveEntity<ICreature>({ initial, save: saveCreature });

  const [activeTab, setActiveTab] = useState<CreatureTabKey>("pericias");
  const [addPartOpen, setAddPartOpen] = useState(false);
  const [draftPart, setDraftPart] = useState(() => createEmptyCreaturePart());

  const updateRaw = (patch: Record<string, unknown>) =>
    update(patch as Partial<ICreature>);

  function handleDelete() {
    deleteCreature(entity.id);
    onDeleted();
  }

  function openAddPart() {
    setDraftPart(createEmptyCreaturePart());
    setAddPartOpen(true);
  }

  function confirmAddPart() {
    update({ parts: [...entity.parts, draftPart] });
    setAddPartOpen(false);
  }

  function updatePart(
    index: number,
    patch: Partial<ICreature["parts"][number]>,
  ) {
    update({
      parts: entity.parts.map((part, i) =>
        i === index ? { ...part, ...patch } : part,
      ),
    });
  }

  function removePart(index: number) {
    update({ parts: entity.parts.filter((_, i) => i !== index) });
  }

  const customTraits = readCustom<ICustomEntry>(entity, "customTraits");
  const principalTraits =
    entity.traits.length +
    customTraits.filter((c) => c.category === "principal").length;
  const additionalTraits =
    entity.additionalTraits.length +
    customTraits.filter((c) => c.category === "adicional").length;

  const tabs: TabDef[] = [
    {
      key: "pericias",
      label: "1. Perícias",
      icon: Award,
      count: skillsList.length,
      color: "#89B5F7",
    },
    {
      key: "tracos",
      label: "2. Traços & Mutações",
      icon: Sparkles,
      count: principalTraits + additionalTraits,
      color: "#6FCF97",
    },
    {
      key: "partes",
      label: "3. Partes do Corpo",
      icon: Layers,
      count: entity.parts.length,
      color: "#FF9B42",
    },
    {
      key: "ecologia",
      label: "4. Ecologia",
      icon: Leaf,
      count: 0,
      color: "#B0A497",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#121110] pb-24 text-[#F5EFEB]">
      <SheetHeader
        eyebrow="Ficha de Criatura"
        accent="red"
        avatarUrl={entity.avatarUrl ?? ""}
        onAvatarChange={(avatarUrl) =>
          update({ avatarUrl: avatarUrl || undefined })
        }
        avatarFallback={
          entity.name.trim() ? entity.name.trim()[0].toUpperCase() : "?"
        }
        titleValue={entity.name}
        onTitleChange={(name) => update({ name })}
        titlePlaceholder="Nome da Criatura"
        onBack={onBack}
        lastSavedAt={lastSavedAt}
        isPending={isPending}
        actions={<></>}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={entity.lineage}
              onChange={(e) =>
                update({ lineage: e.target.value as MonsterLineage })
              }
              className="rounded-full border border-[#3A2323] bg-[#1E1716] px-2.5 py-1 text-[10px] font-bold text-[#FF9B42] outline-none focus:border-[#FF9B42]"
            >
              {ALL_MONSTER_LINEAGES.map((lineage) => (
                <option key={lineage} value={lineage}>
                  {lineage}
                </option>
              ))}
            </select>
            <select
              value={entity.stage}
              onChange={(e) =>
                update({ stage: e.target.value as MonsterStage })
              }
              className="rounded-full border border-[#383430] bg-[#1A1918] px-2.5 py-1 text-[10px] font-bold text-[#89B5F7] outline-none focus:border-[#FF9B42]"
            >
              {ALL_MONSTER_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  Estágio {stage}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
          {/* ================= COLUNA ESQUERDA ================= */}
          <div className="space-y-5">
            <section className={cardClass}>
              <div className="mb-3 flex items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#8F877D]">
                  Ficha oficial de Criatura
                </p>
                <InfoTip text="Tamanho, porte físico e aparência geral da Criatura — útil para descrever seu impacto visual durante a Caçada." />
              </div>
              <div className="space-y-3">
                <Field label="Tamanho / porte">
                  <input
                    value={entity.sizeDescription}
                    onChange={(e) =>
                      update({ sizeDescription: e.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Descrição">
                  <textarea
                    value={entity.description}
                    onChange={(e) => update({ description: e.target.value })}
                    className={`${inputClass} min-h-20 resize-y text-xs`}
                  />
                </Field>
              </div>
            </section>

            <section className={cardClass}>
              <StatHeader
                icon="♥"
                color="#E5484D"
                title="Vigor"
                value={entity.vigor.current}
                max={entity.vigor.max}
                tooltip="Resistência da Criatura durante a Caçada. Ao chegar a 0, a Criatura é derrotada."
              />
              <VigorEditor
                vigor={entity.vigor}
                onChange={(vigor) => update({ vigor })}
              />
            </section>

            <section className={cardClass}>
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black uppercase tracking-wide text-[#F5EFEB]">
                    Estilos de Ação
                  </h3>
                  <InfoTip text="Vão de 0 a 5. Cada ponto em um Estilo adiciona um d6 à pilha de dados rolada quando a Criatura age daquela forma." />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wide text-[#5E564D]">
                  Pilha de dados d6
                </span>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.entries(STYLES).map(([key, meta]) => {
                  const info = STYLE_INFO[key] ?? {
                    description: "",
                    tooltip: "Estilo de ação da Criatura.",
                  };
                  return (
                    <StyleCard
                      key={key}
                      name={meta.name}
                      description={info.description}
                      tooltip={info.tooltip}
                      value={entity.styles[key as StyleKey]}
                      min={0}
                      max={5}
                      onChange={(value) =>
                        update({ styles: { ...entity.styles, [key]: value } })
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
                  <InfoTip text="Efeitos temporários que afetam a Criatura durante a Caçada." />
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
                      : [...entity.conditions, { conditionId, level: 1 }],
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
            <TabBar
              tabs={tabs}
              active={activeTab}
              onChange={(k) => setActiveTab(k as CreatureTabKey)}
            />

            {activeTab === "pericias" && (
              <PericiasPanel
                skills={entity.skills}
                onChange={(skills) => update({ skills })}
              />
            )}

            {activeTab === "tracos" && (
              <TracosPanel
                entity={entity}
                customTraits={customTraits}
                onTogglePrincipal={(traitId) =>
                  update({
                    traits: entity.traits.some((t) => t.traitId === traitId)
                      ? entity.traits.filter((t) => t.traitId !== traitId)
                      : [...entity.traits, { traitId, level: 1 }],
                  })
                }
                onToggleAdicional={(traitId) =>
                  update({
                    additionalTraits: entity.additionalTraits.some(
                      (t) => t.traitId === traitId,
                    )
                      ? entity.additionalTraits.filter(
                          (t) => t.traitId !== traitId,
                        )
                      : [...entity.additionalTraits, { traitId, level: 1 }],
                  })
                }
                onAddCustom={(entryData) =>
                  updateRaw({
                    customTraits: [
                      { id: generateId(), ...entryData },
                      ...customTraits,
                    ],
                  })
                }
                onEditCustom={(id, patch) =>
                  updateRaw({
                    customTraits: customTraits.map((c) =>
                      c.id === id ? { ...c, ...patch } : c,
                    ),
                  })
                }
                onRemoveCustom={(id) =>
                  updateRaw({
                    customTraits: customTraits.filter((c) => c.id !== id),
                  })
                }
              />
            )}

            {activeTab === "partes" && (
              <section className={cardClass}>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black uppercase tracking-wide text-[#F5EFEB]">
                      Partes do Corpo ({entity.parts.length})
                    </h3>
                    <InfoTip text="Cada Parte pode ter Durabilidade própria, Ataque e um efeito de quebra, permitindo abater a Criatura por partes." />
                  </div>
                  <button
                    type="button"
                    onClick={openAddPart}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#FF9B42]/40 bg-[#2B1A16] px-3.5 py-2 text-xs font-black text-[#FF9B42] transition-colors hover:border-[#FF9B42]"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Parte
                  </button>
                </div>

                <div className="space-y-3">
                  {entity.parts.map((part, index) => (
                    <PartEditor
                      key={part.id}
                      index={index}
                      part={part}
                      onChange={(patch) => updatePart(index, patch)}
                      onRemove={() => removePart(index)}
                    />
                  ))}
                  {entity.parts.length === 0 && (
                    <Placeholder
                      icon={Layers}
                      message="Nenhuma Parte cadastrada ainda."
                      hint="Adicione Partes do corpo com Durabilidade, Ataque e efeitos de quebra próprios."
                    />
                  )}
                </div>

                {addPartOpen && (
                  <Modal
                    title="Adicionar Parte"
                    onClose={() => setAddPartOpen(false)}
                    wide
                  >
                    <div className="space-y-3">
                      <PartEditor
                        index={entity.parts.length}
                        part={draftPart}
                        onChange={(patch) =>
                          setDraftPart((current) => ({ ...current, ...patch }))
                        }
                        onRemove={() => setAddPartOpen(false)}
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={confirmAddPart}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#FF9B42]/40 bg-[#2B1A16] px-3.5 py-2 text-xs font-black text-[#FF9B42] transition-colors hover:border-[#FF9B42]"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Adicionar Parte
                        </button>
                        <button
                          type="button"
                          onClick={() => setAddPartOpen(false)}
                          className="px-2 text-xs font-bold text-[#B0A497] hover:text-[#F5EFEB]"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </Modal>
                )}
              </section>
            )}

            {activeTab === "ecologia" && (
              <section className={cardClass}>
                <div className="mb-4 flex items-center gap-2">
                  <h3 className="text-sm font-black uppercase tracking-wide text-[#F5EFEB]">
                    Ecologia & Comportamento
                  </h3>
                  <InfoTip text="O que a Criatura come, onde vive e como reage durante a Caçada — útil para prever seus padrões de ataque e fuga." />
                </div>
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
                  <Field label="Dieta">
                    <textarea
                      value={entity.diet}
                      onChange={(e) => update({ diet: e.target.value })}
                      className={`${inputClass} min-h-28 resize-y`}
                    />
                  </Field>
                  <Field label="Habitat">
                    <textarea
                      value={entity.habitat}
                      onChange={(e) => update({ habitat: e.target.value })}
                      className={`${inputClass} min-h-28 resize-y`}
                    />
                  </Field>
                  <Field label="Comportamento">
                    <textarea
                      value={entity.behavior}
                      onChange={(e) => update({ behavior: e.target.value })}
                      className={`${inputClass} min-h-28 resize-y`}
                    />
                  </Field>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <FloatingUndoButton visible={canUndo} onUndo={undo} />
    </div>
  );
}

// ============================================================================
// STAT HEADER / BARRA
// ============================================================================

function StatHeader({
  icon,
  color,
  title,
  value,
  max,
  tooltip,
}: {
  icon: string;
  color: string;
  title: string;
  value: number;
  max: number;
  tooltip: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-black"
          style={{ backgroundColor: `${color}26`, color }}
        >
          {icon}
        </span>
        <h3 className="text-xs font-black uppercase tracking-wide text-[#F5EFEB]">
          {title}
        </h3>
        <InfoTip text={tooltip} />
      </div>
      <p className="text-lg font-black text-[#F5EFEB]">
        {value}
        <span className="text-xs font-bold text-[#7A7065]"> / {max} MAX</span>
      </p>
    </div>
  );
}

function StatBar({
  percentage,
  colorFrom,
  colorTo,
}: {
  percentage: number;
  colorFrom: string;
  colorTo: string;
}) {
  const segments = 10;
  const filled = Math.round((percentage / 100) * segments);
  return (
    <div className="flex h-3.5 gap-[3px] overflow-hidden rounded-full border border-[#302D29] bg-[#1E1D1B] p-[3px]">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className="h-full flex-1 rounded-sm transition-colors"
          style={{
            background:
              i < filled
                ? `linear-gradient(90deg, ${colorFrom}, ${colorTo})`
                : "#26221F",
          }}
        />
      ))}
    </div>
  );
}

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
      className="shrink-0 rounded-lg border border-[#383430] bg-[#242220] px-2.5 py-1.5 text-[10px] font-black text-[#D8CFC4] transition-colors hover:border-[#FF9B42] hover:text-[#FF9B42]"
    >
      {label}
    </button>
  );
}

function VigorEditor({
  vigor,
  onChange,
}: {
  vigor: ICreature["vigor"];
  onChange: (vigor: ICreature["vigor"]) => void;
}) {
  const percentage =
    vigor.max > 0 ? clamp((vigor.current / vigor.max) * 100, 0, 100) : 0;

  return (
    <div className="space-y-3">
      <StatBar percentage={percentage} colorFrom="#9B2C2C" colorTo="#FF9B42" />
      <div className="flex items-center gap-2">
        <QuickStepButton
          label="-5"
          onClick={() =>
            onChange({
              ...vigor,
              current: clamp(vigor.current - 5, 0, vigor.max),
            })
          }
        />
        <QuickStepButton
          label="−"
          onClick={() =>
            onChange({
              ...vigor,
              current: clamp(vigor.current - 1, 0, vigor.max),
            })
          }
        />
        <input
          type="number"
          min={0}
          max={vigor.max}
          value={vigor.current}
          onChange={(e) =>
            onChange({
              ...vigor,
              current: clamp(Number(e.target.value), 0, vigor.max),
            })
          }
          className={`${inputClass} text-center`}
        />
        <QuickStepButton
          label="+"
          onClick={() =>
            onChange({
              ...vigor,
              current: clamp(vigor.current + 1, 0, vigor.max),
            })
          }
        />
        <QuickStepButton
          label="+5"
          onClick={() =>
            onChange({
              ...vigor,
              current: clamp(vigor.current + 5, 0, vigor.max),
            })
          }
        />
      </div>
      <details className="group text-[10px] text-[#7A7065]">
        <summary className="flex cursor-pointer list-none items-center gap-1 font-bold uppercase tracking-wide hover:text-[#B0A497]">
          <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
          Ajustar máximo
        </summary>
        <div className="mt-2">
          <Field label="Vigor máximo">
            <input
              type="number"
              min={1}
              value={vigor.max}
              onChange={(e) => {
                const max = Math.max(1, Number(e.target.value));
                onChange({ current: Math.min(vigor.current, max), max });
              }}
              className={inputClass}
            />
          </Field>
        </div>
      </details>
    </div>
  );
}

// ============================================================================
// ESTILOS — cartão individual
// ============================================================================

function StyleCard({
  name,
  description,
  tooltip,
  value,
  min,
  max,
  onChange,
}: {
  name: string;
  description: string;
  tooltip: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-xl border border-[#383430] bg-[#1E1D1B] p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-black text-[#F5EFEB]">{name}</p>
          <InfoTip text={tooltip} />
        </div>
        <span className="shrink-0 rounded-md bg-[#FF9B42]/15 px-1.5 py-0.5 text-[9px] font-black text-[#FF9B42]">
          +{value} d6
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
// CONDIÇÕES — grid de pílulas
// ============================================================================

function ConditionsGrid({
  selected,
  onToggle,
  onLevelChange,
}: {
  selected: Array<{ conditionId: ID; level: number }>;
  onToggle: (conditionId: ID) => void;
  onLevelChange: (conditionId: ID, level: number) => void;
}) {
  const conditions: Array<{ id: ID; name: string; description?: string }> =
    conditionDefinitions;

  return (
    <div className="grid grid-cols-2 gap-2">
      {conditions.map((condition) => {
        const active = selected.find((c) => c.conditionId === condition.id);
        return (
          <div key={String(condition.id)} className="relative">
            <button
              type="button"
              onClick={() => onToggle(condition.id)}
              title={condition.description ?? condition.name}
              className={`w-full rounded-lg border px-2.5 py-2 text-left text-[10px] font-bold transition-colors ${
                active
                  ? "border-[#9B2C2C]/50 bg-[#2B1A16] text-[#F0C4A8]"
                  : "border-[#383430] bg-[#1E1D1B] text-[#B0A497] hover:border-[#4A433C]"
              }`}
            >
              {condition.name}
            </button>
            {active && (
              <div className="mt-1 flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() =>
                    onLevelChange(condition.id, Math.max(1, active.level - 1))
                  }
                  className="rounded p-0.5 text-[#8F877D] hover:text-white"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-[9px] font-black text-[#F0C4A8]">
                  Nv {active.level}
                </span>
                <button
                  type="button"
                  onClick={() => onLevelChange(condition.id, active.level + 1)}
                  className="rounded p-0.5 text-[#8F877D] hover:text-white"
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
// TAB 1 — PERÍCIAS
// ============================================================================

function PericiasPanel({
  skills,
  onChange,
}: {
  skills: ICreature["skills"];
  onChange: (skills: ICreature["skills"]) => void;
}) {
  return (
    <section className={cardClass}>
      <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black uppercase tracking-wide text-[#F5EFEB]">
            As 12 Perícias da Criatura (+0 a +3)
          </h3>
          <InfoTip text="Cada Perícia vai de +0 a +3. O bônus é somado diretamente ao resultado do Dado de Ação [A] em testes daquele tipo." />
        </div>
        <span className="rounded-lg border border-[#89B5F7]/40 bg-[#13335C]/30 px-3 py-1.5 text-[10px] font-black text-[#89B5F7]">
          Teste = Estilo (dados) + Perícia (+bônus)
        </span>
      </div>
      <p className="mb-4 text-[11px] text-[#8F877D]">
        O bônus da perícia é somado diretamente ao resultado do Dado de Ação [A]
        nos testes.
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
                  <InfoTip text={skill.tooltipHelp} />
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
                    className="rounded-md border border-[#383430] bg-[#242220] p-1 text-[#D8CFC4] hover:border-[#89B5F7] hover:text-[#89B5F7]"
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
                    className="rounded-md border border-[#383430] bg-[#242220] p-1 text-[#D8CFC4] hover:border-[#89B5F7] hover:text-[#89B5F7]"
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
    </section>
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
          ? "border-[#6FCF97]/50 bg-[#153029]/50 text-[#6FCF97]"
          : "border-[#383430] bg-[#1E1D1B] text-[#8F877D] hover:text-[#F5EFEB]"
      }`}
    >
      {label}
    </button>
  );
}

// ============================================================================
// TAB 2 — TRAÇOS & MUTAÇÕES (principais + adicionais)
// ============================================================================

function TracosPanel({
  entity,
  customTraits,
  onTogglePrincipal,
  onToggleAdicional,
  onAddCustom,
  onEditCustom,
  onRemoveCustom,
}: {
  entity: ICreature;
  customTraits: ICustomEntry[];
  onTogglePrincipal: (traitId: ID) => void;
  onToggleAdicional: (traitId: ID) => void;
  onAddCustom: (entry: Omit<ICustomEntry, "id">) => void;
  onEditCustom: (id: string, patch: Partial<ICustomEntry>) => void;
  onRemoveCustom: (id: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ICustomEntry | null>(null);
  const [modalCategory, setModalCategory] = useState<"principal" | "adicional">(
    "principal",
  );

  const principalLibrary = entity.traits
    .map((s) => ({ selection: s, def: traitsById[s.traitId] }))
    .filter(
      (
        entry,
      ): entry is {
        selection: typeof entry.selection;
        def: NonNullable<typeof entry.def>;
      } => Boolean(entry.def),
    );
  const additionalLibrary = entity.additionalTraits
    .map((s) => ({ selection: s, def: traitsById[s.traitId] }))
    .filter(
      (
        entry,
      ): entry is {
        selection: typeof entry.selection;
        def: NonNullable<typeof entry.def>;
      } => Boolean(entry.def),
    );

  const principalCustom = customTraits.filter(
    (c) => c.category === "principal",
  );
  const additionalCustom = customTraits.filter(
    (c) => c.category === "adicional",
  );

  function openModal(category: "principal" | "adicional") {
    setModalCategory(category);
    setEditing(null);
    setModalOpen(true);
  }

  return (
    <section className={cardClass}>
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-sm font-black uppercase tracking-wide text-[#F5EFEB]">
          Traços & Mutações Biológicas
        </h3>
        <InfoTip text="Poderes sobrenaturais e mutações corporais da Criatura. Separe Traços principais (definem a espécie) dos adicionais (variações individuais)." />
      </div>

      <div className="space-y-5">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-wide text-[#B0A497]">
              Traços principais (
              {principalLibrary.length + principalCustom.length})
            </p>
            <button
              type="button"
              onClick={() => openModal("principal")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2E6F63]/40 bg-[#153029]/50 px-2.5 py-1.5 text-[10px] font-black text-[#6FCF97] transition-colors hover:border-[#6FCF97]"
            >
              <Plus className="h-3.5 w-3.5" />
              Novo Traço
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {principalLibrary.map(({ selection, def }) => {
              const anyDef = def as unknown as {
                id: ID;
                name: string;
                description?: string;
                cost?: string;
              };
              return (
                <EntryCard
                  key={`lib-p-${anyDef.id}`}
                  name={anyDef.name}
                  badge={anyDef.cost ?? `Nível ${selection.level}`}
                  description={anyDef.description ?? ""}
                  onRemove={() => onTogglePrincipal(selection.traitId)}
                />
              );
            })}
            {principalCustom.map((entry) => (
              <EntryCard
                key={entry.id}
                name={entry.name}
                badge={entry.badge}
                description={entry.description}
                onEdit={() => {
                  setModalCategory("principal");
                  setEditing(entry);
                  setModalOpen(true);
                }}
                onRemove={() => onRemoveCustom(entry.id)}
              />
            ))}
          </div>
          {principalLibrary.length + principalCustom.length === 0 && (
            <Placeholder
              icon={Sparkles}
              message="Nenhum Traço principal registrado ainda."
            />
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-wide text-[#B0A497]">
              Traços adicionais (
              {additionalLibrary.length + additionalCustom.length})
            </p>
            <button
              type="button"
              onClick={() => openModal("adicional")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2E6F63]/40 bg-[#153029]/50 px-2.5 py-1.5 text-[10px] font-black text-[#6FCF97] transition-colors hover:border-[#6FCF97]"
            >
              <Plus className="h-3.5 w-3.5" />
              Novo Traço
            </button>
          </div>
          <p className="mb-2 text-[10px] text-[#5E564D]">
            Traços extras adquiridos ao longo da progressão da Criatura.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {additionalLibrary.map(({ selection, def }) => {
              const anyDef = def as unknown as {
                id: ID;
                name: string;
                description?: string;
                cost?: string;
              };
              return (
                <EntryCard
                  key={`lib-a-${anyDef.id}`}
                  name={anyDef.name}
                  badge={anyDef.cost ?? `Nível ${selection.level}`}
                  description={anyDef.description ?? ""}
                  onRemove={() => onToggleAdicional(selection.traitId)}
                />
              );
            })}
            {additionalCustom.map((entry) => (
              <EntryCard
                key={entry.id}
                name={entry.name}
                badge={entry.badge}
                description={entry.description}
                onEdit={() => {
                  setModalCategory("adicional");
                  setEditing(entry);
                  setModalOpen(true);
                }}
                onRemove={() => onRemoveCustom(entry.id)}
              />
            ))}
          </div>
          {additionalLibrary.length + additionalCustom.length === 0 && (
            <Placeholder
              icon={Sparkles}
              message="Nenhum Traço adicional registrado ainda."
            />
          )}
        </div>
      </div>

      {modalOpen && (
        <AddTraitModal
          category={modalCategory}
          selected={
            modalCategory === "principal"
              ? entity.traits
              : entity.additionalTraits
          }
          editing={editing}
          onToggleLibrary={
            modalCategory === "principal"
              ? onTogglePrincipal
              : onToggleAdicional
          }
          onSaveCustom={(data) => {
            if (editing) onEditCustom(editing.id, data);
            else onAddCustom({ ...data, category: modalCategory });
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
}

function AddTraitModal({
  category,
  selected,
  editing,
  onToggleLibrary,
  onSaveCustom,
  onClose,
}: {
  category: "principal" | "adicional";
  selected: Array<{ traitId: ID; level: number }>;
  editing: ICustomEntry | null;
  onToggleLibrary: (traitId: ID) => void;
  onSaveCustom: (data: Omit<ICustomEntry, "id" | "category">) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"biblioteca" | "personalizada">(
    editing ? "personalizada" : "biblioteca",
  );
  const [name, setName] = useState(editing?.name ?? "");
  const [badge, setBadge] = useState(editing?.badge ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");

  const { traitDefinitions } = require("../../data/wilderfeastData") as {
    traitDefinitions: Array<{
      id: ID;
      name: string;
      description?: string;
      cost?: string;
    }>;
  };

  function handleSaveCustom() {
    if (!name.trim()) return;
    onSaveCustom({
      name: name.trim(),
      badge: badge.trim() || undefined,
      description,
    });
    onClose();
  }

  return (
    <Modal
      title={
        editing
          ? "Editar Traço"
          : `Novo Traço ${category === "principal" ? "Principal" : "Adicional"}`
      }
      onClose={onClose}
      wide
    >
      {!editing && (
        <div className="mb-4 flex gap-2">
          <ModeTab
            label="Biblioteca de Traços"
            active={mode === "biblioteca"}
            onClick={() => setMode("biblioteca")}
          />
          <ModeTab
            label="Criar personalizado"
            active={mode === "personalizada"}
            onClick={() => setMode("personalizada")}
          />
        </div>
      )}

      {mode === "biblioteca" && !editing ? (
        <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
          {traitDefinitions.map((trait) => {
            const isKnown = selected.some((t) => t.traitId === trait.id);
            return (
              <button
                key={String(trait.id)}
                type="button"
                onClick={() => onToggleLibrary(trait.id)}
                className={`flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-left transition-colors ${
                  isKnown
                    ? "border-[#2E6F63]/60 bg-[#15302B]"
                    : "border-[#383430] bg-[#1E1D1B] hover:border-[#6FCF97]/50"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[11px] font-black text-[#F5EFEB]">
                      {trait.name}
                    </p>
                    {trait.cost && (
                      <span className="rounded-md bg-[#242220] px-1.5 py-0.5 text-[9px] font-black text-[#89B5F7]">
                        {trait.cost}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[10px] leading-relaxed text-[#8F877D]">
                    {trait.description}
                  </p>
                </div>
                {isKnown && (
                  <Check className="h-4 w-4 shrink-0 text-[#6FCF97]" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          <Field label="Nome" required>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Escamas Regenerativas"
              className={inputClass}
            />
          </Field>
          <Field
            label="Selo / Custo"
            hint="Opcional. Ex: Passiva ou Custo: 1 Sucesso"
          >
            <input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Ex: Passiva"
              className={inputClass}
            />
          </Field>
          <Field label="Descrição">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} min-h-24 resize-y`}
              placeholder="Descreva o efeito do Traço..."
            />
          </Field>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleSaveCustom}
              disabled={!name.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#2E6F63]/40 bg-[#2E6F63] px-3.5 py-2 text-xs font-black text-white transition-colors hover:bg-[#357C6F] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check className="h-3.5 w-3.5" />
              {editing ? "Salvar alterações" : "Adicionar Traço"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-2 text-xs font-bold text-[#B0A497] hover:text-[#F5EFEB]"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default CreatureSheet;
