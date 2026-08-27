import React, { useState } from "react";
import type {
  IFeral,
  ICreature,
  IFeralCard,
  ICreatureCard,
  MonsterStage,
  MonsterLineage,
  UtensilKey,
} from "./types";
import {
  loadAllFeralCards,
  loadFeral,
  saveFeral,
  deleteFeral,
  duplicateFeral,
  renameFeral,
  loadAllCreatureCards,
  loadCreature,
  saveCreature,
  deleteCreature,
  duplicateCreature,
  renameCreature,
  exportFeralAsJSON,
  importFeralFromJSON,
  exportCreatureAsJSON,
  importCreatureFromJSON,
} from "./lib/storage";
import { createDefaultCreature } from "./data/creatureData";
import {
  DEFAULT_NEW_FERAL,
  UTENSILS_DATA,
  SPECIALTIES_DATA,
} from "./data/wilderfeastData";
import { useUndoRedo } from "./hooks/useUndoRedo";

import { HubView } from "./page/HubView";
import { LeftStatusColumn } from "./components/layout/MENULEFT";
import { RightDetailColumn } from "./components/layout/MENURIGHT";
import { CreatureSheetView } from "./components/layout/CreatureSheetView";
import { CreaturePrintView } from "./components/layout/CreaturePrintView";
import { FloatingControls } from "./components/ui/RulesButton";
import { CompendiumModal } from "./components/ui/RulesModal";

import {
  ArrowLeft,
  Check,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  BookOpen,
  ShieldAlert,
} from "lucide-react";

function createFeralDraft(): IFeral {
  return JSON.parse(JSON.stringify(DEFAULT_NEW_FERAL)) as IFeral;
}

