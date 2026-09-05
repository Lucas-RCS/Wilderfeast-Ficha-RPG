import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Heart,
  Info,
  Leaf,
  Minus,
  PawPrint,
  Pencil,
  Plus,
  Sparkles,
  Swords,
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
  SKILLS,
  STYLES,
  STYLE_INFO,
  conditionDefinitions,
  skillsList,
  traitDefinitions,
} from "../../data/wilderfeastData";
import { generateId, getCreatureById, saveCreature } from "../../lib/storage";
import { exportSheet } from "../../lib/sheetTransfer";
import {
  ALL_MONSTER_LINEAGES,
  ALL_MONSTER_STAGES,
} from "../../types/wilderfeastTypes";
import { useAutosaveEntity } from "../../hooks/useAutosaveEntity";
import {
  EmptyState,
  Field,
  SectionTitle,
  cardClass,
  inputClass,
} from "../../components/creation/FormControls";
import { TraitPicker } from "../../components/creation/TraitConditionPicker";
import { PartEditor } from "../../components/creation/PartEditor";
import { createEmptyCreaturePart } from "../../lib/creatureCreation";
import { SheetHeader } from "../../components/layout/SheetHeader";
import { SheetNotFound } from "../../components/layout/SheetNotFound";
import { FloatingUndoButton } from "../../components/ui/FloatingUndoButton";
import { InfoTooltip } from "../ui/Tooltip";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

function formatTraitCost(
  cost: (typeof traitDefinitions)[number]["cost"],
): ReactNode {
  if (!cost) return null;

  const typeLabel: Record<string, string> = {
    acoes: "Ações",
    vigor: "Vigor",
    sucessos: "Sucessos",
  };

  return (
    <>
      <span>{cost.amount}</span>
      <span className="ml-1">{typeLabel[cost.type] ?? cost.type}</span>
    </>
  );
}

interface ICustomCreatureTrait {
  id: ID;
  name: string;
  description: string;
  badge?: string;
  level?: number;
  maxLevel?: number | null;
}

function readCustomTraits(entity: unknown): ICustomCreatureTrait[] {
  const value = (entity as Record<string, unknown>).customTraits;
  return Array.isArray(value) ? (value as ICustomCreatureTrait[]) : [];
}

interface CreatureSheetProps {
  creatureId: ID;
  onBack: () => void;
  onDeleted: () => void;
}

type CreatureTabKey = "combate" | "tracos" | "anatomia" | "ecologia";

const CREATURE_TABS: Array<{
  key: CreatureTabKey;
  label: string;
  icon: typeof Swords;
  color: string;
}> = [
  { key: "combate", label: "1. Habilidades", icon: Swords, color: "#FF9B42" },
  { key: "tracos", label: "2. Traços", icon: Sparkles, color: "#6FCF97" },
  { key: "anatomia", label: "3. Anatomia", icon: PawPrint, color: "#E5484D" },
  { key: "ecologia", label: "4. Ecologia", icon: Leaf, color: "#89B5F7" },
];

/** Ponto de entrada: carrega a Creature do storage e trata o caso de "não encontrada". */
function CreatureSheet({ creatureId, onBack }: CreatureSheetProps) {
  const initial = getCreatureById(creatureId);

  if (!initial) {
    return <SheetNotFound label="Criatura" onBack={onBack} />;
  }

  return (
    <CreatureSheetView key={creatureId} initial={initial} onBack={onBack} />
  );
}

