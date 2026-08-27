import { formatRelativeTime } from "../hooks/useUtils";

import {
  Clock,
  Copy,
  Edit3,
  Trash2,
  Target,
  Hammer,
  ArrowRight,
} from "lucide-react";

import type { IFeralCard } from "../types";

type SheetType = "feral" | "creature";
type RenameHandler = (id: string, currentName: string, type: SheetType) => void;
type DeleteTarget = { id: string; name: string; type: SheetType };

export function CardFeral({
  data,
  onOpenFeral,
  onDuplicateFeral,
  handleOpenRename,
  setDeleteTarget,
}: {
  data: IFeralCard;
  onOpenFeral: (id: string) => void;
  onDuplicateFeral: (id: string) => void;
  handleOpenRename: RenameHandler;
  setDeleteTarget: (target: DeleteTarget) => void;
}) {
  return (
    <div
      key={data.id}
      className="
        group
        overflow-hidden
        rounded-2xl
        border border-[#2B2825]
        bg-[#111110]
        shadow-sm
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-[#3A362F]
        hover:shadow-lg hover:shadow-black/20
      "
    >
      {/* avatarUrl */}
      <div className="relative h-36 overflow-hidden bg-[#1A1918]">
        {data.avatarUrl ? (
          <img
            src={data.avatarUrl}
            alt={data.name || "Feral"}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-serif text-4xl font-black text-[#89B5F7]">
              {data.name ? data.name.split(" ")[0] : "..."}
            </span>
          </div>
        )}

        {/* Overlay */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-black/85
            via-black/5
            to-transparent
          "
        />

        {/* Character information */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3
            className="
              font-serif
              text-base
              font-bold
              leading-tight
              text-white
              transition-colors
              duration-200
              group-hover:text-[#89B5F7]
              line-clamp-1
            "
          >
            {data.name || "Feral Sem Nome"}
          </h3>

          <span className="mt-0.5 block text-[11px] font-medium text-white/65">
            {data.pronouns || "Não informado"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="grid grid-cols-2 gap-1.5">
          {/* Specialty */}
          <div
            className="
              flex items-center gap-2
              rounded-lg
              border border-[#2B6CB0]/40
              bg-[#13335C]/20
              px-2 py-2
              transition-colors
              group-hover:border-[#2B6CB0]/60
            "
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#2B6CB0]/50 bg-[#13335C]/30">
              <Target className="h-3 w-3 text-[#89B5F7]" />
            </span>
            <div className="min-w-0">
              <span className="block text-[8px] font-bold uppercase tracking-wider text-[#89B5F7]">
                Especialidade
              </span>
              <span className="block truncate text-[11px] font-bold text-white">
                {data.specialty || "—"}
              </span>
            </div>
          </div>

          {/* Utensil */}
          <div
            className="
              flex items-center gap-2
              rounded-lg
              border border-[#383430]
              bg-[#1A1918]
              px-2 py-2
              transition-colors
              group-hover:border-[#45403B]
            "
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#FF9B42]/40 bg-[#3A2A17]">
              <Hammer className="h-3 w-3 text-[#FF9B42]" />
            </span>
            <div className="min-w-0">
              <span className="block text-[8px] font-bold uppercase tracking-wider text-[#FF9B42]">
                Utensílio
              </span>
              <span className="block truncate text-[11px] font-bold text-white">
                {data.utensil || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Last saved */}
        <div className="mt-2.5 flex items-center text-[10px] text-[#8C847A]">
          <Clock className="mr-1 h-3 w-3" />
          <span className="font-mono">
            {formatRelativeTime(data.lastSaved)}
          </span>
        </div>

        <div className="my-1 flex items-center gap-2">
          <div className="h-px flex-1 bg-[#2B2825]" />
          <span className="text-[#4D4741]">✦</span>
          <div className="h-px flex-1 bg-[#2B2825]" />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {/* Rename */}
            <button
              type="button"
              onClick={() => handleOpenRename(data.id, data.name, "feral")}
              className="
                rounded-lg
                p-1.5
                text-[#B0A497]
                transition-all
                hover:bg-[#242220]
                hover:text-[#89B5F7]
                cursor-pointer
              "
              title="Renomear Feral"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>

            {/* Duplicate */}
            <button
              type="button"
              onClick={() => onDuplicateFeral(data.id)}
              className="
                rounded-lg
                p-1.5
                text-[#B0A497]
                transition-all
                hover:bg-[#242220]
                hover:text-[#89B5F7]
                cursor-pointer
              "
              title="Duplicar Ficha"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={() =>
                setDeleteTarget({
                  id: data.id,
                  name: data.name,
                  type: "feral",
                })
              }
              className="
                rounded-lg
                p-1.5
                text-[#FC8181]
                transition-all
                hover:bg-[#9B2C2C]/20
                cursor-pointer
              "
              title="Excluir Ficha"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Open */}
          <button
            type="button"
            onClick={() => onOpenFeral(data.id)}
            className="
              flex
              items-center
              gap-1
              rounded-lg
              border border-[#2B6CB0]/40
              bg-[#13335C]
              px-3
              py-1.5
              text-[11px]
              font-bold
              text-white
              shadow-sm
              transition-all
              hover:bg-[#174273]
              hover:border-[#3A7FC9]/50
              active:scale-95
              cursor-pointer
            "
          >
            <span>Abrir</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
