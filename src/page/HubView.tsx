import React, { useState } from "react";
import {
  Plus,
  Upload,
  Flame,
  Utensils,
  Sparkles,
  Info,
  Award,
  Search,
  X,
} from "lucide-react";
import type {
  IFeralCard,
  ICreatureCard,
  MonsterLineage,
  MonsterStage,
  UtensilKey,
} from "../types";
import { SPECIALTIES_DATA, UTENSILS_DATA } from "../data/wilderfeastData";
import { MONSTER_LINEAGES } from "../data/creatureData";
import { CompendiumModal } from "../components/ui/RulesModal";
import { CardFeral } from "../components/ui/CardFeral";
import { CardCreature } from "../components/ui/CardCreature";
import { getItem, setItem } from "../lib/storage";

interface HubViewProps {
  feralCards: IFeralCard[];
  creatureCards: ICreatureCard[];
  onOpenFeral: (id: string) => void;
  onCreateFeral: (
    name: string,
    pronouns: string,
    specialty: string,
    utensil: UtensilKey,
  ) => void;
  onDuplicateFeral: (id: string) => void;
  onRenameFeral: (id: string, newName: string) => void;
  onDeleteFeral: (id: string) => void;
  onImportFeral: (jsonString: string) => void;
  onOpenCreature: (id: string) => void;
  onCreateCreature: (
    name: string,
    lineage: MonsterLineage,
    stage: MonsterStage,
  ) => void;
  onDuplicateCreature: (id: string) => void;
  onRenameCreature: (id: string, newName: string) => void;
  onDeleteCreature: (id: string) => void;
  onImportCreature: (jsonString: string) => void;
}

