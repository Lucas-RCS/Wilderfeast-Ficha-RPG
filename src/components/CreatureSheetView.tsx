import React, { useState } from "react";
import {
  CreatureSheet,
  MonsterStage,
  StyleKey,
  SkillKey,
  CreaturePart,
  CreatureSpecialAction,
} from "../types";
import {
  STAGE_CONFIG,
  calculateEffectiveStats,
  MONSTER_LINEAGES,
} from "../data/creatureData";
import {
  ALL_TRAITS_COMPENDIUM,
  ALL_CONDITIONS_DATA,
} from "../data/wilderfeastData";
import { InfoTooltip } from "./InfoTooltip";
import {
  Shield,
  Zap,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Heart,
  AlertTriangle,
  MapPin,
  BookOpen,
  Award,
  Dna,
  Target,
} from "lucide-react";

interface CreatureSheetViewProps {
  sheet: CreatureSheet;
  onChange: (updated: Partial<CreatureSheet>) => void;
  onOpenCompendium: () => void;
}

type CreatureTabKey = "parts" | "skills" | "traits" | "behavior" | "actions";

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
    tooltip:
      "Velocidade de ataque, manobras rápidas no ar ou terra, e esquiva de armadilhas.",
  },
  {
    key: "poderoso",
    label: "Poderoso",
    desc: "Força bruta, mordidas e impacto",
    tooltip:
      "Força destrutiva, investidas pesadas e capacidade de quebrar utensílios.",
  },
  {
    key: "preciso",
    label: "Preciso",
    desc: "Foco, pontaria e ataques direcionados",
    tooltip:
      "Alvejar pontos fracos específicos dos ferais e disparar espinhos com acurácia.",
  },
  {
    key: "sagaz",
    label: "Sagaz",
    desc: "Astúcia, camuflagem e venenos",
    tooltip: "Uso de terreno, venenos, camuflagem e emboscadas estratégicas.",
  },
];

const SKILLS_LIST: Array<{ key: SkillKey; label: string; tooltip: string }> = [
  {
    key: "agarrar",
    label: "Agarrar",
    tooltip: "Prender ferais entre mandíbulas, garras ou tentáculos.",
  },
  {
    key: "armazenar",
    label: "Armazenar",
    tooltip: "Manter reservas de calor, veneno ou alimento no papo.",
  },
  {
    key: "assegurar",
    label: "Assegurar",
    tooltip: "Fincar garras no solo, ancorar-se e resistir a puxões.",
  },
  {
    key: "atirar",
    label: "Atirar",
    tooltip: "Disparar projéteis orgânicos, espinhos, lamas ou chamas.",
  },
  {
    key: "atravessar",
    label: "Atravessar",
    tooltip: "Romper obstáculos, escalar penhascos e voar entre copas.",
  },
  {
    key: "chamar",
    label: "Chamar",
    tooltip: "Rugir para invocar bandos, atordoar presas e intimidar.",
  },
  {
    key: "curar",
    label: "Curar",
    tooltip: "Regeneração biológica rápida de carapaças ou tecidos.",
  },
  {
    key: "estudar",
    label: "Estudar",
    tooltip: "Ler o comportamento da matilha e antecipar movimentos.",
  },
  {
    key: "exibir",
    label: "Exibir",
    tooltip: "Eriçar espinhos, abrir cristas e impor pânico visual.",
  },
  {
    key: "golpear",
    label: "Golpear",
    tooltip: "Golpes com cauda, garras frontais e ataques corporais.",
  },
  {
    key: "manufaturar",
    label: "Manufaturar",
    tooltip: "Construir teias, ninhos reforçados e poças de ácido.",
  },
  {
    key: "procurar",
    label: "Procurar",
    tooltip: "Detectar cheiro de sangue, calor corporal e vibrações na terra.",
  },
];

