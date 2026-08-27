import React, { useMemo, useState } from "react";
import type {
  ICreature,
  ICreaturePart,
  ITrait,
  SkillKey,
  StyleKey,
  MonsterLineage,
  MonsterStage,
  PartCategory,
} from "../../types";
import {
  calculateEffectiveStats,
  MONSTER_LINEAGES,
  STAGE_CONFIG,
} from "../data/creatureData";
import {
  ALL_CONDITIONS_DATA,
  ALL_TRAITS_COMPENDIUM,
} from "../../data/wilderfeastData";
import { InfoTooltip } from "../ui/Tooltip";
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Dna,
  Heart,
  MapPin,
  Plus,
  Shield,
  Trash2,
  Target,
} from "lucide-react";

interface CreatureSheetViewProps {
  sheet: ICreature;
  onChange: (updated: Partial<ICreature>) => void;
  onOpenCompendium: () => void;
}

type CreatureTabKey = "parts" | "skills" | "traits" | "behavior";

const STYLES_INFO: Array<{
  key: StyleKey;
  label: string;
  desc: string;
  tooltip: string;
}> = [
  {
    key: "ligeiro",
    label: "Ligeiro",
    desc: "Velocidade, agilidade e esquiva",
    tooltip: "Velocidade, agilidade e movimentos rápidos.",
  },
  {
    key: "poderoso",
    label: "Poderoso",
    desc: "Força bruta e impacto",
    tooltip: "Força destrutiva e impacto.",
  },
  {
    key: "preciso",
    label: "Preciso",
    desc: "Foco e ataques direcionados",
    tooltip: "Precisão e ataques direcionados.",
  },
  {
    key: "sagaz",
    label: "Sagaz",
    desc: "Astúcia e adaptação",
    tooltip: "Astúcia, camuflagem e emboscadas.",
  },
];

const SKILLS: Array<{ key: SkillKey; label: string }> = [
  ["agarrar", "Agarrar"],
  ["armazenar", "Armazenar"],
  ["assegurar", "Assegurar"],
  ["atirar", "Atirar"],
  ["atravessar", "Atravessar"],
  ["chamar", "Chamar"],
  ["curar", "Curar"],
  ["estudar", "Estudar"],
  ["exibir", "Exibir"],
  ["golpear", "Golpear"],
  ["manufaturar", "Manufaturar"],
  ["procurar", "Procurar"],
].map(([key, label]) => ({ key: key as SkillKey, label }));

