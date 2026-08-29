import { useState } from "react";
import { Search } from "lucide-react";
import type {
  ID,
  ITechniqueDefinition,
  ITechniqueState,
} from "../../types/types";
import { inputClass } from "../creation/FormControls";

const LEVEL_BADGE: Record<ITechniqueDefinition["level"], string> = {
  Iniciante: "text-[#5FA88A] border-[#5FA88A]/40 bg-[#5FA88A]/10",
  Intermediária: "text-[#89B5F7] border-[#2B6CB0]/40 bg-[#13335C]/20",
  Avançada: "text-[#FF9B42] border-[#FF9B42]/40 bg-[#3A2A17]",
};

interface TechniquePickerProps {
  allTechniques: ITechniqueDefinition[];
  known: ITechniqueState[];
  onToggle: (techniqueId: ID) => void;
}

export function TechniquePicker({
  allTechniques,
  known,
  onToggle,
}: TechniquePickerProps) {
  const [query, setQuery] = useState("");

  const filtered = allTechniques.filter((technique) =>
    technique.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 text-[#7A7065] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar Técnica..."
          className={`${inputClass} pl-8 py-2 text-xs`}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
        {filtered.map((technique) => {
          const isKnown = known.some((t) => t.techniqueId === technique.id);
          return (
            <button
              key={technique.id}
              type="button"
              onClick={() => onToggle(technique.id)}
              className={`text-left rounded-xl border p-3 transition-colors ${
                isKnown
                  ? "border-[#FF9B42] bg-[#2B2216]"
                  : "border-[#383430] bg-[#1E1D1B] hover:border-[#4D4741]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-[#F5EFEB]">
                  {technique.name}
                </span>
                <span
                  className={`shrink-0 text-[8px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded border ${LEVEL_BADGE[technique.level]}`}
                >
                  {technique.level}
                </span>
              </div>
              <p className="text-[10px] text-[#8F877D] mt-1 leading-relaxed line-clamp-2">
                {technique.description}
              </p>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-[11px] text-[#7A7065] py-6">
            Nenhuma Técnica encontrada para "{query}".
          </p>
        )}
      </div>
    </div>
  );
}
