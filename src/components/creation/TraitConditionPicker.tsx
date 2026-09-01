import { useState } from "react";
import { Check, Minus, Plus, Search } from "lucide-react";
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
    <div className="rounded-2xl border border-[#383430] bg-[#1A1918] p-4">
      <div className="flex items-center justify-between gap-3 mb-1">
        <h4 className=" font-black text-sm text-[#89B5F7]">{title}</h4>
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
              className={`group relative overflow-hidden rounded-xl border p-3 transition-colors ${
                isSelected
                  ? "border-[#2E6F63]/60 bg-[#153029]/60"
                  : "border-[#383430] bg-[#1E1D1B] hover:border-[#4A433C] hover:bg-[#211F1D]"
              }`}
            >
              {isSelected && (
                <span className="absolute inset-y-0 left-0 w-0.5 bg-[#6FCF97]" />
              )}
              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  onClick={() => onToggle(trait.id)}
                  aria-label={
                    isSelected
                      ? `Remover ${trait.name}`
                      : `Adicionar ${trait.name}`
                  }
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${isSelected ? "border-[#2E6F63]/50 bg-[#2E6F63]/20 text-[#6FCF97]" : "border-[#383430] bg-[#171615] text-transparent group-hover:border-[#6FCF97]/40"}`}
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(trait.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="text-[11px] font-black text-[#F5EFEB]">
                    {trait.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-[#8F877D]">
                    {trait.description}
                  </p>
                </button>
              </div>

              {isSelected && maxLevel > 1 && (
                <div className="mt-2.5 flex items-center justify-between border-t border-[#2E6F63]/20 pt-2.5">
                  <span className="text-[9px] uppercase font-black text-[#7A7065]">
                    Nível
                  </span>
                  <div className="flex items-center gap-0.5 rounded-lg border border-[#2E6F63]/30 bg-[#171615] p-0.5">
                    <button
                      type="button"
                      disabled={(state?.level ?? 1) <= 1}
                      onClick={() =>
                        onLevelChange(
                          trait.id,
                          Math.max(1, (state?.level ?? 1) - 1),
                        )
                      }
                      className="flex h-5 w-5 items-center justify-center rounded-md text-[#81776E] hover:bg-[#242220] hover:text-[#F0C4A8] disabled:pointer-events-none disabled:opacity-25"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-[22px] text-center text-[9px] font-black text-[#6FCF97]">
                      {state?.level ?? 1}
                    </span>
                    <button
                      type="button"
                      disabled={(state?.level ?? 1) >= maxLevel}
                      onClick={() =>
                        onLevelChange(
                          trait.id,
                          Math.min(maxLevel, (state?.level ?? 1) + 1),
                        )
                      }
                      className="flex h-5 w-5 items-center justify-center rounded-md text-[#81776E] hover:bg-[#242220] hover:text-[#6FCF97] disabled:pointer-events-none disabled:opacity-25"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
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
        <h4 className=" font-black text-sm text-[#89B5F7]">{title}</h4>
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
              className={`group relative overflow-hidden rounded-xl border p-3 transition-colors ${
                isSelected
                  ? "border-[#D97867]/60 bg-[#2B1A16]/70"
                  : "border-[#383430] bg-[#1E1D1B] hover:border-[#4A433C] hover:bg-[#211F1D]"
              }`}
            >
              {isSelected && (
                <span className="absolute inset-y-0 left-0 w-0.5 bg-[#D97867]" />
              )}
              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  onClick={() => onToggle(condition.id)}
                  aria-label={
                    isSelected
                      ? `Remover ${condition.name}`
                      : `Adicionar ${condition.name}`
                  }
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${isSelected ? "border-[#D97867]/50 bg-[#D97867]/15 text-[#F0C4A8]" : "border-[#383430] bg-[#171615] text-transparent group-hover:border-[#D97867]/40"}`}
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(condition.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="text-[11px] font-black text-[#F5EFEB]">
                    {condition.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-[#8F877D]">
                    {condition.description}
                  </p>
                </button>
              </div>

              {isSelected && maxLevel > 1 && (
                <div className="mt-2.5 flex items-center justify-between border-t border-[#D97867]/20 pt-2.5">
                  <span className="text-[9px] uppercase font-black text-[#7A7065]">
                    Nível
                  </span>
                  <div className="flex items-center gap-0.5 rounded-lg border border-[#D97867]/30 bg-[#171615] p-0.5">
                    <button
                      type="button"
                      disabled={(state?.level ?? 1) <= 1}
                      onClick={() =>
                        onLevelChange(
                          condition.id,
                          Math.max(1, (state?.level ?? 1) - 1),
                        )
                      }
                      className="flex h-5 w-5 items-center justify-center rounded-md text-[#81776E] hover:bg-[#38251F] hover:text-[#F0C4A8] disabled:pointer-events-none disabled:opacity-25"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-[22px] text-center text-[9px] font-black text-[#F0C4A8]">
                      {state?.level ?? 1}
                    </span>
                    <button
                      type="button"
                      disabled={(state?.level ?? 1) >= maxLevel}
                      onClick={() =>
                        onLevelChange(
                          condition.id,
                          Math.min(maxLevel, (state?.level ?? 1) + 1),
                        )
                      }
                      className="flex h-5 w-5 items-center justify-center rounded-md text-[#81776E] hover:bg-[#38251F] hover:text-[#F0C4A8] disabled:pointer-events-none disabled:opacity-25"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
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