const PART_CATEGORIES: PartCategory[] = [
  "Passiva",
  "Alcance",
  "Natural",
  "Outro",
];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const CreatureSheetView: React.FC<CreatureSheetViewProps> = ({
  sheet,
  onChange,
  onOpenCompendium,
}) => {
  const [activeTab, setActiveTab] = useState<CreatureTabKey>("parts");
  const [expandedPartId, setExpandedPartId] = useState<string | null>(
    sheet.parts[0]?.id ?? null,
  );
  const { maxVigor, effectiveStyles, effectiveParts, config } =
    calculateEffectiveStats(sheet);

  const activeConditions = useMemo(() => sheet.conditions, [sheet.conditions]);

  const changeIdentity = <K extends keyof ICreature["identity"]>(
    key: K,
    value: ICreature["identity"][K],
  ) => {
    onChange({ identity: { ...sheet.identity, [key]: value } });
  };

  const changeStyle = (key: StyleKey, delta: number) => {
    const value = Math.max(0, Math.min(5, sheet.styles[key] + delta));
    onChange({ styles: { ...sheet.styles, [key]: value } });
  };

  const changeSkill = (key: SkillKey, delta: number) => {
    const value = Math.max(0, Math.min(3, sheet.skills[key] + delta));
    onChange({ skills: { ...sheet.skills, [key]: value } });
  };

  const changeVigor = (value: number) => {
    const current = Math.max(0, Math.min(maxVigor, value));
    onChange({ vigor: { ...sheet.vigor, current } });
  };

  const changeStage = (stage: MonsterStage) => {
    const nextMax = STAGE_CONFIG[stage].vigorMax;
    onChange({
      identity: { ...sheet.identity, stage },
      vigor: {
        ...sheet.vigor,
        max: nextMax,
        current: Math.min(sheet.vigor.current, nextMax),
      },
    });
  };

  const addPart = () => {
    const part: ICreaturePart = {
      id: `part-${Date.now()}`,
      name: "Nova Parte",
      categories: ["Natural"],
      durability: { current: 20, max: 20 },
      description: "Descrição anatômica da parte.",
      range: 1,
      skills: "golpear",
      styles: "poderoso",
      whenBroken: "Descreva o efeito quando esta parte for quebrada.",
    };
    onChange({ parts: [...sheet.parts, part] });
    setExpandedPartId(part.id);
  };

  const updatePart = (id: string, fields: Partial<ICreaturePart>) => {
    onChange({
      parts: sheet.parts.map((part) =>
        part.id === id ? { ...part, ...fields } : part,
      ),
    });
  };

  const removePart = (id: string) => {
    onChange({ parts: sheet.parts.filter((part) => part.id !== id) });
    setExpandedPartId((current) => (current === id ? null : current));
  };

  const changePartDurability = (id: string, delta: number) => {
    const part = effectiveParts.find((item) => item.id === id);
    if (!part) return;
    const current = Math.max(
      0,
      Math.min(part.durability.max, part.durability.current + delta),
    );
    updatePart(id, {
      durability: {
        ...sheet.parts.find((p) => p.id === id)!.durability,
        current,
      },
    });
  };

  const addTrait = (additional: boolean) => {
    if (additional) {
      onChange({
        additionalTraits: [
          ...sheet.additionalTraits,
          {
            id: `additional-trait-${Date.now()}`,
            name: "NOVO TRAÇO ADICIONAL",
            description: "Descrição da adaptação.",
          },
        ],
      });
      return;
    }

    onChange({
      traits: [
        ...sheet.traits,
        {
          id: `trait-${Date.now()}`,
          name: "NOVO TRAÇO",
          level: 1,
          type: "Passiva",
          description: "Descrição do efeito.",
        },
      ],
    });
  };

  const updateTrait = (id: string, fields: Partial<ITrait>) => {
    onChange({
      traits: sheet.traits.map((trait) =>
        trait.id === id ? { ...trait, ...fields } : trait,
      ),
    });
  };

  type ConditionDefinition = (typeof ALL_CONDITIONS_DATA)[number];

  const toggleCondition = (definition: ConditionDefinition) => {
    const existing = sheet.conditions.find(
      (condition) => condition.name === definition.name,
    );
    if (existing) {
      onChange({
        conditions: sheet.conditions.filter(
          (condition) => condition.id !== existing.id,
        ),
      });
      return;
    }
    onChange({
      conditions: [
        ...sheet.conditions,
        {
          ...clone(definition),
          id: `condition-${Date.now()}-${sheet.conditions.length + 1}`,
          level: 1,
        },
      ],
    });
  };

  return (
    <main className="w-full flex-1 px-4 sm:px-8 lg:px-12 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <section className="lg:col-span-5 space-y-6">
          <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#383430]">
              <span className="text-[10px] font-bold tracking-widest text-[#FF9B42] uppercase">
                BESTIÁRIO DO GUIA • MONSTRO
              </span>
              <InfoTooltip
                title="Bestiário & Criação de Monstros"
                description="Linhagem, estágio, porte e descrição da criatura."
                category="Bestiário"
                onOpenCompendium={onOpenCompendium}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                Nome da Criatura *
              </label>
              <input
                value={sheet.identity.name}
                onChange={(e) => changeIdentity("name", e.target.value)}
                className="w-full px-3 py-2 text-base font-serif font-bold rounded-lg bg-[#22201D] border border-[#383430] text-[#89B5F7]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                  Linhagem
                </label>
                <select
                  value={sheet.identity.lineage}
                  onChange={(e) =>
                    changeIdentity("lineage", e.target.value as MonsterLineage)
                  }
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-[#22201D] border border-[#383430] text-[#F5EFEB]"
                >
                  {MONSTER_LINEAGES.map((lineage) => (
                    <option key={lineage.name} value={lineage.name}>
                      {lineage.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                  Estágio de Vida
                </label>
                <select
                  value={sheet.identity.stage}
                  onChange={(e) => changeStage(e.target.value as MonsterStage)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-[#22201D] border border-[#383430] text-[#FF9B42]"
                >
                  {(Object.keys(STAGE_CONFIG) as MonsterStage[]).map(
                    (stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                Porte Físico
              </label>
              <input
                type="number"
                min={0}
                value={sheet.identity.size}
                onChange={(e) =>
                  changeIdentity(
                    "size",
                    Math.max(0, Number(e.target.value) || 0),
                  )
                }
                className="w-full px-3 py-1.5 text-xs font-medium rounded-lg bg-[#22201D] border border-[#383430]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                Descrição
              </label>
              <textarea
                value={sheet.identity.description}
                onChange={(e) => changeIdentity("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#22201D] border border-[#383430]"
              />
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#383430]">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#FC8181]" />
                <span className="font-serif font-black text-sm uppercase text-[#89B5F7]">
                  Vigor da Criatura
                </span>
              </div>
              <span className="font-mono text-xs text-[#B0A497]">
                Máx. {maxVigor}
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#242220] overflow-hidden">
              <div
                className="h-full bg-[#9B2C2C]"
                style={{
                  width: `${Math.max(0, Math.min(100, (sheet.vigor.current / maxVigor) * 100))}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => changeVigor(sheet.vigor.current - 5)}
                className="px-3 py-1.5 rounded-lg bg-[#242220]"
              >
                -5
              </button>
              <button
                onClick={() => changeVigor(sheet.vigor.current - 1)}
                className="px-3 py-1.5 rounded-lg bg-[#242220]"
              >
                -1
              </button>
              <span className="font-mono text-xl font-black text-[#89B5F7]">
                {sheet.vigor.current} / {maxVigor}
              </span>
              <button
                onClick={() => changeVigor(sheet.vigor.current + 1)}
                className="px-3 py-1.5 rounded-lg bg-[#242220]"
              >
                +1
              </button>
              <button
                onClick={() => changeVigor(sheet.vigor.current + 5)}
                className="px-3 py-1.5 rounded-lg bg-[#242220]"
              >
                +5
              </button>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#383430]">
              <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#89B5F7]">
                Estilos
              </span>
              <span className="text-[10px] text-[#B0A497]">
                Efetivos: estágio {config.label}
              </span>
            </div>
            <div className="space-y-2">
              {STYLES_INFO.map((style) => (
                <div key={style.key} className="flex items-center gap-2">
                  <InfoTooltip
                    title={style.label}
                    description={style.tooltip}
                  />
                  <div className="w-24">
                    <div className="text-[10px] font-bold uppercase text-[#89B5F7]">
                      {style.label}
                    </div>
                    <div className="text-[9px] text-[#B0A497]">
                      {style.desc}
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => changeStyle(style.key, -1)}
                      className="w-6 h-6 rounded bg-[#242220]"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold w-8 text-center">
                      {sheet.styles[style.key]}
                    </span>
                    <button
                      onClick={() => changeStyle(style.key, 1)}
                      className="w-6 h-6 rounded bg-[#242220]"
                    >
                      +
                    </button>
                    <span className="text-[10px] text-[#B0A497] w-14 text-right">
                      → {effectiveStyles[style.key]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#383430]">
              <MapPin className="w-4 h-4 text-[#FF9B42]" />
              <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#89B5F7]">
                Dieta, Hábitat & Comportamento
              </span>
            </div>
            <textarea
              value={sheet.diet}
              onChange={(e) => onChange({ diet: e.target.value })}
              placeholder="Dieta da criatura..."
              rows={2}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#22201D] border border-[#383430]"
            />
            <textarea
              value={sheet.habitat}
              onChange={(e) => onChange({ habitat: e.target.value })}
              placeholder="Hábitat e região..."
              rows={2}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#22201D] border border-[#383430]"
            />
            <textarea
              value={sheet.behavior}
              onChange={(e) => onChange({ behavior: e.target.value })}
              placeholder="Comportamento e instintos..."
              rows={4}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#22201D] border border-[#383430]"
            />
          </div>
        </section>

        <section className="lg:col-span-7 space-y-4">
          <div className="overflow-x-auto rounded-xl bg-[#1A1918] border border-[#383430] p-1">
            <div className="flex min-w-max">
              {(
                [
                  ["parts", "Partes"],
                  ["skills", "Habilidades"],
                  ["traits", "Traços"],
                  ["behavior", "Comportamento"],
                ] as Array<[CreatureTabKey, string]>
              ).map(([key, label], index) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-3.5 py-2 rounded-lg font-serif font-bold text-xs ${
                    activeTab === key
                      ? "bg-[#13335C] text-white"
                      : "text-[#B0A497]"
                  }`}
                >
                  {index + 1}. {label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "parts" && (
            <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#383430]">
                <div>
                  <h3 className="font-serif font-black text-sm text-[#89B5F7] uppercase">
                    Partes Monstruosas
                  </h3>
                  <p className="text-[11px] text-[#B0A497]">
                    {sheet.parts.length} parte(s) cadastrada(s)
                  </p>
                </div>
                <button
                  onClick={addPart}
                  className="px-3 py-1.5 rounded-lg bg-[#13335C] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Parte
                </button>
              </div>

              <div className="space-y-3">
                {effectiveParts.map((part) => {
                  const original = sheet.parts.find(
                    (item) => item.id === part.id,
                  )!;
                  const expanded = expandedPartId === part.id;
                  const broken = part.durability.current === 0;
                  const percent = Math.round(
                    (part.durability.current /
                      Math.max(1, part.durability.max)) *
                      100,
                  );

                  return (
                    <div
                      key={part.id}
                      className={`p-4 rounded-xl border ${broken ? "border-[#9B2C2C]/40" : "border-[#383430]"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            onClick={() =>
                              setExpandedPartId(expanded ? null : part.id)
                            }
                            className="text-[#89B5F7]"
                          >
                            {expanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                          <span
                            className={`font-serif font-bold text-sm truncate ${broken ? "text-[#FC8181] line-through" : "text-[#89B5F7]"}`}
                          >
                            {part.name}
                          </span>
                          {part.categories.map((category) => (
                            <span
                              key={category}
                              className="px-1.5 py-0.5 rounded bg-[#22201D] text-[9px] text-[#B0A497] border border-[#383430]"
                            >
                              {category}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => changePartDurability(part.id, -1)}
                            disabled={part.durability.current <= 0}
                            className="w-6 h-6 rounded bg-[#22201D] disabled:opacity-30"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs w-16 text-center">
                            {part.durability.current} / {part.durability.max}
                          </span>
                          <button
                            onClick={() => changePartDurability(part.id, 1)}
                            disabled={
                              part.durability.current >= part.durability.max
                            }
                            className="w-6 h-6 rounded bg-[#22201D] disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-[#242220] overflow-hidden mt-2">
                        <div
                          className="h-full bg-[#E66826]"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      {expanded && (
                        <div className="mt-3 pt-3 border-t border-[#383430] space-y-3 text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-[#B0A497] mb-1">
                                Nome
                              </label>
                              <input
                                value={original.name}
                                onChange={(e) =>
                                  updatePart(part.id, { name: e.target.value })
                                }
                                className="w-full px-2.5 py-1.5 rounded bg-[#22201D] border border-[#383430]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-[#B0A497] mb-1">
                                Durabilidade Máxima
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={original.durability.max}
                                onChange={(e) => {
                                  const max = Math.max(
                                    1,
                                    Number(e.target.value) || 1,
                                  );
                                  updatePart(part.id, {
                                    durability: {
                                      ...original.durability,
                                      max,
                                      current: Math.min(
                                        original.durability.current,
                                        max,
                                      ),
                                    },
                                  });
                                }}
                                className="w-full px-2.5 py-1.5 rounded bg-[#22201D] border border-[#383430]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-[#B0A497] mb-1">
                              Categorias
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {PART_CATEGORIES.map((category) => {
                                const selected =
                                  original.categories.includes(category);
                                return (
                                  <button
                                    type="button"
                                    key={category}
                                    onClick={() =>
                                      updatePart(part.id, {
                                        categories: selected
                                          ? original.categories.filter(
                                              (item) => item !== category,
                                            )
                                          : [...original.categories, category],
                                      })
                                    }
                                    className={`px-2 py-1 rounded border text-[10px] ${selected ? "bg-[#13335C] border-[#2B6CB0] text-white" : "border-[#383430] text-[#B0A497]"}`}
                                  >
                                    {category}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-[#B0A497] mb-1">
                                Alcance
                              </label>
                              <input
                                type="number"
                                min={0}
                                value={original.range ?? ""}
                                onChange={(e) =>
                                  updatePart(part.id, {
                                    range:
                                      e.target.value === ""
                                        ? undefined
                                        : Number(e.target.value),
                                  })
                                }
                                className="w-full px-2.5 py-1.5 rounded bg-[#22201D] border border-[#383430]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-[#B0A497] mb-1">
                                Habilidade
                              </label>
                              <select
                                value={original.skills ?? ""}
                                onChange={(e) =>
                                  updatePart(part.id, {
                                    skills: e.target.value
                                      ? (e.target.value as SkillKey)
                                      : undefined,
                                  })
                                }
                                className="w-full px-2.5 py-1.5 rounded bg-[#22201D] border border-[#383430]"
                              >
                                <option value="">Nenhuma</option>
                                {SKILLS.map((skill) => (
                                  <option key={skill.key} value={skill.key}>
                                    {skill.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-[#B0A497] mb-1">
                                Estilo
                              </label>
                              <select
                                value={original.styles ?? ""}
                                onChange={(e) =>
                                  updatePart(part.id, {
                                    styles: e.target.value
                                      ? (e.target.value as StyleKey)
                                      : undefined,
                                  })
                                }
                                className="w-full px-2.5 py-1.5 rounded bg-[#22201D] border border-[#383430]"
                              >
                                <option value="">Nenhum</option>
                                {STYLES_INFO.map((style) => (
                                  <option key={style.key} value={style.key}>
                                    {style.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-[#B0A497] mb-1">
                              Descrição
                            </label>
                            <textarea
                              value={original.description}
                              onChange={(e) =>
                                updatePart(part.id, {
                                  description: e.target.value,
                                })
                              }
                              rows={3}
                              className="w-full px-2.5 py-2 rounded bg-[#22201D] border border-[#383430]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-[#FC8181] mb-1">
                              Quando quebrada
                            </label>
                            <textarea
                              value={original.whenBroken ?? ""}
                              onChange={(e) =>
                                updatePart(part.id, {
                                  whenBroken: e.target.value || undefined,
                                })
                              }
                              rows={2}
                              className="w-full px-2.5 py-2 rounded bg-[#22201D] border border-[#383430]"
                            />
                          </div>

                          <div className="flex justify-end">
                            <button
                              onClick={() => removePart(part.id)}
                              className="text-xs font-bold text-[#FC8181] flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remover Parte
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm">
              <h3 className="font-serif font-black text-sm text-[#89B5F7] uppercase mb-4">
                Habilidades
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {SKILLS.map((skill) => (
                  <div
                    key={skill.key}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#242220]"
                  >
                    <span className="text-xs font-bold">{skill.label}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => changeSkill(skill.key, -1)}
                        className="w-6 h-6 rounded bg-[#22201D]"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold w-6 text-center">
                        +{sheet.skills[skill.key]}
                      </span>
                      <button
                        onClick={() => changeSkill(skill.key, 1)}
                        className="w-6 h-6 rounded bg-[#22201D]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "traits" && (
            <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dna className="w-4 h-4 text-[#38C2B3]" />
                  <h3 className="font-serif font-black text-sm text-[#89B5F7] uppercase">
                    Traços & Mutações
                  </h3>
                </div>
                <button
                  onClick={() => addTrait(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#13335C] text-white text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" /> Novo
                </button>
              </div>

              {sheet.traits.map((trait) => (
                <div
                  key={trait.id}
                  className="p-3 rounded-xl bg-[#242220] border border-[#383430]"
                >
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <input
                      value={trait.name}
                      onChange={(e) =>
                        updateTrait(trait.id, { name: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded bg-[#22201D] border border-[#383430] font-bold text-xs"
                    />
                    <button
                      onClick={() =>
                        onChange({
                          traits: sheet.traits.filter(
                            (item) => item.id !== trait.id,
                          ),
                        })
                      }
                      className="text-[#FC8181]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input
                      type="number"
                      min={1}
                      value={trait.level}
                      onChange={(e) =>
                        updateTrait(trait.id, {
                          level: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                      className="px-2.5 py-1.5 rounded bg-[#22201D] border border-[#383430]"
                    />
                    <input
                      type="number"
                      min={0}
                      value={trait.cost}
                      onChange={(e) =>
                        updateTrait(trait.id, {
                          cost: Math.max(0, Number(e.target.value) || 0),
                        })
                      }
                      className="px-2.5 py-1.5 rounded bg-[#22201D] border border-[#383430]"
                    />
                  </div>
                  <textarea
                    value={trait.description}
                    onChange={(e) =>
                      updateTrait(trait.id, { description: e.target.value })
                    }
                    rows={2}
                    className="w-full mt-2 px-2.5 py-2 rounded bg-[#22201D] border border-[#383430]"
                  />
                </div>
              ))}

              <div className="pt-4 border-t border-[#383430]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#B0A497]">
                    Traços Adicionais
                  </span>
                  <button
                    onClick={() => addTrait(true)}
                    className="text-xs text-[#FF9B42] font-bold"
                  >
                    <Plus className="w-3.5 h-3.5 inline mr-1" />
                    Novo
                  </button>
                </div>

                <div className="space-y-2 mt-3">
                  {sheet.additionalTraits.map((trait) => (
                    <div
                      key={trait.id}
                      className="p-3 rounded-lg bg-[#242220] border border-[#383430] flex gap-2"
                    >
                      <input
                        value={trait.name}
                        onChange={(e) =>
                          onChange({
                            additionalTraits: sheet.additionalTraits.map(
                              (item) =>
                                item.id === trait.id
                                  ? { ...item, name: e.target.value }
                                  : item,
                            ),
                          })
                        }
                        className="flex-1 px-2.5 py-1.5 rounded bg-[#22201D] border border-[#383430] text-xs font-bold"
                      />
                      <button
                        onClick={() =>
                          onChange({
                            additionalTraits: sheet.additionalTraits.filter(
                              (item) => item.id !== trait.id,
                            ),
                          })
                        }
                        className="text-[#FC8181]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "behavior" && (
            <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4">
              <div className="pb-3 border-b border-[#383430]">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#FF9B42]" />
                  <h3 className="font-serif font-black text-sm text-[#89B5F7] uppercase">
                    Comportamento
                  </h3>
                </div>
                <p className="text-[11px] text-[#B0A497] mt-1">
                  O novo modelo concentra as instruções comportamentais em um
                  único texto.
                </p>
              </div>
              <textarea
                value={sheet.behavior}
                onChange={(e) => onChange({ behavior: e.target.value })}
                rows={12}
                className="w-full px-3 py-2 rounded-lg bg-[#22201D] border border-[#383430] text-xs"
                placeholder="Seleção de alvo, instintos, padrões de ataque e reação quando ferida..."
              />

              <div className="pt-3 border-t border-[#383430]">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-[#38C2B3]" />
                  <span className="font-serif font-black text-sm uppercase text-[#89B5F7]">
                    Condições
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {ALL_CONDITIONS_DATA.map((condition) => {
                    const active = activeConditions.some(
                      (item) => item.name === condition.name,
                    );
                    return (
                      <button
                        type="button"
                        key={condition.name}
                        onClick={() => toggleCondition(condition)}
                        className={`p-3 rounded-lg border text-left ${active ? "bg-[#13335C] border-[#2B6CB0] text-white" : "bg-[#242220] border-[#383430] text-[#B0A497]"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">
                            {condition.name}
                          </span>
                          {active ? (
                            <Shield className="w-3.5 h-3.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <p className="text-[10px] mt-1 opacity-80">
                          {condition.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {sheet.conditions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {sheet.conditions.map((condition) => (
                      <div
                        key={condition.id}
                        className="p-3 rounded-lg bg-[#242220] border border-[#383430] flex items-center gap-3"
                      >
                        <span className="text-xs font-bold flex-1">
                          {condition.name}
                        </span>
                        <input
                          type="number"
                          min={1}
                          value={condition.level}
                          onChange={(e) =>
                            onChange({
                              conditions: sheet.conditions.map((item) =>
                                item.id === condition.id
                                  ? {
                                      ...item,
                                      level: Math.max(
                                        1,
                                        Number(e.target.value) || 1,
                                      ),
                                    }
                                  : item,
                              ),
                            })
                          }
                          className="w-16 px-2 py-1 rounded bg-[#22201D] border border-[#383430] text-xs"
                        />
                        <button
                          onClick={() =>
                            onChange({
                              conditions: sheet.conditions.filter(
                                (item) => item.id !== condition.id,
                              ),
                            })
                          }
                          className="text-[#FC8181]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