export const CreatureSheetView: React.FC<CreatureSheetViewProps> = ({
  sheet,
  onChange,
  onOpenCompendium,
}) => {
  const { maxVigor, effectiveStyles, effectiveParts, config } =
    calculateEffectiveStats(sheet);

  const [activeTab, setActiveTab] = useState<CreatureTabKey>("parts");
  const [expandedPartId, setExpandedPartId] = useState<string | null>(
    sheet.parts[0]?.id || null,
  );
  const [isAddingTrait, setIsAddingTrait] = useState(false);
  const [selectedCompendiumTrait, setSelectedCompendiumTrait] = useState("");

  // Vigor modification
  const handleVigorChange = (newVigor: number) => {
    const clamped = Math.max(0, Math.min(maxVigor, newVigor));
    onChange({ vigor: { current: clamped } });
  };

  // Stage modification
  const handleStageChange = (newStage: MonsterStage) => {
    const newConfig = STAGE_CONFIG[newStage];
    onChange({
      stage: newStage,
      vigor: {
        current: Math.min(sheet.vigor.current, newConfig.vigorMax),
      },
    });
  };

  // Base Style modification
  const handleBaseStyleChange = (key: StyleKey, delta: number) => {
    const current = sheet.baseStyles[key] || 0;
    const nextVal = Math.max(0, Math.min(5, current + delta));
    onChange({
      baseStyles: {
        ...sheet.baseStyles,
        [key]: nextVal,
      },
    });
  };

  // Skill modification (0 to 3)
  const handleSkillChange = (key: SkillKey, delta: number) => {
    const current = sheet.skills[key] || 0;
    const nextVal = Math.max(0, Math.min(3, current + delta));
    onChange({
      skills: {
        ...sheet.skills,
        [key]: nextVal,
      },
    });
  };

  // Part management
  const handleAddPart = () => {
    const newPart: CreaturePart = {
      id: `part-${Date.now()}`,
      name: "Nova Parte (ex: Mandíbula)",
      categories: ["Arma"],
      baseMaxDurability: 20,
      currentDurability: 20,
      weaponReach: 1,
      weaponStyle: "poderoso",
      weaponSkill: "golpear",
      weaponEffect: "Causa dano de impacto.",
      brokenEffect: "Alcance: 1 (GOLPEAR). Esta PARTE causa metade do Dano.",
    };
    const updated = [...sheet.parts, newPart];
    onChange({ parts: updated });
    setExpandedPartId(newPart.id);
  };

  const handleUpdatePart = (
    id: string,
    updatedFields: Partial<CreaturePart>,
  ) => {
    const updated = sheet.parts.map((p) =>
      p.id === id ? { ...p, ...updatedFields } : p,
    );
    onChange({ parts: updated });
  };

  const handleRemovePart = (id: string) => {
    const updated = sheet.parts.filter((p) => p.id !== id);
    onChange({ parts: updated });
  };

  const handlePartDurabilityDelta = (id: string, delta: number) => {
    const effPart = effectiveParts.find((p) => p.id === id);
    if (!effPart) return;
    const effMax = effPart.effectiveMaxDurability;
    const newDur = Math.max(
      0,
      Math.min(effMax, effPart.currentDurability + delta),
    );
    handleUpdatePart(id, { currentDurability: newDur });
  };

  // Trait management
  const handleAddTrait = (isAdditional = false) => {
    if (selectedCompendiumTrait) {
      const found = ALL_TRAITS_COMPENDIUM.find(
        (t) => t.name === selectedCompendiumTrait,
      );
      if (found) {
        if (isAdditional) {
          onChange({
            additionalTraits: [
              ...sheet.additionalTraits,
              {
                id: `add-trait-${Date.now()}`,
                name: found.name,
                description: found.description,
              },
            ],
          });
        } else {
          onChange({
            traits: [
              ...sheet.traits,
              {
                id: `trait-${Date.now()}`,
                name: found.name,
                level: 1,
                cost: found.cost,
                description: found.description,
              },
            ],
          });
        }
        setSelectedCompendiumTrait("");
        setIsAddingTrait(false);
        return;
      }
    }

    if (isAdditional) {
      onChange({
        additionalTraits: [
          ...sheet.additionalTraits,
          {
            id: `add-trait-${Date.now()}`,
            name: "NOVO TRAÇO ADICIONAL",
            description:
              "Descrição das adaptações biológicas ou comportamentais ecológicas.",
          },
        ],
      });
    } else {
      onChange({
        traits: [
          ...sheet.traits,
          {
            id: `trait-${Date.now()}`,
            name: "NOVO TRAÇO",
            level: 1,
            cost: "Passiva",
            description: "Descrição do efeito mecânico de combate da criatura.",
          },
        ],
      });
    }
  };

  const handleRemoveTrait = (id: string, isAdditional = false) => {
    if (isAdditional) {
      onChange({
        additionalTraits: sheet.additionalTraits.filter((t) => t.id !== id),
      });
    } else {
      onChange({ traits: sheet.traits.filter((t) => t.id !== id) });
    }
  };

  // Special actions management
  const handleAddAction = () => {
    const newAct: CreatureSpecialAction = {
      id: `act-${Date.now()}`,
      name: "Nova Ação Especial",
      type: "Ação",
      cost: "2 Ações",
      description: "Efeito tático devastador durante A Caçada.",
    };
    onChange({ specialActions: [...sheet.specialActions, newAct] });
  };

  const handleUpdateAction = (
    id: string,
    fields: Partial<CreatureSpecialAction>,
  ) => {
    onChange({
      specialActions: sheet.specialActions.map((a) =>
        a.id === id ? { ...a, ...fields } : a,
      ),
    });
  };

  const handleRemoveAction = (id: string) => {
    onChange({
      specialActions: sheet.specialActions.filter((a) => a.id !== id),
    });
  };

  // Conditions
  const isConditionActive = (name: string) =>
    sheet.conditions.some((c) => c.name === name);
  const getConditionLevel = (name: string) =>
    sheet.conditions.find((c) => c.name === name)?.level || 0;
  const handleToggleCondition = (def: (typeof ALL_CONDITIONS_DATA)[0]) => {
    const exists = sheet.conditions.find((c) => c.name === def.name);
    if (exists) {
      onChange({
        conditions: sheet.conditions.filter((c) => c.name !== def.name),
      });
    } else {
      onChange({
        conditions: [
          ...sheet.conditions,
          {
            id: `cond-${Date.now()}`,
            name: def.name,
            level: 1,
            description: def.description,
          },
        ],
      });
    }
  };

  const handleConditionLevelDelta = (name: string, delta: number) => {
    onChange({
      conditions: sheet.conditions
        .map((c) =>
          c.name === name ? { ...c, level: Math.max(1, c.level + delta) } : c,
        )
        .filter((c) => c.level > 0),
    });
  };

  const vigorPercent = Math.min(
    100,
    Math.max(0, (sheet.vigor.current / maxVigor) * 100),
  );

  return (
    <div className="w-full flex-1 px-4 sm:px-8 lg:px-12 py-6">
      {/* 2-Column Grid (100% Fluid Width) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ========================================================= */}
        {/* COLUNA ESQUERDA: IDENTIDADE, VIGOR, ESTILOS & STATUS (5 cols) */}
        {/* ========================================================= */}
        <section className="lg:col-span-5 space-y-6">
          {/* Header Card: Nome, Linhagem, Estágio */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#383430]">
              <span className="text-[10px] font-bold tracking-widest text-[#FF9B42] uppercase">
                BESTIÁRIO DO GUIA • MONSTRO
              </span>
              <InfoTooltip
                title="Bestiário & Criação de Monstros"
                description="Criaturas em Wilderfeast são divididas por Linhagens e Estágios (Juvenil, Adulto, Ancião, Zênite). Cada estágio aumenta o Vigor e os bônus de Estilo da criatura."
                category="Bestiário"
                onOpenCompendium={onOpenCompendium}
              />
            </div>

            {/* Creature Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                Nome da Criatura *
              </label>
              <input
                type="text"
                value={sheet.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Ex: Satra Alfa, Magmagarto..."
                className="w-full px-3 py-2 text-base font-serif font-bold rounded-lg bg-[#22201D] border border-[#383430] text-[#89B5F7] focus:outline-none focus:ring-1 focus:ring-[#173F73]"
              />
            </div>

            {/* Linhagem & Estágio */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                  Linhagem
                </label>
                <select
                  value={sheet.lineage}
                  onChange={(e) => onChange({ lineage: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-[#22201D] border border-[#383430] text-[#F5EFEB]"
                >
                  {MONSTER_LINEAGES.map((l) => (
                    <option key={l.name} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                  Estágio de Vida
                </label>
                <select
                  value={sheet.stage}
                  onChange={(e) =>
                    handleStageChange(e.target.value as MonsterStage)
                  }
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-[#22201D] border border-[#383430] text-[#FF9B42]"
                >
                  <option value="Juvenil">Juvenil (+0 Estilos)</option>
                  <option value="Adulto">Adulto (+1 Estilos)</option>
                  <option value="Ancião">Ancião (+2 Estilos)</option>
                  <option value="Zênite">Zênite (+3 Estilos)</option>
                </select>
              </div>
            </div>

            {/* Size Concept */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                Conceito & Porte Físico
              </label>
              <input
                type="text"
                value={sheet.sizeConcept}
                onChange={(e) => onChange({ sizeConcept: e.target.value })}
                placeholder="Ex: Quadrúpede colossal com couraça de pedra-pomes..."
                className="w-full px-3 py-1.5 text-xs font-medium rounded-lg bg-[#22201D] border border-[#383430]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                Descrição Ecológica
              </label>
              <textarea
                value={sheet.description}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder="Aparência, rugidos, comportamento alimentar..."
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#22201D] border border-[#383430]"
              />
            </div>
          </div>

          {/* Vigor da Criatura */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#383430]">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#FC8181]" />
                <span className="font-serif font-black text-sm uppercase text-[#89B5F7]">
                  Vigor da Criatura
                </span>
                <InfoTooltip
                  title="Vigor de Monstro"
                  description="Quando o Vigor do monstro chega a 0, ele entra em colapso e a Caçada é vencida pelos ferais. O Vigor máximo é determinado pelo Estágio do monstro."
                  category="Combate"
                />
              </div>
              <span className="font-mono font-bold text-xs text-[#B0A497]">
                Base: {config.vigorMax}
              </span>
            </div>

            {/* Large Vigor Counter */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#242220] border border-[#383430]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleVigorChange(sheet.vigor.current - 5)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#22201D] hover:bg-[#33302B] text-xs font-bold border border-[#383430] text-[#FC8181]"
                  title="Diminuir 5 de Vigor"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => handleVigorChange(sheet.vigor.current - 1)}
                  className="w-8 h-8 rounded-lg bg-[#22201D] hover:bg-[#33302B] text-sm font-bold border border-[#383430] text-[#FC8181] flex items-center justify-center"
                >
                  -1
                </button>
              </div>

              <div className="text-center">
                <div className="font-mono font-black text-2xl text-[#89B5F7]">
                  {sheet.vigor.current}{" "}
                  <span className="text-sm font-medium text-[#B0A497]">
                    / {maxVigor}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#B0A497]">
                  {sheet.vigor.current === 0
                    ? "Abatido / Pronto para Banquete"
                    : "Vigor Restante"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleVigorChange(sheet.vigor.current + 1)}
                  className="w-8 h-8 rounded-lg bg-[#22201D] hover:bg-[#33302B] text-sm font-bold border border-[#383430] text-[#38C2B3] flex items-center justify-center"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => handleVigorChange(sheet.vigor.current + 5)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#22201D] hover:bg-[#33302B] text-xs font-bold border border-[#383430] text-[#38C2B3]"
                  title="Aumentar 5 de Vigor"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Vigor Bar */}
            <div className="w-full h-3 rounded-full bg-[#242220] overflow-hidden border border-[#383430]">
              <div
                className={`h-full transition-all duration-300 ${
                  vigorPercent > 50
                    ? "bg-[#16857A]"
                    : vigorPercent > 20
                      ? "bg-[#E66826]"
                      : "bg-[#9B2C2C]"
                }`}
                style={{ width: `${vigorPercent}%` }}
              />
            </div>
          </div>

          {/* Os 4 Estilos do Monstro */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#383430]">
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-sm uppercase text-[#89B5F7]">
                  Estilos do Monstro
                </span>
                <InfoTooltip
                  title="Estilos de Criatura"
                  description="Os Estilos determinam a quantidade de Dados de Ação lançados pelo monstro ao atacar ou se defender. O estágio concede um bônus automático a todos os estilos."
                  category="Estilos"
                />
              </div>
              <span className="text-[11px] font-bold text-[#FF9B42]">
                Bônus de Estágio: +{config.styleModifier}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {STYLES_INFO.map((st) => {
                const effVal = effectiveStyles[st.key];
                const baseVal = sheet.baseStyles[st.key];
                return (
                  <div
                    key={st.key}
                    className="p-3 rounded-xl bg-[#242220] border border-[#383430] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs uppercase text-[#89B5F7]">
                        {st.label}
                      </span>
                      <InfoTooltip
                        title={st.label}
                        description={st.tooltip}
                        category="Estilo"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <span className="font-mono font-black text-xl text-[#89B5F7]">
                          +{effVal}
                        </span>
                        <span className="block text-[9px] text-[#B0A497] font-semibold">
                          (Base: {baseVal})
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleBaseStyleChange(st.key, -1)}
                          disabled={baseVal <= 0}
                          className="w-6 h-6 rounded bg-[#22201D] hover:bg-[#33302B] text-xs font-bold flex items-center justify-center disabled:opacity-30 border border-[#383430]"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBaseStyleChange(st.key, 1)}
                          disabled={baseVal >= 5}
                          className="w-6 h-6 rounded bg-[#22201D] hover:bg-[#33302B] text-xs font-bold flex items-center justify-center disabled:opacity-30 border border-[#383430]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Condições da Caçada */}
          <div className="p-5 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#383430]">
              <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#FC8181] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Condições da Caçada</span>
              </span>
              <span className="text-[11px] text-[#B0A497]">
                {sheet.conditions.length} ativas
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {ALL_CONDITIONS_DATA.map((def) => {
                const active = isConditionActive(def.name);
                const lvl = getConditionLevel(def.name);
                return (
                  <div
                    key={def.name}
                    className={`p-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                      active
                        ? "bg-[#9B2C2C]/10 border-[#9B2C2C] text-[#FC8181] font-bold"
                        : "bg-[#22201D] border-[#383430] text-[#B0A497]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleCondition(def)}
                      className="text-left flex-1 truncate pr-1"
                    >
                      {def.name}
                    </button>

                    {active && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            handleConditionLevelDelta(def.name, -1)
                          }
                          className="w-4 h-4 rounded bg-[#242220] flex items-center justify-center text-[10px]"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs">{lvl}</span>
                        <button
                          type="button"
                          onClick={() => handleConditionLevelDelta(def.name, 1)}
                          className="w-4 h-4 rounded bg-[#242220] flex items-center justify-center text-[10px]"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dieta e Hábitat */}
          <div className="p-5 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-3">
            <div className="pb-2 border-b border-[#383430]">
              <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#89B5F7] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF9B42]" />
                <span>Dieta & Hábitat Natural</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#B0A497] mb-0.5">
                  Tipo de Dieta
                </label>
                <input
                  type="text"
                  value={sheet.diet.type}
                  onChange={(e) =>
                    onChange({ diet: { ...sheet.diet, type: e.target.value } })
                  }
                  placeholder="Ex: Carnívoro, Geófago..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#22201D] border border-[#383430]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#B0A497] mb-0.5">
                  Região do Hábitat
                </label>
                <input
                  type="text"
                  value={sheet.habitat.region}
                  onChange={(e) =>
                    onChange({
                      habitat: { ...sheet.habitat, region: e.target.value },
                    })
                  }
                  placeholder="Ex: Penhascos, Floresta..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#22201D] border border-[#383430]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* COLUNA DIREITA: TABS DE PARTES, HABILIDADES, TRAÇOS & COMPORTAMENTO (7 cols) */}
        {/* ========================================================= */}
        <section className="lg:col-span-7 space-y-4">
          {/* Top Tab Navigation Bar for Monster Features */}
          <div className="bg-[#1A1918] border border-[#383430] rounded-xl p-1.5 shadow-sm flex items-center gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("parts")}
              className={`px-3.5 py-2 rounded-lg font-serif font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === "parts"
                  ? "bg-[#13335C] text-white shadow-sm"
                  : "text-[#5C4D3C] hover:bg-[#33302B] hover:text-[#89B5F7]"
              }`}
            >
              <Shield className="w-4 h-4 text-[#FF9B42]" />
              <span>1. Partes ({sheet.parts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("skills")}
              className={`px-3.5 py-2 rounded-lg font-serif font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === "skills"
                  ? "bg-[#13335C] text-white shadow-sm"
                  : "text-[#5C4D3C] hover:bg-[#33302B] hover:text-[#89B5F7]"
              }`}
            >
              <Award className="w-4 h-4 text-[#FF9B42]" />
              <span>2. Habilidades</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("traits")}
              className={`px-3.5 py-2 rounded-lg font-serif font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === "traits"
                  ? "bg-[#13335C] text-white shadow-sm"
                  : "text-[#5C4D3C] hover:bg-[#33302B] hover:text-[#89B5F7]"
              }`}
            >
              <Dna className="w-4 h-4 text-[#38C2B3]" />
              <span>
                3. Traços ({sheet.traits.length + sheet.additionalTraits.length}
                )
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("behavior")}
              className={`px-3.5 py-2 rounded-lg font-serif font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === "behavior"
                  ? "bg-[#13335C] text-white shadow-sm"
                  : "text-[#5C4D3C] hover:bg-[#33302B] hover:text-[#89B5F7]"
              }`}
            >
              <Target className="w-4 h-4 text-[#FF9B42]" />
              <span>4. Comportamento</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("actions")}
              className={`px-3.5 py-2 rounded-lg font-serif font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === "actions"
                  ? "bg-[#13335C] text-white shadow-sm"
                  : "text-[#5C4D3C] hover:bg-[#33302B] hover:text-[#89B5F7]"
              }`}
            >
              <Zap className="w-4 h-4 text-[#38C2B3]" />
              <span>5. Ações Especiais ({sheet.specialActions.length})</span>
            </button>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: PARTES & ANATOMIA MONSTRUOSA */}
          {/* ========================================================= */}
          {activeTab === "parts" && (
            <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#383430] gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-black text-sm text-[#89B5F7] uppercase tracking-wider">
                      Partes Monstruosas & Durabilidade ({sheet.parts.length})
                    </h3>
                    <InfoTooltip
                      title="Partes de Criatura"
                      description="Monstros possuem partes anatômicas distintas (Garras, Cauda, Papo, Carapaça). Cada parte possui sua própria Durabilidade e causa efeitos devastadores se quebrada."
                      category="Anatomia"
                      onOpenCompendium={onOpenCompendium}
                    />
                  </div>
                  <p className="text-[11px] text-[#B0A497]">
                    Anatomia de combate, ataques de armas orgânicas, pontos
                    fracos e efeitos se quebrada.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddPart}
                  className="px-3 py-1.5 rounded-lg bg-[#13335C] hover:bg-[#0E2644] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FF9B42]" />
                  <span>Adicionar Parte</span>
                </button>
              </div>

              {/* Parts List */}
              <div className="space-y-3">
                {effectiveParts.map((part) => {
                  const isExpanded = expandedPartId === part.id;
                  const isBroken = part.currentDurability === 0;
                  const durPercent = Math.min(
                    100,
                    Math.max(
                      0,
                      (part.currentDurability / part.effectiveMaxDurability) *
                        100,
                    ),
                  );

                  return (
                    <div
                      key={part.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isBroken
                          ? "bg-[#9B2C2C]/5 border-[#9B2C2C]/40"
                          : "bg-[#242220] border-[#383430]"
                      }`}
                    >
                      {/* Summary Row */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedPartId(isExpanded ? null : part.id)
                            }
                            className="text-[#89B5F7] hover:text-[#FF9B42] p-0.5"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>

                          <span
                            className={`font-serif font-bold text-sm uppercase truncate ${isBroken ? "text-[#FC8181] line-through" : "text-[#89B5F7]"}`}
                          >
                            {part.name}
                          </span>

                          <div className="flex items-center gap-1 shrink-0">
                            {part.categories.map((cat) => (
                              <span
                                key={cat}
                                className="px-1.5 py-0.2 rounded bg-[#22201D] text-[9px] font-bold text-[#B0A497] border border-[#383430]"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Durability Delta Controls */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handlePartDurabilityDelta(part.id, -1)
                            }
                            disabled={part.currentDurability <= 0}
                            className="w-6 h-6 rounded bg-[#22201D] hover:bg-[#33302B] text-xs font-bold flex items-center justify-center border border-[#383430] disabled:opacity-30"
                          >
                            -
                          </button>

                          <span className="font-mono font-bold text-xs w-16 text-center text-[#89B5F7]">
                            {part.currentDurability} /{" "}
                            {part.effectiveMaxDurability}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handlePartDurabilityDelta(part.id, 1)
                            }
                            disabled={
                              part.currentDurability >=
                              part.effectiveMaxDurability
                            }
                            className="w-6 h-6 rounded bg-[#22201D] hover:bg-[#33302B] text-xs font-bold flex items-center justify-center border border-[#383430] disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Mini Bar */}
                      <div className="w-full h-1.5 rounded-full bg-white/70 overflow-hidden mt-2 border border-[#D8CEBA]/50">
                        <div
                          className={`h-full transition-all ${
                            isBroken
                              ? "bg-[#9B2C2C]"
                              : durPercent > 40
                                ? "bg-[#16857A]"
                                : "bg-[#E66826]"
                          }`}
                          style={{ width: `${durPercent}%` }}
                        />
                      </div>

                      {/* Expanded Part Editor */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-[#383430] space-y-3 text-xs animate-fadeIn">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-[#B0A497] mb-0.5">
                                Nome da Parte
                              </label>
                              <input
                                type="text"
                                value={part.name}
                                onChange={(e) =>
                                  handleUpdatePart(part.id, {
                                    name: e.target.value,
                                  })
                                }
                                className="w-full px-2.5 py-1 text-xs font-semibold rounded bg-[#22201D] border border-[#383430]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase text-[#B0A497] mb-0.5">
                                Durabilidade Máxima Base
                              </label>
                              <input
                                type="number"
                                value={part.baseMaxDurability}
                                onChange={(e) =>
                                  handleUpdatePart(part.id, {
                                    baseMaxDurability:
                                      parseInt(e.target.value) || 10,
                                  })
                                }
                                className="w-full px-2.5 py-1 text-xs font-semibold rounded bg-[#22201D] border border-[#383430]"
                              />
                            </div>
                          </div>

                          {/* Se Quebrada */}
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#FC8181] mb-0.5">
                              Se Quebrada (Efeito quando Durabilidade = 0) *
                            </label>
                            <textarea
                              value={part.brokenEffect}
                              onChange={(e) =>
                                handleUpdatePart(part.id, {
                                  brokenEffect: e.target.value,
                                })
                              }
                              placeholder="Ex: Esta parte causa metade do dano. A criatura fica Exposta."
                              rows={2}
                              className="w-full px-2.5 py-1.5 text-xs rounded bg-[#22201D] border border-[#383430] focus:ring-1 focus:ring-[#9B2C2C]"
                            />
                          </div>

                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => handleRemovePart(part.id)}
                              className="text-xs font-bold text-[#FC8181] hover:underline flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remover Parte</span>
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

          {/* ========================================================= */}
          {/* TAB 2: AS 12 HABILIDADES DA CRIATURA (+0 A +3) */}
          {/* ========================================================= */}
          {activeTab === "skills" && (
            <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#383430] gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-black text-sm text-[#89B5F7] uppercase tracking-wider">
                      Habilidades da Criatura (+0 a +3)
                    </h3>
                    <InfoTooltip
                      title="Perícias de Monstro"
                      description="Bônus adicionados diretamente aos Testes da criatura ao caçar presas ou resistir a ferais."
                      category="Regras"
                    />
                  </div>
                  <p className="text-[11px] text-[#B0A497]">
                    Bônus de ação aplicados em ataques, escaladas, rastreamento
                    e rugidos.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {SKILLS_LIST.map((sk) => {
                  const val = sheet.skills[sk.key] || 0;
                  return (
                    <div
                      key={sk.key}
                      className="p-2.5 rounded-lg bg-[#242220] border border-[#383430] flex items-center justify-between gap-2 hover:border-[#173F73]/40 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif font-bold text-xs text-[#F5EFEB] truncate uppercase">
                            {sk.label}
                          </span>
                          <InfoTooltip
                            title={sk.label}
                            description={sk.tooltip}
                            category="Habilidade"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleSkillChange(sk.key, -1)}
                          disabled={val <= 0}
                          className="w-6 h-6 rounded bg-[#22201D] hover:bg-[#33302B] text-xs font-bold flex items-center justify-center disabled:opacity-30 border border-[#383430] text-[#89B5F7]"
                        >
                          −
                        </button>
                        <span className="font-mono font-black text-sm w-6 text-center text-[#89B5F7]">
                          +{val}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSkillChange(sk.key, 1)}
                          disabled={val >= 3}
                          className="w-6 h-6 rounded bg-[#22201D] hover:bg-[#33302B] text-xs font-bold flex items-center justify-center disabled:opacity-30 border border-[#383430] text-[#89B5F7]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: TRAÇOS DO MONSTRO */}
          {/* ========================================================= */}
          {activeTab === "traits" && (
            <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#383430] gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-black text-sm text-[#38C2B3] uppercase tracking-wider">
                      Traços de Monstro (
                      {sheet.traits.length + sheet.additionalTraits.length})
                    </h3>
                    <InfoTooltip
                      title="Traços de Criatura"
                      description="Habilidades passivas, armaduras orgânicas e reações que tornam cada criatura única no campo de batalha."
                      category="Traços"
                    />
                  </div>
                  <p className="text-[11px] text-[#B0A497]">
                    Traços de combate e características biológicas ecológicas.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onOpenCompendium}
                    className="px-3 py-1.5 rounded-lg bg-[#242220] hover:bg-[#33302B] text-[#38C2B3] font-bold text-xs flex items-center gap-1.5 border border-[#383430]"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Compêndio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddTrait(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#16857A] hover:bg-[#126B62] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Traço</span>
                  </button>
                </div>
              </div>

              {/* Traits List */}
              <div className="space-y-3">
                {sheet.traits.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-3.5 rounded-xl bg-[#242220] border border-[#383430] space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tr.name}
                        onChange={(e) =>
                          onChange({
                            traits: sheet.traits.map((t) =>
                              t.id === tr.id
                                ? { ...t, name: e.target.value }
                                : t,
                            ),
                          })
                        }
                        placeholder="Nome do Traço..."
                        className="font-serif font-bold text-xs uppercase px-2.5 py-1 rounded bg-[#22201D] border border-[#383430] flex-1 text-[#38C2B3]"
                      />
                      <input
                        type="text"
                        value={tr.cost}
                        onChange={(e) =>
                          onChange({
                            traits: sheet.traits.map((t) =>
                              t.id === tr.id
                                ? { ...t, cost: e.target.value }
                                : t,
                            ),
                          })
                        }
                        placeholder="Custo (ex: Passiva)"
                        className="w-28 text-xs px-2 py-1 rounded bg-[#22201D] border border-[#383430]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTrait(tr.id, false)}
                        className="p-1 text-[#FC8181] hover:bg-[#22201D] rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      value={tr.description}
                      onChange={(e) =>
                        onChange({
                          traits: sheet.traits.map((t) =>
                            t.id === tr.id
                              ? { ...t, description: e.target.value }
                              : t,
                          ),
                        })
                      }
                      placeholder="Descrição mecânica do traço..."
                      rows={2}
                      className="w-full px-2.5 py-1 text-xs rounded bg-[#22201D] border border-[#383430]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: COMPORTAMENTO & INSTINTOS */}
          {/* ========================================================= */}
          {activeTab === "behavior" && (
            <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4 animate-fadeIn">
              <div className="pb-3 border-b border-[#383430]">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-black text-sm text-[#89B5F7] uppercase tracking-wider">
                    Comportamento & Instintos de Caçada
                  </h3>
                  <InfoTooltip
                    title="Inteligência de Monstro"
                    description="Instruções para o Guia sobre como o monstro reage, quem ele escolhe como alvo e como se comporta ao entrar em fúria."
                    category="Guia"
                  />
                </div>
                <p className="text-[11px] text-[#B0A497]">
                  Critérios de seleção de alvos, padrões de ataque e fases de
                  perigo.
                </p>
              </div>

              {/* Target Selection */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                  Seleção de Alvo Inicial
                </label>
                <textarea
                  value={sheet.behavior.targetSelection}
                  onChange={(e) =>
                    onChange({
                      behavior: {
                        ...sheet.behavior,
                        targetSelection: e.target.value,
                      },
                    })
                  }
                  placeholder="Como o monstro decide quem atacar se ninguém estiver Exposto ou Preso? (Ex: ataca quem se moveu por último)..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#22201D] border border-[#383430]"
                />
              </div>

              {/* Combat Instincts */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                  Instintos em Combate
                </label>
                <textarea
                  value={sheet.behavior.instincts}
                  onChange={(e) =>
                    onChange({
                      behavior: {
                        ...sheet.behavior,
                        instincts: e.target.value,
                      },
                    })
                  }
                  placeholder="Como ela se movimenta no terreno? Prefere emboscar do alto ou forçar combate fechado?"
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#22201D] border border-[#383430]"
                />
              </div>

              {/* Wounded Phase */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#FC8181] mb-1">
                  Fase de Fúria / Quando Ferido
                </label>
                <textarea
                  value={sheet.behavior.woundedPhase || ""}
                  onChange={(e) =>
                    onChange({
                      behavior: {
                        ...sheet.behavior,
                        woundedPhase: e.target.value,
                      },
                    })
                  }
                  placeholder="Mudanças de tática quando o Vigor atinge metade ou quando partes vitais são quebradas..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#22201D] border border-[#383430]"
                />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: AÇÕES ESPECIAIS */}
          {/* ========================================================= */}
          {activeTab === "actions" && (
            <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#383430] gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-black text-sm text-[#38C2B3] uppercase tracking-wider">
                      Habilidades Especiais & Reações (
                      {sheet.specialActions.length})
                    </h3>
                    <InfoTooltip
                      title="Ações Especiais de Monstro"
                      description="Poderes ativados durante o turno do monstro, como baforadas de fogo, terremotos ou reações defensivas."
                      category="Combate"
                    />
                  </div>
                  <p className="text-[11px] text-[#B0A497]">
                    Ações de alto impacto executadas pela criatura durante os
                    turnos de caçada.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddAction}
                  className="px-3 py-1.5 rounded-lg bg-[#16857A] hover:bg-[#126B62] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Habilidade</span>
                </button>
              </div>

              {/* Actions List */}
              <div className="space-y-3">
                {sheet.specialActions.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl bg-[#242220] border border-[#383430] space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={act.name}
                        onChange={(e) =>
                          handleUpdateAction(act.id, { name: e.target.value })
                        }
                        placeholder="Nome da Habilidade..."
                        className="font-serif font-bold text-xs px-2.5 py-1 rounded bg-[#22201D] border border-[#383430] flex-1 text-[#38C2B3]"
                      />
                      <select
                        value={act.type}
                        onChange={(e) =>
                          handleUpdateAction(act.id, {
                            type: e.target.value as any,
                          })
                        }
                        className="px-2 py-1 text-xs rounded bg-[#22201D] border border-[#383430]"
                      >
                        <option value="Ação">Ação</option>
                        <option value="Passiva">Passiva</option>
                        <option value="Reação">Reação</option>
                        <option value="Outro">Outro</option>
                      </select>
                      <input
                        type="text"
                        value={act.cost}
                        onChange={(e) =>
                          handleUpdateAction(act.id, {
                            cost: e.target.value as any,
                          })
                        }
                        placeholder="Custo (ex: 2 Ações)"
                        className="w-28 text-xs px-2 py-1 rounded bg-[#22201D] border border-[#383430]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAction(act.id)}
                        className="p-1 text-[#FC8181] hover:bg-[#22201D] rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      value={act.description}
                      onChange={(e) =>
                        handleUpdateAction(act.id, {
                          description: e.target.value,
                        })
                      }
                      placeholder="Descrição mecânica da habilidade..."
                      rows={2}
                      className="w-full px-2.5 py-1 text-xs rounded bg-[#22201D] border border-[#383430]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
