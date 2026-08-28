import { useState } from "react";
import { Search } from "lucide-react";
import type {
  IConditionDefinition,
  IConditionState,
  ID,
  ITraitDefinition,
  ITraitState,
} from "../../types/types";
import { inputClass } from "./FormControls";

interface TraitPickerProps {
  title: string;
  hint?: string;
  allTraits: ITraitDefinition[];
  selected: ITraitState[];
  onToggle: (traitId: ID) => void;
  onLevelChange: (traitId: ID, level: number) => void;
}

/** Lista buscável de Traços, com controle de nível para cada item selecionado. */
export function TraitPicker({
  title,
  hint,
  allTraits,
  selected,
  onToggle,
  onLevelChange,
}: TraitPickerProps) {
  const [query, setQuery] = useState("");

  const filtered = allTraits.filter((trait) =>
    trait.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="rounded-2xl bg-[#1A1918] border border-[#383430] p-4">
      <div className="flex items-center justify-between gap-3 mb-1">
        <h4 className="font-serif font-black text-sm text-[#89B5F7]">
          {title}
        </h4>
        <span className="text-[10px] text-[#7A7065]">
          {selected.length} selecionado{selected.length === 1 ? "" : "s"}
        </span>
      </div>
      {hint && <p className="text-[11px] text-[#8F877D] mb-3">{hint}</p>}

      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 text-[#7A7065] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar Traço..."
          className={`${inputClass} pl-8 py-2 text-xs`}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
        {filtered.map((trait) => {
          const state = selected.find((item) => item.traitId === trait.id);
          const isSelected = Boolean(state);
          const maxLevel = trait.maxLevel ?? 1;

          return (
            <div
              key={trait.id}
              className={`rounded-xl border p-3 transition-colors ${
                isSelected
                  ? "border-[#FF9B42] bg-[#2B2216]"
                  : "border-[#383430] bg-[#1E1D1B] hover:border-[#4D4741]"
              }`}
            >
              <button
                type="button"
                onClick={() => onToggle(trait.id)}
                className="w-full text-left"
              >
                <p className="text-[11px] font-bold text-[#F5EFEB]">
                  {trait.name}
                </p>
                <p className="text-[10px] text-[#8F877D] mt-1 leading-relaxed line-clamp-2">
                  {trait.description}
                </p>
              </button>

              {isSelected && maxLevel > 1 && (
                <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-[#302D29]">
                  <span className="text-[9px] uppercase font-black text-[#7A7065]">
                    Nível
                  </span>
                  <select
                    value={state?.level ?? 1}
                    onChange={(e) =>
                      onLevelChange(trait.id, Number(e.target.value))
                    }
                    className="flex-1 rounded-lg bg-[#171615] border border-[#383430] px-2 py-1 text-[11px] text-[#F5EFEB] outline-none focus:border-[#FF9B42]"
                  >
                    {Array.from(
                      { length: maxLevel },
                      (_, index) => index + 1,
                    ).map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-[11px] text-[#7A7065] py-6">
            Nenhum Traço encontrado para "{query}".
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// CONDITION PICKER — mesma experiência do TraitPicker, para Condições
// ============================================================================

interface ConditionPickerProps {
  title: string;
  hint?: string;
  allConditions: IConditionDefinition[];
  selected: IConditionState[];
  onToggle: (conditionId: ID) => void;
  onLevelChange: (conditionId: ID, level: number) => void;
}

export function ConditionPicker({
  title,
  hint,
  allConditions,
  selected,
  onToggle,
  onLevelChange,
}: ConditionPickerProps) {
  const [query, setQuery] = useState("");

  const filtered = allConditions.filter((condition) =>
    condition.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="rounded-2xl bg-[#1A1918] border border-[#383430] p-4">
      <div className="flex items-center justify-between gap-3 mb-1">
        <h4 className="font-serif font-black text-sm text-[#89B5F7]">
          {title}
        </h4>
        <span className="text-[10px] text-[#7A7065]">
          {selected.length} selecionada{selected.length === 1 ? "" : "s"}
        </span>
      </div>
      {hint && <p className="text-[11px] text-[#8F877D] mb-3">{hint}</p>}

      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 text-[#7A7065] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar Condição..."
          className={`${inputClass} pl-8 py-2 text-xs`}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
        {filtered.map((condition) => {
          const state = selected.find(
            (item) => item.conditionId === condition.id,
          );
          const isSelected = Boolean(state);
          const maxLevel = condition.maxLevel ?? 1;

          return (
            <div
              key={condition.id}
              className={`rounded-xl border p-3 transition-colors ${
                isSelected
                  ? "border-[#FF9B42] bg-[#2B2216]"
                  : "border-[#383430] bg-[#1E1D1B] hover:border-[#4D4741]"
              }`}
            >
              <button
                type="button"
                onClick={() => onToggle(condition.id)}
                className="w-full text-left"
              >
                <p className="text-[11px] font-bold text-[#F5EFEB]">
                  {condition.name}
                </p>
                <p className="text-[10px] text-[#8F877D] mt-1 leading-relaxed line-clamp-2">
                  {condition.description}
                </p>
              </button>

              {isSelected && maxLevel > 1 && (
                <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-[#302D29]">
                  <span className="text-[9px] uppercase font-black text-[#7A7065]">
                    Nível
                  </span>
                  <select
                    value={state?.level ?? 1}
                    onChange={(e) =>
                      onLevelChange(condition.id, Number(e.target.value))
                    }
                    className="flex-1 rounded-lg bg-[#171615] border border-[#383430] px-2 py-1 text-[11px] text-[#F5EFEB] outline-none focus:border-[#FF9B42]"
                  >
                    {Array.from(
                      { length: maxLevel },
                      (_, index) => index + 1,
                    ).map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-[11px] text-[#7A7065] py-6">
            Nenhuma Condição encontrada para "{query}".
          </p>
        )}
      </div>
    </div>
  );
}
