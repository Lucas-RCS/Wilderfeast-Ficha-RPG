import { ArrowRight, Clock, Copy, Edit3, PawPrint, Trash2 } from "lucide-react";

import { formatRelativeTime } from "../../hooks/useUtils";
import type { ICreatureCard, ID } from "../../types/types";
import type { DeleteTarget, RenameHandler } from "../../types/cardTypes";

interface CardCreatureProps {
  data: ICreatureCard;
  handleOpenRename: RenameHandler;
  onDuplicateCreature: (id: ID) => void;
  setDeleteTarget: (target: DeleteTarget) => void;
  onOpenCreature: (id: ID) => void;
}

export function CardCreature({
  data,
  handleOpenRename,
  onDuplicateCreature,
  onOpenCreature,
  setDeleteTarget,
}: CardCreatureProps) {
  return (
    <div
      className="
        group
        overflow-hidden
        rounded-2xl
        border border-[#3A2323]
        bg-[#161211]
        shadow-sm
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-[#5A3535]
        hover:shadow-lg hover:shadow-black/20
      "
    >
      {/* Avatar / capa */}
      <div className="relative h-36 overflow-hidden bg-[#201A19]">
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
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <PawPrint className="h-10 w-10 text-[#8A4A4A]" />
          </div>
        )}

        {/* Badge de estágio */}
        <div
          className="
            absolute left-2 top-2
            flex items-center gap-1
            rounded-full
            bg-black/70
            px-2 py-0.5
            backdrop-blur-sm
          "
        >
          <PawPrint className="h-2.5 w-2.5 text-[#FC8181]" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-white">
            Estágio {data.stage}
          </span>
        </div>

        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-[#1a0d0d]/95
            via-black/10
            to-transparent
          "
        />

        {/* Identidade */}
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
              group-hover:text-[#FF9B42]
              line-clamp-1
            "
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
        {/* Descrição — não existia no card original, mas o tipo já a exigia */}
        <p className="text-[11px] leading-relaxed text-[#A79E93] line-clamp-2 min-h-[2.2em]">
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
              onClick={() => handleOpenRename(data.id, data.name, "creature")}
              className="
                rounded-lg
                p-1.5
                text-[#B0A497]
                transition-all
                hover:bg-[#242220]
                hover:text-[#FF9B42]
                cursor-pointer
              "
              title="Renomear Criatura"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onDuplicateCreature(data.id)}
              className="
                rounded-lg
                p-1.5
                text-[#B0A497]
                transition-all
                hover:bg-[#242220]
                hover:text-[#FF9B42]
                cursor-pointer
              "
              title="Duplicar Monstro"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() =>
                setDeleteTarget({
                  id: data.id,
                  name: data.name,
                  type: "creature",
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
              title="Excluir Criatura"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenCreature(data.id)}
            className="
              flex
              items-center
              gap-1
              rounded-lg
              border border-[#9B2C2C]/40
              bg-[#4A1F1F]
              px-3
              py-1.5
              text-[11px]
              font-bold
              text-white
              shadow-sm
              transition-all
              hover:bg-[#5C2626]
              hover:border-[#C9524F]/50
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
