import { useState } from "react";
import {
  Bone,
  ChevronDown,
  Ham,
  HeartPulse,
  Minus,
  Plus,
  Swords,
  Trash2,
} from "lucide-react";
import type {
  ICreaturePart,
  IPartAttack,
  SkillKey,
  StyleKey,
} from "../../types/types";
import { SKILLS, STYLES } from "../../data/wilderfeastData";
import { Field, inputClass } from "./FormControls";

interface PartEditorProps {
  index: number;
  part: ICreaturePart;
  onChange: (patch: Partial<ICreaturePart>) => void;
  onRemove: () => void;
}

const EMPTY_ATTACK: IPartAttack = {
  range: 1,
  skill: "golpear",
  style: "poderoso",
};

export function PartEditor({
  index,
  part,
  onChange,
  onRemove,
}: PartEditorProps) {
  const hasAttack = Boolean(part.attack);
  const hasBroken = Boolean(part.broken);
  const isDurabilityBroken = part.durability.current <= 0;
  const [isOpen, setIsOpen] = useState(index === 1);
  const durabilityPercent =
    part.durability.max > 0
      ? Math.max(
          0,
          Math.min(100, (part.durability.current / part.durability.max) * 100),
        )
      : 0;

  function updateDurability(current: number, max = part.durability.max) {
    onChange({
      durability: {
        current: Math.max(0, Math.min(max, current)),
        max,
      },
    });
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[#383430] bg-[#1A1918] transition-colors hover:border-[#4A433C]">
      <div className="flex items-center justify-between gap-3 p-4">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          className="cursor-pointer flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D97867]/25 bg-[#2B1A16] text-[#D97867]">
            <Ham className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-black uppercase tracking-wider text-[#FF9B42]">
              Parte {index + 1}
            </span>
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-[11px] font-bold text-[#F5EFEB]">
                {part.name || "Sem nome"}
              </span>
              {isDurabilityBroken && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#D97867]/40 bg-[#2B1A16] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-[#F0C4A8]">
                  <Bone className="h-3 w-3" />
                  Quebrado
                </span>
              )}
            </div>
          </div>
          <span
            className={`shrink-0 text-[9px] font-bold ${
              isDurabilityBroken ? "text-[#D97867]" : "text-[#7A7065]"
            }`}
          >
            {part.durability.current}/{part.durability.max}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-[#8F877D] transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover parte ${index + 1}`}
          className="rounded-lg p-1.5 text-[#6D655D] transition-colors hover:bg-[#2B1F1C] hover:text-[#D97867]"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4 border-t border-[#302D29] p-4 pt-4">
          <div className="grid gap-3">
            <Field label="Nome" required>
              <input
                value={part.name}
                onChange={(e) => onChange({ name: e.target.value })}
                className={inputClass}
                placeholder="Ex.: PENAS OLEOSAS"
              />
            </Field>
          </div>
          <Field label="Descrição">
            <textarea
              value={part.description ?? ""}
              onChange={(e) =>
                onChange({ description: e.target.value || undefined })
              }
              className={`${inputClass} min-h-20 resize-y`}
            />
          </Field>

          <section className="rounded-xl border border-[#D97867]/25 bg-[#2B1A16]/30 p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D97867]/25 bg-[#2B1A16] text-[#D97867]">
                  <HeartPulse className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-[#F5EFEB]">
                    Durabilidade
                  </p>
                  <p className="text-[9px] text-[#8F877D]">
                    Resistência desta Parte durante a Caçada.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-baseline gap-1">
                <span className="text-lg font-black leading-none text-[#F5EFEB]">
                  {part.durability.current}
                </span>
                <span className="text-xs font-bold text-[#7A7065]">/</span>
                <input
                  type="number"
                  min={1}
                  value={part.durability.max}
                  onChange={(e) => {
                    const max = Math.max(1, Number(e.target.value));
                    updateDurability(part.durability.current, max);
                  }}
                  aria-label={`Durabilidade máxima de ${part.name || `Parte ${index + 1}`}`}
                  className="w-10 appearance-none border-none bg-transparent p-0 text-xs font-bold text-[#7A7065] outline-none focus:text-[#B0A497]"
                />
                <span className="text-xs font-bold text-[#7A7065]">MAX</span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={part.durability.max}
              value={part.durability.current}
              onChange={(e) => updateDurability(Number(e.target.value))}
              aria-label={`Durabilidade atual de ${part.name || `Parte ${index + 1}`}`}
              className="part-durability-slider block h-3 w-full cursor-pointer appearance-none rounded-full bg-[#2B2825] outline-none"
              style={{
                background: `linear-gradient(to right, #9B2C2C 0%, #D97867 ${durabilityPercent}%, #2B2825 ${durabilityPercent}%, #2B2825 100%)`,
              }}
            />
            <div className="mt-3 grid grid-cols-5 gap-1.5">
              {[-5, -1, 0, 1, 5].map((amount) =>
                amount === 0 ? (
                  <input
                    key={amount}
                    type="number"
                    min={0}
                    max={part.durability.max}
                    value={part.durability.current}
                    onChange={(e) => updateDurability(Number(e.target.value))}
                    aria-label={`Valor atual de ${part.name || `Parte ${index + 1}`}`}
                    className="min-w-0 rounded-lg bg-[#211F1D] px-1 py-1.5 text-center text-sm font-black text-[#E8E0D6] outline-none"
                  />
                ) : (
                  <button
                    key={amount}
                    type="button"
                    onClick={() =>
                      updateDurability(part.durability.current + amount)
                    }
                    className="flex items-center justify-center rounded-lg border border-[#383430] bg-[#242220] px-2 py-1.5 text-[10px] font-black text-[#D8CFC4] transition-colors hover:border-[#D97867] hover:text-[#F0C4A8]"
                  >
                    {amount === -1 ? (
                      <Minus className="h-3 w-3" />
                    ) : amount === 1 ? (
                      <Plus className="h-3 w-3" />
                    ) : amount > 0 ? (
                      `+${amount}`
                    ) : (
                      amount
                    )}
                  </button>
                ),
              )}
            </div>
            <style>{`.part-durability-slider::-webkit-slider-runnable-track{height:12px;border-radius:9999px;background:transparent}.part-durability-slider::-moz-range-track{height:12px;border-radius:9999px;background:transparent}.part-durability-slider::-webkit-slider-thumb{appearance:none;width:20px;height:20px;margin-top:-4px;border-radius:9999px;border:3px solid #171514;background:#F2E9DE;box-shadow:0 3px 8px rgba(0,0,0,.35)}.part-durability-slider::-moz-range-thumb{width:20px;height:20px;border-radius:9999px;border:3px solid #171514;background:#F2E9DE;box-shadow:0 3px 8px rgba(0,0,0,.35)}`}</style>
          </section>

          <section
            className={`rounded-xl border p-3 transition-colors ${hasAttack ? "border-[#89B5F7]/35 bg-[#13335C]/20" : "border-[#302D29] bg-[#171615]"}`}
          >
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-[#D8CFC4]">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg border ${hasAttack ? "border-[#89B5F7]/30 bg-[#13335C]/60 text-[#89B5F7]" : "border-[#383430] bg-[#1E1D1B] text-[#7A7065]"}`}
                >
                  <Swords className="h-3.5 w-3.5" />
                </span>
                Ataque da Parte
              </span>
              <input
                type="checkbox"
                checked={hasAttack}
                onChange={(e) =>
                  onChange({
                    attack: e.target.checked ? EMPTY_ATTACK : undefined,
                  })
                }
                className="h-4 w-4 accent-[#89B5F7]"
              />
            </label>
            {hasAttack && part.attack && (
              <div className="mt-3 grid gap-3 border-t border-[#89B5F7]/15 pt-3 sm:grid-cols-3">
                <Field label="Alcance">
                  <input
                    type="number"
                    min={0}
                    value={part.attack.range}
                    onChange={(e) =>
                      onChange({
                        attack: {
                          ...part.attack!,
                          range: Number(e.target.value),
                        },
                      })
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Perícia">
                  <select
                    value={part.attack.skill}
                    onChange={(e) =>
                      onChange({
                        attack: {
                          ...part.attack!,
                          skill: e.target.value as SkillKey,
                        },
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
                <Field label="Estilo">
                  <select
                    value={part.attack.style}
                    onChange={(e) =>
                      onChange({
                        attack: {
                          ...part.attack!,
                          style: e.target.value as StyleKey,
                        },
                      })
                    }
                    className={inputClass}
                  >
                    {Object.entries(STYLES).map(([style, meta]) => (
                      <option key={style} value={style}>
                        {meta.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            )}
          </section>

          <section
            className={`rounded-xl border p-3 transition-colors ${hasBroken ? "border-[#D97867]/35 bg-[#2B1A16]/60" : "border-[#302D29] bg-[#171615]"}`}
          >
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-[#D8CFC4]">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg border ${hasBroken ? "border-[#D97867]/30 bg-[#2B1A16] text-[#D97867]" : "border-[#383430] bg-[#1E1D1B] text-[#7A7065]"}`}
                >
                  <Bone className="h-3.5 w-3.5" />
                </span>
                Estado Quebrado
              </span>
              <input
                type="checkbox"
                checked={hasBroken}
                onChange={(e) =>
                  onChange({
                    broken: e.target.checked
                      ? {
                          description: "",
                          passiveEffect: undefined,
                          attack: undefined,
                        }
                      : undefined,
                  })
                }
                className="h-4 w-4 accent-[#D97867]"
              />
            </label>
            {hasBroken && part.broken && (
              <div className="mt-3 space-y-3 border-t border-[#D97867]/15 pt-3">
                <Field label="Descrição quando quebrada" required>
                  <textarea
                    value={part.broken.description}
                    onChange={(e) =>
                      onChange({
                        broken: {
                          ...part.broken!,
                          description: e.target.value,
                        },
                      })
                    }
                    className={`${inputClass} min-h-16 resize-y`}
                  />
                </Field>
                <Field label="Efeito passivo quando quebrada" hint="Opcional">
                  <input
                    value={part.broken.passiveEffect ?? ""}
                    onChange={(e) =>
                      onChange({
                        broken: {
                          ...part.broken!,
                          passiveEffect: e.target.value || undefined,
                        },
                      })
                    }
                    className={inputClass}
                  />
                </Field>
              </div>
            )}
          </section>
        </div>
      )}
    </article>
  );
}
