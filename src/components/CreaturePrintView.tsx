import React from 'react';
import { CreatureSheet, StyleKey, SkillKey } from '../types';
import { calculateEffectiveStats } from '../data/creatureData';

interface CreaturePrintViewProps {
  sheet: CreatureSheet;
}

const STYLES_ORDER: Array<{ key: StyleKey; label: string }> = [
  { key: 'ligeiro', label: 'LIGEIRO' },
  { key: 'poderoso', label: 'PODEROSO' },
  { key: 'preciso', label: 'PRECISO' },
  { key: 'sagaz', label: 'SAGAZ' }
];

const SKILLS_ORDER: Array<{ key: SkillKey; label: string }> = [
  { key: 'agarrar', label: 'AGARRAR' },
  { key: 'armazenar', label: 'ARMAZENAR' },
  { key: 'assegurar', label: 'ASSEGURAR' },
  { key: 'atirar', label: 'ATIRAR' },
  { key: 'atravessar', label: 'ATRAVESSAR' },
  { key: 'chamar', label: 'CHAMAR' },
  { key: 'curar', label: 'CURAR' },
  { key: 'estudar', label: 'ESTUDAR' },
  { key: 'exibir', label: 'EXIBIR' },
  { key: 'golpear', label: 'GOLPEAR' },
  { key: 'manufaturar', label: 'MANUFATURAR' },
  { key: 'procurar', label: 'PROCURAR' }
];