export const HubView: React.FC<HubViewProps> = ({
  feralCards,
  creatureCards,
  onOpenFeral,
  onCreateFeral,
  onDuplicateFeral,
  onRenameFeral,
  onDeleteFeral,
  onImportFeral,
  onOpenCreature,
  onCreateCreature,
  onDuplicateCreature,
  onRenameCreature,
  onDeleteCreature,
  onImportCreature,
}) => {
  const [activeTab, setActiveTab] = useState<"ferais" | "criaturas">("ferais");
  const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
  const [showQuickGuide, setShowQuickGuide] = useState(
    getItem("showQuickGuide") !== "false" ? true : false,
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [isNewFeralModalOpen, setIsNewFeralModalOpen] = useState(false);
  const [isNewCreatureModalOpen, setIsNewCreatureModalOpen] = useState(false);

  // Rename Modal State
  const [renameTarget, setRenameTarget] = useState<{
    id: string;
    name: string;
    type: "feral" | "creature";
  } | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
    type: "feral" | "creature";
  } | null>(null);

  // New Feral Form
  const [newFeralName, setNewFeralName] = useState("");
  const [newFeralPronouns, setNewFeralPronouns] = useState("ele/dele");
  const [newFeralSpecialty, setNewFeralSpecialty] = useState("Açougueiro");
  const [newFeralUtensil, setNewFeralUtensil] = useState<UtensilKey>("Cutelo");

  // New Creature Form
  const [newCreatureName, setNewCreatureName] = useState("");
  const [newCreatureLineage, setNewCreatureLineage] =
    useState<MonsterLineage>("Molheiro");
  const [newCreatureStage, setNewCreatureStage] =
    useState<MonsterStage>("Adulto");

  // Filtered lists in real time
  const normalizedQuery = searchTerm.toLowerCase().trim();

  const filteredFerals = feralCards.filter((f) => {
    if (!normalizedQuery) return true;
    const nameMatch = f.name?.toLowerCase().includes(normalizedQuery);
    const specMatch = f.specialty?.toLowerCase().includes(normalizedQuery);
    const utMatch = f.utensil?.toLowerCase().includes(normalizedQuery);
    const proMatch = f.pronouns?.toLowerCase().includes(normalizedQuery);
    return nameMatch || specMatch || utMatch || proMatch;
  });

  const filteredCreatures = creatureCards.filter((c) => {
    if (!normalizedQuery) return true;
    const nameMatch = c.name?.toLowerCase().includes(normalizedQuery);
    const linMatch = c.lineage?.toLowerCase().includes(normalizedQuery);
    const stgMatch = c.stage?.toLowerCase().includes(normalizedQuery);
    return nameMatch || linMatch || stgMatch;
  });

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "feral" | "creature",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (type === "feral") {
        onImportFeral(content);
      } else {
        onImportCreature(content);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleOpenRename = (
    id: string,
    currentName: string,
    type: "feral" | "creature",
  ) => {
    setRenameTarget({ id, name: currentName, type });
    setRenameValue(currentName);
  };

  const handleConfirmRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTarget || !renameValue.trim()) return;
    if (renameTarget.type === "feral") {
      onRenameFeral(renameTarget.id, renameValue.trim());
    } else {
      onRenameCreature(renameTarget.id, renameValue.trim());
    }
    setRenameTarget(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "feral") {
      onDeleteFeral(deleteTarget.id);
    } else {
      onDeleteCreature(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  const handleCreateFeralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeralName.trim()) return;
    onCreateFeral(
      newFeralName.trim(),
      newFeralPronouns.trim(),
      newFeralSpecialty,
      newFeralUtensil,
    );
    setIsNewFeralModalOpen(false);
    setNewFeralName("");
  };

  const handleCreateCreatureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCreatureName.trim()) return;
    onCreateCreature(
      newCreatureName.trim(),
      newCreatureLineage,
      newCreatureStage,
    );
    setIsNewCreatureModalOpen(false);
    setNewCreatureName("");
  };

  const handleShowQuickGuide = () => {
    setItem("showQuickGuide", "false");
    setShowQuickGuide(false);
  };

  return (
    <main className="w-full min-h-screen bg-[#121110] text-[#F5EFEB] flex flex-col font-sans pb-16">
      {/* Main Hub Content Area - 100% Fluid Width */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-10 flex-1 flex flex-col">
        {/* Editorial Title Block */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#242220] border border-[#383430] text-xs font-bold text-[#FF9B42] uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistema de Fichas • Wilderfeast RPG</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-serif tracking-tight text-[#89B5F7] uppercase mb-2">
            Wilderfeast
          </h1>
          <p className="text-sm sm:text-base text-[#B0A497] font-serif italic">
            "Você é o que você come. Ame o que você mata e ame o que pode matar
            você."
          </p>
        </div>

        {showQuickGuide && (
          <div className="mb-8 p-3 sm:p-3 rounded-2xl bg-[#1A1918] border border-[#383430] shadow-sm relative animate-fadeIn">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2 rounded-xl bg-[#13335C] text-white">
                  <Info className="w-4 h-4 text-[#FF9B42]" />
                </div>
                <div>
                  <h2 className="font-serif font-black text-sm text-[#89B5F7] uppercase tracking-wide">
                    Novo em Wilderfeast? Primeiros Passos
                  </h2>
                  <p className="text-xs text-[#B0A497]">
                    Entenda como funciona o ciclo de jogo e a criação de
                    personagens.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleShowQuickGuide}
                className="text-xs font-bold text-[#B0A497] hover:text-[#F5EFEB] px-2 py-1 rounded hover:bg-[#242220] cursor-pointer"
              >
                Ocultar Guia
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#2B2825] text-xs">
              <div className="p-3 rounded-xl bg-[#242220] border border-[#383430] space-y-1">
                <div className="font-serif font-bold text-xs text-[#89B5F7] uppercase flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-[#FF9B42]" />
                  <span>1. Crie seu Feral</span>
                </div>
                <p className="text-[#B0A497] leading-relaxed">
                  Escolha uma Especialidade culinária e um Utensílio de
                  Arkaicaço (Cutelo, Espeto, Luvas...).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#242220] border border-[#383430] space-y-1">
                <div className="font-serif font-bold text-xs text-[#89B5F7] uppercase flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#FF9B42]" />
                  <span>2. A Trilha & A Caçada</span>
                </div>
                <p className="text-[#B0A497] leading-relaxed">
                  Rastreie a presa pela Trilha e enfrente o monstro em combate
                  tático quebrando suas partes corporais.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#242220] border border-[#383430] space-y-1">
                <div className="font-serif font-bold text-xs text-[#89B5F7] uppercase flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#38C2B3]" />
                  <span>3. O Banquete</span>
                </div>
                <p className="text-[#B0A497] leading-relaxed">
                  Cozinhe a presa durante o Recesso e adquira suas técnicas e
                  traços biológicos para evoluir seu feral.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Big Solid Selector: [ FERAIS ] vs [ CRIATURAS ] */}
        <div className="w-full flex flex-col items-center mb-6">
          <div className="p-1.5 rounded-xl bg-[#1E1D1B] border border-[#383430] flex items-center gap-1.5 shadow-sm max-w-md w-full">
            <button
              id="hub-tab-ferais"
              type="button"
              onClick={() => setActiveTab("ferais")}
              className={`flex-1 py-3 px-4 rounded-lg font-serif font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "ferais"
                  ? "bg-[#13335C] text-white shadow-sm border border-[#2B6CB0]/40"
                  : "bg-transparent text-[#B0A497] hover:bg-[#282623] hover:text-[#F5EFEB]"
              }`}
            >
              <Utensils className="w-4 h-4 text-[#FF9B42]" />
              <span>Ferais ({feralCards.length})</span>
            </button>

            <button
              id="hub-tab-criaturas"
              type="button"
              onClick={() => setActiveTab("criaturas")}
              className={`flex-1 py-3 px-4 rounded-lg font-serif font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "criaturas"
                  ? "bg-[#13335C] text-white shadow-sm border border-[#2B6CB0]/40"
                  : "bg-transparent text-[#B0A497] hover:bg-[#282623] hover:text-[#F5EFEB]"
              }`}
            >
              <Flame className="w-4 h-4 text-[#FF9B42]" />
              <span>Criaturas ({creatureCards.length})</span>
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="w-full max-w-2xl mt-5">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-[#FF9B42] pointer-events-none flex items-center">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="hub-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  activeTab === "ferais"
                    ? "Buscar feral por nome, especialidade, utensílio ou pronome..."
                    : "Buscar monstro por nome, linhagem ou estágio de vida..."
                }
                className="w-full pl-11 pr-24 py-3 rounded-xl bg-[#1E1D1B] border border-[#383430] hover:border-[#4D4741] focus:border-[#FF9B42] focus:ring-1 focus:ring-[#FF9B42] text-sm text-[#F5EFEB] placeholder-[#7A7065] font-medium transition-all shadow-inner outline-none"
              />

              <div className="absolute right-3 flex items-center gap-2">
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="p-1 rounded-lg text-[#B0A497] hover:text-[#F5EFEB] hover:bg-[#2A2825] transition-colors"
                    title="Limpar busca"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B0A497] bg-[#282623] px-2 py-1 rounded-md border border-[#3D3833]">
                  {activeTab === "ferais"
                    ? `${filteredFerals.length} ${filteredFerals.length === 1 ? "feral" : "ferais"}`
                    : `${filteredCreatures.length} ${filteredCreatures.length === 1 ? "criatura" : "criaturas"}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TAB 1: FERAIS */}
        {activeTab === "ferais" && (
          <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#383430]">
              <div>
                <h2 className="text-xl font-bold font-serif text-[#89B5F7]">
                  Fichas dos Ferais
                </h2>
                <p className="text-xs text-[#B0A497]">
                  Caçadores, patrulheiros e chefs da Terra Una portando grandes
                  utensílios de arkaicaço.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Import JSON button */}
                <label
                  id="hub-btn-import-feral"
                  className="px-3 py-2 rounded-lg bg-[#242220] hover:bg-[#2E2B27] text-[#F5EFEB] font-bold text-xs flex items-center gap-1.5 border border-[#383430] cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-[#89B5F7]" />
                  <span>Importar JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleFileUpload(e, "feral")}
                    className="hidden"
                  />
                </label>

                {/* New Feral Button */}
                <button
                  id="hub-btn-new-feral"
                  type="button"
                  onClick={() => setIsNewFeralModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-[#13335C] hover:bg-[#0E2644] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors border border-[#2B6CB0]/40 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FF9B42]" />
                  <span>Novo Feral</span>
                </button>
              </div>
            </div>

            {/* Grid of Feral Sheets or Empty Search */}
            {feralCards.length === 0 ? (
              <div className="py-16 text-center rounded-2xl bg-[#1A1918] border-2 border-dashed border-[#383430] p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#242220] text-[#FF9B42] flex items-center justify-center mx-auto border border-[#383430]">
                  <Utensils className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="font-serif font-black text-lg text-[#89B5F7]">
                    Nenhum Feral Cadastrado
                  </h3>
                  <p className="text-xs text-[#B0A497]">
                    Crie seu primeiro caçador de criaturas para começar a
                    explorar a Terra Una e registrar seus banquetes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewFeralModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#13335C] hover:bg-[#0E2644] text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm border border-[#2B6CB0]/40 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FF9B42]" />
                  <span>Criar Meu Primeiro Feral</span>
                </button>
              </div>
            ) : filteredFerals.length === 0 ? (
              <div className="py-14 text-center rounded-2xl bg-[#1A1918] border border-[#383430] p-8 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#242220] text-[#FF9B42] flex items-center justify-center mx-auto border border-[#383430]">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#F5EFEB]">
                  Nenhum feral encontrado
                </h3>
                <p className="text-xs text-[#B0A497] max-w-sm mx-auto">
                  Nenhum personagem corresponde ao termo de busca "
                  <strong>{searchTerm}</strong>".
                </p>
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 rounded-lg bg-[#242220] hover:bg-[#2E2B27] text-xs font-bold text-[#FF9B42] border border-[#383430] transition-colors cursor-pointer"
                >
                  Limpar Filtro de Busca
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFerals.map((data) => (
                  <CardFeral
                    key={data.id}
                    data={data}
                    onOpenFeral={() => onOpenFeral(data.id)}
                    onDuplicateFeral={() => onDuplicateFeral(data.id)}
                    handleOpenRename={handleOpenRename}
                    setDeleteTarget={setDeleteTarget}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CRIATURAS (Bestiário do Guia) */}
        {activeTab === "criaturas" && (
          <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#383430]">
              <div>
                <h2 className="text-xl font-bold font-serif text-[#89B5F7]">
                  Bestiário do Guia
                </h2>
                <p className="text-xs text-[#B0A497]">
                  Criaturas, estágios de vida, partes corporais e instintos para
                  A Caçada.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Import JSON button */}
                <label
                  id="hub-btn-import-creature"
                  className="px-3 py-2 rounded-lg bg-[#242220] hover:bg-[#2E2B27] text-[#F5EFEB] font-bold text-xs flex items-center gap-1.5 border border-[#383430] cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-[#89B5F7]" />
                  <span>Importar JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleFileUpload(e, "creature")}
                    className="hidden"
                  />
                </label>

                {/* New Creature Button */}
                <button
                  id="hub-btn-new-creature"
                  type="button"
                  onClick={() => setIsNewCreatureModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-[#13335C] hover:bg-[#0E2644] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors border border-[#2B6CB0]/40 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FF9B42]" />
                  <span>Nova Criatura</span>
                </button>
              </div>
            </div>

            {/* Grid of Creature Sheets or Empty Search */}
            {creatureCards.length === 0 ? (
              <div className="py-16 text-center rounded-2xl bg-[#1A1918] border-2 border-dashed border-[#383430] p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#242220] text-[#FF9B42] flex items-center justify-center mx-auto border border-[#383430]">
                  <Flame className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="font-serif font-black text-lg text-[#89B5F7]">
                    Nenhuma Criatura Cadastrada
                  </h3>
                  <p className="text-xs text-[#B0A497]">
                    Crie criaturas magníficas para o seu bestiário, explore suas
                    origens e descubra novas formas de desafiar os ferais.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewCreatureModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#13335C] hover:bg-[#0E2644] text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm border border-[#2B6CB0]/40 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FF9B42]" />
                  <span>Criar Primeiro Monstro</span>
                </button>
              </div>
            ) : filteredCreatures.length === 0 ? (
              <div className="py-14 text-center rounded-2xl bg-[#1A1918] border border-[#383430] p-8 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#242220] text-[#FF9B42] flex items-center justify-center mx-auto border border-[#383430]">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#F5EFEB]">
                  Nenhum monstro encontrado
                </h3>
                <p className="text-xs text-[#B0A497] max-w-sm mx-auto">
                  Nenhuma criatura corresponde ao termo de busca "
                  <strong>{searchTerm}</strong>".
                </p>
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 rounded-lg bg-[#242220] hover:bg-[#2E2B27] text-xs font-bold text-[#FF9B42] border border-[#383430] transition-colors cursor-pointer"
                >
                  Limpar Filtro de Busca
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCreatures.map((data) => (
                  <CardCreature
                    key={data.id}
                    data={data}
                    handleOpenRename={() =>
                      handleOpenRename(data.id, data.name, "creature")
                    }
                    onDuplicateCreature={onDuplicateCreature}
                    setDeleteTarget={() =>
                      setDeleteTarget({
                        id: data.id,
                        name: data.name,
                        type: "creature",
                      })
                    }
                    onOpenCreature={onOpenCreature}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: NOVO FERAL */}
      {isNewFeralModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1A1918] w-full max-w-md rounded-2xl border border-[#383430] shadow-2xl p-6 space-y-4 text-[#F5EFEB]">
            <h3 className="font-serif font-black text-lg text-[#89B5F7]">
              Criar Novo Feral
            </h3>
            <form
              onSubmit={handleCreateFeralSubmit}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                  Nome do Feral *
                </label>
                <input
                  type="text"
                  required
                  value={newFeralName}
                  onChange={(e) => setNewFeralName(e.target.value)}
                  placeholder="Ex: Maya, Garra de Ferro..."
                  className="w-full px-3 py-2 rounded-lg bg-[#242220] border border-[#383430] font-bold text-sm text-[#89B5F7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                  Pronomes
                </label>
                <input
                  type="text"
                  value={newFeralPronouns}
                  onChange={(e) => setNewFeralPronouns(e.target.value)}
                  placeholder="ele/dele, ela/dela, elu/delu..."
                  className="w-full px-3 py-1.5 rounded-lg bg-[#242220] border border-[#383430]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                    Especialidade
                  </label>
                  <select
                    value={newFeralSpecialty}
                    onChange={(e) => setNewFeralSpecialty(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#242220] border border-[#383430] font-bold text-[#89B5F7]"
                  >
                    {Object.keys(SPECIALTIES_DATA).map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                    Utensílio Inicial
                  </label>
                  <select
                    value={newFeralUtensil}
                    onChange={(e) =>
                      setNewFeralUtensil(e.target.value as UtensilKey)
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#242220] border border-[#383430] font-bold text-[#FF9B42]"
                  >
                    {Object.keys(UTENSILS_DATA).map((ut) => (
                      <option key={ut} value={ut}>
                        {ut}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2B2825]">
                <button
                  type="button"
                  onClick={() => setIsNewFeralModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#242220] hover:bg-[#2E2B27] text-[#F5EFEB] font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#13335C] hover:bg-[#0E2644] text-white font-bold border border-[#2B6CB0]/40 cursor-pointer"
                >
                  Criar Feral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: NOVA CRIATURA */}
      {/* ========================================================= */}
      {isNewCreatureModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1A1918] w-full max-w-md rounded-2xl border border-[#383430] shadow-2xl p-6 space-y-4 text-[#F5EFEB]">
            <h3 className="font-serif font-black text-lg text-[#89B5F7]">
              Criar Novo Monstro
            </h3>
            <form
              onSubmit={handleCreateCreatureSubmit}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                  Nome da Criatura *
                </label>
                <input
                  type="text"
                  required
                  value={newCreatureName}
                  onChange={(e) => setNewCreatureName(e.target.value)}
                  placeholder="Ex: Satra Alfa, Magmagarto..."
                  className="w-full px-3 py-2 rounded-lg bg-[#242220] border border-[#383430] font-bold text-sm text-[#89B5F7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                    Linhagem
                  </label>
                  <select
                    value={newCreatureLineage}
                    onChange={(e) =>
                      setNewCreatureLineage(e.target.value as MonsterLineage)
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#242220] border border-[#383430] font-bold text-[#89B5F7]"
                  >
                    {MONSTER_LINEAGES.map((lin) => (
                      <option key={lin.name} value={lin.name}>
                        {lin.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#B0A497] mb-1">
                    Estágio de Vida
                  </label>
                  <select
                    value={newCreatureStage}
                    onChange={(e) =>
                      setNewCreatureStage(e.target.value as MonsterStage)
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#242220] border border-[#383430] font-bold text-[#FF9B42]"
                  >
                    <option value="Jovem">Jovem (Vigor 20)</option>
                    <option value="Adulto">Adulto (Vigor 30)</option>
                    <option value="Ancião">Ancião (Vigor 40)</option>
                    <option value="Zênite">Zênite (Vigor 50)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2B2825]">
                <button
                  type="button"
                  onClick={() => setIsNewCreatureModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#242220] hover:bg-[#2E2B27] text-[#F5EFEB] font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#13335C] hover:bg-[#0E2644] text-white font-bold border border-[#2B6CB0]/40 cursor-pointer"
                >
                  Criar Monstro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: RENOMEAR */}
      {/* ========================================================= */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1A1918] w-full max-w-sm rounded-2xl border border-[#383430] shadow-2xl p-5 space-y-3 text-[#F5EFEB]">
            <h3 className="font-serif font-bold text-sm text-[#89B5F7]">
              Renomear Ficha
            </h3>
            <form onSubmit={handleConfirmRename} className="space-y-3 text-xs">
              <input
                type="text"
                required
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#242220] border border-[#383430] font-bold text-[#F5EFEB]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRenameTarget(null)}
                  className="px-3 py-1.5 rounded-lg bg-[#242220] text-xs font-bold text-[#B0A497] hover:text-[#F5EFEB] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-[#13335C] text-white text-xs font-bold border border-[#2B6CB0]/40 cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EXCLUIR */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1A1918] w-full max-w-sm rounded-2xl border border-[#383430] shadow-2xl p-5 space-y-3 text-[#F5EFEB]">
            <h3 className="font-serif font-bold text-sm text-[#FC8181]">
              Confirmar Exclusão
            </h3>
            <p className="text-xs text-[#B0A497]">
              Tem certeza que deseja excluir permanentemente a ficha de{" "}
              <strong>"{deleteTarget.name}"</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-1.5 rounded-lg bg-[#242220] text-xs font-bold text-[#B0A497] hover:text-[#F5EFEB] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 rounded-lg bg-[#9B2C2C] hover:bg-[#822424] text-white text-xs font-bold cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compendium Modal */}
      <CompendiumModal
        isOpen={isCompendiumOpen}
        onClose={() => setIsCompendiumOpen(false)}
      />
    </main>
  );
};
