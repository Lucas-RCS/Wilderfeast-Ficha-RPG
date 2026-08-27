import React, { useState } from "react";
import { HelpCircle, X, BookOpen } from "lucide-react";

interface InfoTooltipProps {
  title: string;
  description: string;
  category?: string;
  onOpenCompendium?: () => void;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  title,
  description,
  category,
  onOpenCompendium,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-[#173F73]/70 hover:text-[#FF9B42] transition-colors p-0.5 rounded-full hover:bg-[#33302B] focus:outline-none"
        title={`Informação: ${title}`}
        aria-label={`Ajuda sobre ${title}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 sm:w-72 p-3 bg-[#1E1D1B] text-[#F5EFEB] rounded-xl border border-[#3D3833] shadow-xl text-left pointer-events-auto animate-fadeIn"
          style={{ filter: "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.35))" }}
        >
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-[#3D3833]" />

          <div className="flex items-start justify-between gap-2 mb-1.5 pb-1 border-b border-[#33302B]">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-serif font-black text-xs uppercase text-[#89B5F7] truncate">
                {title}
              </span>
              {category && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#FF9B42] bg-[#E66826]/20 px-1.5 py-0.5 rounded shrink-0">
                  {category}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-[#B0A497] hover:text-[#F5EFEB] p-0.5 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <p className="text-[11px] text-[#D5CBC1] leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  );
};
