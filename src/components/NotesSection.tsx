import React from "react";
import {
  BookOpenText,
  Plus,
  Trash2,
  Calendar,
  Search,
  StickyNote,
} from "lucide-react";
import { FeralSheet, JournalNote } from "../types";

interface NotesSectionProps {
  sheet: FeralSheet;
  onChange: (updated: Partial<FeralSheet>) => void;
  onShowToast: (message: string, onUndo?: () => void) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  sheet,
  onChange,
  onShowToast,
}) => {
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const categories = [
    { id: "all", label: "Todas as Notas" },
    { id: "Caçadas & Monstros", label: "Caçadas & Monstros" },
    { id: "Receitas & Ingredientes", label: "Receitas & Ingredientes" },
    { id: "Matilha & NPCs", label: "Matilha & NPCs" },
    { id: "Locais & Trilha", label: "Locais & Trilha" },
    { id: "Juramentos & Dívidas", label: "Juramentos & Dívidas" },
  ];

  const handleAddNote = () => {
    const newNote: JournalNote = {
      id: `note-${Date.now()}`,
      title: "Nova Anotação de Caçada",
      category:
        activeCategory === "all" ? "Caçadas & Monstros" : activeCategory,
      content:
        "Escreva suas anotações sobre monstros avistados, pistas na Trilha, ingredientes ou diálogos da sessão...",
      createdAt: new Date().toLocaleDateString("pt-BR"),
    };

    onChange({
      notesList: [newNote, ...sheet.notesList],
    });
  };

  const handleUpdateNote = (id: string, fields: Partial<JournalNote>) => {
    const updated = sheet.notesList.map((n) =>
      n.id === id ? { ...n, ...fields } : n,
    );
    onChange({ notesList: updated });
  };

  const handleDeleteNote = (id: string) => {
    const target = sheet.notesList.find((n) => n.id === id);
    if (!target) return;

    const remaining = sheet.notesList.filter((n) => n.id !== id);
    onChange({ notesList: remaining });

    onShowToast(`Nota "${target.title}" excluída.`, () => {
      onChange({ notesList: [target, ...remaining] });
    });
  };

  const filteredNotes = sheet.notesList.filter((n) => {
    const matchCat = activeCategory === "all" || n.category === activeCategory;
    const matchSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-6">
      {/* Header & Controls */}
      <div className="bg-[#1E1D1A] rounded-2xl p-5 sm:p-6 border-2 border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpenText className="w-5 h-5 text-[#FF9B42]" />
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-amber-300">
                DIÁRIO DE JORNADA & ANOTAÇÕES
              </h2>
              <p className="text-xs text-zinc-400">
                Registre pistas, anatomia de feras encontradas, receitas
                secretas e acontecimentos das sessões.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddNote}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F28C28] hover:bg-[#D47318] text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Anotação</span>
          </button>
        </div>

        {/* Categories & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === c.id
                    ? "bg-[#F28C28] text-white shadow-xs"
                    : "bg-zinc-800 text-zinc-300 hover:bg-amber-100 border border-zinc-700"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar em todas as notas..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-zinc-700 text-xs bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-[#F28C28]"
            />
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="p-12 text-center bg-zinc-900/30 rounded-2xl border-2 border-dashed border-zinc-800 space-y-2">
          <StickyNote className="w-8 h-8 text-zinc-400 mx-auto" />
          <p className="text-sm font-semibold text-zinc-300">
            Nenhuma anotação encontrada.
          </p>
          <p className="text-xs text-zinc-400">
            Clique em "Nova Anotação" para começar a registrar sua jornada pelos
            ermos de Wilderfeast.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-[#1E1D1A] rounded-2xl p-5 border border-white/10 shadow-xs hover:border-[#F28C28]/40 transition-all flex flex-col justify-between gap-3 relative"
            >
              <div className="space-y-2">
                {/* Title & Delete */}
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={note.title}
                    onChange={(e) =>
                      handleUpdateNote(note.id, { title: e.target.value })
                    }
                    placeholder="Título da Nota"
                    className="font-display font-bold text-base text-amber-300 bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-[#F28C28] outline-none flex-1 pb-0.5"
                  />

                  <button
                    type="button"
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-zinc-400 hover:text-red-600 p-1 cursor-pointer"
                    title="Excluir Nota"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Category & Date bar */}
                <div className="flex items-center gap-2 text-xs">
                  <select
                    value={note.category}
                    onChange={(e) =>
                      handleUpdateNote(note.id, { category: e.target.value })
                    }
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700 text-amber-200 outline-none cursor-pointer"
                  >
                    <option value="Caçadas & Monstros">
                      Caçadas & Monstros
                    </option>
                    <option value="Receitas & Ingredientes">
                      Receitas & Ingredientes
                    </option>
                    <option value="Matilha & NPCs">Matilha & NPCs</option>
                    <option value="Locais & Trilha">Locais & Trilha</option>
                    <option value="Juramentos & Dívidas">
                      Juramentos & Dívidas
                    </option>
                  </select>

                  <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-code">
                    <Calendar className="w-3 h-3" />
                    {note.createdAt}
                  </span>
                </div>

                {/* Note Content */}
                <textarea
                  rows={6}
                  value={note.content}
                  onChange={(e) =>
                    handleUpdateNote(note.id, { content: e.target.value })
                  }
                  placeholder="Escreva os detalhes..."
                  className="w-full p-3 rounded-xl bg-black/20 border border-zinc-800 text-xs sm:text-sm text-zinc-200 leading-relaxed outline-none focus:ring-1 focus:ring-[#F28C28] resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
