import React from "react";
import type { ICreature, SkillKey, StyleKey } from "../../types/types";
import { calculateEffectiveStats } from "../data/creatureData";

interface CreaturePrintViewProps {
  sheet: ICreature;
}

const STYLES_ORDER: Array<{ key: StyleKey; label: string }> = [
  { key: "ligeiro", label: "LIGEIRO" },
  { key: "poderoso", label: "PODEROSO" },
  { key: "preciso", label: "PRECISO" },
  { key: "sagaz", label: "SAGAZ" },
];

const SKILLS_ORDER: Array<{ key: SkillKey; label: string }> = [
  { key: "agarrar", label: "AGARRAR" },
  { key: "armazenar", label: "ARMAZENAR" },
  { key: "assegurar", label: "ASSEGURAR" },
  { key: "atirar", label: "ATIRAR" },
  { key: "atravessar", label: "ATRAVESSAR" },
  { key: "chamar", label: "CHAMAR" },
  { key: "curar", label: "CURAR" },
  { key: "estudar", label: "ESTUDAR" },
  { key: "exibir", label: "EXIBIR" },
  { key: "golpear", label: "GOLPEAR" },
  { key: "manufaturar", label: "MANUFATURAR" },
  { key: "procurar", label: "PROCURAR" },
];

export const CreaturePrintView: React.FC<CreaturePrintViewProps> = ({
  sheet,
}) => {
  const { maxVigor, effectiveStyles, effectiveParts, config } =
    calculateEffectiveStats(sheet);

  return (
    <div className="hidden print:block w-full max-w-[210mm] mx-auto p-8 bg-white text-black font-serif text-[12px] leading-snug">
      <div className="border-b-2 border-black pb-3 mb-4">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">
              {sheet.identity.name || "CRIATURA SEM NOME"}
            </h1>
            <p className="text-[13px] font-sans font-bold text-gray-700 italic">
              Linhagem: {sheet.identity.lineage} • Estágio:{" "}
              {sheet.identity.stage} • Porte: {sheet.identity.size}
            </p>
          </div>
          <div className="text-right font-sans">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 block">
              BESTIÁRIO DE WILDERFEAST
            </span>
            <span className="font-mono font-bold text-sm">
              Vigor: {sheet.vigor.current} / {maxVigor}
            </span>
          </div>
        </div>

        {sheet.identity.description && (
          <p className="text-xs text-gray-800 mt-2 text-justify">
            {sheet.identity.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-12 gap-4 mb-4 border border-black p-3">
        <div className="col-span-4 border-r border-black pr-3">
          <h2 className="font-sans font-black text-[11px] uppercase tracking-wider mb-2 border-b border-black pb-0.5">
            ESTILOS EFETIVOS
          </h2>
          <div className="grid grid-cols-2 gap-2 text-center">
            {STYLES_ORDER.map((st) => (
              <div key={st.key} className="border border-black p-1.5">
                <div className="text-[10px] font-bold uppercase">
                  {st.label}
                </div>
                <div className="font-mono font-black text-base">
                  +{effectiveStyles[st.key]}
                </div>
                <div className="text-[9px] text-gray-500 font-sans">
                  Base: {sheet.styles[st.key]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-8">
          <h2 className="font-sans font-black text-[11px] uppercase tracking-wider mb-2 border-b border-black pb-0.5">
            HABILIDADES
          </h2>
          <div className="grid grid-cols-4 gap-1.5 text-center">
            {SKILLS_ORDER.map((sk) => (
              <div
                key={sk.key}
                className="border border-gray-400 p-1 flex items-center justify-between px-2"
              >
                <span className="text-[10px] font-bold font-sans">
                  {sk.label}
                </span>
                <span className="font-mono font-bold text-xs">
                  +{sheet.skills[sk.key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 border border-black p-3">
        <h2 className="font-sans font-black text-[11px] uppercase tracking-wider mb-2 border-b border-black pb-0.5">
          TRAÇOS
        </h2>
        <div className="space-y-2">
          {sheet.traits.map((trait) => (
            <div key={trait.id} className="text-xs">
              <span className="font-bold uppercase tracking-wide">
                {trait.name}
              </span>
              <span className="font-sans font-medium text-gray-600 ml-1.5">
                ({trait.cost})
              </span>
              <span className="text-gray-800 ml-1.5">
                — {trait.description}
              </span>
            </div>
          ))}

          {sheet.additionalTraits.length > 0 && (
            <div className="pt-2 mt-2 border-t border-dashed border-gray-300">
              <span className="font-sans font-bold text-[10px] uppercase text-gray-600 block mb-1">
                TRAÇOS ADICIONAIS
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {sheet.additionalTraits.map((trait) => (
                  <div key={trait.id}>
                    <strong className="uppercase">{trait.name}:</strong>{" "}
                    {trait.description}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sheet.conditions.length > 0 && (
            <div className="pt-2 mt-2 border-t border-dashed border-gray-300">
              <span className="font-sans font-bold text-[10px] uppercase text-gray-600 block mb-1">
                CONDIÇÕES
              </span>
              <div className="grid grid-cols-2 gap-2">
                {sheet.conditions.map((condition) => (
                  <div key={condition.id}>
                    <strong>
                      {condition.name}{" "}
                      {condition.level > 0 ? `(${condition.level})` : ""}:
                    </strong>{" "}
                    {condition.description}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sheet.identity.stage === "Zênite" && (
            <div className="text-xs font-bold text-black mt-2">
              {config.traitSpecial}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 border border-black p-3">
        <h2 className="font-sans font-black text-[11px] uppercase tracking-wider mb-2 border-b border-black pb-0.5">
          PARTES & DURABILIDADE
        </h2>
        <div className="space-y-2.5">
          {effectiveParts.map((part) => (
            <div key={part.id} className="border border-gray-300 p-2 text-xs">
              <div className="flex items-center justify-between font-sans mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-black uppercase text-sm">
                    {part.name}
                  </span>
                  <span className="text-[10px] text-gray-600">
                    [{part.categories.join(", ")}]
                  </span>
                </div>
                <span className="font-mono font-bold">
                  Durabilidade: {part.durability.current} /{" "}
                  {part.durability.max}
                </span>
              </div>
              <div className="text-[11px] text-gray-900">
                {part.description}
              </div>
              {(part.range !== undefined || part.skills || part.styles) && (
                <div className="text-[11px] mt-1">
                  <strong>Combate:</strong>{" "}
                  {part.range !== undefined ? `Alcance ${part.range}` : ""}
                  {part.skills
                    ? ` • Habilidade ${part.skills.toUpperCase()}`
                    : ""}
                  {part.styles ? ` • Estilo ${part.styles.toUpperCase()}` : ""}
                </div>
              )}
              {part.whenBroken && (
                <div className="text-[11px] text-gray-900 bg-gray-50 p-1 rounded border border-gray-200 mt-1">
                  <strong>Quando quebrada:</strong> {part.whenBroken}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 border border-black p-3 text-xs">
        <h2 className="font-sans font-black text-[11px] uppercase tracking-wider mb-2 border-b border-black pb-0.5">
          ECOLOGIA & COMPORTAMENTO
        </h2>
        <div className="space-y-2 text-justify">
          <p>
            <strong>Dieta:</strong> {sheet.diet}
          </p>
          <p>
            <strong>Hábitat:</strong> {sheet.habitat}
          </p>
          <p>
            <strong>Comportamento:</strong> {sheet.behavior}
          </p>
        </div>
      </div>
    </div>
  );
};
