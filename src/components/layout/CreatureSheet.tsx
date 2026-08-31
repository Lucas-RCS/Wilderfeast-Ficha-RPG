import { Plus } from "lucide-react";

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
  conditionDefinitions,
  traitDefinitions,
} from "../../data/wilderfeastData";
import {
  deleteCreature,
  getCreatureById,
  saveCreature,
} from "../../lib/storage";
import {
  ALL_MONSTER_LINEAGES,
  ALL_MONSTER_STAGES,
} from "../../types/wilderfeastTypes";
import { useAutosaveEntity } from "../../hooks/useAutosaveEntity";
import {
  EmptyState,
  Field,
  NumberStepper,
  SectionTitle,
  cardClass,
  inputClass,
} from "../../components/creation/FormControls";
import {
  ConditionPicker,
  TraitPicker,
} from "../../components/creation/TraitConditionPicker";
import { PartEditor } from "../../components/creation/PartEditor";
import { createEmptyCreaturePart } from "../../lib/creatureCreation";
import { SheetHeader } from "../../components/layout/SheetHeader";
import { SheetNotFound } from "../../components/layout/SheetNotFound";
import { FloatingUndoButton } from "../../components/ui/FloatingUndoButton";
import { ConfirmButton } from "../../components/ui/ConfirmButton";

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

  function handleDelete() {
    deleteCreature(entity.id);
    onDeleted();
  }

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
        actions={
          <ConfirmButton label="Excluir Criatura" onConfirm={handleDelete} />
        }
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

      <main className="mx-auto max-w-5xl space-y-5 px-4 sm:px-6 py-6">
        <section className={cardClass}>
          <SectionTitle
            eyebrow="Identidade"
            title="Descrição"
            subtitle="Tamanho, porte e aparência geral."
          />
          <div className="mt-3 space-y-3">
            <Field label="Tamanho / porte">
              <input
                value={entity.sizeDescription}
                onChange={(e) => update({ sizeDescription: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Descrição">
              <textarea
                value={entity.description}
                onChange={(e) => update({ description: e.target.value })}
                className={`${inputClass} min-h-24 resize-y`}
              />
            </Field>
          </div>
        </section>

        <section className={cardClass}>
          <SectionTitle
            eyebrow="Recursos"
            title="Vigor"
            subtitle="Resistência da Criatura durante a Caçada."
          />
          <VigorEditor
            vigor={entity.vigor}
            onChange={(vigor) => update({ vigor })}
          />
        </section>

        <section className={cardClass}>
          <SectionTitle
            eyebrow="Combate"
            title="Estilos"
            subtitle="De 0 a 5. Definem os dados rolados em cada ataque."
          />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(STYLES).map(([key, meta]) => (
              <NumberStepper
                key={key}
                label={meta.name}
                min={0}
                max={5}
                value={entity.styles[key as StyleKey]}
                onChange={(value) =>
                  update({ styles: { ...entity.styles, [key]: value } })
                }
              />
            ))}
          </div>
        </section>

        <section className={cardClass}>
          <SectionTitle
            eyebrow="Combate"
            title="Perícias"
            subtitle="De 0 a 3. Somam-se ao Estilo em cada teste."
          />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(SKILLS).map(([key, meta]) => (
              <NumberStepper
                key={key}
                label={meta.name}
                min={0}
                max={3}
                value={entity.skills[key as SkillKey]}
                onChange={(value) =>
                  update({ skills: { ...entity.skills, [key]: value } })
                }
              />
            ))}
          </div>
        </section>

        <section className={cardClass}>
          <SectionTitle
            eyebrow="Progressão"
            title="Traços"
            subtitle="Separe Traços principais dos adicionais."
          />
          <div className="mt-3 space-y-4">
            <TraitPicker
              title="Traços principais"
              allTraits={traitDefinitions}
              selected={entity.traits}
              onToggle={(traitId) =>
                update({
                  traits: entity.traits.some((t) => t.traitId === traitId)
                    ? entity.traits.filter((t) => t.traitId !== traitId)
                    : [...entity.traits, { traitId, level: 1 }],
                })
              }
              onLevelChange={(traitId, level) =>
                update({
                  traits: entity.traits.map((t) =>
                    t.traitId === traitId ? { ...t, level } : t,
                  ),
                })
              }
            />
            <TraitPicker
              title="Traços adicionais"
              hint="Traços extras adquiridos ao longo da progressão da Criatura."
              allTraits={traitDefinitions}
              selected={entity.additionalTraits}
              onToggle={(traitId) =>
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
              onLevelChange={(traitId, level) =>
                update({
                  additionalTraits: entity.additionalTraits.map((t) =>
                    t.traitId === traitId ? { ...t, level } : t,
                  ),
                })
              }
            />
          </div>
        </section>

        <section className={cardClass}>
          <SectionTitle
            eyebrow="Status"
            title="Condições"
            subtitle="Efeitos ativos na Criatura neste momento."
          />
          <div className="mt-3">
            <ConditionPicker
              title="Condições ativas"
              allConditions={conditionDefinitions}
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
          </div>
        </section>

        <section className={cardClass}>
          <SectionTitle
            eyebrow="Anatomia"
            title="Partes do Corpo"
            subtitle="Cada Parte pode ter Durabilidade própria, Ataque e um efeito de quebra."
          />
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#8F877D]">
                {entity.parts.length} parte
                {entity.parts.length === 1 ? "" : "s"} cadastrada
                {entity.parts.length === 1 ? "" : "s"}.
              </p>
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
        </section>
      </main>

      <FloatingUndoButton visible={canUndo} onUndo={undo} />
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
  vigor: ICreature["vigor"];
  onChange: (vigor: ICreature["vigor"]) => void;
}) {
  const percentage =
    vigor.max > 0
      ? Math.max(0, Math.min(100, (vigor.current / vigor.max) * 100))
      : 0;

  return (
    <div className="mt-3 space-y-3">
      <div className="h-2.5 overflow-hidden rounded-full border border-[#302D29] bg-[#1E1D1B]">
        <div
          className="h-full bg-gradient-to-r from-[#9B2C2C] to-[#FF9B42] transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Atual">
          <input
            type="number"
            min={0}
            max={vigor.max}
            value={vigor.current}
            onChange={(e) =>
              onChange({
                ...vigor,
                current: Math.max(
                  0,
                  Math.min(vigor.max, Number(e.target.value)),
                ),
              })
            }
            className={inputClass}
          />
        </Field>
        <Field label="Máximo">
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
    </div>
  );
}

export default CreatureSheet;
