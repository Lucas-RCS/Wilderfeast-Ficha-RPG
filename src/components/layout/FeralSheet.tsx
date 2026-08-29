import { useMemo, useState } from "react";
import {
  Check,
  Hammer,
  Link2,
  Plus,
  Target,
  Trash2,
  Users,
  X,
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
  ITechniqueTraining,
  IUtensilDefinition,
  OriginDishType,
  PermanentReward,
  SkillKey,
  StyleKey,
} from "../../types/types";
import {
  SKILLS,
  STYLES,
  conditionDefinitions,
  creatureDefinitions,
  creaturesById,
  specialtiesById,
  techniqueDefinitions,
  techniquesById,
  traitDefinitions,
  traitsById,
  utensilsById,
} from "../../data/wilderfeastData";
import {
  addFeralToMatilha,
  deleteFeral,
  generateId,
  getAllFeralCards,
  getAllMatilhas,
  getFeralById,
  removeFeralFromMatilha,
  saveFeral,
} from "../../lib/storage";
import {
  ALL_ORIGIN_DISH_TYPES,
  ORIGIN_DISH_LABELS,
} from "../../types/wilderfeastTypes";
import { useAutosaveEntity } from "../../hooks/useAutosaveEntity";
import { formatRelativeTime } from "../../hooks/useUtils";
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
import { TechniquePicker } from "../../components/layout/TechniquePicker";
import { SheetHeader } from "../../components/layout/SheetHeader";
import { SheetNotFound } from "../../components/layout/SheetNotFound";
import { FloatingUndoButton } from "../../components/ui/FloatingUndoButton";
import { ConfirmButton } from "../../components/ui/ConfirmButton";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

interface FeralSheetProps {
  feralId: ID;
  onBack: () => void;
  onDeleted: () => void;
}

/** Ponto de entrada: carrega o Feral do storage e trata o caso de "não encontrado". */
function FeralSheet({ feralId, onBack, onDeleted }: FeralSheetProps) {
  const initial = getFeralById(feralId);

  if (!initial) {
    return <SheetNotFound label="Feral" onBack={onBack} />;
  }

  // `key` força remontagem (e novo estado de autosave) ao trocar de Feral.
  return (
    <FeralSheetView
      key={feralId}
      initial={initial}
      onBack={onBack}
      onDeleted={onDeleted}
    />
  );
}

