import React, { useState } from "react";
import { Heart, Shield, Users, AlertTriangle, Plus } from "lucide-react";
import { FeralSheet, StyleKey, CustomUtensil } from "../types";
import {
  UTENSILS_DATA,
  SPECIALTIES_DATA,
  ALL_CONDITIONS_DATA,
} from "../data/wilderfeastData";
import { CustomUtensilModal } from "./CustomUtensilModal";
import { loadCustomUtensils } from "../lib/storage";
import { InfoTooltip } from "./InfoTooltip";

interface LeftStatusColumnProps {
  sheet: FeralSheet;
  onChange: (updated: Partial<FeralSheet>) => void;
  onOpenCompendiumWithTopic?: (topic: string) => void;
}

export const LeftStatusColumn: React.FC<LeftStatusColumnProps> = ({
  sheet,
  onChange,
}) => {
  const [isCustomUtensilModalOpen, setIsCustomUtensilModalOpen] =
    useState(false);
  const customUtensils = loadCustomUtensils();

  // Styles definitions & metadata
  const stylesList: Array<{
    key: StyleKey;
    name: string;
    description: string;
    tooltip: string;
    badgeColor: string;
    borderCol: string;
    bgCol: string;
  }> = [
    {
      key: "ligeiro",
      name: "LIGEIRO",
      description: "Velocidade, agilidade, esquiva e destreza acrobática.",
      tooltip:
        "Rola dados de Ligeiro ao agir com rapidez, esquivar de investidas de monstros ou saltar entre copas de árvores.",
      badgeColor: "bg-[#16857A] text-white",
      borderCol: "border-[#16857A]/40",
      bgCol: "bg-[#242220]",
    },
    {
      key: "poderoso",
      name: "PODEROSO",
      description: "Força bruta, impacto pesado, resistência e vigor físico.",
      tooltip:
        "Rola dados de Poderoso ao desferir golpes devastadores com utensílios pesados, quebrar carapaças e bloquear impacto.",
      badgeColor: "bg-[#9B2C2C] text-white",
      borderCol: "border-[#9B2C2C]/40",
      bgCol: "bg-[#242220]",
    },
    {
      key: "preciso",
      name: "PRECISO",
      description: "Mira, cirurgia culinária, cortes milimétricos e foco.",
      tooltip:
        "Rola dados de Preciso ao mirar em partes e pontos fracos específicos do monstro ou executar cortes limpos de alta acurácia.",
      badgeColor: "bg-[#E66826] text-white",
      borderCol: "border-[#E66826]/40",
      bgCol: "bg-[#242220]",
    },
    {
      key: "sagaz",
      name: "SAGAZ",
      description: "Astúcia, armadilhas, percepção, intuição e conhecimento.",
      tooltip:
        "Rola dados de Sagaz ao armar emboscadas, ler o comportamento da presa, rastrear pegadas e manipular o ambiente.",
      badgeColor: "bg-[#13335C] text-white",
      borderCol: "border-[#173F73]/40",
      bgCol: "bg-[#242220]",
    },
  ];

  // Helper to adjust a Style value
  const handleStyleChange = (key: StyleKey, delta: number) => {
    const currentVal = sheet.styles[key] || 1;
    const newVal = Math.max(1, Math.min(5, currentVal + delta));
    onChange({
      styles: {
        ...sheet.styles,
        [key]: newVal,
      },
    });
  };

  // Helper for Conditions
  const isConditionActive = (condName: string) => {
    return sheet.conditions.some(
      (c) => c.name.toLowerCase() === condName.toLowerCase(),
    );
  };

  const getConditionObj = (condName: string) => {
    return sheet.conditions.find(
      (c) => c.name.toLowerCase() === condName.toLowerCase(),
    );
  };

  const toggleCondition = (condName: string, defDesc?: string) => {
    const existing = getConditionObj(condName);
    if (existing) {
      onChange({
        conditions: sheet.conditions.filter((c) => c.id !== existing.id),
      });
    } else {
      const newCond = {
        id: `cond-${condName}-${Date.now()}`,
        name: condName,
        level: 1,
        description: defDesc || "Condição de status ativa.",
        notes: "",
      };
      onChange({
        conditions: [...sheet.conditions, newCond],
      });
    }
  };

  const updateConditionLevel = (condName: string, delta: number) => {
    const existing = getConditionObj(condName);
    if (!existing) return;
    const newLvl = existing.level + delta;
    if (newLvl <= 0) {
      onChange({
        conditions: sheet.conditions.filter((c) => c.id !== existing.id),
      });
    } else {
      onChange({
        conditions: sheet.conditions.map((c) =>
          c.id === existing.id ? { ...c, level: Math.min(5, newLvl) } : c,
        ),
      });
    }
  };

  // Utensil selection change
  const handleUtensilChange = (newType: string) => {
    const custom = customUtensils.find((u) => u.name === newType);
    if (custom) {
      onChange({
        utensil: {
          ...sheet.utensil,
          type: custom.name,
          customName: custom.name,
          reach: custom.reach,
          maxDurability: custom.maxDurability,
          currentDurability: Math.min(
            sheet.utensil.currentDurability,
            custom.maxDurability,
          ),
          isCustom: true,
          style1: custom.style1,
          style2: custom.style2,
        },
      });
      return;
    }

    const def = UTENSILS_DATA[newType];
    onChange({
      utensil: {
        ...sheet.utensil,
        type: newType,
        customName: sheet.utensil.customName || `${newType} de Arkaicaço`,
        reach: def?.reach ?? sheet.utensil.reach,
        maxDurability: def?.baseDurability ?? sheet.utensil.maxDurability,
        currentDurability: Math.min(
          sheet.utensil.currentDurability,
          def?.baseDurability ?? 20,
        ),
        isCustom: false,
      },
    });
  };

  const handleCustomUtensilCreated = (custom: CustomUtensil) => {
    onChange({
      utensil: {
        type: custom.name,
        customName: custom.name,
        reach: custom.reach,
        maxDurability: custom.maxDurability,
        currentDurability: custom.maxDurability,
        isCustom: true,
        style1: custom.style1,
        style2: custom.style2,
        notes: custom.description,
      },
      techniques: [
        ...sheet.techniques,
        ...custom.techniques.map((t) => ({ ...t, utensil: custom.name })),
      ],
    });
  };

  // Specialty selection change
  const handleSpecialtyChange = (newSpec: string) => {
    onChange({
      identity: {
        ...sheet.identity,
        specialty: newSpec,
      },
    });
  };

  // Vigor calculation
  const vigorPercent = Math.min(
    100,
    Math.max(0, (sheet.vigor.current / (sheet.vigor.max || 20)) * 100),
  );
  const durabilityPercent = Math.min(
    100,
    Math.max(
      0,
      (sheet.utensil.currentDurability / (sheet.utensil.maxDurability || 20)) *
        100,
    ),
  );

  return (
    <aside className="w-full space-y-5">
      {/* ========================================================= */}
      {/* 1. DADOS PRINCIPAIS & IDENTIDADE COMPACTA */}
      {/* ========================================================= */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4">
        {/* Header Indicator */}
        <div className="flex items-center justify-between pb-1 border-b border-[#383430]">
          <span className="text-[10px] font-bold tracking-widest text-[#FF9B42] uppercase">
            FICHA OFICIAL DE FERAL
          </span>
          <InfoTooltip
            title="O Feral"
            description="Ferais são caçadores-cozinheiros mutados que comem carne de monstros para adquirir suas habilidades biológicas e restaurar o equilíbrio do ecossistema."
            category="Identidade"
          />
        </div>

        {/* Name & Pronouns & Avatar */}
        <div className="flex items-start gap-3.5">
          <div className="w-14 h-14 rounded-xl bg-[#242220] border border-[#383430] text-[#89B5F7] flex items-center justify-center font-serif font-black text-2xl shrink-0">
            {sheet.identity.name
              ? sheet.identity.name.charAt(0).toUpperCase()
              : "F"}
          </div>

          <div className="flex-1 min-w-0">
            <input
              id="input-feral-name"
              type="text"
              value={sheet.identity.name}
              onChange={(e) =>
                onChange({
                  identity: { ...sheet.identity, name: e.target.value },
                })
              }
              placeholder="Nome do Feral..."
              className="w-full font-serif font-black text-2xl sm:text-3xl text-[#89B5F7] bg-transparent border-b border-transparent hover:border-[#383430] focus:border-[#173F73] focus:outline-none transition-colors"
            />
            <input
              id="input-feral-pronouns"
              type="text"
              value={sheet.identity.pronouns}
              onChange={(e) =>
                onChange({
                  identity: { ...sheet.identity, pronouns: e.target.value },
                })
              }
              placeholder="Pronomes (ex: ele/dele, ela/dela)..."
              className="w-full text-xs font-semibold text-[#B0A497] bg-transparent border-b border-transparent hover:border-[#383430] focus:border-[#173F73] focus:outline-none transition-colors mt-0.5"
            />
          </div>
        </div>

        {/* Especialidade e Utensílio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#383430]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#B0A497]">
                Especialidade (Linhagem)
              </label>
              <InfoTooltip
                title="Especialidade"
                description="Sua classe culinária e de combate (ex: Molheiro, Grelhador, Açougueiro). Concede um estilo inicial favorecido e traços únicos."
                category="Identidade"
              />
            </div>
            <select
              value={sheet.identity.specialty}
              onChange={(e) => handleSpecialtyChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-bold rounded-lg bg-[#242220] text-[#89B5F7] border border-[#383430]"
            >
              {Object.keys(SPECIALTIES_DATA).map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#B0A497]">
                Utensílio de Arkaicaço
              </label>
              <div className="flex items-center gap-1">
                <InfoTooltip
                  title="Utensílio de Arkaicaço"
                  description="Armas gigantes de cozinha forjadas em metal ancestral. Cada utensílio possui Alcance, Durabilidade e Técnicas exclusivas."
                  category="Equipamento"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomUtensilModalOpen(true)}
                  className="text-[10px] font-bold text-[#89B5F7] hover:underline flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>Novo</span>
                </button>
              </div>
            </div>
            <select
              value={sheet.utensil.type}
              onChange={(e) => handleUtensilChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-bold rounded-lg bg-[#242220] text-[#89B5F7] border border-[#383430]"
            >
              <optgroup label="Utensílios Oficiais">
                {Object.keys(UTENSILS_DATA).map((ut) => (
                  <option key={ut} value={ut}>
                    {ut}
                  </option>
                ))}
              </optgroup>
              {customUtensils.length > 0 && (
                <optgroup label="Utensílios Personalizados">
                  {customUtensils.map((cu) => (
                    <option key={cu.id} value={cu.name}>
                      {cu.name} (Custom)
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIGOR (UNIFICADO NA MESMA DIV) */}
        {/* ========================================================= */}
        <div className="p-4 rounded-xl bg-[#242220] border border-[#383430] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#FC8181]" />
              <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#FC8181]">
                Vigor (Saúde)
              </span>
              <InfoTooltip
                title="Vigor & Ferimentos"
                description="Sua reserva de energia física. Se chegar a 0, você recebe 1 nível de Ferido e seu Vigor é restaurado ao máximo! Com Ferido 3, você corre risco mortal."
                category="Combate"
              />
            </div>

            <div className="text-right">
              <span className="font-mono font-black text-xl text-[#F5EFEB]">
                {sheet.vigor.current}
              </span>
              <span className="text-xs font-bold text-[#B0A497] ml-1">
                / {sheet.vigor.max || 20} MAX
              </span>
            </div>
          </div>

          {/* Solid Liquid Progress Bar */}
          <div className="relative w-full h-6 bg-[#1A1918] rounded-lg overflow-hidden border border-[#383430]">
            <div
              className="h-full bg-[#9B2C2C] transition-all duration-300 relative"
              style={{ width: `${vigorPercent}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center font-mono font-bold text-[10px] text-[#F5EFEB] pointer-events-none">
              {Math.round(vigorPercent)}%
            </span>
          </div>

          {/* Controls on same div */}
          <div className="flex items-center justify-between gap-1.5 pt-0.5">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    vigor: {
                      ...sheet.vigor,
                      current: Math.max(0, sheet.vigor.current - 5),
                    },
                  })
                }
                className="px-2 py-1 text-[11px] font-bold rounded bg-[#22201D] hover:bg-[#33302B] text-[#FC8181] border border-[#383430]"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    vigor: {
                      ...sheet.vigor,
                      current: Math.max(0, sheet.vigor.current - 1),
                    },
                  })
                }
                className="w-7 h-7 rounded bg-[#22201D] hover:bg-[#33302B] text-[#FC8181] font-bold text-xs flex items-center justify-center border border-[#383430]"
              >
                −
              </button>
            </div>

            <input
              type="number"
              min={0}
              max={sheet.vigor.max || 20}
              value={sheet.vigor.current}
              onChange={(e) =>
                onChange({
                  vigor: {
                    ...sheet.vigor,
                    current: Math.max(
                      0,
                      Math.min(
                        sheet.vigor.max || 20,
                        parseInt(e.target.value) || 0,
                      ),
                    ),
                  },
                })
              }
              className="w-14 px-1.5 py-0.5 text-center font-mono font-bold text-xs rounded bg-[#22201D] border border-[#383430]"
            />

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    vigor: {
                      ...sheet.vigor,
                      current: Math.min(
                        sheet.vigor.max || 20,
                        sheet.vigor.current + 1,
                      ),
                    },
                  })
                }
                className="w-7 h-7 rounded bg-[#22201D] hover:bg-[#33302B] text-[#38C2B3] font-bold text-xs flex items-center justify-center border border-[#383430]"
              >
                +
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    vigor: {
                      ...sheet.vigor,
                      current: Math.min(
                        sheet.vigor.max || 20,
                        sheet.vigor.current + 5,
                      ),
                    },
                  })
                }
                className="px-2 py-1 text-[11px] font-bold rounded bg-[#22201D] hover:bg-[#33302B] text-[#38C2B3] border border-[#383430]"
              >
                +5
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* DURABILIDADE DO UTENSÍLIO (UNIFICADO NA MESMA DIV) */}
        {/* ========================================================= */}
        <div className="p-4 rounded-xl bg-[#242220] border border-[#383430] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#89B5F7]" />
              <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#89B5F7]">
                Durabilidade do Utensílio
              </span>
              <InfoTooltip
                title="Durabilidade"
                description="Usar técnicas ou bloquear ataques pesados consome Durabilidade. Se atingir 0, o utensílio quebra e precisa ser reparado."
                category="Equipamento"
              />
            </div>

            <div className="text-right">
              <span className="font-mono font-black text-xl text-[#F5EFEB]">
                {sheet.utensil.currentDurability}
              </span>
              <span className="text-xs font-bold text-[#B0A497] ml-1">
                / {sheet.utensil.maxDurability || 20} MAX
              </span>
            </div>
          </div>

          {/* Solid Liquid Progress Bar */}
          <div className="relative w-full h-6 bg-[#1A1918] rounded-lg overflow-hidden border border-[#383430]">
            <div
              className="h-full bg-[#13335C] transition-all duration-300 relative"
              style={{ width: `${durabilityPercent}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center font-mono font-bold text-[10px] text-[#F5EFEB] pointer-events-none">
              {Math.round(durabilityPercent)}%
            </span>
          </div>

          {/* Controls on same div */}
          <div className="flex items-center justify-between gap-1.5 pt-0.5">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    utensil: {
                      ...sheet.utensil,
                      currentDurability: Math.max(
                        0,
                        sheet.utensil.currentDurability - 5,
                      ),
                    },
                  })
                }
                className="px-2 py-1 text-[11px] font-bold rounded bg-[#22201D] hover:bg-[#33302B] text-[#FC8181] border border-[#383430]"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    utensil: {
                      ...sheet.utensil,
                      currentDurability: Math.max(
                        0,
                        sheet.utensil.currentDurability - 1,
                      ),
                    },
                  })
                }
                className="w-7 h-7 rounded bg-[#22201D] hover:bg-[#33302B] text-[#FC8181] font-bold text-xs flex items-center justify-center border border-[#383430]"
              >
                −
              </button>
            </div>

            <input
              type="number"
              min={0}
              max={sheet.utensil.maxDurability || 20}
              value={sheet.utensil.currentDurability}
              onChange={(e) =>
                onChange({
                  utensil: {
                    ...sheet.utensil,
                    currentDurability: Math.max(
                      0,
                      Math.min(
                        sheet.utensil.maxDurability || 20,
                        parseInt(e.target.value) || 0,
                      ),
                    ),
                  },
                })
              }
              className="w-14 px-1.5 py-0.5 text-center font-mono font-bold text-xs rounded bg-[#22201D] border border-[#383430]"
            />

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    utensil: {
                      ...sheet.utensil,
                      currentDurability: Math.min(
                        sheet.utensil.maxDurability || 20,
                        sheet.utensil.currentDurability + 1,
                      ),
                    },
                  })
                }
                className="w-7 h-7 rounded bg-[#22201D] hover:bg-[#33302B] text-[#38C2B3] font-bold text-xs flex items-center justify-center border border-[#383430]"
              >
                +
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    utensil: {
                      ...sheet.utensil,
                      currentDurability: Math.min(
                        sheet.utensil.maxDurability || 20,
                        sheet.utensil.currentDurability + 5,
                      ),
                    },
                  })
                }
                className="px-2 py-1 text-[11px] font-bold rounded bg-[#22201D] hover:bg-[#33302B] text-[#38C2B3] border border-[#383430]"
              >
                +5
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* HARMONIA DA MATILHA (CORRIGIDA: SEM MÁXIMO, MÍNIMO 0) */}
        {/* ========================================================= */}
        <div className="p-4 rounded-xl bg-[#242220] border border-[#383430] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#E66826] text-white">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#FF9B42] block">
                  Harmonia da Matilha
                </span>
                <InfoTooltip
                  title="Harmonia da Matilha"
                  description="Pontos compartilhados por toda a matilha. Gastos para ajudar companheiros, ativar manobras cooperativas e proteger ferais caídos."
                  category="Matilha"
                />
              </div>
              <span className="text-[10px] text-[#B0A497]">
                Recurso compartilhado (mínimo 0)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-harmony-minus"
              type="button"
              onClick={() =>
                onChange({
                  packState: {
                    ...sheet.packState,
                    harmony: Math.max(0, (sheet.packState.harmony || 0) - 1),
                  },
                })
              }
              disabled={(sheet.packState.harmony || 0) <= 0}
              className="w-8 h-8 rounded-lg bg-[#22201D] hover:bg-[#33302B] text-[#F5EFEB] font-bold text-sm flex items-center justify-center disabled:opacity-30 border border-[#383430]"
            >
              −
            </button>

            <span className="font-mono font-black text-2xl w-8 text-center text-[#F5EFEB]">
              {sheet.packState.harmony ?? 3}
            </span>

            <button
              id="btn-harmony-plus"
              type="button"
              onClick={() =>
                onChange({
                  packState: {
                    ...sheet.packState,
                    harmony: (sheet.packState.harmony || 0) + 1,
                  },
                })
              }
              className="w-8 h-8 rounded-lg bg-[#22201D] hover:bg-[#33302B] text-[#F5EFEB] font-bold text-sm flex items-center justify-center border border-[#383430]"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. ESTILOS DE AÇÃO (1 A 5 D6) */}
      {/* ========================================================= */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#383430]">
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-bold text-sm text-[#89B5F7] uppercase tracking-wider">
              Estilos de Ação (1 a 5 d6)
            </span>
            <InfoTooltip
              title="Estilos de Ação"
              description="Quando você realiza um Teste, escolha o Estilo apropriado. Você rola tantos dados d6 quanto o valor do Estilo. Cada 5 ou 6 tirado no d6 é 1 Sucesso."
              category="Regras"
            />
          </div>
          <span className="text-[11px] text-[#B0A497]">Pilha de dados d6</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stylesList.map((st) => {
            const val = sheet.styles[st.key] || 1;
            return (
              <div
                key={st.key}
                className={`p-3 rounded-lg border ${st.borderCol} ${st.bgCol} flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <span className="font-serif font-bold text-xs uppercase text-[#F5EFEB]">
                      {st.name}
                    </span>
                    <InfoTooltip
                      title={st.name}
                      description={st.tooltip}
                      category="Estilo"
                    />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-black font-mono ${st.badgeColor}`}
                  >
                    +{val} d6
                  </span>
                </div>

                <p className="text-[10px] text-[#B0A497] line-clamp-1 mb-2">
                  {st.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#D8CEBA]/50">
                  {/* Dot pips indicator */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((pip) => (
                      <div
                        key={pip}
                        className={`w-2 h-2 rounded-full ${
                          pip <= val ? "bg-[#13335C]" : "bg-[#D8CEBA]"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStyleChange(st.key, -1)}
                      disabled={val <= 1}
                      className="w-5 h-5 rounded bg-[#22201D] hover:bg-[#33302B] text-[#F5EFEB] font-bold text-xs flex items-center justify-center disabled:opacity-30 border border-[#383430]"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStyleChange(st.key, 1)}
                      disabled={val >= 5}
                      className="w-5 h-5 rounded bg-[#22201D] hover:bg-[#33302B] text-[#F5EFEB] font-bold text-xs flex items-center justify-center disabled:opacity-30 border border-[#383430]"
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

      {/* ========================================================= */}
      {/* 3. CONDIÇÕES ATIVAS */}
      {/* ========================================================= */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#383430]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FC8181]" />
            <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#FC8181]">
              Condições de Status
            </span>
            <InfoTooltip
              title="Condições de Status"
              description="Efeitos temporários sofridos durante A Caçada (ex: Exposto, Preso, Ferido, Fúria). Cada condição impõe penalidades ou regras especiais."
              category="Combate"
            />
          </div>
          <span className="text-[11px] text-[#B0A497]">
            {sheet.conditions.length} ativas
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {ALL_CONDITIONS_DATA.map((def) => {
            const active = isConditionActive(def.name);
            const cond = getConditionObj(def.name);
            return (
              <div
                key={def.name}
                className={`p-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                  active
                    ? "bg-[#9B2C2C]/10 border-[#9B2C2C] text-[#FC8181] font-bold"
                    : "bg-[#242220] border-[#383430] text-[#B0A497]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleCondition(def.name, def.description)}
                  className="text-left flex-1 truncate pr-1"
                >
                  {def.name}
                </button>

                {active && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateConditionLevel(def.name, -1)}
                      className="w-4 h-4 rounded bg-[#22201D] flex items-center justify-center text-[10px]"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs">
                      {cond?.level || 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateConditionLevel(def.name, 1)}
                      className="w-4 h-4 rounded bg-[#22201D] flex items-center justify-center text-[10px]"
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

      {/* Custom Utensil Modal */}
      <CustomUtensilModal
        isOpen={isCustomUtensilModalOpen}
        onClose={() => setIsCustomUtensilModalOpen(false)}
        onSelectUtensil={handleCustomUtensilCreated}
      />
    </aside>
  );
};
