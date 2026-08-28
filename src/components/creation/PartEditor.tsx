import { Trash2 } from "lucide-react";
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

  return (
    <div className="rounded-2xl bg-[#1A1918] border border-[#383430] p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#FF9B42]">
          Parte {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-lg text-[#B0645A] hover:text-white hover:bg-[#5C2B26] transition-colors"
          title="Remover parte"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="Nome" required>
          <input
            value={part.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className={inputClass}
            placeholder="Ex.: PENAS OLEOSAS"
          />
        </Field>
        <Field label="Durabilidade máxima">
          <input
            type="number"
            min={1}
            value={part.durability.max}
            onChange={(e) => {
              const max = Math.max(1, Number(e.target.value));
              onChange({ durability: { current: max, max } });
            }}
            className={inputClass}
          />
        </Field>
        <Field label="Efeito passivo" hint="Opcional">
          <input
            value={part.passiveEffect ?? ""}
            onChange={(e) =>
              onChange({ passiveEffect: e.target.value || undefined })
            }
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Descrição" hint="Opcional">
        <textarea
          value={part.description ?? ""}
          onChange={(e) =>
            onChange({ description: e.target.value || undefined })
          }
          className={`${inputClass} min-h-20 resize-y`}
        />
      </Field>

      {/* ATAQUE */}
      <div className="rounded-xl border border-[#302D29] bg-[#171615] p-3">
        <label className="flex items-center gap-2 text-[11px] font-bold text-[#B0A497] mb-3">
          <input
            type="checkbox"
            checked={hasAttack}
            onChange={(e) =>
              onChange({ attack: e.target.checked ? EMPTY_ATTACK : undefined })
            }
            className="accent-[#FF9B42]"
          />
          Esta Parte ataca
        </label>
        {hasAttack && part.attack && (
          <div className="grid sm:grid-cols-3 gap-3">
            <Field label="Alcance">
              <input
                type="number"
                min={0}
                value={part.attack.range}
                onChange={(e) =>
                  onChange({
                    attack: { ...part.attack!, range: Number(e.target.value) },
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
      </div>

      {/* ESTADO QUEBRADO */}
      <div className="rounded-xl border border-[#302D29] bg-[#171615] p-3">
        <label className="flex items-center gap-2 text-[11px] font-bold text-[#B0A497] mb-3">
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
            className="accent-[#FF9B42]"
          />
          Definir efeito de Parte quebrada
        </label>
        {hasBroken && part.broken && (
          <div className="space-y-3">
            <Field label="Descrição quando quebrada" required>
              <textarea
                value={part.broken.description}
                onChange={(e) =>
                  onChange({
                    broken: { ...part.broken!, description: e.target.value },
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
      </div>
    </div>
  );
}
