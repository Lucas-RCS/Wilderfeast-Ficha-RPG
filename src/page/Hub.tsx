import { useEffect, useState, type ChangeEvent } from "react";
import {
  Swords,
  Info,
  Plus,
  Search,
  Sparkles,
  Upload,
  Utensils,
  X,
  PawPrint,
  CookingPot,
  Trash2,
} from "lucide-react";
import type { IFeralCard, ICreatureCard, ID } from "../types/types";
import {
  copyCreature,
  copyFeral,
  deleteFeral,
  deleteCreature,
  getAllCreatureCards,
  getAllFeralCards,
  getItem,
  generateId,
  saveCreature,
  saveFeral,
  setItem,
} from "../lib/storage";
import { importSheet } from "../lib/sheetTransfer";
import { useToast } from "../hooks/useToast";
import { FeralCreateModal } from "../components/creation/FeralCreateModal";
import { CreatureCreateModal } from "../components/creation/CreatureCreateModal";
import { CardCreature } from "../components/ui/CardCreature";
import { CardFeral } from "../components/ui/CardFeral";
import type { DeleteTarget } from "../types/cardTypes";

interface HubProps {
  onOpenFeral: (id: ID) => void;
  onOpenCreature: (id: ID) => void;
}

export default function Hub({ onOpenFeral, onOpenCreature }: HubProps) {
  const { showToast } = useToast();
  const [showQuickGuide, setShowQuickGuide] = useState<boolean>(
    () => getItem("showQuickGuide") !== "false",
  );
  const [activeTab, setActiveTab] = useState<"ferais" | "criaturas">("ferais");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [feralCards, setFeralCards] = useState<IFeralCard[]>([]);
  const [filteredFerals, setFilteredFerals] = useState<IFeralCard[]>([]);
  const [creatureCards, setCreatureCards] = useState<ICreatureCard[]>([]);
  const [filteredCreatures, setFilteredCreatures] = useState<ICreatureCard[]>(
    [],
  );

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const handleDeleteTarget = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "feral") {
      deleteFeral(deleteTarget.id);
      setFeralCards(getAllFeralCards());
    } else {
      deleteCreature(deleteTarget.id);
      setCreatureCards(getAllCreatureCards());
    }

    setDeleteTarget(null);
  };

  const [isNewFeralModalOpen, setIsNewFeralModalOpen] =
    useState<boolean>(false);
  const [isNewCreatureModalOpen, setIsNewCreatureModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    setFeralCards(getAllFeralCards());
    setCreatureCards(getAllCreatureCards());
  }, []);

  useEffect(() => {
    setFilteredFerals(
      feralCards.filter((card) =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
    setFilteredCreatures(
      creatureCards.filter((card) =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm, feralCards, creatureCards]);

  const handleShowQuickGuide = () => {
    setItem("showQuickGuide", "false");
    setShowQuickGuide(false);
  };

  async function handleFeralImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    try {
      const feral = await importSheet(file, "feral");
      saveFeral({ ...feral, id: generateId() });
      setFeralCards(getAllFeralCards());
      setActiveTab("ferais");
      showToast("Feral importado com sucesso.");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao importar o Feral.",
      );
    }
  }

  async function handleCreatureImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    try {
      const creature = await importSheet(file, "creature");
      saveCreature({ ...creature, id: generateId() });
      setCreatureCards(getAllCreatureCards());
      setActiveTab("criaturas");
      showToast("Criatura importada com sucesso.");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Falha ao importar a Criatura.",
      );
    }
  }

  return (
    <main className="w-full min-h-screen bg-[#121110] text-[#F5EFEB] flex flex-col font-sans pb-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-10 flex-1 flex flex-col">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#242220] border border-[#383430] text-xs font-bold text-[#FF9B42] uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistema de Fichas • Wilderfeast RPG</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black  tracking-tight text-[#89B5F7] uppercase mb-2">
            Wilderfeast
          </h1>
          <p className="text-sm sm:text-base text-[#B0A497]  italic">
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
                  <h2 className=" font-black text-sm text-[#89B5F7] uppercase tracking-wide">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-[#2B2825] text-xs">
              <div className="p-3 rounded-xl bg-[#242220] border border-[#383430] space-y-1">
                <div className=" font-bold text-xs text-[#89B5F7] uppercase flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-[#FF9B42]" />
                  <span>1. Crie seu Feral</span>
                </div>
                <p className="text-[#B0A497] leading-relaxed">
                  Escolha uma Especialidade culinária e um Utensílio de
                  Arkaicaço (Cutelo, Espeto, Luvas...).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#242220] border border-[#383430] space-y-1">
                <div className=" font-bold text-xs text-[#89B5F7] uppercase flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-[#FF9B42]" />
                  <span>2. A Trilha & A Caçada</span>
                </div>
                <p className="text-[#B0A497] leading-relaxed">
                  Rastreie a presa pela Trilha e enfrente o criatura em combate
                  tático quebrando suas partes corporais.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#242220] border border-[#383430] space-y-1">
                <div className=" font-bold text-xs text-[#89B5F7] uppercase flex items-center gap-1.5">
                  <CookingPot className="w-3.5 h-3.5 text-[#38C2B3]" />
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
        <div className="w-full flex flex-col items-center mb-6 ">
          <div className="p-1.5 rounded-xl bg-[#1E1D1B] border border-[#383430] flex items-center gap-1.5 shadow-sm max-w-md w-full">
            <button
              id="hub-tab-ferais"
              type="button"
              onClick={() => setActiveTab("ferais")}
              className={`flex-1 py-3 px-4 rounded-lg  font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
              className={`flex-1 py-3 px-4 rounded-lg  font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "criaturas"
                  ? "bg-[#13335C] text-white shadow-sm border border-[#2B6CB0]/40"
                  : "bg-transparent text-[#B0A497] hover:bg-[#282623] hover:text-[#F5EFEB]"
              }`}
            >
              <PawPrint className="w-4 h-4 text-[#FF9B42]" />
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
                    : "Buscar criatura por nome, linhagem ou estágio de vida..."
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
                <h2 className="text-xl font-bold  text-[#89B5F7]">
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
                    onChange={handleFeralImport}
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
              <div
                key="no-feral"
                className="py-16 text-center rounded-2xl bg-[#1A1918] border-2 border-dashed border-[#383430] p-8 space-y-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#242220] text-[#FF9B42] flex items-center justify-center mx-auto border border-[#383430]">
                  <Utensils className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className=" font-black text-lg text-[#89B5F7]">
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
                <h3 className=" font-bold text-base text-[#F5EFEB]">
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
                    onDuplicateFeral={(e) => {
                      copyFeral(e);
                      setFeralCards(getAllFeralCards());
                    }}
                    setDeleteTarget={(e) => setDeleteTarget(e)}
                    onOpenFeral={onOpenFeral}
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
                <h2 className="text-xl font-bold  text-[#89B5F7]">
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
                    onChange={handleCreatureImport}
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
              <div
                key="no-creature"
                className="py-16 text-center rounded-2xl bg-[#1A1918] border-2 border-dashed border-[#383430] p-8 space-y-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#242220] text-[#FF9B42] flex items-center justify-center mx-auto border border-[#383430]">
                  <Swords className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className=" font-black text-lg text-[#89B5F7]">
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
                <h3 className=" font-bold text-base text-[#F5EFEB]">
                  Nenhuma criatura encontrado
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
                {filteredCreatures.map((data) => (
                  <CardCreature
                    key={data.id}
                    data={data}
                    onDuplicateCreature={(e) => {
                      copyCreature(e);
                      setCreatureCards(getAllCreatureCards());
                    }}
                    setDeleteTarget={(e) => {
                      setDeleteTarget(e);
                    }}
                    onOpenCreature={onOpenCreature}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <FeralCreateModal
        isOpen={isNewFeralModalOpen}
        onClose={() => setIsNewFeralModalOpen(false)}
        onCreated={() => {
          setFeralCards(getAllFeralCards());
          setIsNewFeralModalOpen(false);
        }}
      />
      <CreatureCreateModal
        isOpen={isNewCreatureModalOpen}
        onClose={() => setIsNewCreatureModalOpen(false)}
        onCreated={() => {
          setCreatureCards(getAllCreatureCards());
          setIsNewCreatureModalOpen(false);
        }}
      />

      {/* Modal delete feral e creature */}
      {deleteTarget && (
        <div
          id="hub-modal-delete"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#383430] bg-[#1A1918] shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#383430] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3A1F1F] text-[#FC8181]">
                <Trash2 className="h-5 w-5" />
              </div>

              <div>
                <h3 className=" text-lg font-black text-[#F5EFEB]">
                  Excluir ficha
                </h3>

                <p className="mt-0.5 text-xs text-[#7A7065]">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="mb-4 text-sm text-[#B0A497]">
                Você está prestes a excluir a seguinte ficha:
              </p>

              <div className="rounded-xl border border-[#383430] bg-[#242220] p-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#7A7065]">
                      {deleteTarget.type === "feral" ? "Feral" : "Criatura"}
                    </span>

                    <p className="truncate  text-base font-bold text-[#F5EFEB]">
                      {deleteTarget.name}
                    </p>
                  </div>

                  <div className="shrink-0 rounded-lg bg-[#2E2B27] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#B0A497]">
                    {deleteTarget.type === "feral" ? "Feral" : "Criatura"}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-[#7A7065]">
                Todos os dados associados a esta ficha serão removidos
                permanentemente.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#383430] bg-[#161514] px-6 py-4">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-[#383430] px-4 py-2.5 text-xs font-bold text-[#B0A497] transition-colors hover:bg-[#242220] hover:text-[#F5EFEB] cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDeleteTarget}
                className="inline-flex items-center gap-2 rounded-lg bg-[#9B2C2C] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#B83232] cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
