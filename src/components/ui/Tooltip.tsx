import React, { useEffect, useRef, useState } from "react";
import { HelpCircle, X } from "lucide-react";

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
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    transformX: -50,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!buttonRef.current || !tooltipRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    const gap = 8;
    const viewportPadding = 12;

    let left = buttonRect.left + buttonRect.width / 2;
    let transformX = -50;

    const tooltipHalfWidth = tooltipRect.width / 2;

    const idealLeft = left - tooltipHalfWidth;
    const idealRight = left + tooltipHalfWidth;

    // Está ultrapassando a esquerda
    if (idealLeft < viewportPadding) {
      left = viewportPadding;
      transformX = 0;
    }

    // Está ultrapassando a direita
    if (idealRight > window.innerWidth - viewportPadding) {
      left = window.innerWidth - viewportPadding;
      transformX = -100;
    }

    const top = buttonRect.top - tooltipRect.height - gap;

    setPosition({
      top,
      left,
      transformX,
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(updatePosition);

    const handleReposition = () => {
      updatePosition();
    };

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="rounded-full p-0.5 text-[#89B5F7]/70 transition-colors hover:text-[#FF9B42] focus:outline-none"
        title={`Informação: ${title}`}
        aria-label={`Ajuda sobre ${title}`}
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <div
          ref={tooltipRef}
          role="tooltip"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="fixed z-[9999] w-[min(18rem,calc(100vw-24px))] rounded-xl border border-[#3D3833] bg-[#1E1D1B] p-3 text-left text-[#F5EFEB] shadow-xl pointer-events-auto animate-fadeIn"
          style={{
            top: position.top,
            left: position.left,
            transform: `translateX(${position.transformX}%)`,
            filter: "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.35))",
          }}
        >
          {/* Arrow */}
          <div
            className="absolute top-full border-4 border-transparent border-t-[#3D3833]"
            style={{
              left:
                position.transformX === 0
                  ? "16px"
                  : position.transformX === -100
                    ? "calc(100% - 16px)"
                    : "50%",
              transform:
                position.transformX === 0
                  ? "none"
                  : position.transformX === -100
                    ? "none"
                    : "translateX(-50%)",
            }}
          />

          <div className="mb-1.5 flex items-start justify-between gap-2 border-b border-[#33302B] pb-1">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate  text-xs font-black uppercase text-[#89B5F7]">
                {title}
              </span>

              {category && (
                <span className="shrink-0 rounded bg-[#E66826]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FF9B42]">
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
              className="shrink-0 rounded p-0.5 text-[#B0A497] hover:text-[#F5EFEB]"
              aria-label="Fechar tooltip"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          <p className="text-[11px] leading-relaxed text-[#D5CBC1]">
            {description}
          </p>
        </div>
      )}
    </div>
  );
};