function CreatureSheetView({
  initial,
  onBack,
}: {
  initial: ICreature;
  onBack: () => void;
}) {
  const { entity, update, undo, canUndo, lastSavedAt, isPending } =
    useAutosaveEntity<ICreature>({ initial, save: saveCreature });
  const [activeTab, setActiveTab] = useState<CreatureTabKey>("combate");
  const customTraits = readCustomTraits(entity);
  const updateRaw = (patch: Record<string, unknown>) =>
    update(patch as Partial<ICreature>);

  function addPart() {
    update({ parts: [...entity.parts, createEmptyCreaturePart()] });
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

  return (
    <div className="min-h-screen bg-[#121110] text-[#F5EFEB] pb-24">
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
        onExport={() => exportSheet("creature", entity, entity.name)}
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
        <div className="grid gap-5 lg:grid-cols-[380px_1fr] xl:grid-cols-[620px_1fr]">
          <aside className="space-y-4">
            <section className={cardClass}>
              <StatHeader
                icon={<Heart />}
                color="#E5484D"
                title="Vigor (Saúde)"
                value={entity.vigor.current}
                max={entity.vigor.max}
                category="Combate"
                tooltip="A reserva de resistência da Criatura durante a Caçada. Ao chegar a zero, use as consequências previstas pelas regras."
                onMaxChange={(max) =>
                  update({
                    vigor: {
                      ...entity.vigor,
                      max,
                      current: clamp(entity.vigor.current, 0, max),
                    },
                  })
                }
              />
              <VigorEditor
                vigor={entity.vigor}
                onChange={(vigor) => update({ vigor })}
              />
            </section>

            <section className={cardClass}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black uppercase tracking-wide text-[#F5EFEB]">
                    Estilos de ataque
                  </h3>
                  <InfoTooltip
                    title="Estilos de ataque"
                    category="Combate"
                    description="Definem quantos dados a Criatura rola ao atacar de cada forma. Criaturas podem ter Estilos entre 0 e 5."
                  />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wide text-[#5E564D]">
                  0 a 5d6
                </span>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.entries(STYLES).map(([key, meta]) => (
                  <StyleCard
                    key={key}
                    name={meta.name}
                    color={meta.color}
                    description={STYLE_INFO[key]?.description ?? ""}
                    tooltip={
                      STYLE_INFO[key]?.tooltip ??
                      "Estilo de ataque da Criatura."
                    }
                    value={entity.styles[key as StyleKey]}
                    onChange={(value) =>
                      update({ styles: { ...entity.styles, [key]: value } })
                    }
                  />
                ))}
              </div>
            </section>

            <section className={cardClass}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black uppercase tracking-wide text-[#F5EFEB]">
                    Condições
                  </h3>
                  <InfoTooltip
                    title="Condições"
                    category="Status"
                    description="Efeitos ativos na Criatura durante a Caçada."
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
                      (condition) => condition.conditionId === conditionId,
                    )
                      ? entity.conditions.filter(
                          (condition) => condition.conditionId !== conditionId,
                        )
                      : [...entity.conditions, { conditionId, level: 1 }],
                  })
                }
                onLevelChange={(conditionId, level) =>
                  update({
                    conditions: entity.conditions.map((condition) =>
                      condition.conditionId === conditionId
                        ? { ...condition, level }
                        : condition,
                    ),
                  })
                }
              />
            </section>
          </aside>

          <div className="min-w-0 space-y-4">
            <TabBar
              active={activeTab}
              onChange={setActiveTab}
              counts={{
                tracos: entity.traits.length + customTraits.length,
                anatomia: entity.parts.length,
              }}
            />

            {activeTab === "combate" && (
              <SkillsPanel
                skills={entity.skills}
                onChange={(skills) => update({ skills })}
              />
            )}

            {activeTab === "tracos" && (
              <CreatureTraitsPanel
                selected={entity.traits}
                onChange={(traits) => update({ traits })}
                custom={customTraits}
                onCustomChange={(traits) => updateRaw({ customTraits: traits })}
              />
            )}

            {activeTab === "anatomia" && (
              <section className={cardClass}>
                <SectionTitle
                  eyebrow="Anatomia"
                  title="Partes do Corpo"
                  subtitle="Cada Parte pode ter Durabilidade própria, Ataque e um efeito de quebra."
                />
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="mb-2 text-[11px] font-black uppercase tracking-wide text-[#F5EFEB] sm:mb-0">
                      Partes ({entity.parts.length})
                    </h4>
                    <button
                      type="button"
                      onClick={addPart}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#383430] bg-[#242220] px-3.5 py-2 text-xs font-black text-[#F5EFEB] transition-colors hover:border-[#FF9B42]"
                    >
                      <Plus className="w-4 h-4 text-[#FF9B42]" />
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
                      <EmptyState message="Nenhuma Parte cadastrada ainda." />
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeTab === "ecologia" && (
              <section className={cardClass}>
                <SectionTitle
                  eyebrow="Ecologia"
                  title="Comportamento"
                  subtitle="O que a Criatura come, onde vive e como reage durante a Caçada."
                />
                <div className="mt-3 space-y-3">
                  <Field label="Dieta">
                    <textarea
                      value={entity.diet}
                      onChange={(e) => update({ diet: e.target.value })}
                      className={`${inputClass} min-h-20 resize-y`}
                    />
                  </Field>
                  <Field label="Habitat">
                    <textarea
                      value={entity.habitat}
                      onChange={(e) => update({ habitat: e.target.value })}
                      className={`${inputClass} min-h-20 resize-y`}
                    />
                  </Field>
                  <Field label="Comportamento">
                    <textarea
                      value={entity.behavior}
                      onChange={(e) => update({ behavior: e.target.value })}
                      className={`${inputClass} min-h-20 resize-y`}
                    />
                  </Field>
                </div>

                <SectionTitle
                  eyebrow="Identidade"
                  title="Descrição"
                  subtitle="Tamanho, porte e características marcantes da Criatura."
                />
                <div className="mt-3 flex flex-col gap-3">
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
                      className={`${inputClass} min-h-20 resize-y`}
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
// VIGOR
// ============================================================================

function TabBar({
  active,
  onChange,
  counts,
}: {
  active: CreatureTabKey;
  onChange: (tab: CreatureTabKey) => void;
  counts: Partial<Record<CreatureTabKey, number>>;
}) {
  return (
    <nav
      className="flex flex-wrap gap-2 rounded-2xl border border-[#302D29] bg-[#171615] p-2"
      aria-label="Seções da ficha"
    >
      {CREATURE_TABS.map((tab) => {
        const Icon = tab.icon;
        const selected = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[11px] font-black uppercase tracking-wide transition-colors ${selected ? "" : "border-transparent text-[#8F877D] hover:bg-[#1E1D1B] hover:text-[#F5EFEB]"}`}
            style={
              selected
                ? {
                    borderColor: `${tab.color}66`,
                    backgroundColor: `${tab.color}1F`,
                    color: tab.color,
                  }
                : undefined
            }
          >
            <Icon className="h-3.5 w-3.5" style={{ color: tab.color }} />
            {tab.label}
            {counts[tab.key] !== undefined && (
              <span className="rounded-full bg-[#242220] px-1.5 py-0.5 text-[9px] font-black text-[#B0A497]">
                {counts[tab.key]}
              </span>
            )}
          </button>
        );
      })}
    </nav>
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
  tooltip: string;
  category: string;
  onMaxChange: (max: number) => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black"
          style={{ color }}
        >
          {icon}
        </span>
        <h3 className="truncate text-xs font-black uppercase tracking-wide text-[#F5EFEB]">
          {title}
        </h3>
        <InfoTooltip title={title} category={category} description={tooltip} />
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
          aria-label="Vigor máximo"
          className="w-10 appearance-none border-none bg-transparent p-0 text-xs font-bold text-[#7A7065] outline-none focus:text-[#B0A497]"
        />
        <span className="text-xs font-bold text-[#7A7065]">MAX</span>
      </div>
    </div>
  );
}

function StyleCard({
  name,
  color,
  description,
  tooltip,
  value,
  onChange,
}: {
  name: string;
  color: string;
  description: string;
  tooltip: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div
      className="rounded-xl border bg-[#1E1D1B] p-3"
      style={{ borderColor: color }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-black text-[#F5EFEB]">{name}</p>
          <InfoTooltip title={name} category="Estilo" description={tooltip} />
        </div>
        <span
          className="rounded-md px-1.5 py-0.5 text-[9px] font-black text-white"
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
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: index < value ? "#FF9B42" : "#3A3530" }}
            />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChange(clamp(value - 1, 0, 5))}
            className="cursor-pointer rounded-md border border-[#383430] bg-[#242220] p-1 text-[#D8CFC4] hover:border-[#FF9B42] hover:text-[#FF9B42]"
            aria-label={`Diminuir ${name}`}
          >
            <Minus className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onChange(clamp(value + 1, 0, 5))}
            className="cursor-pointer rounded-md border border-[#383430] bg-[#242220] p-1 text-[#D8CFC4] hover:border-[#FF9B42] hover:text-[#FF9B42]"
            aria-label={`Aumentar ${name}`}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
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
    vigor.max > 0
      ? Math.max(0, Math.min(100, (vigor.current / vigor.max) * 100))
      : 0;

  const updateCurrent = (current: number) =>
    onChange({ ...vigor, current: clamp(current, 0, vigor.max) });

  return (
    <div className="w-full space-y-3">
      <div className="relative w-full">
        <input
          type="range"
          min={0}
          max={vigor.max}
          value={vigor.current}
          onChange={(e) => updateCurrent(Number(e.target.value))}
          aria-label="Vigor atual"
          className="creature-vigor-slider block h-3 w-full cursor-pointer appearance-none rounded-full bg-[#2B2825] outline-none"
          style={{
            background: `linear-gradient(to right, #c22424 0%, #ff7e42 ${percentage}%, #2B2825 ${percentage}%, #2B2825 100%)`,
          }}
        />
        <style>{`.creature-vigor-slider::-webkit-slider-runnable-track{height:12px;border-radius:9999px;background:transparent}.creature-vigor-slider::-moz-range-track{height:12px;border-radius:9999px;background:transparent}.creature-vigor-slider::-webkit-slider-thumb{appearance:none;width:20px;height:20px;margin-top:-4px;border-radius:9999px;border:3px solid #171514;background:#F2E9DE;box-shadow:0 3px 8px rgba(0,0,0,.35)}.creature-vigor-slider::-moz-range-thumb{width:20px;height:20px;border-radius:9999px;border:3px solid #171514;background:#F2E9DE;box-shadow:0 3px 8px rgba(0,0,0,.35)}`}</style>
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
            className="w-full min-w-0 bg-transparent text-center text-sm font-black text-[#E8E0D6] outline-none"
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

function ConditionsGrid({
  selected,
  onToggle,
  onLevelChange,
}: {
  selected: ICreature["conditions"];
  onToggle: (conditionId: ID) => void;
  onLevelChange: (conditionId: ID, level: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {conditionDefinitions.map((condition) => {
        const active = selected.find(
          (item) => item.conditionId === condition.id,
        );
        return (
          <div
            key={condition.id}
            className={`group flex h-12 min-w-0 items-center gap-2 rounded-xl border px-2.5 transition-all duration-150 ${active ? "border-[#8F3B2F]/70 bg-[#2A1C18]" : "border-[#383430] bg-[#1E1D1B] hover:border-[#4A433C] hover:bg-[#211F1D]"}`}
          >
            <button
              type="button"
              onClick={() => onToggle(condition.id)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
              title={condition.description}
              style={{ cursor: "pointer" }}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-[#D96B4C] shadow-[0_0_7px_rgba(217,107,76,0.55)]" : "bg-[#4C4640] group-hover:bg-[#655D55]"}`}
              />
              <span
                className={`min-w-0 truncate text-[10px] font-black uppercase tracking-wide ${active ? "text-[#F0C4A8]" : "text-[#B0A497] group-hover:text-[#D8CFC4]"}`}
              >
                {condition.name}
              </span>
            </button>
            <InfoTooltip
              title={condition.name}
              description={condition.description}
              category="Condição"
            />
            {active && (
              <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-[#49312A] bg-[#211A17] p-0.5">
                <button
                  type="button"
                  onClick={() =>
                    onLevelChange(condition.id, Math.max(1, active.level - 1))
                  }
                  disabled={active.level <= 1}
                  aria-label={`Diminuir nível de ${condition.name}`}
                  className="cursor-pointer flex h-5 w-5 items-center justify-center rounded-md text-[#81776E] hover:bg-[#38251F] hover:text-[#F0C4A8] disabled:pointer-events-none disabled:opacity-25"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="min-w-[24px] px-0.5 text-center text-[9px] font-black tabular-nums text-[#F0C4A8]">
                  {active.level}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onLevelChange(
                      condition.id,
                      condition.maxLevel != null
                        ? Math.min(condition.maxLevel, active.level + 1)
                        : active.level + 1,
                    )
                  }
                  disabled={
                    condition.maxLevel != null &&
                    active.level >= condition.maxLevel
                  }
                  aria-label={`Aumentar nível de ${condition.name}`}
                  className="cursor-pointer flex h-5 w-5 items-center justify-center rounded-md text-[#81776E] hover:bg-[#38251F] hover:text-[#F0C4A8] disabled:pointer-events-none disabled:opacity-25"
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

function SkillsPanel({
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
            Habilidades da Criatura
          </h3>
          <InfoTooltip
            title="Habilidades da Criatura"
            category="Combate"
            description="Cada Perícia vai de +0 a +3 e é somada ao Estilo usado no teste ou ataque."
          />
        </div>
        <span className="rounded-lg border border-[#FF9B42]/40 bg-[#2B1A16] px-3 py-1.5 text-[10px] font-black text-[#FF9B42]">
          Teste = Estilo (dados) + Perícia (+bônus)
        </span>
      </div>
      <p className="mb-4 text-[11px] text-[#8F877D]">
        A Perícia representa a aptidão da Criatura e é aplicada ao resultado do
        teste.
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
                    category="Perícia"
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
                    aria-label={`Diminuir ${skill.name}`}
                    className="cursor-pointer rounded-md border border-[#383430] bg-[#242220] p-1 text-[#D8CFC4] hover:border-[#FF9B42] hover:text-[#FF9B42]"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span
                    className={`min-w-[30px] rounded-md px-1.5 py-0.5 text-center text-[10px] font-black ${value > 0 ? "bg-[#2E6F63]/30 text-[#6FCF97]" : "bg-[#242220] text-[#7A7065]"}`}
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
                    aria-label={`Aumentar ${skill.name}`}
                    className="cursor-pointer rounded-md border border-[#383430] bg-[#242220] p-1 text-[#D8CFC4] hover:border-[#FF9B42] hover:text-[#FF9B42]"
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
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#FF9B42]" />
        <p className="text-[10px] leading-relaxed text-[#D8CFC4]">
          <span className="font-black text-[#FF9B42]">Combate:</span> combine o
          Estilo de ataque com a Perícia apropriada à ação da Criatura.
        </p>
      </div>
    </section>
  );
}

function CreatureTraitsPanel({
  selected,
  onChange,
  custom,
  onCustomChange,
}: {
  selected: ICreature["traits"];
  onChange: (traits: ICreature["traits"]) => void;
  custom: ICustomCreatureTrait[];
  onCustomChange: (traits: ICustomCreatureTrait[]) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingCustom, setEditingCustom] =
    useState<ICustomCreatureTrait | null>(null);
  const selectedTraits = useMemo(
    () =>
      selected
        .map((state) => {
          const definition = traitDefinitions.find(
            (trait) => trait.id === state.traitId,
          );
          return definition ? { definition, state } : null;
        })
        .filter(
          (
            entry,
          ): entry is {
            definition: (typeof traitDefinitions)[number];
            state: ICreature["traits"][number];
          } => Boolean(entry),
        ),
    [selected],
  );

  const toggleTrait = (traitId: ID) =>
    onChange(
      selected.some((trait) => trait.traitId === traitId)
        ? selected.filter((trait) => trait.traitId !== traitId)
        : [...selected, { traitId, level: 1 }],
    );

  return (
    <section className={cardClass}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#383430] bg-[#153029]/60 text-[#6FCF97]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-black uppercase tracking-wide text-[#F5EFEB]">
                Traços da Criatura ({selectedTraits.length + custom.length})
              </h3>
              <InfoTooltip
                title="Traços da Criatura"
                category="Progressão"
                description="Características naturais, poderes e capacidades especiais da Criatura."
              />
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-[#7A7065]">
              Capacidades especiais que definem como esta Criatura age e reage.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingCustom(null);
            setPickerOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-[#2E6F63]/40 bg-[#153029]/60 px-3.5 py-2 text-xs font-black text-[#6FCF97] transition-all hover:border-[#6FCF97]/70 hover:bg-[#1A3A31]"
        >
          <Plus className="h-4 w-4" />
          Adicionar Traço
        </button>
      </div>

      {selectedTraits.length > 0 || custom.length > 0 ? (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {selectedTraits.map(({ definition, state }) => (
            <CreatureTraitCard
              key={definition.id}
              trait={definition}
              level={state.level}
              onLevelChange={(level) =>
                onChange(
                  selected.map((item) =>
                    item.traitId === definition.id ? { ...item, level } : item,
                  ),
                )
              }
              onRemove={() => toggleTrait(definition.id)}
            />
          ))}
          {custom.map((trait) => (
            <CustomCreatureTraitCard
              key={trait.id}
              trait={trait}
              onEdit={() => {
                setEditingCustom(trait);
                setPickerOpen(true);
              }}
              onLevelChange={(level) =>
                onCustomChange(
                  custom.map((item) =>
                    item.id === trait.id ? { ...item, level } : item,
                  ),
                )
              }
              onRemove={() =>
                onCustomChange(custom.filter((item) => item.id !== trait.id))
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#383430] bg-[#171615]/60 px-6 py-10 text-center">
          <Sparkles className="h-7 w-7 text-[#4A433C]" />
          <p className="text-xs font-bold text-[#8F877D]">
            Nenhum Traço registrado ainda.
          </p>
          <p className="max-w-xs text-[10px] text-[#5E564D]">
            Adicione os Traços que tornam esta Criatura única.
          </p>
        </div>
      )}

      {pickerOpen && (
        <TraitLibraryModal
          selected={selected}
          editing={editingCustom}
          onToggle={toggleTrait}
          onLevelChange={(traitId, level) =>
            onChange(
              selected.map((trait) =>
                trait.traitId === traitId ? { ...trait, level } : trait,
              ),
            )
          }
          onSaveCustom={(trait) =>
            onCustomChange(
              editingCustom
                ? custom.map((item) =>
                    item.id === editingCustom.id
                      ? { ...trait, id: editingCustom.id }
                      : item,
                  )
                : [{ ...trait, id: generateId() }, ...custom],
            )
          }
          onClose={() => {
            setPickerOpen(false);
            setEditingCustom(null);
          }}
        />
      )}
    </section>
  );
}

function CustomCreatureTraitCard({
  trait,
  onEdit,
  onLevelChange,
  onRemove,
}: {
  trait: ICustomCreatureTrait;
  onEdit: () => void;
  onLevelChange: (level: number) => void;
  onRemove: () => void;
}) {
  const level = Math.max(1, trait.level ?? 1);
  const maxLevel = trait.maxLevel ?? null;
  return (
    <article className="group relative overflow-hidden rounded-xl border border-[#2E6F63]/40 bg-[#1E1D1B] transition-all duration-150 hover:border-[#2E6F63]/70 hover:bg-[#201F1D]">
      <div className="flex min-w-0 items-start gap-3 p-2">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#2E6F63]/30 bg-[#153029]/60 text-[#6FCF97]">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-[11px] font-black uppercase tracking-wide text-[#F5EFEB]">
                  {trait.name}
                </p>
                {trait.badge && (
                  <span className="rounded-md bg-[#242220] px-1.5 py-0.5 text-[9px] font-black text-[#89B5F7]">
                    {trait.badge}
                  </span>
                )}
                {maxLevel != null && (
                  <span className="rounded-md bg-[#242220] px-1.5 py-0.5 text-[9px] font-black text-[#6FCF97]">
                    Máx. {maxLevel}
                  </span>
                )}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#cdc6c1]">
                    Nível
                  </span>
                  <div className="flex items-center gap-0.5 rounded-lg border border-[#383430] bg-[#171615] p-0.5">
                    <button
                      type="button"
                      disabled={level <= 1}
                      onClick={() => onLevelChange(Math.max(1, level - 1))}
                      className="cursor-pointer flex h-5 w-5 items-center justify-center rounded-md text-[#81776E] hover:bg-[#242220] hover:text-[#6FCF97] disabled:pointer-events-none disabled:opacity-25"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-[22px] px-0.5 text-center text-[10px] font-black tabular-nums text-[#6FCF97]">
                      {level}
                    </span>
                    <button
                      type="button"
                      disabled={maxLevel != null && level >= maxLevel}
                      onClick={() =>
                        onLevelChange(
                          maxLevel == null
                            ? level + 1
                            : Math.min(maxLevel, level + 1),
                        )
                      }
                      className="cursor-pointer flex h-5 w-5 items-center justify-center rounded-md text-[#81776E] hover:bg-[#242220] hover:text-[#6FCF97] disabled:pointer-events-none disabled:opacity-25"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-[#bbb6b3]">
                {trait.description}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={onEdit}
                aria-label={`Editar ${trait.name}`}
                className="cursor-pointer rounded-lg p-1.5 text-[#6D655D] transition-colors hover:bg-[#242220] hover:text-[#F5EFEB]"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onRemove}
                aria-label={`Remover ${trait.name}`}
                className="cursor-pointer rounded-lg p-1.5 text-[#6D655D] transition-colors hover:bg-[#2B1F1C] hover:text-[#D97867]"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function CreatureTraitCard({
  trait,
  level,
  onLevelChange,
  onRemove,
}: {
  trait: (typeof traitDefinitions)[number];
  level: number;
  onLevelChange: (level: number) => void;
  onRemove: () => void;
}) {
  const maxLevel = trait.maxLevel ?? null;
  const costLabel = formatTraitCost(trait.cost);

  return (
    <article className="group relative overflow-hidden rounded-xl border border-[#2E6F63]/40 bg-[#1E1D1B] transition-all duration-150 hover:border-[#2E6F63]/70 hover:bg-[#201F1D]">
      <div className="flex min-w-0 items-start gap-3 p-2">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#2E6F63]/30 bg-[#153029]/60 text-[#6FCF97]">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-[11px] font-black uppercase tracking-wide text-[#F5EFEB]">
                  {trait.name}
                </p>
                {costLabel && (
                  <span className="rounded-md bg-[#242220] px-1.5 py-0.5 text-[9px] font-black text-[#89B5F7]">
                    {costLabel}
                  </span>
                )}
                {maxLevel != null && (
                  <span className="rounded-md bg-[#242220] px-1.5 py-0.5 text-[9px] font-black text-[#6FCF97]">
                    Máx. {maxLevel}
                  </span>
                )}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#cdc6c1]">
                    Nível
                  </span>
                  <div className="flex items-center gap-0.5 rounded-lg border border-[#383430] bg-[#171615] p-0.5">
                    <button
                      type="button"
                      disabled={level <= 1}
                      onClick={() => onLevelChange(Math.max(1, level - 1))}
                      className="cursor-pointer flex h-5 w-5 items-center justify-center rounded-md text-[#81776E] hover:bg-[#242220] hover:text-[#6FCF97] disabled:pointer-events-none disabled:opacity-25"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-[22px] px-0.5 text-center text-[10px] font-black tabular-nums text-[#6FCF97]">
                      {level}
                    </span>
                    <button
                      type="button"
                      disabled={maxLevel != null && level >= maxLevel}
                      onClick={() =>
                        onLevelChange(
                          maxLevel == null
                            ? level + 1
                            : Math.min(maxLevel, level + 1),
                        )
                      }
                      className="cursor-pointer flex h-5 w-5 items-center justify-center rounded-md text-[#81776E] hover:bg-[#242220] hover:text-[#6FCF97] disabled:pointer-events-none disabled:opacity-25"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-[#bbb6b3]">
                {trait.description}
              </p>
            </div>
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remover ${trait.name}`}
              className="cursor-pointer shrink-0 rounded-lg p-1.5 text-[#6D655D] transition-colors hover:bg-[#2B1F1C] hover:text-[#D97867]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function TraitLibraryModal({
  selected,
  editing,
  onToggle,
  onLevelChange,
  onSaveCustom,
  onClose,
}: {
  selected: ICreature["traits"];
  editing: ICustomCreatureTrait | null;
  onToggle: (traitId: ID) => void;
  onLevelChange: (traitId: ID, level: number) => void;
  onSaveCustom: (trait: Omit<ICustomCreatureTrait, "id">) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"biblioteca" | "personalizado">(
    editing ? "personalizado" : "biblioteca",
  );
  const [name, setName] = useState(editing?.name ?? "");
  const [badge, setBadge] = useState(editing?.badge ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [level, setLevel] = useState(editing?.level ?? 1);
  const [maxLevel, setMaxLevel] = useState<number | "">(
    editing?.maxLevel ?? "",
  );

  function handleSaveCustom() {
    if (!name.trim()) return;
    const normalizedMax = maxLevel === "" ? undefined : Math.max(1, maxLevel);
    onSaveCustom({
      name: name.trim(),
      badge: badge.trim() || undefined,
      description: description.trim(),
      level:
        normalizedMax == null
          ? Math.max(1, level)
          : clamp(level, 1, normalizedMax),
      maxLevel: normalizedMax,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#383430] bg-[#1A1918] p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-[#F5EFEB]">
              {editing ? "Editar Traço" : "Novo Traço"}
            </h3>
            <p className="mt-1 text-[10px] text-[#7A7065]">
              Escolha as capacidades desta Criatura.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar biblioteca"
            className="rounded-lg p-1.5 text-[#8F877D] transition-colors hover:bg-[#242220] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {!editing && (
          <div className="mb-4 flex rounded-xl border border-[#383430] bg-[#171615] p-1">
            <button
              type="button"
              onClick={() => setMode("biblioteca")}
              className={`flex-1 rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-wide transition-colors ${mode === "biblioteca" ? "border-[#2E6F63]/50 bg-[#153029]/60 text-[#6FCF97]" : "border-transparent text-[#8F877D] hover:bg-[#1E1D1B] hover:text-[#F5EFEB]"}`}
            >
              Biblioteca
            </button>
            <button
              type="button"
              onClick={() => setMode("personalizado")}
              className={`flex-1 rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-wide transition-colors ${mode === "personalizado" ? "border-[#2E6F63]/50 bg-[#153029]/60 text-[#6FCF97]" : "border-transparent text-[#8F877D] hover:bg-[#1E1D1B] hover:text-[#F5EFEB]"}`}
            >
              Personalizado
            </button>
          </div>
        )}
        {mode === "biblioteca" && !editing ? (
          <TraitPicker
            title="Traços disponíveis"
            allTraits={traitDefinitions}
            selected={selected}
            onToggle={onToggle}
            onLevelChange={onLevelChange}
          />
        ) : (
          <div className="space-y-3">
            <Field label="Nome" required>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex: Carapaça de Basalto"
                className={inputClass}
                autoFocus
              />
            </Field>
            <Field label="Custo ou etiqueta">
              <input
                value={badge}
                onChange={(event) => setBadge(event.target.value)}
                placeholder="Ex: Passiva ou 1 Sucesso"
                className={inputClass}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nível inicial">
                <input
                  type="number"
                  min={1}
                  value={level}
                  onChange={(event) =>
                    setLevel(Math.max(1, Number(event.target.value)))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Nível máximo" hint="Opcional">
                <input
                  type="number"
                  min={1}
                  value={maxLevel}
                  onChange={(event) =>
                    setMaxLevel(
                      event.target.value === ""
                        ? ""
                        : Math.max(1, Number(event.target.value)),
                    )
                  }
                  placeholder="Sem limite"
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Descrição">
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Descreva a capacidade especial da Criatura..."
                className={`${inputClass} min-h-24 resize-y`}
              />
            </Field>
            <div className="flex items-center justify-end gap-2 border-t border-[#302D29] pt-4">
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
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#2E6F63]/40 bg-[#2E6F63] px-3.5 py-2 text-xs font-black text-white transition-all hover:bg-[#357C6F] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                {editing ? "Salvar alterações" : "Adicionar Traço"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default CreatureSheet;
