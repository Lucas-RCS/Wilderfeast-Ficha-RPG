import type { MonsterLineage } from "../types/types";

export const formatRelativeTime = (isoString?: string) => {
  if (!isoString) return "Recentemente";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 2) return "Atualizado agora mesmo";
    if (diffMin < 60) return `Atualizado há ${diffMin} min`;
    if (diffHours === 1) return "Atualizado há 1 hora";
    if (diffHours < 24) return `Atualizado há ${diffHours} horas`;
    if (diffDays === 1) return "Atualizado ontem";
    return `Atualizado há ${diffDays} dias`;
  } catch {
    return "Recentemente";
  }
};

export const SPECIALTY_COLOR: Record<
  MonsterLineage,
  {
    bg: string;
    bgStrong: string;
    border: string;
    hoverBorder: string;
    text: string;
    gradient: string;
    hoverBg: string;
    hoverText: string;
  }
> = {
  Açougueiro: {
    bg: "bg-red-500/15",
    bgStrong: "bg-red-500/25",
    border: "border-red-400/30",
    hoverBorder: "hover:border-red-400/50",
    text: "text-red-400",
    gradient: "from-red-950/60",
    hoverBg: "hover:bg-red-500/35",
    hoverText: "hover:text-red-400",
  },

  Amontoeiro: {
    bg: "bg-stone-400/15",
    bgStrong: "bg-stone-400/25",
    border: "border-stone-400/30",
    hoverBorder: "hover:border-stone-400/50",
    text: "text-stone-300",
    gradient: "from-stone-900/60",
    hoverBg: "hover:bg-stone-400/35",
    hoverText: "hover:text-stone-300",
  },

  Churrasqueiro: {
    bg: "bg-orange-500/15",
    bgStrong: "bg-orange-500/25",
    border: "border-orange-400/30",
    hoverBorder: "hover:border-orange-400/50",
    text: "text-orange-400",
    gradient: "from-orange-950/60",
    hoverBg: "hover:bg-orange-500/35",
    hoverText: "hover:text-orange-400",
  },

  Jardineiro: {
    bg: "bg-emerald-500/15",
    bgStrong: "bg-emerald-500/25",
    border: "border-emerald-400/30",
    hoverBorder: "hover:border-emerald-400/50",
    text: "text-emerald-400",
    gradient: "from-emerald-950/60",
    hoverBg: "hover:bg-emerald-500/35",
    hoverText: "hover:text-emerald-400",
  },

  Molheiro: {
    bg: "bg-sky-500/15",
    bgStrong: "bg-sky-500/25",
    border: "border-sky-400/30",
    hoverBorder: "hover:border-sky-400/50",
    text: "text-sky-400",
    gradient: "from-sky-950/60",
    hoverBg: "hover:bg-sky-500/35",
    hoverText: "hover:text-sky-400",
  },

  Padeiro: {
    bg: "bg-amber-500/15",
    bgStrong: "bg-amber-500/25",
    border: "border-amber-400/30",
    hoverBorder: "hover:border-amber-400/50",
    text: "text-amber-400",
    gradient: "from-amber-950/60",
    hoverBg: "hover:bg-amber-500/35",
    hoverText: "hover:text-amber-400",
  },

  Peixeiro: {
    bg: "bg-cyan-500/15",
    bgStrong: "bg-cyan-500/25",
    border: "border-cyan-400/30",
    hoverBorder: "hover:border-cyan-400/50",
    text: "text-cyan-400",
    gradient: "from-cyan-950/60",
    hoverBg: "hover:bg-cyan-500/35",
    hoverText: "hover:text-cyan-400",
  },

  Pivoteiro: {
    bg: "bg-violet-500/15",
    bgStrong: "bg-violet-500/25",
    border: "border-violet-400/30",
    hoverBorder: "hover:border-violet-400/50",
    text: "text-violet-400",
    gradient: "from-violet-950/60",
    hoverBg: "hover:bg-violet-500/35",
    hoverText: "hover:text-violet-400",
  },
};