export function App() {
  // Navigation Module: 'hub' | 'feral' | 'creature'
  const [activeModule, setActiveModule] = useState<
    "hub" | "feral" | "creature"
  >("hub");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Summaries list
  const [feralCards, setFeralCards] = useState<IFeralCard[]>(() =>
    loadAllFeralCards(),
  );
  const [creatureCards, setCreatureCards] = useState<ICreatureCard[]>(() =>
    loadAllCreatureCards(),
  );

  // Undo/Redo mantém somente a ficha completa atualmente aberta.
  const feralHistory = useUndoRedo<IFeral>(createFeralDraft());
  const creatureHistory = useUndoRedo<ICreature>(
    createDefaultCreature("Nova Criatura", "Molheiro", "Adulto"),
  );

  // Modals & Tools
  const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const refreshCards = () => {
    setFeralCards(loadAllFeralCards());
    setCreatureCards(loadAllCreatureCards());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // =========================================================
  // HUB NAVIGATION & ACTIONS (FERAIS)
  // =========================================================
  const handleOpenFeral = (id: string) => {
    const sheet = loadFeral(id);
    if (sheet) {
      feralHistory.resetState(sheet);
      setActiveId(id);
      setActiveModule("feral");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCreateFeral = (
    name: string,
    pronouns: string,
    specialty: string,
    utensil: UtensilKey,
  ) => {
    const base = createFeralDraft();
    const utDef = UTENSILS_DATA[utensil];
    const specDef = SPECIALTIES_DATA[specialty];

    const initialTraits =
      specDef?.initialTraits?.map((t, idx) => ({
        id: `trait-initial-${idx}`,
        name: t.name,
        level: 1,
        cost: t.cost,
        type: t.type,
        description: t.description,
      })) || [];

    const newSheet: IFeral = {
      ...base,
      id: `feral-${Date.now()}`,
      identity: {
        ...base.identity,
        name,
        pronouns,
        specialty,
      },
      utensil: {
        ...base.utensil,
        type: utensil,
        customName: `${utensil}`,
        reach: utDef?.reach ?? 1,
        maxDurability: utDef?.baseDurability ?? 20,
        currentDurability: utDef?.baseDurability ?? 20,
      },
      traits: [...base.traits, ...initialTraits],
    };

    saveFeral(newSheet);
    refreshCards();
    handleOpenFeral(newSheet.id);
    showToast(`Ficha de "${name}" criada com sucesso!`);
  };

  const handleDuplicateFeral = (id: string) => {
    const duplicated = duplicateFeral(id);
    if (duplicated) {
      refreshCards();
      showToast(`Ficha duplicada: "${duplicated.identity.name || "Feral"}"`);
    }
  };

  const handleRenameFeral = (id: string, newName: string) => {
    renameFeral(id, newName);
    refreshCards();
    showToast(`Ficha renomeada para "${newName}"`);
  };

  const handleDeleteFeral = (id: string) => {
    deleteFeral(id);
    refreshCards();
    showToast("Ficha de Feral excluída.");
  };

  const handleImportFeral = (jsonString: string) => {
    const imported = importFeralFromJSON(jsonString);
    if (imported) {
      refreshCards();
      handleOpenFeral(imported.id);
      showToast(
        `Ficha importada com sucesso: "${imported.identity.name || "Feral"}"`,
      );
    } else {
      showToast("Erro ao importar JSON. Verifique a formatação do arquivo.");
    }
  };

  // =========================================================
  // HUB NAVIGATION & ACTIONS (CRIATURAS)
  // =========================================================
  const handleOpenCreature = (id: string) => {
    const sheet = loadCreature(id);
    if (sheet) {
      creatureHistory.resetState(sheet);
      setActiveId(id);
      setActiveModule("creature");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCreateCreature = (
    name: string,
    lineage: MonsterLineage,
    stage: MonsterStage,
  ) => {
    const newMonster = createDefaultCreature(name, lineage, stage);
    saveCreature(newMonster);
    refreshCards();
    handleOpenCreature(newMonster.id);
    showToast(`Monstro "${name}" criado com sucesso!`);
  };

  const handleDuplicateCreature = (id: string) => {
    const duplicated = duplicateCreature(id);
    if (duplicated) {
      refreshCards();
      showToast(
        `Criatura duplicada: "${duplicated.identity.name || "Criatura"}"`,
      );
    }
  };

  const handleRenameCreature = (id: string, newName: string) => {
    renameCreature(id, newName);
    refreshCards();
    showToast(`Criatura renomeada para "${newName}"`);
  };

  const handleDeleteCreature = (id: string) => {
    deleteCreature(id);
    refreshCards();
    showToast("Criatura excluída do bestiário.");
  };

  const handleImportCreature = (jsonString: string) => {
    const imported = importCreatureFromJSON(jsonString);
    if (imported) {
      refreshCards();
      handleOpenCreature(imported.id);
      showToast(
        `Criatura importada com sucesso: "${imported.identity.name || "Criatura"}"`,
      );
    } else {
      showToast("Erro ao importar JSON da criatura.");
    }
  };

  // =========================================================
  // SHEET EDIT HANDLERS (AUTOSAVE WITH PERSISTENCE)
  // =========================================================
  const handleFeralChange = (updated: Partial<IFeral>) => {
    const prev = feralHistory.state || createFeralDraft();
    const nextState: IFeral = { ...prev, ...updated };
    feralHistory.setState(nextState);
    saveFeral(nextState);
  };

  const handleCreatureChange = (updated: Partial<ICreature>) => {
    const prev =
      creatureHistory.state ||
      createDefaultCreature("Nova Criatura", "Molheiro", "Adulto");
    const nextState: ICreature = { ...prev, ...updated };
    creatureHistory.setState(nextState);
    saveCreature(nextState);
  };

  const handleClearSheet = () => {
    if (activeModule === "feral") {
      const current = feralHistory.state || createFeralDraft();
      const cleared = createFeralDraft();
      cleared.id = current.id || cleared.id;
      if (current.identity) {
        cleared.identity.name = current.identity.name || "";
        cleared.identity.pronouns = current.identity.pronouns || "";
        cleared.identity.specialty = current.identity.specialty || "Açougueiro";
      }
      if (current.utensil) {
        cleared.utensil.type = current.utensil.type || "Cutelo";
      }
      feralHistory.setImmediate(cleared);
      saveFeral(cleared);
      refreshCards();
      showToast(
        "Ficha limpa! Você pode desfazer esta ação pelo botão Desfazer.",
      );
    } else if (activeModule === "creature") {
      const current =
        creatureHistory.state ||
        createDefaultCreature("Nova Criatura", "Molheiro", "Adulto");
      const cleared = createDefaultCreature(
        current.identity.name || "Nova Criatura",
        current.identity.lineage || "Molheiro",
        current.identity.stage || "Adulto",
      );
      cleared.id = current.id || cleared.id;
      creatureHistory.setImmediate(cleared);
      saveCreature(cleared);
      refreshCards();
      showToast(
        "Criatura restaurada ao padrão! Você pode desfazer pelo botão Desfazer.",
      );
    }
    setIsClearConfirmOpen(false);
  };

  const handlePDFExport = async () => {
    setIsExportingPDF(true);
    showToast("Gerando documento PDF em alta resolução...");

    try {
      const elementId =
        activeModule === "feral" ? "print-feral-sheet" : "print-creature-sheet";
      const element = document.getElementById(elementId);
      const fileName =
        activeModule === "feral"
          ? `Wilderfeast_Feral_${feralHistory.state?.identity.name || "SemNome"}.pdf`
          : `Wilderfeast_Criatura_${creatureHistory.state?.identity.name || "SemNome"}.pdf`;

      if (element) {
        const { exportElementToPDF } = await import("./lib/pdfExport");
        await exportElementToPDF(element, {
          fileName,
          onComplete: () => {
            setIsExportingPDF(false);
            showToast("PDF baixado com sucesso!");
          },
          onError: () => {
            setIsExportingPDF(false);
            window.print();
          },
        });
      } else {
        window.print();
        setIsExportingPDF(false);
      }
    } catch {
      setIsExportingPDF(false);
      window.print();
    }
  };

  const handleExportCurrentJSON = () => {
    if (activeModule === "feral") {
      const sheet = feralHistory.state || createFeralDraft();
      exportFeralAsJSON(sheet);
      showToast("Ficha de Feral exportada em JSON.");
    } else if (activeModule === "creature") {
      const sheet =
        creatureHistory.state ||
        createDefaultCreature("Nova Criatura", "Molheiro", "Adulto");
      exportCreatureAsJSON(sheet);
      showToast("Criatura exportada em JSON.");
    }
  };

  const currentFeral = feralHistory.state || createFeralDraft();
  const currentCreature =
    creatureHistory.state ||
    createDefaultCreature("Nova Criatura", "Molheiro", "Adulto");

  return (
    <div className="w-full min-h-screen bg-[#121110] text-[#F5EFEB] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#13335C] text-white font-bold text-xs shadow-2xl border border-[#2B6CB0] flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-[#FF9B42]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* SCREEN 1: HUB VIEW (Default entry point) */}
      {/* ========================================================= */}
      {activeModule === "hub" && (
        <HubView
          feralCards={feralCards}
          creatureCards={creatureCards}
          onOpenFeral={handleOpenFeral}
          onCreateFeral={handleCreateFeral}
          onDuplicateFeral={handleDuplicateFeral}
          onRenameFeral={handleRenameFeral}
          onDeleteFeral={handleDeleteFeral}
          onImportFeral={handleImportFeral}
          onOpenCreature={handleOpenCreature}
          onCreateCreature={handleCreateCreature}
          onDuplicateCreature={handleDuplicateCreature}
          onRenameCreature={handleRenameCreature}
          onDeleteCreature={handleDeleteCreature}
          onImportCreature={handleImportCreature}
        />
      )}

      {activeModule === "feral" && (
        <div className="w-full flex-1 flex flex-col">
          {/* Top Bar for Active Sheet */}
          <header className="sticky top-0 z-30 w-full px-4 sm:px-8 py-3 bg-[#1A1918] border-b border-[#383430] flex items-center justify-between shadow-xs print:hidden">
            <div className="flex items-center gap-3">
              <button
                id="btn-back-hub"
                type="button"
                onClick={() => {
                  refreshCards();
                  setActiveModule("hub");
                }}
                className="px-3 py-1.5 rounded-lg bg-[#242220] hover:bg-[#2E2B28] text-[#89B5F7] font-bold text-xs flex items-center gap-1.5 border border-[#383430] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <div className="hidden sm:flex items-center gap-2">
                <span className="font-serif font-black text-sm text-[#89B5F7] truncate max-w-[200px]">
                  {currentFeral.identity.name || "Feral Sem Nome"}
                </span>
                <span className="text-xs text-[#B0A497]">
                  • {currentFeral.identity.specialty}
                </span>
              </div>
            </div>

            {/* Quick Action Tools */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={feralHistory.undo}
                disabled={!feralHistory.canUndo}
                className="p-2 rounded-lg text-[#B0A497] hover:bg-[#242220] hover:text-[#F5EFEB] disabled:opacity-30 transition-colors cursor-pointer"
                title="Desfazer alteração (Ctrl+Z)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={feralHistory.redo}
                disabled={!feralHistory.canRedo}
                className="p-2 rounded-lg text-[#B0A497] hover:bg-[#242220] hover:text-[#F5EFEB] disabled:opacity-30 transition-colors cursor-pointer"
                title="Refazer alteração (Ctrl+Y)"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsClearConfirmOpen(true)}
                className="p-2 rounded-lg text-[#FC8181] hover:bg-[#9B2C2C]/30 transition-colors cursor-pointer"
                title="Limpar ficha (com confirmação)"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-5 bg-[#383430] mx-1" />

              <button
                type="button"
                onClick={handleExportCurrentJSON}
                className="p-2 rounded-lg text-[#B0A497] hover:bg-[#242220] hover:text-[#89B5F7] transition-colors cursor-pointer"
                title="Exportar Ficha em JSON"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsCompendiumOpen(true)}
                className="p-2 rounded-lg text-[#89B5F7] hover:bg-[#242220] transition-colors cursor-pointer"
                title="Abrir Compêndio de Regras"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* 100% Fluid 2-Column Responsive Layout */}
          <main className="w-full flex-1 px-4 sm:px-8 lg:px-12 py-6 print:hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left 5 cols: Identity, Vigor, Styles, Utensil & Conditions */}
              <div className="lg:col-span-5 w-full">
                <LeftStatusColumn
                  sheet={currentFeral}
                  onChange={handleFeralChange}
                  onOpenCompendiumWithTopic={() => setIsCompendiumOpen(true)}
                />
              </div>

              {/* Right 7 cols: Tabbed Details (Skills, Techniques, Traits, Beasts/Feasts, Notes) */}
              <div className="lg:col-span-7 w-full">
                <RightDetailColumn
                  sheet={currentFeral}
                  onChange={handleFeralChange}
                  onOpenCompendium={() => setIsCompendiumOpen(true)}
                />
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================= */}
      {/* SCREEN 3: ACTIVE CREATURE SHEET (Bestiary for GM) */}
      {/* ========================================================= */}
      {activeModule === "creature" && (
        <div className="w-full flex-1 flex flex-col">
          {/* Top Bar for Creature Sheet */}
          <header className="sticky top-0 z-30 w-full px-4 sm:px-8 py-3 bg-[#1A1918] border-b border-[#383430] flex items-center justify-between shadow-xs print:hidden">
            <div className="flex items-center gap-3">
              <button
                id="btn-back-hub-creature"
                type="button"
                onClick={() => {
                  refreshCards();
                  setActiveModule("hub");
                }}
                className="px-3 py-1.5 rounded-lg bg-[#242220] hover:bg-[#2E2B28] text-[#89B5F7] font-bold text-xs flex items-center gap-1.5 border border-[#383430] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Hub</span>
              </button>

              <div className="hidden sm:flex items-center gap-2">
                <span className="font-serif font-black text-sm text-[#89B5F7] truncate max-w-[200px]">
                  {currentCreature.identity.name || "Criatura Sem Nome"}
                </span>
                <span className="text-xs text-[#B0A497]">
                  • {currentCreature.identity.lineage} (
                  {currentCreature.identity.stage})
                </span>
                <span className="text-[11px] font-semibold text-[#38C2B3] flex items-center gap-1 ml-2">
                  <Check className="w-3 h-3" />
                  <span>Autosave</span>
                </span>
              </div>
            </div>

            {/* Quick Action Tools */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={creatureHistory.undo}
                disabled={!creatureHistory.canUndo}
                className="p-2 rounded-lg text-[#B0A497] hover:bg-[#242220] hover:text-[#F5EFEB] disabled:opacity-30 transition-colors cursor-pointer"
                title="Desfazer alteração (Ctrl+Z)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={creatureHistory.redo}
                disabled={!creatureHistory.canRedo}
                className="p-2 rounded-lg text-[#B0A497] hover:bg-[#242220] hover:text-[#F5EFEB] disabled:opacity-30 transition-colors cursor-pointer"
                title="Refazer alteração (Ctrl+Y)"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsClearConfirmOpen(true)}
                className="p-2 rounded-lg text-[#FC8181] hover:bg-[#9B2C2C]/30 transition-colors cursor-pointer"
                title="Restaurar monstro ao padrão"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-5 bg-[#383430] mx-1" />

              <button
                type="button"
                onClick={handleExportCurrentJSON}
                className="p-2 rounded-lg text-[#B0A497] hover:bg-[#242220] hover:text-[#89B5F7] transition-colors cursor-pointer"
                title="Exportar Monstro em JSON"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsCompendiumOpen(true)}
                className="p-2 rounded-lg text-[#89B5F7] hover:bg-[#242220] transition-colors cursor-pointer"
                title="Abrir Compêndio de Regras"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Creature Sheet View */}
          <CreatureSheetView
            sheet={currentCreature}
            onChange={handleCreatureChange}
            onOpenCompendium={() => setIsCompendiumOpen(true)}
          />

          {/* Hidden Print Container for High Resolution PDF Export */}
          <div id="print-creature-sheet" className="hidden">
            <CreaturePrintView sheet={currentCreature} />
          </div>
        </div>
      )}

      <FloatingControls onOpenCompendium={() => setIsCompendiumOpen(true)} />

      <CompendiumModal
        isOpen={isCompendiumOpen}
        onClose={() => setIsCompendiumOpen(false)}
      />

      {isClearConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1A1918] w-full max-w-sm rounded-2xl border border-[#383430] shadow-2xl p-6 space-y-3 text-[#F5EFEB]">
            <div className="flex items-center gap-2 text-[#FC8181]">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-serif font-black text-base uppercase">
                Limpar Ficha
              </h3>
            </div>
            <p className="text-xs text-[#B0A497] leading-relaxed">
              Tem certeza que deseja redefinir os campos desta ficha para os
              valores iniciais? (Você ainda poderá desfazer via Ctrl+Z).
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsClearConfirmOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-[#242220] hover:bg-[#2E2B28] text-[#B0A497] hover:text-[#F5EFEB] font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleClearSheet}
                className="px-3.5 py-1.5 rounded-lg bg-[#9B2C2C] hover:bg-[#822424] text-white font-bold text-xs cursor-pointer"
              >
                Confirmar Limpeza
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
