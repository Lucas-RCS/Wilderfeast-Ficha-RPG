import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BookOpen,
  ChevronDown,
  Dna,
  FileText,
  Search,
  Sparkles,
  X,
  Utensils,
  Users,
  PawPrint,
  Heart,
  Route,
  Beef,
  Wheat,
  Flame,
  Fish,
  Sprout,
  Droplets,
  Layers,
  MapPin,
  Ruler,
  Shield,
  Target,
  ListOrdered,
  AlertTriangle,
} from "lucide-react";

import {
  STYLES,
  SKILLS,
  utensilDefinitions,
  conditionDefinitions,
  techniqueDefinitions,
  traitDefinitions,
  specialtyDefinitions,
  creatureDefinitions,
  traitsById,
  creaturesById,
} from "../../data/wilderfeastData";

import type {
  ICreature,
  IConditionDefinition,
  ISpecialtyDefinition,
  ITechniqueDefinition,
  ITraitDefinition,
  IUtensilDefinition,
  SpecialtyKey,
} from "../../types/types";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type RuleTab =
  | "regras"
  | "utensilios"
  | "especialidades"
  | "tecnicas"
  | "tracos"
  | "condicoes"
  | "criaturas";

interface TabDefinition {
  id: RuleTab;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TABS: TabDefinition[] = [
  {
    id: "regras",
    label: "Regras Básicas",
    icon: <FileText className="h-4 w-4" />,
    description: "Fundamentos do jogo",
  },
  {
    id: "utensilios",
    label: "Utensílios",
    icon: <Utensils className="h-4 w-4" />,
    description: "Equipamentos",
  },
  {
    id: "especialidades",
    label: "Especialidades",
    icon: <Users className="h-4 w-4" />,
    description: "Especializações dos ferais",
  },
  {
    id: "tecnicas",
    label: "Técnicas",
    icon: <Sparkles className="h-4 w-4" />,
    description: "Técnicas dos utensílios",
  },
  {
    id: "tracos",
    label: "Traços",
    icon: <Dna className="h-4 w-4" />,
    description: "Traços e mutações",
  },
  {
    id: "condicoes",
    label: "Condições",
    icon: <Activity className="h-4 w-4" />,
    description: "Estados e efeitos",
  },
  {
    id: "criaturas",
    label: "Criaturas",
    icon: <PawPrint className="h-4 w-4" />,
    description: "Bestiário",
  },
];

const TEST_STEPS = [
  {
    title: "Declare a Ação",
    description:
      "O jogador descreve o que seu feral está tentando fazer na ficção.",
  },
  {
    title: "Escolha o Estilo (Pilha de d6)",
    description:
      "O estilo determina quantos dados de 6 faces você rola (de 1 a 5).",
  },
  {
    title: "Escolha a Habilidade (Bônus +0 a +3)",
    description:
      "Se aplicável, a Habilidade adiciona seu valor como bônus fixo.",
  },
  {
    title: "Role o Dado de Ação [A]",
    description:
      "Role 1d8 (ou 1d20 em Frenesi / Chamado Selvagem). Ele define o dano ou alcance de efeito.",
  },
  {
    title: "Avalie os Sucessos",
    description:
      "Qualquer d6 que tire 5 ou 6 é 1 Sucesso. Se a soma de (Bônus da Habilidade + Sucessos) for suficiente, você tem êxito!",
  },
  {
    title: "Gaste Sucessos Extras",
    description:
      "Use sucessos a mais para ativar BRIO (+1 ponto no dado de ação [A]), TINO (estabelecer detalhe) ou ativar Traços.",
  },
] as const;

const RULE_HIGHLIGHTS = [
  {
    title: "VIGOR, DANO E FERIMENTOS",
    page: "Página 50",
    icon: <Heart className="h-4 w-4" />,
    accent: "text-red-400",
    accentBg: "bg-red-500/10",
    accentBorder: "border-red-500/20",
    description:
      "Quando você sofre dano, subtraia do seu Vigor. Se seu Vigor chegar a 0, você recebe 1 nível de FERIDO e seu Vigor é restaurado ao máximo! Ao atingir Ferido 3, seu Vigor permanece em 0 e você corre sério risco de vida.",
  },
  {
    title: "A TRILHA & O RECESSO",
    page: "Página 58",
    icon: <Route className="h-4 w-4" />,
    accent: "text-teal-300",
    accentBg: "bg-teal-500/10",
    accentBorder: "border-teal-500/20",
    description:
      "A Jornada tem três fases: A Trilha (viagem, forrageamento e pistas), A Caçada (combate visceral contra o criatura frenético) e O Banquete & Recesso (purificação, cozinhar a carne e adquirir novas mutações e técnicas).",
  },
] as const;

const LINEAGE_META: Record<
  SpecialtyKey,
  {
    icon: React.ReactNode;
    text: string;
    bg: string;
    border: string;
  }
> = {
  Açougueiro: {
    icon: <Beef className="h-4 w-4" />,
    text: "text-red-300",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  Amontoeiro: {
    icon: <Layers className="h-4 w-4" />,
    text: "text-stone-300",
    bg: "bg-stone-500/10",
    border: "border-stone-500/20",
  },
  Churrasqueiro: {
    icon: <Flame className="h-4 w-4" />,
    text: "text-orange-300",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  Jardineiro: {
    icon: <Sprout className="h-4 w-4" />,
    text: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  Molheiro: {
    icon: <Droplets className="h-4 w-4" />,
    text: "text-sky-300",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  Padeiro: {
    icon: <Wheat className="h-4 w-4" />,
    text: "text-amber-300",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  Peixeiro: {
    icon: <Fish className="h-4 w-4" />,
    text: "text-cyan-300",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  Pivoteiro: {
    icon: <Dna className="h-4 w-4" />,
    text: "text-violet-300",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
};

const DEFAULT_LINEAGE_META = {
  icon: <PawPrint className="h-4 w-4" />,
  text: "text-zinc-300",
  bg: "bg-zinc-500/10",
  border: "border-zinc-500/20",
};

const getLineageMeta = (lineage: string) =>
  LINEAGE_META[lineage as SpecialtyKey] ?? DEFAULT_LINEAGE_META;

const STYLE_ORDER: Array<keyof ICreature["styles"]> = [
  "ligeiro",
  "poderoso",
  "preciso",
  "sagaz",
];

const SKILL_ORDER: Array<keyof ICreature["skills"]> = [
  "agarrar",
  "armazenar",
  "assegurar",
  "atirar",
  "atravessar",
  "chamar",
  "curar",
  "estudar",
  "exibir",
  "golpear",
  "manufaturar",
  "procurar",
];

const normalizeSearchValue = (value: unknown) =>
  String(value ?? "").toLowerCase();

const matchesSearch = (search: string, ...values: unknown[]) => {
  const query = normalizeSearchValue(search.trim());

  if (!query) return true;

  return values.some((value) => normalizeSearchValue(value).includes(query));
};

const formatCost = (cost?: {
  type: "acoes" | "vigor" | "sucessos";
  amount: number;
  restriction?: string;
}) => {
  if (!cost) return "Passiva";

  const labels = {
    acoes: "Ações",
    vigor: "Vigor",
    sucessos: "Sucessos",
  } as const;

  return `${cost.amount} ${labels[cost.type]}${
    cost.restriction ? ` • ${cost.restriction}` : ""
  }`;
};

const getTraitName = (traitId: number) =>
  traitsById[String(traitId)]?.name ?? `Traço #${traitId}`;

const getCreatureName = (creatureId: number) =>
  creaturesById[String(creatureId)]?.name ?? `Criatura #${creatureId}`;

function InfoCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`rounded-2xl border border-zinc-700 bg-zinc-800/80 p-4 ${className}`}
    >
      {children}
    </article>
  );
}

function EmptyState({ search }: { search: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-700 bg-black/20 px-6 py-12 text-center">
      <p className=" text-sm font-bold text-zinc-200">
        Nenhum resultado encontrado
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        {search
          ? `Não encontramos correspondências para "${search}".`
          : "Não há dados disponíveis nesta seção."}
      </p>
    </div>
  );
}

function TestWalkthrough() {
  return (
    <article className="overflow-hidden rounded-2xl border border-amber-500/20 bg-black/20 p-3 sm:p-3">
      <div className="flex items-center gap-2">
        <span className="rounded-lg bg-amber-500/15 p-1.5 text-amber-300">
          <ListOrdered className="h-4 w-4" />
        </span>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400/80">
          Passo a passo • Página 14
        </p>
      </div>

      <h4 className="mt-2  text-base font-black uppercase tracking-wide text-white sm:text-lg">
        Como funciona o Teste de Wilderfeast
      </h4>
      <p className="mt-1 text-xs text-zinc-400">
        Siga esses passos toda vez que seu feral tentar algo arriscado ou
        incerto.
      </p>

      <ol className="mt-5">
        {TEST_STEPS.map((step, index) => (
          <li key={step.title} className="relative flex gap-4 pb-5 last:pb-0">
            {index < TEST_STEPS.length - 1 && (
              <span
                aria-hidden
                className="absolute left-[15px] top-8 bottom-0 w-px bg-gradient-to-b from-amber-500/40 to-transparent"
              />
            )}
            <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-500/40 bg-[#1C1B18] font-code text-xs font-bold text-amber-500">
              {index + 1}
            </span>
            <div className="min-w-0 pt-1">
              <p className="text-xs font-bold text-zinc-100">{step.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

function RulesTab() {
  return (
    <div className="space-y-6">
      <TestWalkthrough />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {RULE_HIGHLIGHTS.map((rule) => (
          <article
            key={rule.title}
            className={`rounded-2xl border bg-black/20 p-3 ${rule.accentBorder}`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`rounded-lg p-1.5 ${rule.accentBg} ${rule.accent}`}
              >
                {rule.icon}
              </span>
              <div>
                <h4
                  className={` text-xs font-black uppercase tracking-wide ${rule.accent}`}
                >
                  {rule.title}
                </h4>
                <p className="text-[10px] text-zinc-500">{rule.page}</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-300">
              {rule.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function UtensilsTab({ search }: { search: string }) {
  const items = useMemo(
    () =>
      utensilDefinitions.filter((utensil) =>
        matchesSearch(
          search,
          utensil.id,
          utensil.name,
          utensil.brokenDescription,
        ),
      ),
    [search],
  );

  if (!items.length) return <EmptyState search={search} />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {items.map((utensil: IUtensilDefinition) => (
          <InfoCard key={utensil.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-amber-300">
                  {utensil.name}
                </h4>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Utensílio de arkaicaço
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <span className="rounded-lg bg-teal-950 px-2 py-1 font-code text-[10px] font-bold text-teal-300">
                  Alcance {utensil.defaultRange}
                </span>
              </div>
            </div>
          </InfoCard>
        ))}
      </div>
      {items[0]?.brokenDescription && (
        <InfoCard className="border-orange-500/20 bg-orange-500/5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-orange-400">
                Quando quebrado
              </p>

              <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                {items[0].brokenDescription}
              </p>
            </div>
          </div>
        </InfoCard>
      )}
    </div>
  );
}

function TechniquesTab({ search }: { search: string }) {
  const items = useMemo(
    () =>
      techniqueDefinitions.filter((technique) =>
        matchesSearch(
          search,
          technique.id,
          technique.name,
          technique.description,
          technique.level,
          ...(technique.utensils ?? []),
        ),
      ),
    [search],
  );

  if (!items.length) return <EmptyState search={search} />;

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {items.map((technique: ITechniqueDefinition) => (
        <InfoCard key={technique.id}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className=" text-xs font-bold text-amber-300">
                {technique.name}
              </h4>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <span className="rounded-md bg-teal-950 px-2 py-0.5 text-[10px] font-semibold text-teal-300">
                  {technique.level}
                </span>
                <span className="rounded-md bg-orange-950 px-2 py-0.5 text-[10px] font-semibold text-orange-300">
                  {formatCost(technique.cost)}
                </span>
              </div>
            </div>

            {technique.utensils?.length ? (
              <div className="shrink-0 text-right">
                <p className="text-[9px] uppercase tracking-wide text-zinc-500">
                  Utensílio
                </p>
                <p className="text-[10px] font-semibold text-zinc-300">
                  {technique.utensils.join(", ")}
                </p>
              </div>
            ) : null}
          </div>

          <p className="mt-3 text-xs leading-relaxed text-zinc-300">
            {technique.description}
          </p>
        </InfoCard>
      ))}
    </div>
  );
}

function TraitsTab({ search }: { search: string }) {
  const items = useMemo(
    () =>
      traitDefinitions.filter((trait) =>
        matchesSearch(
          search,
          trait.id,
          trait.name,
          trait.description,
          trait.cost?.type,
          trait.cost?.restriction,
          trait.maxLevel,
        ),
      ),
    [search],
  );

  if (!items.length) return <EmptyState search={search} />;

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {items.map((trait: ITraitDefinition) => (
        <InfoCard key={trait.id}>
          <div className="flex items-start justify-between gap-3">
            <h4 className=" text-xs font-bold text-teal-300">{trait.name}</h4>
            <span className="shrink-0 rounded-lg bg-amber-950 px-2 py-1 text-[10px] font-semibold text-amber-300">
              {formatCost(trait.cost)}
            </span>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-zinc-300">
            {trait.description}
          </p>

          {trait.maxLevel != null && (
            <div className="mt-3 border-t border-zinc-700/70 pt-2 text-[10px] font-code text-zinc-500">
              Máximo: {trait.maxLevel}
            </div>
          )}
        </InfoCard>
      ))}
    </div>
  );
}

function ConditionsTab({ search }: { search: string }) {
  const items = useMemo(
    () =>
      conditionDefinitions.filter((condition) =>
        matchesSearch(
          search,
          condition.id,
          condition.name,
          condition.description,
          condition.maxLevel,
        ),
      ),
    [search],
  );

  if (!items.length) return <EmptyState search={search} />;

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {items.map((condition: IConditionDefinition) => (
        <InfoCard key={condition.id}>
          <div className="flex items-start justify-between gap-3">
            <h4 className=" text-xs font-black uppercase text-amber-300">
              {condition.name}
            </h4>

            <span className="shrink-0 font-code text-[10px] text-zinc-500">
              {condition.maxLevel == null
                ? "Sem limite"
                : `Máx. ${condition.maxLevel}`}
            </span>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-zinc-300">
            {condition.description}
          </p>
        </InfoCard>
      ))}
    </div>
  );
}

function SpecialtiesTab({ search }: { search: string }) {
  const items = useMemo(
    () =>
      specialtyDefinitions.filter((specialty) =>
        matchesSearch(
          search,
          specialty.id,
          specialty.name,
          specialty.description,
          ...specialty.firstTraitOptions.map(getTraitName),
          ...(specialty.importantMonsterOptions ?? []).map(getCreatureName),
        ),
      ),
    [search],
  );

  if (!items.length) return <EmptyState search={search} />;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {items.map((specialty: ISpecialtyDefinition) => (
        <InfoCard key={specialty.id}>
          <div className="flex items-start justify-between gap-3">
            <h4 className=" text-sm font-bold text-amber-300">
              {specialty.name}
            </h4>
            <span className="rounded-lg bg-purple-950 px-2 py-1 text-[10px] font-semibold text-purple-300">
              Especialidade
            </span>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-zinc-300">
            {specialty.description}
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-zinc-700/70 pt-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-teal-400">
                Traços iniciais
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {specialty.firstTraitOptions.map((traitId) => (
                  <span
                    key={traitId}
                    className="rounded-lg bg-zinc-900 px-2 py-1 text-[10px] text-zinc-300"
                  >
                    {getTraitName(traitId)}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-orange-400">
                Criaturas importantes
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(specialty.importantMonsterOptions ?? []).map((creatureId) => (
                  <span
                    key={creatureId}
                    className="rounded-lg bg-zinc-900 px-2 py-1 text-[10px] text-zinc-300"
                  >
                    {getCreatureName(creatureId)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </InfoCard>
      ))}
    </div>
  );
}

function StatPips({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, index) => (
        <span
          key={index}
          className={`h-1.5 w-1.5 rounded-full ${
            index < value ? "bg-current" : "bg-current/15"
          }`}
        />
      ))}
    </div>
  );
}

function CreatureStyleGrid({ creature }: { creature: ICreature }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {STYLE_ORDER.map((key) => {
        const value = creature.styles[key];
        return (
          <div
            key={key}
            className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-2.5 py-2"
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wide text-zinc-400">
                {STYLES[key].name}
              </span>
              <span className="font-code text-[10px] font-bold text-amber-300">
                {value}
              </span>
            </div>
            <div className="mt-1.5 text-amber-400">
              <StatPips value={value} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CreatureSkillGrid({ creature }: { creature: ICreature }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
      {SKILL_ORDER.map((key) => {
        const value = creature.skills[key];
        const active = value > 0;
        return (
          <div
            key={key}
            className={`flex items-center justify-between gap-2 rounded-md border px-2 py-1.5 ${
              active
                ? "border-teal-500/25 bg-teal-500/5"
                : "border-zinc-800/70 bg-zinc-950/30"
            }`}
          >
            <span
              className={`truncate text-[9px] font-bold uppercase tracking-wide ${
                active ? "text-teal-300" : "text-zinc-600"
              }`}
            >
              {SKILLS[key].name}
            </span>
            <span
              className={`shrink-0 font-code text-[10px] font-bold ${
                active ? "text-teal-200" : "text-zinc-700"
              }`}
            >
              +{value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function CreatureStatBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
      <div className="flex items-center gap-1.5 text-zinc-500">
        {icon}
        <span className="text-[9px] font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-zinc-200">
        {value || "—"}
      </p>
    </div>
  );
}

const parsePartDescription = (part: ICreature["parts"][number]) => {
  const raw = part.description ?? "";
  const withoutName = raw.startsWith(`${part.name}.`)
    ? raw.slice(part.name.length + 1).trim()
    : raw;

  const [main, ...rest] = withoutName.split("◆");
  const brokenRaw = rest.join("◆").trim();
  const broken = brokenRaw
    ? brokenRaw.replace(/^Se Quebradas?:?\s*/i, "").trim()
    : part.broken?.description?.trim();

  return { main: main.trim(), broken };
};

function CreaturePartCard({ part }: { part: ICreature["parts"][number] }) {
  const { main, broken } = parsePartDescription(part);
  const attackLabel = part.attack
    ? `${SKILLS[part.attack.skill]?.name ?? part.attack.skill} ${
        STYLES[part.attack.style]?.name ?? part.attack.style
      }`
    : null;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className=" text-[11px] font-bold uppercase tracking-wide text-zinc-100">
          {part.name}
        </span>
        <div className="flex shrink-0 items-center gap-1 text-zinc-500">
          <Shield className="h-3 w-3" />
          <span className="font-code text-[10px]">{part.durability.max}</span>
        </div>
      </div>

      {(attackLabel || part.attack) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {attackLabel && (
            <span className="inline-flex items-center gap-1 rounded-md border border-orange-500/20 bg-orange-500/10 px-1.5 py-0.5 text-[9px] font-bold text-orange-300">
              <Target className="h-2.5 w-2.5" />
              {attackLabel}
            </span>
          )}
          {part.attack && (
            <span className="rounded-md bg-zinc-900 px-1.5 py-0.5 font-code text-[9px] text-zinc-400">
              Alcance {part.attack.range}
            </span>
          )}
        </div>
      )}

      {main && (
        <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">{main}</p>
      )}

      {broken && (
        <div className="mt-2 rounded-lg border border-red-500/20 bg-red-500/5 p-2">
          <p className="text-[9px] font-bold uppercase tracking-wide text-red-400">
            Se Quebrada
          </p>
          <p className="mt-0.5 text-[10px] leading-relaxed text-red-200/80">
            {broken}
          </p>
        </div>
      )}
    </div>
  );
}

function CreatureCard({ creature }: { creature: ICreature }) {
  const [expanded, setExpanded] = useState(false);
  const meta = getLineageMeta(creature.lineage);

  const topStyles = useMemo(
    () =>
      STYLE_ORDER.map((key) => [key, creature.styles[key]] as const)
        .filter(([, value]) => value > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2),
    [creature],
  );

  return (
    <InfoCard className="overflow-hidden p-0 hover:bg-white/[0.04]">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="w-full cursor-pointer p-2 text-left transition-colors "
        aria-expanded={expanded}
      >
        <div className="flex items-start gap-3">
          <span
            className={`flex shrink-0 items-center justify-center rounded-xl border p-2 ${meta.bg} ${meta.text} ${meta.border}`}
          >
            {meta.icon}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className=" text-sm font-bold text-zinc-50">
                  {creature.name}
                </h4>
                <p
                  className={`mt-0.5 text-[10px] font-bold uppercase tracking-wide ${meta.text}`}
                >
                  {creature.lineage} • {creature.stage}
                </p>
              </div>

              <ChevronDown
                className={`mt-1 h-4 w-4 shrink-0 text-zinc-500 transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </div>

            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              {creature.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-300">
                <Heart className="h-3 w-3" />
                {creature.vigor.max}
              </span>
              {topStyles.map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300"
                >
                  {STYLES[key].name} {value}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-400">
                {creature.parts.length}{" "}
                {creature.parts.length === 1 ? "Parte" : "Partes"}
              </span>
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-zinc-700/70 px-4 pb-4 pt-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <CreatureStatBlock
              icon={<Ruler className="h-3.5 w-3.5" />}
              label="Tamanho"
              value={creature.sizeDescription}
            />
            <CreatureStatBlock
              icon={<MapPin className="h-3.5 w-3.5" />}
              label="Habitat"
              value={creature.habitat}
            />
            <CreatureStatBlock
              icon={<Utensils className="h-3.5 w-3.5" />}
              label="Dieta"
              value={creature.diet}
            />
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
              Estilos
            </p>
            <CreatureStyleGrid creature={creature} />
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
              Habilidades
            </p>
            <CreatureSkillGrid creature={creature} />
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-teal-400">
              Traços
            </p>
            <div className="flex flex-wrap gap-1.5">
              {creature.traits.map(({ traitId, level }, index) => (
                <span
                  key={`${traitId}-${index}`}
                  className="rounded-lg border border-teal-500/25 bg-teal-500/10 px-2 py-1 text-[10px] font-semibold text-teal-200"
                >
                  {getTraitName(traitId)}
                  {level > 1 ? ` ${level}` : ""}
                </span>
              ))}
              {creature.additionalTraits.map(({ traitId, level }, index) => (
                <span
                  key={`add-${traitId}-${index}`}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-400"
                >
                  {getTraitName(traitId)}
                  {level > 1 ? ` ${level}` : ""}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-orange-400">
              Partes do Corpo
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {creature.parts.map((part) => (
                <CreaturePartCard key={part.id} part={part} />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-black/20 p-3">
            <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
              <Route className="h-3 w-3" />
              Comportamento em combate
            </p>
            <p className="text-xs leading-relaxed text-zinc-300">
              {creature.behavior}
            </p>
          </div>
        </div>
      )}
    </InfoCard>
  );
}

function CreaturesTab({ search }: { search: string }) {
  const items = useMemo(
    () =>
      creatureDefinitions.filter((creature: ICreature) =>
        matchesSearch(
          search,
          creature.id,
          creature.name,
          creature.lineage,
          creature.stage,
          creature.sizeDescription,
          creature.description,
          creature.diet,
          creature.habitat,
          creature.behavior,
          ...creature.traits.map(({ traitId }) => getTraitName(traitId)),
          ...creature.additionalTraits.map(({ traitId }) =>
            getTraitName(traitId),
          ),
          ...creature.parts.map((part) => part.name),
        ),
      ),
    [search],
  );

  const groups = useMemo(() => {
    const byLineage = new Map<string, ICreature[]>();

    items.forEach((creature) => {
      const list = byLineage.get(creature.lineage) ?? [];
      list.push(creature);
      byLineage.set(creature.lineage, list);
    });

    const knownOrder = Object.keys(LINEAGE_META).filter((key) =>
      byLineage.has(key),
    );
    const unknownOrder = Array.from(byLineage.keys())
      .filter((key) => !(key in LINEAGE_META))
      .sort((a, b) => a.localeCompare(b, "pt-BR"));

    return [...knownOrder, ...unknownOrder].map((lineage) => ({
      lineage,
      creatures: (byLineage.get(lineage) ?? [])
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    }));
  }, [items]);

  if (!items.length) return <EmptyState search={search} />;

  return (
    <div className="space-y-7">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
        {items.length}{" "}
        {items.length === 1 ? "criatura encontrada" : "criaturas encontradas"}
      </p>

      {groups.map(({ lineage, creatures }) => {
        const meta = getLineageMeta(lineage);
        return (
          <section key={lineage}>
            <div className="mb-3 flex items-center gap-2.5">
              <span
                className={`flex shrink-0 items-center justify-center rounded-lg border p-1.5 ${meta.bg} ${meta.text} ${meta.border}`}
              >
                {meta.icon}
              </span>
              <h3 className=" text-sm font-black uppercase tracking-wide text-zinc-100">
                Linhagem {lineage}
              </h3>
              <span className="font-code text-[10px] text-zinc-500">
                {creatures.length}
              </span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              {creatures.map((creature) => (
                <CreatureCard key={creature.id} creature={creature} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

const TAB_CONTENT: Record<
  Exclude<RuleTab, "regras">,
  (props: { search: string }) => React.ReactNode
> = {
  utensilios: UtensilsTab,
  especialidades: SpecialtiesTab,
  tecnicas: TechniquesTab,
  tracos: TraitsTab,
  condicoes: ConditionsTab,
  criaturas: CreaturesTab,
};

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<RuleTab>("regras");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setActiveTab("regras");
      setSearch("");
    }
  }, [isOpen]);

  const Content = activeTab === "regras" ? RulesTab : TAB_CONTENT[activeTab];
  const activeTabDefinition = TABS.find((tab) => tab.id === activeTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div className="flex h-[76vh] w-full max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-[#1C1B18] shadow-2xl">
          {/* Sidebar */}
          <aside className="hidden w-56 shrink-0 flex-col border-r border-zinc-800 bg-[#171615] md:flex">
            <div className="border-b border-zinc-800 p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-[#F28C28] p-2 text-white">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className=" text-xs font-black text-zinc-100">
                    WILDERFEAST
                  </p>
                  <p className="text-[10px] text-zinc-500">Compêndio</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
              {TABS.map((tab) => {
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearch("");
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      active
                        ? "bg-[#13335C] text-white"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                    }`}
                  >
                    <span
                      className={active ? "text-[#F28C28]" : "text-zinc-500"}
                    >
                      {tab.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-bold">
                        {tab.label}
                      </span>
                      <span className="block truncate text-[9px] text-zinc-500">
                        {tab.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main */}
          <section className="flex min-w-0 flex-1 flex-col">
            <header className="shrink-0 bg-[#13335C] p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200">
                    Guia Rápido Oficial
                  </p>
                  <h3 className=" text-base font-bold tracking-wide text-white sm:text-lg">
                    COMPÊNDIO & REGRAS DE WILDERFEAST
                  </h3>
                  <p className="mt-1 text-xs text-zinc-300">
                    {activeTabDefinition?.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer shrink-0 rounded-lg p-1.5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Fechar compêndio"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            {/* Mobile navigation */}
            <div className="shrink-0 border-b border-zinc-800 bg-black/30 p-3 md:hidden">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearch("");
                    }}
                    className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold ${
                      activeTab === tab.id
                        ? "bg-[#13335C] text-white"
                        : "border border-zinc-700 bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="shrink-0 border-b border-zinc-800 bg-black/20 p-3 sm:p-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Buscar em ${activeTabDefinition?.label.toLowerCase()}...`}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-3 text-xs text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-[#F28C28]"
                  aria-label="Buscar no compêndio"
                />
              </div>
            </div>

            {/* Content */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="mx-auto w-full max-w-6xl">
                <Content search={search} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;