export const CreaturePrintView: React.FC<CreaturePrintViewProps> = ({ sheet }) => {
  const { maxVigor, effectiveStyles, effectiveParts, config } = calculateEffectiveStats(sheet);

  return (
    <div className="hidden print:block w-full max-w-[210mm] mx-auto p-8 bg-white text-black font-serif text-[12px] leading-snug">
      {/* Top Bestiary Header */}
      <div className="border-b-2 border-black pb-3 mb-4">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">
              {sheet.name || 'CRIATURA SEM NOME'}
            </h1>
            <p className="text-[13px] font-sans font-bold text-gray-700 italic">
              Um monstro da Linhagem dos {sheet.lineage} • Estágio: {sheet.stage} ({config.vigorMax} Vigor Base)
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

        {sheet.sizeConcept && (
          <p className="text-xs italic text-gray-600 mt-1">
            {sheet.sizeConcept}
          </p>
        )}

        {sheet.description && (
          <p className="text-xs text-gray-800 mt-2 text-justify">
            {sheet.description}
          </p>
        )}
      </div>

      {/* Grid: Estilos e Habilidades */}
      <div className="grid grid-cols-12 gap-4 mb-4 border border-black p-3">
        {/* Estilos */}
        <div className="col-span-4 border-r border-black pr-3">
          <h2 className="font-sans font-black text-[11px] uppercase tracking-wider mb-2 border-b border-black pb-0.5">
            ESTILOS (EFETIVOS)
          </h2>
          <div className="grid grid-cols-2 gap-2 text-center">
            {STYLES_ORDER.map(st => (
              <div key={st.key} className="border border-black p-1.5">
                <div className="text-[10px] font-bold uppercase">{st.label}</div>
                <div className="font-mono font-black text-base">+{effectiveStyles[st.key]}</div>
                <div className="text-[9px] text-gray-500 font-sans">Base: {sheet.baseStyles[st.key]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Habilidades */}
        <div className="col-span-8">
          <h2 className="font-sans font-black text-[11px] uppercase tracking-wider mb-2 border-b border-black pb-0.5">
            HABILIDADES (0 A +3)
          </h2>
          <div className="grid grid-cols-4 gap-1.5 text-center">
            {SKILLS_ORDER.map(sk => {
              const val = sheet.skills[sk.key] || 0;
              return (
                <div key={sk.key} className="border border-gray-400 p-1 flex items-center justify-between px-2">
                  <span className="text-[10px] font-bold font-sans">{sk.label}</span>
                  <span className="font-mono font-bold text-xs">+{val}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Traços e Traços Adicionais */}
      <div className="mb-4 border border-black p-3">
        <h2 className="font-sans font-black text-[11px] uppercase tracking-wider mb-2 border-b border-black pb-0.5 flex justify-between">
          <span>TRAÇOS DA CRIATURA</span>
          <span className="text-[10px] text-gray-600 font-normal">Principal & Adicionais</span>
        </h2>

        <div className="space-y-2">
          {sheet.traits.map(t => (
            <div key={t.id} className="text-xs">
              <span className="font-bold uppercase tracking-wide">{t.name}</span>
              {t.cost && <span className="font-sans font-medium text-gray-600 ml-1.5">({t.cost})</span>}
              <span className="text-gray-800 ml-1.5">— {t.description}</span>
            </div>
          ))}

          {sheet.stage === 'Zênite' && (
            <div className="text-xs font-bold text-black">
              <span>ZÊNITE. (Passivo) — Remove 1 Sucesso de cada Teste realizado por criaturas hostis em combate com você.</span>
            </div>
          )}

          {sheet.additionalTraits.length > 0 && (
            <div className="pt-2 mt-2 border-t border-dashed border-gray-300">
              <span className="font-sans font-bold text-[10px] uppercase text-gray-600 block mb-1">
                Traços Adicionais (Biológicos / Fora de Combate):
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {sheet.additionalTraits.map(at => (
                  <div key={at.id}>
                    <strong className="uppercase">{at.name}:</strong> {at.description}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Partes e Durabilidade (Core do Bestiário) */}
      <div className="mb-4 border border-black p-3">
        <h2 className="font-sans font-black text-[11px] uppercase tracking-wider mb-2 border-b border-black pb-0.5 flex justify-between">
          <span>PARTES & DURABILIDADE</span>
          <span className="text-[10px] text-gray-600 font-normal">Efeitos de Combate e Quando Quebradas</span>
        </h2>

        <div className="space-y-2.5">
          {effectiveParts.map(part => (
            <div key={part.id} className="border border-gray-300 p-2 text-xs">
              <div className="flex items-center justify-between font-sans mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-black uppercase text-sm">{part.name}</span>
                  <span className="text-[10px] text-gray-600">[{part.categories.join(', ')}]</span>
                </div>
                <span className="font-mono font-bold">
                  Durabilidade: {part.currentDurability} / {part.effectiveMaxDurability} (Base: {part.baseMaxDurability})
                </span>
              </div>

              {part.categories.includes('Arma') && (
                <div className="text-[11px] mb-1">
                  <strong>Ataque de Arma:</strong> Alcance: {part.weaponReach ?? 1} ({part.weaponSkill?.toUpperCase()} {part.weaponStyle?.toUpperCase()}).
                  {part.weaponEffect && <span className="ml-1 text-gray-700">{part.weaponEffect}</span>}
                </div>
              )}

              {part.weakPointEffect && (
                <div className="text-[11px] mb-1">
                  <strong>Ponto Fraco:</strong> {part.weakPointEffect}
                </div>
              )}

              <div className="text-[11px] text-gray-900 bg-gray-50 p-1 rounded border border-gray-200">
                <strong>Se Quebrada:</strong> {part.brokenEffect}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comportamento e Instintos */}
      <div className="mb-4 border border-black p-3 text-xs">
        <h2 className="font-sans font-black text-[11px] uppercase tracking-wider mb-2 border-b border-black pb-0.5">
          COMPORTAMENTO DOS MONSTROS
        </h2>

        <div className="space-y-2 text-justify">
          {sheet.behavior.targetSelection && (
            <p>
              <strong>Seleção de Alvo:</strong> {sheet.behavior.targetSelection}
            </p>
          )}

          {sheet.behavior.instincts && (
            <p>
              <strong>Instintos em Combate:</strong> {sheet.behavior.instincts}
            </p>
          )}

          {sheet.behavior.woundedPhase && (
            <p>
              <strong>Quando Ferido / Fúria:</strong> {sheet.behavior.woundedPhase}
            </p>
          )}
        </div>
      </div>

      {/* Dieta e Hábitat */}
      <div className="grid grid-cols-2 gap-4 border border-black p-3 text-xs">
        <div>
          <h3 className="font-sans font-bold text-[10px] uppercase border-b border-gray-400 pb-0.5 mb-1">
            DIETA ({sheet.diet.type})
          </h3>
          <p className="text-gray-800">{sheet.diet.examples}</p>
          {sheet.diet.description && <p className="text-gray-600 text-[11px] mt-0.5">{sheet.diet.description}</p>}
        </div>

        <div>
          <h3 className="font-sans font-bold text-[10px] uppercase border-b border-gray-400 pb-0.5 mb-1">
            HÁBITAT
          </h3>
          <p className="text-gray-800">{sheet.habitat.region} — {sheet.habitat.areas}</p>
          {sheet.habitat.notes && <p className="text-gray-600 text-[11px] mt-0.5">{sheet.habitat.notes}</p>}
        </div>
      </div>
    </div>
  );
};
