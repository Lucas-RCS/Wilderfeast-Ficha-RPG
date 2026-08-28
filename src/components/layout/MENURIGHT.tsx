import React, { useState } from "react";
import {
  Swords,
  BookOpen,
  Dna,
  PawPrint,
  FileText,
  Plus,
  Trash2,
  Edit3,
  Soup,
  Award,
  Zap,
  Info,
} from "lucide-react";
import type {
  IFeral,
  ICondition,
  ITechnique,
  ITrait,
  SkillKey,
  JournalNote,
} from "../../types";
import { InfoTooltip } from "../ui/Tooltip";

interface RightDetailColumnProps {
  sheet: IFeral;
  onChange: (updated: Partial<IFeral>) => void;
  onOpenCompendium?: () => void;
}

type FeralTabKey =
  | "skills"
  | "techniques"
  | "traits"
  | "beasts_feasts"
  | "notes";

export const RightDetailColumn: React.FC<RightDetailColumnProps> = ({
  sheet,
  onChange,
  onOpenCompendium,
}) => {
  const [activeTab, setActiveTab] = useState<FeralTabKey>("skills");

  // Modals & form states
  const [editingTechnique, setEditingTechnique] = useState<ITechnique | null>(
    null,
  );

  const [editingTrait, setEditingTrait] = useState<ITrait | null>(null);

  const [editingBeast, setEditingBeast] = useState<{
    id?: string;
    name: string;
    species: string;
    connectionLevel: number;
    skills: string;
    personality: string;
    description?: string;
  } | null>(null);

  const [editingFeast, setEditingFeast] = useState<{
    id?: string;
    dishName: string;
    monsterSource: string;
    date: string;
    ingredients: string;
    permanentBenefit: string;
  } | null>(null);

  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");

  // 12 Skills definition with comprehensive book-faithful descriptions for tooltips
  const skillsList: Array<{
    key: SkillKey;
    name: string;
    description: string;
    tooltipHelp: string;
  }> = [
    {
      key: "agarrar",
      name: "AGARRAR",
      description: "Imobilizar, escalar e segurar presas ou fendas",
      tooltipHelp:
        "Usado para conter criaturas, escalar partes do corpo de criaturas colossais, agarrar galhos ou prender presas no combate.",
    },
    {
      key: "armazenar",
      name: "ARMAZENAR",
      description: "Conservar carne, guardar provisões e transportar peso",
      tooltipHelp:
        "Capacidade de empacotar provisões, salgar e secar carnes de criaturas caçados, suportar cargas pesadas na marcha.",
    },
    {
      key: "assegurar",
      name: "ASSEGURAR",
      description: "Amarrar cordas, prender acampamento e fixar defesas",
      tooltipHelp:
        "Amarrar nós de caçada, ancorar cordas para descida, armar barricadas táticas e proteger a toca da matilha.",
    },
    {
      key: "atirar",
      name: "ATIRAR",
      description:
        "Arremessar utensílios, disparar maçarico e alvejar à distância",
      tooltipHelp:
        "Disparar flechas de cabo, arremessar cutelos ou temperos combustíveis, alvejar partes aéreas ou à distância.",
    },
    {
      key: "atravessar",
      name: "ATRAVESSAR",
      description: "Superar terrenos acidentados, saltar e forçar passagens",
      tooltipHelp:
        "Correr por pântanos, atravessar rios de lava, esquivar de desmoronamentos e desbravar a selva fechada.",
    },
    {
      key: "chamar",
      name: "CHAMAR",
      description: "Emitir rugidos, atrair criaturas e coordenar a matilha",
      tooltipHelp:
        "Usado para atrair criaturas com imitações de acasalamento/desafio, emitir comandos à matilha e inspirar companheiros.",
    },
    {
      key: "curar",
      name: "CURAR",
      description: "Tratar ferimentos, primeiros socorros e ministrar pomadas",
      tooltipHelp:
        "Tratar queimaduras, extrair venenos monstruosos, estancar sangramentos e regenerar vigor dos aliados com remédios de campo.",
    },
    {
      key: "estudar",
      name: "ESTUDAR",
      description: "Analisar anatomia de criaturas, fraquezas e botânica",
      tooltipHelp:
        "Examinar carcaças, descobrir pontos fracos e vulnerabilidades de criaturas, identificar ervas medicinais e cogumelos.",
    },
    {
      key: "exibir",
      name: "EXIBIR",
      description: "Intimidar com postura, demonstrar força e liderança",
      tooltipHelp:
        "Intimidar feras predadoras para fazê-las hesitar, realizar rituais de liderança e impor presença de caçador alfa.",
    },
    {
      key: "golpear",
      name: "GOLPEAR",
      description: "Ataques corpo a corpo com utensílios e cortes limpos",
      tooltipHelp:
        "Ataques corporais principais com seu Utensílio culinário para desferir cortes, quebrar carapaças e decepar partes.",
    },
    {
      key: "manufaturar",
      name: "MANUFATURAR",
      description: "Forjar arkaicaço, armadilhas e cozinhar banquetes",
      tooltipHelp:
        "Cozinhar pratos magistrais no Banquete, forjar melhorias para utensílios com carcaças e construir armadilhas letais.",
    },
    {
      key: "procurar",
      name: "PROCURAR",
      description: "Rastrear pegadas, forragear ingredientes e vigiar trilhas",
      tooltipHelp:
        "Seguir rastros de sangue, encontrar pegadas na terra, detectar predadores emboscados e forragear temperos raros.",
    },
  ];

  const handleSkillChange = (key: SkillKey, delta: number) => {
    const current = sheet.skills[key] || 0;
    const newVal = Math.max(0, Math.min(3, current + delta));
    onChange({
      skills: {
        ...sheet.skills,
        [key]: newVal,
      },
    });
  };

  // --- TECHNIQUES HANDLERS ---
  const handleSaveTechnique = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTechnique || !editingTechnique.name.trim()) return;

    if (editingTechnique.id) {
      onChange({
        techniques: sheet.techniques.map((t) =>
          t.id === editingTechnique.id ? { ...t, ...editingTechnique } : t,
        ),
      });
    } else {
      const newTech = {
        ...editingTechnique,
        id: `tech-${Date.now()}`,
      };
      onChange({
        techniques: [...sheet.techniques, newTech],
      });
    }
    setEditingTechnique(null);
  };

  const handleDeleteTechnique = (id: string) => {
    onChange({
      techniques: sheet.techniques.filter((t) => t.id !== id),
    });
  };

  // --- TRAITS HANDLERS ---
  const handleSaveTrait = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrait || !editingTrait.name.trim()) return;

    if (editingTrait.id) {
      onChange({
        traits: sheet.traits.map((tr) =>
          tr.id === editingTrait.id ? { ...tr, ...editingTrait } : tr,
        ),
      });
    } else {
      const newTr = {
        ...editingTrait,
        id: `trait-${Date.now()}`,
      };
      onChange({
        traits: [...sheet.traits, newTr],
      });
    }
    setEditingTrait(null);
  };

  const handleDeleteTrait = (id: string) => {
    onChange({
      traits: sheet.traits.filter((t) => t.id !== id),
    });
  };

  // --- FAMILIAR BEASTS HANDLERS ---
  const handleSaveBeast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBeast || !editingBeast.name.trim()) return;

    if (editingBeast.id) {
      onChange({
        familiarBeasts: sheet.familiarBeasts.map((b) =>
          b.id === editingBeast.id ? { ...b, ...editingBeast } : b,
        ),
      });
    } else {
      const newB = {
        ...editingBeast,
        id: `beast-${Date.now()}`,
      };
      onChange({
        familiarBeasts: [...sheet.familiarBeasts, newB],
      });
    }
    setEditingBeast(null);
  };

  const handleDeleteBeast = (id: string) => {
    onChange({
      familiarBeasts: sheet.familiarBeasts.filter((b) => b.id !== id),
    });
  };

  // --- FEAST HANDLERS ---
  const handleSaveFeast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeast || !editingFeast.dishName.trim()) return;

    if (editingFeast.id) {
      onChange({
        feastHistory: sheet.feastHistory.map((f) =>
          f.id === editingFeast.id ? { ...f, ...editingFeast } : f,
        ),
      });
    } else {
      const newF = {
        ...editingFeast,
        id: `feast-${Date.now()}`,
      };
      onChange({
        feastHistory: [...sheet.feastHistory, newF],
      });
    }
    setEditingFeast(null);
  };

  const handleDeleteFeast = (id: string) => {
    onChange({
      feastHistory: sheet.feastHistory.filter((f) => f.id !== id),
    });
  };

  // --- NOTES HANDLERS ---
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      title: newNoteTitle.trim() || "Anotação de Caçada",
      content: newNoteContent.trim(),
      category: "Sessão",
      createdAt: new Date().toISOString(),
    };
    onChange({
      notes: [newNote, ...sheet.notes],
    });
    setNewNoteTitle("");
    setNewNoteContent("");
  };

  const handleDeleteNote = (id: string) => {
    onChange({
      notes: sheet.notes.filter((n) => n.id !== id),
    });
  };

  return (
    <section className="w-full space-y-4">
      {/* ========================================================= */}
      {/* TOP TAB NAVIGATION BAR */}
      {/* ========================================================= */}
      <div className="bg-[#1A1918] border border-[#383430] rounded-xl p-1.5 shadow-sm flex items-center gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("skills")}
          className={`px-3.5 py-2 rounded-lg font-serif font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === "skills"
              ? "bg-[#13335C] text-white shadow-sm"
              : "text-[#5C4D3C] hover:bg-[#33302B] hover:text-[#89B5F7]"
          }`}
        >
          <Award className="w-4 h-4 text-[#FF9B42]" />
          <span>1. Habilidades</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === "skills"
                ? "bg-white/20 text-white"
                : "bg-[#242220] text-[#B0A497]"
            }`}
          >
            12
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("techniques")}
          className={`px-3.5 py-2 rounded-lg font-serif font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === "techniques"
              ? "bg-[#13335C] text-white shadow-sm"
              : "text-[#5C4D3C] hover:bg-[#33302B] hover:text-[#89B5F7]"
          }`}
        >
          <Swords className="w-4 h-4 text-[#FF9B42]" />
          <span>2. Técnicas</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === "techniques"
                ? "bg-white/20 text-white"
                : "bg-[#242220] text-[#B0A497]"
            }`}
          >
            {sheet.techniques.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("traits")}
          className={`px-3.5 py-2 rounded-lg font-serif font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === "traits"
              ? "bg-[#13335C] text-white shadow-sm"
              : "text-[#5C4D3C] hover:bg-[#33302B] hover:text-[#89B5F7]"
          }`}
        >
          <Dna className="w-4 h-4 text-[#38C2B3]" />
          <span>3. Traços & Mutações</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === "traits"
                ? "bg-white/20 text-white"
                : "bg-[#242220] text-[#B0A497]"
            }`}
          >
            {sheet.traits.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("beasts_feasts")}
          className={`px-3.5 py-2 rounded-lg font-serif font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === "beasts_feasts"
              ? "bg-[#13335C] text-white shadow-sm"
              : "text-[#5C4D3C] hover:bg-[#33302B] hover:text-[#89B5F7]"
          }`}
        >
          <PawPrint className="w-4 h-4 text-[#FF9B42]" />
          <span>4. Feras & Banquetes</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === "beasts_feasts"
                ? "bg-white/20 text-white"
                : "bg-[#242220] text-[#B0A497]"
            }`}
          >
            {sheet.familiarBeasts.length + sheet.feastHistory.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`px-3.5 py-2 rounded-lg font-serif font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === "notes"
              ? "bg-[#13335C] text-white shadow-sm"
              : "text-[#5C4D3C] hover:bg-[#33302B] hover:text-[#89B5F7]"
          }`}
        >
          <FileText className="w-4 h-4 text-[#38C2B3]" />
          <span>5. Diário & Notas</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === "notes"
                ? "bg-white/20 text-white"
                : "bg-[#242220] text-[#B0A497]"
            }`}
          >
            {sheet.notes.length}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: AS 12 HABILIDADES (+0 A +3) */}
      {/* ========================================================= */}
      {activeTab === "skills" && (
        <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#383430] gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-sm text-[#89B5F7] uppercase tracking-wider">
                  As 12 Habilidades do Feral (+0 a +3)
                </h3>
                <InfoTooltip
                  title="Habilidades de Ação"
                  description="Em Wilderfeast, toda ação usa um Estilo (dados) + uma Habilidade (bônus numérico fixo adicionado ao Dado de Ação). O valor varia de 0 a +3."
                  category="Regras Básicas"
                  onOpenCompendium={onOpenCompendium}
                />
              </div>
              <p className="text-[11px] text-[#B0A497]">
                O bônus da habilidade é somado diretamente ao resultado do Dado
                de Ação [A] nos testes.
              </p>
            </div>

            {/* Quick Helper Badge */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#FF9B42] bg-[#E66826]/10 px-2.5 py-1 rounded-md border border-[#E66826]/20 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Teste = Estilo (dados) + Habilidade (+bônus)</span>
              </span>
            </div>
          </div>

          {/* 3-Column Compact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {skillsList.map((skill) => {
              const val = sheet.skills[skill.key] || 0;
              return (
                <div
                  key={skill.key}
                  className="p-2.5 rounded-lg bg-[#242220] border border-[#383430] flex items-center justify-between gap-2 hover:border-[#173F73]/40 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-bold text-xs text-[#F5EFEB] truncate uppercase">
                        {skill.name}
                      </span>
                      <InfoTooltip
                        title={skill.name}
                        description={skill.tooltipHelp}
                        category="Habilidade"
                        onOpenCompendium={onOpenCompendium}
                      />
                    </div>
                    <p className="text-[10px] text-[#B0A497] truncate">
                      {skill.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSkillChange(skill.key, -1)}
                      disabled={val <= 0}
                      className="w-6 h-6 rounded bg-[#22201D] hover:bg-[#33302B] text-xs font-bold flex items-center justify-center disabled:opacity-30 border border-[#383430] text-[#89B5F7] transition-colors"
                      title="Diminuir bônus"
                    >
                      −
                    </button>

                    <span className="font-mono font-black text-sm w-6 text-center text-[#89B5F7]">
                      +{val}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleSkillChange(skill.key, 1)}
                      disabled={val >= 3}
                      className="w-6 h-6 rounded bg-[#22201D] hover:bg-[#33302B] text-xs font-bold flex items-center justify-center disabled:opacity-30 border border-[#383430] text-[#89B5F7] transition-colors"
                      title="Aumentar bônus (Máx +3)"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contextual Tutorial / Quick Tip for New Users */}
          <div className="mt-3 p-3 rounded-lg bg-[#FAF0E6] border border-[#E66826]/30 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#FF9B42] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#5C4D3C] leading-relaxed">
              <strong>Dica de Caçador Feral:</strong> Na criação de personagem,
              distribua seus pontos entre as perícias que melhor representam seu
              passado humano e sua afinidade de criatura. Especialidades
              concedem bônus específicos em perícias como <em>Golpear</em>,{" "}
              <em>Atravessar</em> ou <em>Curar</em>.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: TÉCNICAS DE UTENSÍLIO */}
      {/* ========================================================= */}
      {activeTab === "techniques" && (
        <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#383430] gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-sm text-[#89B5F7] uppercase tracking-wider flex items-center gap-1.5">
                  <Swords className="w-4 h-4 text-[#FF9B42]" />
                  <span>Técnicas de Utensílio ({sheet.techniques.length})</span>
                </h3>
                <InfoTooltip
                  title="Técnicas Marciais"
                  description="Manobras avançadas que você executa com seu Utensílio culinário durante o combate. Cada técnica possui um Nível (Iniciante, Intermediária, Avançada) e um Custo em Sucessos ou Vigor."
                  category="Combate"
                  onOpenCompendium={onOpenCompendium}
                />
              </div>
              <p className="text-[11px] text-[#B0A497]">
                Manobras táticas e golpes especiais executados com seu Utensílio
                de Arkaicaço.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenCompendium}
                className="px-3 py-1.5 rounded-lg bg-[#242220] hover:bg-[#33302B] text-[#89B5F7] font-bold text-xs flex items-center gap-1.5 border border-[#383430] transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Compêndio de Técnicas</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setEditingTechnique({
                    id: `tech-${Date.now()}`,
                    name: "",
                    level: "Iniciante",
                    cost: "",
                    description: "",
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-[#13335C] hover:bg-[#0E2644] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#FF9B42]" />
                <span>Nova Técnica</span>
              </button>
            </div>
          </div>

          {/* Techniques List */}
          <div className="space-y-3">
            {sheet.techniques.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-[#383430] text-center space-y-2">
                <Swords className="w-8 h-8 mx-auto text-[#B0A497]" />
                <p className="text-xs font-bold text-[#5C4D3C]">
                  Nenhuma técnica cadastrada ainda.
                </p>
                <p className="text-[11px] text-[#B0A497] max-w-sm mx-auto">
                  Clique em <strong>Nova Técnica</strong> para adicionar sua
                  manobra personalizada ou abra o <strong>Compêndio</strong>{" "}
                  para consultar técnicas oficiais do livro básico.
                </p>
              </div>
            ) : (
              sheet.techniques.map((tech) => (
                <div
                  key={tech.id}
                  className="p-3.5 rounded-xl bg-[#242220] border border-[#383430] space-y-2 hover:border-[#173F73]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-[#89B5F7] uppercase">
                          {tech.name}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#22201D] text-[10px] font-bold text-[#89B5F7] border border-[#383430]">
                          {tech.level}
                        </span>
                        {tech.cost && (
                          <span className="px-2 py-0.5 rounded bg-[#E66826]/10 text-[10px] font-bold text-[#FF9B42] border border-[#E66826]/20">
                            {tech.cost}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingTechnique(tech)}
                        className="p-1.5 rounded-md text-[#B0A497] hover:bg-[#22201D] hover:text-[#89B5F7] transition-colors"
                        title="Editar técnica"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTechnique(tech.id)}
                        className="p-1.5 rounded-md text-[#FC8181] hover:bg-[#22201D] transition-colors"
                        title="Remover técnica"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#F5EFEB] leading-relaxed">
                    {tech.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: TRAÇOS & MUTAÇÕES MONSTRUOSAS */}
      {/* ========================================================= */}
      {activeTab === "traits" && (
        <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#383430] gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-sm text-[#38C2B3] uppercase tracking-wider flex items-center gap-1.5">
                  <Dna className="w-4 h-4 text-[#38C2B3]" />
                  <span>
                    Traços & Mutações Biológicas ({sheet.traits.length})
                  </span>
                </h3>
                <InfoTooltip
                  title="Traços Ferais"
                  description="Poderes e mutações orgânicas obtidas ao se alimentar da carne de criaturas sagrados nos Banquetes. Concedem imunidades, garras, armaduras naturais ou sentidos aguçados."
                  category="Mutação"
                  onOpenCompendium={onOpenCompendium}
                />
              </div>
              <p className="text-[11px] text-[#B0A497]">
                Poderes sobrenaturais e mutações corporais herdadas do consumo
                de criaturas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenCompendium}
                className="px-3 py-1.5 rounded-lg bg-[#242220] hover:bg-[#33302B] text-[#38C2B3] font-bold text-xs flex items-center gap-1.5 border border-[#383430] transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Compêndio de Traços</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setEditingTrait({
                    id: `trait-${Date.now()}`,
                    name: "",
                    level: 1,
                    type: "Passiva",
                    description: "",
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-[#16857A] hover:bg-[#126B62] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Traço</span>
              </button>
            </div>
          </div>

          {/* Traits List */}
          <div className="space-y-3">
            {sheet.traits.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-[#383430] text-center space-y-2">
                <Dna className="w-8 h-8 mx-auto text-[#B0A497]" />
                <p className="text-xs font-bold text-[#5C4D3C]">
                  Nenhum traço monstruoso absorvido ainda.
                </p>
                <p className="text-[11px] text-[#B0A497] max-w-sm mx-auto">
                  Participe de um Banquete culinário após uma caçada para
                  incorporar a essência de criaturas e desbloquear mutações
                  ferais.
                </p>
              </div>
            ) : (
              sheet.traits.map((tr) => (
                <div
                  key={tr.id}
                  className="p-3.5 rounded-xl bg-[#242220] border border-[#383430] space-y-2 hover:border-[#16857A]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-[#38C2B3] uppercase">
                          {tr.name}
                        </span>
                        {tr.level > 1 && (
                          <span className="px-2 py-0.5 rounded bg-[#22201D] text-[10px] font-bold text-[#38C2B3] border border-[#383430]">
                            Nível {tr.level}
                          </span>
                        )}
                        {tr.cost && (
                          <span className="px-2 py-0.5 rounded bg-[#16857A]/10 text-[10px] font-bold text-[#38C2B3] border border-[#16857A]/20">
                            {tr.cost}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingTrait(tr)}
                        className="p-1.5 rounded-md text-[#B0A497] hover:bg-[#22201D] hover:text-[#38C2B3] transition-colors"
                        title="Editar traço"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTrait(tr.id)}
                        className="p-1.5 rounded-md text-[#FC8181] hover:bg-[#22201D] transition-colors"
                        title="Remover traço"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#F5EFEB] leading-relaxed">
                    {tr.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: FERAS FAMILIARES & HISTÓRICO DE BANQUETES */}
      {/* ========================================================= */}
      {activeTab === "beasts_feasts" && (
        <div className="space-y-4 animate-fadeIn">
          {/* Feras Familiares */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#383430] gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-black text-sm text-[#89B5F7] uppercase tracking-wider flex items-center gap-1.5">
                    <PawPrint className="w-4 h-4 text-[#FF9B42]" />
                    <span>
                      Feras Familiares & Companheiros (
                      {sheet.familiarBeasts.length})
                    </span>
                  </h3>
                  <InfoTooltip
                    title="Feras Familiares"
                    description="Criaturas domesticadas ou companheiros que acompanham a matilha. Possuem um nível de conexão e truques treinados que podem auxiliar na caçada."
                    category="Companheiros"
                    onOpenCompendium={onOpenCompendium}
                  />
                </div>
                <p className="text-[11px] text-[#B0A497]">
                  Monstros companheiros que convivem com você e auxiliam nas
                  expedições.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingBeast({
                    name: "",
                    species: "",
                    connectionLevel: 1,
                    skills: "",
                    personality: "",
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-[#13335C] hover:bg-[#0E2644] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#FF9B42]" />
                <span>Nova Fera Familiar</span>
              </button>
            </div>

            <div className="space-y-3">
              {sheet.familiarBeasts.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-[#383430] text-center text-xs text-[#B0A497]">
                  Nenhuma fera familiar vinculada no momento.
                </div>
              ) : (
                sheet.familiarBeasts.map((beast) => (
                  <div
                    key={beast.id}
                    className="p-3.5 rounded-xl bg-[#242220] border border-[#383430] space-y-2 hover:border-[#173F73]/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-[#89B5F7]">
                            {beast.name}
                          </h4>
                          <span className="text-xs text-[#B0A497] font-medium">
                            ({beast.species})
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#22201D] text-[10px] font-bold text-[#FF9B42] border border-[#383430]">
                            Conexão {beast.connectionLevel}
                          </span>
                        </div>
                        {beast.personality && (
                          <span className="text-[11px] text-[#B0A497]">
                            Personalidade: {beast.personality}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingBeast(beast)}
                          className="p-1.5 rounded text-[#B0A497] hover:bg-[#22201D] hover:text-[#89B5F7] transition-colors"
                          title="Editar fera"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBeast(beast.id)}
                          className="p-1.5 rounded text-[#FC8181] hover:bg-[#22201D] transition-colors"
                          title="Remover fera"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {beast.skills && (
                      <p className="text-xs text-[#F5EFEB] leading-relaxed">
                        <strong>Truques & Habilidades:</strong> {beast.skills}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Histórico de Banquetes */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#383430] gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-black text-sm text-[#FF9B42] uppercase tracking-wider flex items-center gap-1.5">
                    <Soup className="w-4 h-4 text-[#FF9B42]" />
                    <span>
                      Histórico de Banquetes ({sheet.feastHistory.length})
                    </span>
                  </h3>
                  <InfoTooltip
                    title="O Ritual do Banquete"
                    description="Após uma caçada bem-sucedida, a matilha prepara um banquete com carne de criatura e temperos locais. Comer a presa concede novas mutações biológicas e fortalece os laços."
                    category="Culinária"
                    onOpenCompendium={onOpenCompendium}
                  />
                </div>
                <p className="text-[11px] text-[#B0A497]">
                  Pratos preparados com a carne de criaturas abatidos e
                  benefícios adquiridos.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingFeast({
                    dishName: "",
                    monsterSource: "",
                    date: "",
                    ingredients: "",
                    permanentBenefit: "",
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-[#E66826] hover:bg-[#C85210] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar Banquete</span>
              </button>
            </div>

            <div className="space-y-3">
              {sheet.feastHistory.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-[#383430] text-center text-xs text-[#B0A497]">
                  Nenhum banquete culinário registrado ainda.
                </div>
              ) : (
                sheet.feastHistory.map((feast) => (
                  <div
                    key={feast.id}
                    className="p-3.5 rounded-xl bg-[#242220] border border-[#383430] space-y-2 hover:border-[#E66826]/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-[#FF9B42]">
                            {feast.dishName}
                          </h4>
                          {feast.monsterSource && (
                            <span className="text-xs text-[#B0A497] font-semibold">
                              (Carne de {feast.monsterSource})
                            </span>
                          )}
                          {feast.date && (
                            <span className="text-[10px] text-[#B0A497]">
                              • {feast.date}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingFeast({
                              ...feast,
                              ingredients: feast.ingredients || "",
                            })
                          }
                          className="p-1.5 rounded text-[#B0A497] hover:bg-[#22201D] hover:text-[#FF9B42] transition-colors"
                          title="Editar banquete"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFeast(feast.id)}
                          className="p-1.5 rounded text-[#FC8181] hover:bg-[#22201D] transition-colors"
                          title="Remover banquete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-[#F5EFEB] space-y-1">
                      {feast.ingredients && (
                        <p>
                          <strong>Ingredientes & Temperos:</strong>{" "}
                          {feast.ingredients}
                        </p>
                      )}
                      {feast.permanentBenefit && (
                        <p className="text-[#38C2B3] font-semibold">
                          <strong>Benefício / Traço Obtido:</strong>{" "}
                          {feast.permanentBenefit}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: DIÁRIO DE CAÇADA & ANOTAÇÕES */}
      {/* ========================================================= */}
      {activeTab === "notes" && (
        <div className="p-5 sm:p-6 rounded-xl bg-[#1A1918] border border-[#383430] shadow-sm space-y-4 animate-fadeIn">
          <div className="pb-3 border-b border-[#383430]">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-black text-sm text-[#89B5F7] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#89B5F7]" />
                <span>
                  Diário de Caçada & Anotações de Campanha ({sheet.notes.length}
                  )
                </span>
              </h3>
              <InfoTooltip
                title="Diário de Caçada"
                description="Seu bloco de notas pessoal para registrar pistas de criaturas, temperos secretos, dívidas de honra e anotações de sessões de Wilderfeast."
                category="Campanha"
              />
            </div>
            <p className="text-[11px] text-[#B0A497]">
              Registros de expedição, temperos descobertos, rumores e pistas de
              feras alfas.
            </p>
          </div>

          {/* Add Note Form */}
          <form
            onSubmit={handleAddNote}
            className="space-y-2.5 p-4 rounded-xl bg-[#242220] border border-[#383430]"
          >
            <input
              type="text"
              placeholder="Título da anotação (ex: Pistas do Satra Alfa nos Penhascos)..."
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-[#22201D] border border-[#383430] focus:outline-none focus:ring-1 focus:ring-[#173F73]"
            />
            <textarea
              placeholder="Escreva os detalhes da caçada, coordenadas de tocas ou ingredientes raros..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#22201D] border border-[#383430] focus:outline-none focus:ring-1 focus:ring-[#173F73]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newNoteContent.trim()}
                className="px-4 py-2 rounded-lg bg-[#13335C] hover:bg-[#0E2644] text-white font-bold text-xs shadow-sm disabled:opacity-40 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#FF9B42]" />
                <span>Salvar no Diário</span>
              </button>
            </div>
          </form>

          {/* Notes List */}
          <div className="space-y-3 pt-2">
            {sheet.notes.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-[#383430] text-center text-xs text-[#B0A497]">
                Nenhuma anotação registrada ainda no diário de bordo.
              </div>
            ) : (
              sheet.notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3.5 rounded-lg bg-[#242220] border border-[#383430] space-y-1.5 hover:border-[#173F73]/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-[#89B5F7] uppercase tracking-wide">
                      {note.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 rounded text-[#FC8181] hover:bg-[#22201D] transition-colors"
                      title="Excluir anotação"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-[#F5EFEB] whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDITAR / CRIAR TÉCNICA */}
      {/* ========================================================= */}
      {editingTechnique && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#1A1918] text-[#F5EFEB] rounded-xl border border-[#383430] shadow-2xl p-6">
            <h3 className="text-lg font-bold font-serif text-[#89B5F7] mb-4">
              {editingTechnique.id ? "Editar Técnica" : "Nova Técnica"}
            </h3>

            <form onSubmit={handleSaveTechnique} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                  Nome da Técnica *
                </label>
                <input
                  type="text"
                  required
                  value={editingTechnique.name}
                  onChange={(e) =>
                    setEditingTechnique({
                      ...editingTechnique,
                      name: e.target.value,
                    })
                  }
                  placeholder="Ex: Corte Transpassante..."
                  className="w-full px-3 py-2 text-sm font-semibold rounded-lg bg-[#22201D] border border-[#383430]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                    Nível
                  </label>
                  <select
                    value={editingTechnique.level}
                    onChange={(e) =>
                      setEditingTechnique({
                        ...editingTechnique,
                        level: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-[#22201D] border border-[#383430]"
                  >
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediária">Intermediária</option>
                    <option value="Avançada">Avançada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                    Custo
                  </label>
                  <input
                    type="text"
                    value={editingTechnique.cost}
                    onChange={(e) =>
                      setEditingTechnique({
                        ...editingTechnique,
                        cost: e.target.value,
                      })
                    }
                    placeholder="Ex: 1 Sucesso, 2 Vigor"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-[#22201D] border border-[#383430]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                  Descrição do Efeito
                </label>
                <textarea
                  rows={3}
                  value={editingTechnique.description}
                  onChange={(e) =>
                    setEditingTechnique({
                      ...editingTechnique,
                      description: e.target.value,
                    })
                  }
                  placeholder="Descreva as regras e efeitos da manobra..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#22201D] border border-[#383430]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#383430]">
                <button
                  type="button"
                  onClick={() => setEditingTechnique(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#242220] text-xs font-bold text-[#5C4D3C]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#13335C] text-white text-xs font-bold shadow-sm"
                >
                  Salvar Técnica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDITAR / CRIAR TRAÇO */}
      {/* ========================================================= */}
      {editingTrait && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#1A1918] text-[#F5EFEB] rounded-xl border border-[#383430] shadow-2xl p-6">
            <h3 className="text-lg font-bold font-serif text-[#38C2B3] mb-4">
              {editingTrait.id ? "Editar Traço Feral" : "Novo Traço Feral"}
            </h3>

            <form onSubmit={handleSaveTrait} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                  Nome do Traço *
                </label>
                <input
                  type="text"
                  required
                  value={editingTrait.name}
                  onChange={(e) =>
                    setEditingTrait({ ...editingTrait, name: e.target.value })
                  }
                  placeholder="Ex: GLÂNDULA DE FOGO..."
                  className="w-full px-3 py-2 text-sm font-semibold rounded-lg bg-[#22201D] border border-[#383430]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                    Nível
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={editingTrait.level}
                    onChange={(e) =>
                      setEditingTrait({
                        ...editingTrait,
                        level: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-[#22201D] border border-[#383430]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                    Custo / Tipo
                  </label>
                  <input
                    type="number"
                    value={editingTrait.cost}
                    onChange={(e) =>
                      setEditingTrait({
                        ...editingTrait,
                        cost: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Ex: 1"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-[#22201D] border border-[#383430]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                  Descrição do Efeito Biológico
                </label>
                <textarea
                  rows={3}
                  value={editingTrait.description}
                  onChange={(e) =>
                    setEditingTrait({
                      ...editingTrait,
                      description: e.target.value,
                    })
                  }
                  placeholder="Descreva as propriedades biológicas e vantagens do traço..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#22201D] border border-[#383430]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#383430]">
                <button
                  type="button"
                  onClick={() => setEditingTrait(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#242220] text-xs font-bold text-[#5C4D3C]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#16857A] text-white text-xs font-bold shadow-sm"
                >
                  Salvar Traço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDITAR / CRIAR FERA FAMILIAR */}
      {/* ========================================================= */}
      {editingBeast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#1A1918] text-[#F5EFEB] rounded-xl border border-[#383430] shadow-2xl p-6">
            <h3 className="text-lg font-bold font-serif text-[#89B5F7] mb-4">
              {editingBeast.id ? "Editar Fera Familiar" : "Nova Fera Familiar"}
            </h3>

            <form onSubmit={handleSaveBeast} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                  Nome da Fera *
                </label>
                <input
                  type="text"
                  required
                  value={editingBeast.name}
                  onChange={(e) =>
                    setEditingBeast({ ...editingBeast, name: e.target.value })
                  }
                  placeholder="Ex: Foguinho, Couro Velho..."
                  className="w-full px-3 py-2 text-sm font-semibold rounded-lg bg-[#22201D] border border-[#383430]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                    Espécie / Linhagem
                  </label>
                  <input
                    type="text"
                    value={editingBeast.species}
                    onChange={(e) =>
                      setEditingBeast({
                        ...editingBeast,
                        species: e.target.value,
                      })
                    }
                    placeholder="Ex: Fagurila Jovem"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-[#22201D] border border-[#383430]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                    Nível de Conexão (1 a 5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={editingBeast.connectionLevel}
                    onChange={(e) =>
                      setEditingBeast({
                        ...editingBeast,
                        connectionLevel: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-[#22201D] border border-[#383430]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                  Truques & Habilidades
                </label>
                <textarea
                  rows={2}
                  value={editingBeast.skills}
                  onChange={(e) =>
                    setEditingBeast({ ...editingBeast, skills: e.target.value })
                  }
                  placeholder="Ex: Rastreamento térmico, carregar carga, aviso de emboscada..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#22201D] border border-[#383430]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#383430]">
                <button
                  type="button"
                  onClick={() => setEditingBeast(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#242220] text-xs font-bold text-[#5C4D3C]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#13335C] text-white text-xs font-bold shadow-sm"
                >
                  Salvar Fera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDITAR / CRIAR BANQUETE */}
      {/* ========================================================= */}
      {editingFeast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#1A1918] text-[#F5EFEB] rounded-xl border border-[#383430] shadow-2xl p-6">
            <h3 className="text-lg font-bold font-serif text-[#FF9B42] mb-4">
              {editingFeast.id ? "Editar Banquete" : "Registrar Novo Banquete"}
            </h3>

            <form onSubmit={handleSaveFeast} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                  Nome do Prato *
                </label>
                <input
                  type="text"
                  required
                  value={editingFeast.dishName}
                  onChange={(e) =>
                    setEditingFeast({
                      ...editingFeast,
                      dishName: e.target.value,
                    })
                  }
                  placeholder="Ex: Ensopado Picante de Cauda de Satra..."
                  className="w-full px-3 py-2 text-sm font-semibold rounded-lg bg-[#22201D] border border-[#383430]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                    Monstro Fonte
                  </label>
                  <input
                    type="text"
                    value={editingFeast.monsterSource}
                    onChange={(e) =>
                      setEditingFeast({
                        ...editingFeast,
                        monsterSource: e.target.value,
                      })
                    }
                    placeholder="Ex: Satra Alfa"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-[#22201D] border border-[#383430]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                    Data / Sessão
                  </label>
                  <input
                    type="text"
                    value={editingFeast.date}
                    onChange={(e) =>
                      setEditingFeast({ ...editingFeast, date: e.target.value })
                    }
                    placeholder="Ex: Sessão 3"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-[#22201D] border border-[#383430]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                  Ingredientes & Temperos
                </label>
                <input
                  type="text"
                  value={editingFeast.ingredients}
                  onChange={(e) =>
                    setEditingFeast({
                      ...editingFeast,
                      ingredients: e.target.value,
                    })
                  }
                  placeholder="Ex: Pimenta-vulcânica, cogumelos luminosos..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#22201D] border border-[#383430]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#B0A497] mb-1">
                  Benefício / Traço Permanente
                </label>
                <textarea
                  rows={2}
                  value={editingFeast.permanentBenefit}
                  onChange={(e) =>
                    setEditingFeast({
                      ...editingFeast,
                      permanentBenefit: e.target.value,
                    })
                  }
                  placeholder="Ex: +1 de Vigor permanente, Traço Glândula de Fogo Nível 1..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#22201D] border border-[#383430]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#383430]">
                <button
                  type="button"
                  onClick={() => setEditingFeast(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#242220] text-xs font-bold text-[#5C4D3C]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#E66826] text-white text-xs font-bold shadow-sm"
                >
                  Salvar Banquete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
