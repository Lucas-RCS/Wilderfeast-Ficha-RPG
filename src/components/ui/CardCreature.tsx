import { ArrowRight, Clock, Copy, PawPrint, Trash2 } from "lucide-react";

import { formatRelativeTime, SPECIALTY_COLOR } from "../../hooks/useUtils";
import type { ICreatureCard, ID, MonsterLineage } from "../../types/types";
import type { DeleteTarget } from "../../types/cardTypes";

interface CardCreatureProps {
  data: ICreatureCard;
  onDuplicateCreature: (id: ID) => void;
  setDeleteTarget: (target: DeleteTarget) => void;
  onOpenCreature: (id: ID) => void;
}

export function CardCreature({
  data,
  onDuplicateCreature,
  onOpenCreature,
  setDeleteTarget,
}: CardCreatureProps) {
  const lineage = data.lineage as MonsterLineage;
  const colors = SPECIALTY_COLOR[lineage];

  return (
    <div
      className={`
        group
        overflow-hidden
        rounded-2xl
        border
        ${colors.border}
        bg-[#161211]
        transition-[transform,border-color,box-shadow]
        duration-300
        ease-out
        hover:-translate-y-[2px]
        ${colors.hoverBorder}
      `}
    >
      {/* Avatar / capa */}
      <div className={`relative h-36 overflow-hidden ${colors.bg}`}>
        {data.avatarUrl ? (
          <img
            src={data.avatarUrl}
            alt={data.name || "Criatura"}
            className="
              h-full
              w-full
              object-cover
              grayscale-[15%]
              transition-transform
              duration-500
              ease-out
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <PawPrint className={`h-10 w-10 ${colors.text}`} />
          </div>
        )}

        {/* Badge de estágio */}
        <div
          className={`
            absolute left-2 top-2
            flex items-center gap-1
            rounded-full
            border
            ${colors.border}
            ${colors.bgStrong}
            px-2 py-0.5
            backdrop-blur-sm
          `}
        >
          <PawPrint className={`h-2.5 w-2.5 ${colors.text}`} />
          <span className="text-[9px] font-bold uppercase tracking-wider text-white">
            Estágio {data.stage}
          </span>
        </div>

        {/* Gradiente da lineage */}
        <div
          className={`
            absolute inset-0
            bg-gradient-to-t
            ${colors.gradient}
            via-black/10
            to-transparent
          `}
        />

        {/* Identidade */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3
            className={`
              font-serif
              text-base
              font-bold
              leading-tight
              transition-colors
              duration-200
              ${colors.text}
              line-clamp-1
            `}
          >
            {data.name || "Criatura Sem Nome"}
          </h3>

          <span className="mt-0.5 block text-[11px] font-semibold text-white/60">
            {data.lineage || "Linhagem desconhecida"}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-3">
        <p className="min-h-[2.2em] line-clamp-2 text-[11px] leading-relaxed text-[#A79E93]">
          {data.description || "Sem descrição registrada."}
        </p>

        <div className="mt-2.5 flex items-center text-[10px] text-[#8C847A]">
          <Clock className="mr-1 h-3 w-3" />
          <span className="font-mono">
            {formatRelativeTime(data.lastSaved)}
          </span>
        </div>

        {/* Ações */}
        <div className="mt-3 flex items-center justify-between border-t border-[#2B2825] pt-3">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => onDuplicateCreature(data.id)}
              className={`
                cursor-pointer
                rounded-lg
                p-1.5
                text-[#B0A497]
                transition-[background-color,color]
                hover:bg-[#242220]
                ${colors.hoverText}
              `}
              title="Duplicar Monstro"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() =>
                setDeleteTarget({
                  id: data.id,
                  type: "creature",
                })
              }
              className="
                cursor-pointer
                rounded-lg
                p-1.5
                text-[#FC8181]
                transition-[background-color]
                hover:bg-[#9B2C2C]/20
              "
              title="Excluir Criatura"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenCreature(data.id)}
            className={`
              flex
              items-center
              gap-1
              rounded-lg
              border
              ${colors.border}
              ${colors.bgStrong}
              px-3
              py-1.5
              text-[11px]
              font-bold
              text-white
              transition-[background-color,border-color,transform]
              active:scale-95
              cursor-pointer
              ${colors.hoverBg}
              ${colors.hoverBorder}
            `}
          >
            <span>Abrir</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