function FeralSheetView({
  initial,
  onBack,
  onDeleted,
}: {
  initial: IFeral;
  onBack: () => void;
  onDeleted: () => void;
}) {
  const { entity, update, undo, canUndo, lastSavedAt, isPending } =
    useAutosaveEntity<IFeral>({ initial, save: saveFeral });

  const [matilhas, setMatilhas] = useState<IMatilha[]>(() => getAllMatilhas());
  const feralOptions = useMemo(() => getAllFeralCards(), []);

  const specialtyName =
    specialtiesById[entity.specialtyId]?.name ?? entity.specialtyId;
  const utensilDef = utensilsById[entity.utensil.utensilId] as
    | IUtensilDefinition
    | undefined;
  const currentMatilha = matilhas.find((m) => m.memberIds.includes(entity.id));

  function handleDelete() {
    deleteFeral(entity.id);
    onDeleted();
  }

  function handleJoinMatilha(matilhaId: ID) {
    if (currentMatilha) removeFeralFromMatilha(currentMatilha.id, entity.id);
    addFeralToMatilha(matilhaId, entity.id);
    setMatilhas(getAllMatilhas());
  }

  function handleLeaveMatilha() {
    if (!currentMatilha) return;
    removeFeralFromMatilha(currentMatilha.id, entity.id);
    setMatilhas(getAllMatilhas());
  }

  return (
    <div className="min-h-screen bg-[#121110] text-[#F5EFEB] pb-24">
      <SheetHeader
        eyebrow="Ficha de Feral"
        accent="blue"
        avatarUrl={entity.avatarUrl ?? ""}
        onAvatarChange={(avatarUrl) =>
          update({ avatarUrl: avatarUrl || undefined })
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
        actions={
          <ConfirmButton label="Excluir Feral" onConfirm={handleDelete} />
        }
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={entity.pronouns}
              onChange={(e) => update({ pronouns: e.target.value })}
              placeholder="pronomes"
              className="w-28 border-b border-transparent bg-transparent text-xs font-medium text-[#B0A497] outline-none transition-colors hover:border-[#383430] focus:border-[#FF9B42]"
            />
            <span className="inline-flex items-center gap-1 rounded-full border border-[#2B6CB0]/40 bg-[#13335C]/20 px-2.5 py-1 text-[10px] font-bold text-[#89B5F7]">
              <Target className="w-3 h-3" /> {specialtyName}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#383430] bg-[#1A1918] px-2.5 py-1 text-[10px] font-bold text-[#FF9B42]">
              <Hammer className="w-3 h-3" />{" "}
              {utensilDef?.name ?? entity.utensil.utensilId}
            </span>
          </div>
        }
      />

      <main className="mx-auto max-w-5xl space-y-5 px-4 sm:px-6 py-6">
        <section className={cardClass}>
          <SectionTitle eyebrow="Identidade" title="Aparência" />
          <textarea
            value={entity.appearance}
            onChange={(e) => update({ appearance: e.target.value })}
            className={`${inputClass} mt-3 min-h-24 resize-y`}
          />
        </section>

        <div className="grid gap-5 md:grid-cols-2">
          <section className={cardClass}>
            <SectionTitle
              eyebrow="Recursos"
              title="Vigor"
              subtitle="Resistência física e mental do Feral."
            />
            <VigorEditor
              vigor={entity.vigor}
              onChange={(vigor) => update({ vigor })}
            />
          </section>
          <section className={cardClass}>
            <SectionTitle
              eyebrow="Equipamento"
              title={utensilDef?.name ?? "Utensílio"}
              subtitle="Durabilidade e alcance do Utensílio de Arkaicaço."
            />
            <UtensilEditor
              utensil={entity.utensil}
              definition={utensilDef}
              onChange={(utensil) => update({ utensil })}
            />
          </section>
        </div>

        <section className={cardClass}>
          <SectionTitle
            eyebrow="Combate"
            title="Estilos de Ação"
            subtitle="De 1 a 5. Definem os dados rolados em cada abordagem."
          />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(STYLES).map(([key, meta]) => (
              <NumberStepper
                key={key}
                label={meta.name}
                min={1}
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
            eyebrow="Combate"
            title="Técnicas"
            subtitle="Técnicas conhecidas e a que está em treinamento."
          />
          <TechniquesEditor
            known={entity.techniques}
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
              update({ techniqueTraining })
            }
          />
        </section>

        <section className={cardClass}>
          <SectionTitle
            eyebrow="Progressão"
            title="Traços"
            subtitle="Habilidades especiais adquiridas pelo Feral."
          />
          <div className="mt-3">
            <TraitPicker
              title="Traços do Feral"
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
          </div>
        </section>

        <section className={cardClass}>
          <SectionTitle
            eyebrow="Status"
            title="Condições"
            subtitle="Efeitos ativos no Feral neste momento."
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
            eyebrow="História"
            title="Origem"
            subtitle="Os marcos que moldaram o Feral."
          />
          <OriginEditor
            origin={entity.origin}
            onChange={(origin) => update({ origin })}
            feralOptions={feralOptions}
            selfId={entity.id}
          />
        </section>

        <section className={cardClass}>
          <SectionTitle eyebrow="História" title="Personalidade" />
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="É...">
              <input
                value={entity.personality.is}
                onChange={(e) =>
                  update({
                    personality: { ...entity.personality, is: e.target.value },
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
        </section>

        <section className={cardClass}>
          <SectionTitle eyebrow="História" title="Monstro Importante" />
          <ImportantMonsterEditor
            value={entity.importantMonster}
            onChange={(importantMonster) => update({ importantMonster })}
          />
        </section>

        <section className={cardClass}>
          <SectionTitle
            eyebrow="Vínculos"
            title="Matilha"
            subtitle="A qual Matilha este Feral pertence."
          />
          <MatilhaMembershipEditor
            matilhas={matilhas}
            currentMatilha={currentMatilha}
            onJoin={handleJoinMatilha}
            onLeave={handleLeaveMatilha}
          />
        </section>

        <section className={cardClass}>
          <SectionTitle
            eyebrow="Progressão"
            title="Banquete Feral"
            subtitle="Criaturas banqueteadas e as recompensas permanentes obtidas."
          />
          <FeastHistoryEditor
            records={entity.feastHistory}
            onAdd={(record) =>
              update({ feastHistory: [record, ...entity.feastHistory] })
            }
            onRemove={(id) =>
              update({
                feastHistory: entity.feastHistory.filter((r) => r.id !== id),
              })
            }
          />
        </section>

        <section className={cardClass}>
          <SectionTitle
            eyebrow="Registro"
            title="Diário de Caçada"
            subtitle="Anotações livres sobre a jornada do Feral."
          />
          <JournalNotesEditor
            notes={entity.notes}
            onChange={(notes) => update({ notes })}
          />
        </section>
      </main>

      <FloatingUndoButton visible={canUndo} onUndo={undo} />
    </div>
  );
}

// ============================================================================
// VIGOR & UTENSÍLIO
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
                current: clamp(Number(e.target.value), 0, vigor.max),
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

  return (
    <div className="mt-3 space-y-3">
      <div className="h-2.5 overflow-hidden rounded-full border border-[#302D29] bg-[#1E1D1B]">
        <div
          className="h-full bg-gradient-to-r from-[#5A4632] to-[#FF9B42] transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isBroken && definition && (
        <div className="rounded-lg border border-[#9B2C2C]/40 bg-[#2B1A16] px-3 py-2 text-[11px] text-[#F0C4A8]">
          <span className="font-bold">Quebrado: </span>
          {definition.brokenDescription}
        </div>
      )}
      <div className="grid grid-cols-3 gap-3">
        <Field label="Durab. atual">
          <input
            type="number"
            min={0}
            max={utensil.durability.max}
            value={utensil.durability.current}
            onChange={(e) =>
              onChange({
                ...utensil,
                durability: {
                  ...utensil.durability,
                  current: clamp(
                    Number(e.target.value),
                    0,
                    utensil.durability.max,
                  ),
                },
              })
            }
            className={inputClass}
          />
        </Field>
        <Field label="Durab. máxima">
          <input
            type="number"
            min={1}
            value={utensil.durability.max}
            onChange={(e) => {
              const max = Math.max(1, Number(e.target.value));
              onChange({
                ...utensil,
                durability: {
                  current: Math.min(utensil.durability.current, max),
                  max,
                },
              });
            }}
            className={inputClass}
          />
        </Field>
        <Field label="Alcance">
          <input
            type="number"
            min={0}
            value={utensil.range}
            onChange={(e) =>
              onChange({
                ...utensil,
                range: Math.max(0, Number(e.target.value)),
              })
            }
            className={inputClass}
          />
        </Field>
      </div>
    </div>
  );
}

// ============================================================================
// TÉCNICAS
// ============================================================================

function TechniquesEditor({
  known,
  training,
  onToggle,
  onTrainingChange,
}: {
  known: IFeral["techniques"];
  training?: ITechniqueTraining;
  onToggle: (techniqueId: ID) => void;
  onTrainingChange: (training: ITechniqueTraining | undefined) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const knownDefs = known
    .map((t) => techniquesById[t.techniqueId])
    .filter((t): t is (typeof techniqueDefinitions)[number] => Boolean(t));

  return (
    <div className="mt-3 space-y-4">
      <div className="grid gap-2 sm:grid-cols-2">
        {knownDefs.map((technique) => (
          <div
            key={technique.id}
            className="rounded-xl border border-[#383430] bg-[#1E1D1B] p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#F5EFEB]">
                  {technique.name}
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-[#8F877D]">
                  {technique.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onToggle(technique.id)}
                className="shrink-0 rounded-lg p-1 text-[#B0645A] hover:bg-[#5C2626]/40 hover:text-white"
                title="Esquecer Técnica"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {knownDefs.length === 0 && (
          <div className="sm:col-span-2">
            <EmptyState message="Nenhuma Técnica conhecida ainda." />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setPickerOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-xl border border-[#383430] bg-[#242220] px-3.5 py-2 text-xs font-black text-[#F5EFEB] transition-colors hover:border-[#FF9B42]"
      >
        <Plus className="w-4 h-4 text-[#FF9B42]" />
        {pickerOpen ? "Fechar lista de Técnicas" : "Aprender Técnica"}
      </button>
      {pickerOpen && (
        <TechniquePicker
          allTechniques={techniqueDefinitions}
          known={known}
          onToggle={onToggle}
        />
      )}

      <div className="rounded-xl border border-[#302D29] bg-[#171615] p-3">
        <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-[#B0A497]">
          Técnica em treinamento
        </p>
        <div className="grid items-end gap-3 sm:grid-cols-[2fr_1fr]">
          <Field label="Técnica">
            <select
              value={training?.techniqueId ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                onTrainingChange(
                  value
                    ? {
                        techniqueId: Number(value),
                        sessions: training?.sessions ?? 0,
                      }
                    : undefined,
                );
              }}
              className={inputClass}
            >
              <option value="">Nenhuma</option>
              {techniqueDefinitions.map((technique) => (
                <option key={technique.id} value={technique.id}>
                  {technique.name}
                </option>
              ))}
            </select>
          </Field>
          {training && (
            <Field label="Sessões">
              <input
                type="number"
                min={0}
                value={training.sessions}
                onChange={(e) =>
                  onTrainingChange({
                    ...training,
                    sessions: Math.max(0, Number(e.target.value)),
                  })
                }
                className={inputClass}
              />
            </Field>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ORIGEM
// ============================================================================

const ORIGIN_DISH_META: {
  key: "creation" | "initiation" | "ambition";
  type: OriginDishType;
}[] = [
  { key: "creation", type: "criacao" },
  { key: "initiation", type: "iniciacao" },
  { key: "ambition", type: "ambicao" },
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
    onChange({ ...origin, [key]: { ...origin[key], ...patch } });
  }

  function updateConnection(patch: Partial<IOriginConnection>) {
    onChange({ ...origin, connection: { ...origin.connection, ...patch } });
  }

  return (
    <div className="mt-3 space-y-4">
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
                    updateDish(key, { description: e.target.value })
                  }
                  className={`${inputClass} min-h-20 resize-y text-xs`}
                />
              </Field>
              <Field label="Bônus de Perícia">
                <select
                  value={dish.skillBonus}
                  onChange={(e) =>
                    updateDish(key, { skillBonus: e.target.value as SkillKey })
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
                    updateDish(key, { notes: e.target.value || undefined })
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
              onChange({ ...origin, homeland: e.target.value || undefined })
            }
            className={inputClass}
          />
        </Field>
        <Field label="Ingrediente típico">
          <input
            value={origin.typicalIngredient}
            onChange={(e) =>
              onChange({ ...origin, typicalIngredient: e.target.value })
            }
            className={inputClass}
          />
        </Field>
        <Field label="Tempero típico">
          <input
            value={origin.typicalSeasoning}
            onChange={(e) =>
              onChange({ ...origin, typicalSeasoning: e.target.value })
            }
            className={inputClass}
          />
        </Field>
      </div>

      <div className="rounded-xl border border-[#302D29] bg-[#171615] p-3.5">
        <div className="mb-3 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[#38C2B3]" />
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
        <div className="mt-3">
          <Field label="Descrição da conexão">
            <textarea
              value={origin.connection.description}
              onChange={(e) =>
                updateConnection({ description: e.target.value })
              }
              className={`${inputClass} min-h-16 resize-y text-xs`}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MONSTRO IMPORTANTE
// ============================================================================

function ImportantMonsterEditor({
  value,
  onChange,
}: {
  value: IImportantMonsterRelation;
  onChange: (value: IImportantMonsterRelation) => void;
}) {
  return (
    <div className="mt-3 grid gap-4 sm:grid-cols-2">
      <Field label="Criatura">
        <select
          value={value.monsterId}
          onChange={(e) =>
            onChange({ ...value, monsterId: Number(e.target.value) })
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
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          className={inputClass}
        />
      </Field>
    </div>
  );
}

// ============================================================================
// MATILHA
// ============================================================================

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
    <div className="mt-3 space-y-3">
      {currentMatilha ? (
        <div className="flex items-center justify-between rounded-xl border border-[#2B6CB0]/40 bg-[#13335C]/20 px-3.5 py-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#89B5F7]" />
            <div>
              <p className="text-[11px] font-bold text-[#F5EFEB]">
                {currentMatilha.name}
              </p>
              <p className="text-[10px] text-[#8F877D]">
                {currentMatilha.memberIds.length} membro
                {currentMatilha.memberIds.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLeave}
            className="rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-[#B0645A] transition-colors hover:bg-[#5C2626]/40 hover:text-white"
          >
            Sair da Matilha
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

// ============================================================================
// BANQUETE FERAL
// ============================================================================

function describeReward(reward: PermanentReward): string {
  if (reward.type === "style") return `+1 Estilo: ${STYLES[reward.key].name}`;
  if (reward.type === "skill") return `+1 Perícia: ${SKILLS[reward.key].name}`;
  return `Traço: ${traitsById[reward.traitId]?.name ?? "—"}`;
}

function FeastHistoryEditor({
  records,
  onAdd,
  onRemove,
}: {
  records: IFeastRecord[];
  onAdd: (record: IFeastRecord) => void;
  onRemove: (id: ID) => void;
}) {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="mt-3 space-y-3">
      <div className="space-y-2">
        {records.map((record) => {
          const monster = creaturesById[record.monsterId] as
            | ICreature
            | undefined;
          return (
            <div
              key={record.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-[#383430] bg-[#1E1D1B] p-3"
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
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
        {records.length === 0 && (
          <EmptyState message="Nenhum Banquete registrado ainda." />
        )}
      </div>

      {formOpen ? (
        <FeastRecordForm
          onAdd={(record) => {
            onAdd(record);
            setFormOpen(false);
          }}
          onCancel={() => setFormOpen(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-[#383430] bg-[#242220] px-3.5 py-2 text-xs font-black text-[#F5EFEB] transition-colors hover:border-[#FF9B42]"
        >
          <Plus className="w-4 h-4 text-[#FF9B42]" />
          Registrar Banquete
        </button>
      )}
    </div>
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
        ? { type: "style", key: styleKey }
        : rewardType === "skill"
          ? { type: "skill", key: skillKey }
          : { type: "trait", traitId: Number(traitId) };

    onAdd({
      id: generateId(),
      monsterId: Number(monsterId),
      dishName: dishName.trim() || undefined,
      date: date || undefined,
      permanentReward,
    });
  }

  return (
    <div className="space-y-3 rounded-xl border border-[#302D29] bg-[#171615] p-3.5">
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
          <Check className="w-3.5 h-3.5" />
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
// DIÁRIO DE CAÇADA
// ============================================================================

function JournalNotesEditor({
  notes,
  onChange,
}: {
  notes: IJournalNote[];
  onChange: (notes: IJournalNote[]) => void;
}) {
  function addNote() {
    const note: IJournalNote = {
      id: generateId(),
      title: "",
      category: "Geral",
      content: "",
      createdAt: new Date().toISOString(),
    };
    onChange([note, ...notes]);
  }

  function updateNote(id: ID, patch: Partial<IJournalNote>) {
    onChange(
      notes.map((note) => (note.id === id ? { ...note, ...patch } : note)),
    );
  }

  function removeNote(id: ID) {
    onChange(notes.filter((note) => note.id !== id));
  }

  return (
    <div className="mt-3 space-y-3">
      <button
        type="button"
        onClick={addNote}
        className="inline-flex items-center gap-2 rounded-xl border border-[#383430] bg-[#242220] px-3.5 py-2 text-xs font-black text-[#F5EFEB] transition-colors hover:border-[#FF9B42]"
      >
        <Plus className="w-4 h-4 text-[#FF9B42]" />
        Nova Anotação
      </button>

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="space-y-2.5 rounded-xl border border-[#383430] bg-[#1E1D1B] p-3.5"
          >
            <div className="flex items-start gap-2">
              <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-[2fr_1fr]">
                <input
                  value={note.title}
                  onChange={(e) =>
                    updateNote(note.id, { title: e.target.value })
                  }
                  placeholder="Título"
                  className={`${inputClass} text-xs`}
                />
                <input
                  value={note.category}
                  onChange={(e) =>
                    updateNote(note.id, { category: e.target.value })
                  }
                  placeholder="Categoria"
                  className={`${inputClass} text-xs`}
                />
              </div>
              <button
                type="button"
                onClick={() => removeNote(note.id)}
                className="mt-0.5 shrink-0 rounded-lg p-1.5 text-[#B0645A] hover:bg-[#5C2626]/40 hover:text-white"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              value={note.content}
              onChange={(e) => updateNote(note.id, { content: e.target.value })}
              placeholder="O que aconteceu..."
              className={`${inputClass} min-h-20 resize-y text-xs`}
            />
            <p className="text-[9px] text-[#7A7065]">
              {formatRelativeTime(note.createdAt)}
            </p>
          </div>
        ))}
        {notes.length === 0 && (
          <EmptyState message="Nenhuma anotação registrada ainda." />
        )}
      </div>
    </div>
  );
}

export default FeralSheet;
