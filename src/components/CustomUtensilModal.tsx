import React, { useState } from "react";
import { X, Plus, Trash2, Wrench, Sparkles, AlertCircle } from "lucide-react";
import type { StyleKey, CustomUtensil, ITechnique } from "../types";
import { saveCustomUtensil } from "../lib/storage";

interface CustomUtensilModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUtensil: (custom: CustomUtensil) => void;
}

const STYLE_NAMES: Record<StyleKey, string> = {
  ligeiro: "Ligeiro",
  poderoso: "Poderoso",
  preciso: "Preciso",
  sagaz: "Sagaz",
};

export const CustomUtensilModal: React.FC<CustomUtensilModalProps> = ({
  isOpen,
  onClose,
  onSelectUtensil,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [style1, setStyle1] = useState<StyleKey>("poderoso");
  const [style2, setStyle2] = useState<StyleKey>("preciso");
  const [reach, setReach] = useState<number>(1);
  const [maxDurability, setMaxDurability] = useState<number>(20);

  const [techniques, setTechniques] = useState<ITechnique[]>([
    {
      id: "custom-tech-1",
      name: "TÉCNICA DE ABERTURA",
      level: "Iniciante",
      cost: "2 Ações",
      description:
        "Aproveita a anatomia singular do utensílio para golpear ou manobrar com eficácia.",
    },
  ]);

  if (!isOpen) return null;

  const isDuplicateStyle = style1 === style2;

  const handleAddTechnique = () => {
    setTechniques((prev) => [
      ...prev,
      {
        id: `custom-tech-${Date.now()}`,
        name: "",
        level: "Iniciante",
        cost: "2 Ações",
        description: "",
      },
    ]);
  };

  const handleRemoveTechnique = (id: string) => {
    setTechniques((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTechnique = <K extends keyof ITechnique>(
    id: string,
    field: K,
    value: ITechnique[K],
  ) => {
    setTechniques((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isDuplicateStyle) return;

    const newUtensil: CustomUtensil = {
      id: `utensil-${Date.now()}`,
      name: name.trim(),
      description:
        description.trim() || "Utensílio de arkaicaço forjado sob medida.",
      style1,
      style2,
      reach,
      maxDurability,
      techniques: techniques.filter((t) => t.name.trim().length > 0),
    };

    saveCustomUtensil(newUtensil);
    onSelectUtensil(newUtensil);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1A1917] text-[#F3EFE6] rounded-xl border border-[#3E3A34] shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3E3A34]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#13335C] text-white">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif">
                Criar Novo Utensílio
              </h2>
              <p className="text-xs text-[#A09383]">
                Combine dois Estilos distintos e personalize técnicas e
                durabilidade
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#B0A497] hover:bg-[#25221F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Nome e Descrição */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A09383] mb-1">
                Nome do Utensílio *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Amaciador de Carne, Garfo Titânico, Foice de Arkaicaço..."
                required
                className="w-full px-3 py-2 text-sm font-semibold rounded-lg bg-[#25221F] border border-[#3E3A34] focus:outline-none focus:ring-2 focus:ring-[#E2A053]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A09383] mb-1">
                Descrição & Propósito Culinário
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Como essa ferramenta foi adaptada dos reis verdes para a caçada e o preparo de monstros?"
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#25221F] border border-[#3E3A34] focus:outline-none focus:ring-2 focus:ring-[#E2A053]"
              />
            </div>
          </div>

          {/* Combinação de Dois Estilos */}
          <div className="p-4 rounded-lg bg-[#25221F] border border-[#3E3A34]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#E2A053] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Combinação de Dois Estilos Primários</span>
            </h3>
            <p className="text-[11px] text-[#A09383] mb-3">
              Segundo o livro básico, cada utensílio expressa uma combinação sem
              ordem de dois Estilos diferentes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#A09383] mb-1">
                  Primeiro Estilo (3 Dados iniciais)
                </label>
                <select
                  value={style1}
                  onChange={(e) => setStyle1(e.target.value as StyleKey)}
                  className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1A1917] border border-[#3E3A34]"
                >
                  {(Object.keys(STYLE_NAMES) as StyleKey[]).map((st) => (
                    <option key={st} value={st}>
                      {STYLE_NAMES[st]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#A09383] mb-1">
                  Segundo Estilo (2 Dados iniciais)
                </label>
                <select
                  value={style2}
                  onChange={(e) => setStyle2(e.target.value as StyleKey)}
                  className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1A1917] border border-[#3E3A34]"
                >
                  {(Object.keys(STYLE_NAMES) as StyleKey[]).map((st) => (
                    <option key={st} value={st}>
                      {STYLE_NAMES[st]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isDuplicateStyle && (
              <div className="mt-2 text-xs font-bold text-[#FC8181] flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span>Escolha dois Estilos diferentes para o utensílio.</span>
              </div>
            )}
          </div>

          {/* Alcance e Durabilidade Base */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A09383] mb-1">
                Alcance Base (Pernadas)
              </label>
              <input
                type="number"
                min={0}
                max={4}
                value={reach}
                onChange={(e) =>
                  setReach(Math.max(0, parseInt(e.target.value) || 1))
                }
                className="w-full px-3 py-1.5 text-xs font-bold rounded-lg bg-[#25221F] border border-[#3E3A34]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A09383] mb-1">
                Durabilidade Máxima
              </label>
              <input
                type="number"
                min={10}
                max={60}
                step={5}
                value={maxDurability}
                onChange={(e) =>
                  setMaxDurability(Math.max(10, parseInt(e.target.value) || 20))
                }
                className="w-full px-3 py-1.5 text-xs font-bold rounded-lg bg-[#25221F] border border-[#3E3A34]"
              />
            </div>
          </div>

          {/* Técnicas Iniciais */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#A09383]">
                Técnicas Personalizadas ({techniques.length})
              </label>
              <button
                type="button"
                onClick={handleAddTechnique}
                className="text-xs font-bold text-[#E2A053] flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Técnica</span>
              </button>
            </div>

            <div className="space-y-3">
              {techniques.map((tech, idx) => (
                <div
                  key={tech.id}
                  className="p-3 rounded-lg bg-[#25221F] border border-[#3E3A34] space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nome da Técnica..."
                      value={tech.name}
                      onChange={(e) =>
                        handleUpdateTechnique(tech.id, "name", e.target.value)
                      }
                      className="flex-1 px-2.5 py-1 text-xs font-bold rounded bg-[#1A1917] border border-[#3E3A34]"
                    />
                    <select
                      value={tech.level}
                      onChange={(e) =>
                        handleUpdateTechnique(
                          tech.id,
                          "level",
                          e.target.value as ITechnique["level"],
                        )
                      }
                      className="px-2 py-1 text-[11px] font-semibold rounded bg-[#1A1917] border border-[#3E3A34]"
                    >
                      <option value="Iniciante">Iniciante</option>
                      <option value="Intermediária">Intermediária</option>
                      <option value="Avançada">Avançada</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Custo (ex: 2 Ações, 3 Vigor, Passiva)"
                      value={tech.cost}
                      onChange={(e) =>
                        handleUpdateTechnique(tech.id, "cost", e.target.value)
                      }
                      className="w-36 px-2.5 py-1 text-xs rounded bg-[#1A1917] border border-[#3E3A34]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnique(tech.id)}
                      className="p-1 text-[#FC8181] hover:bg-[#322E29] rounded"
                      title="Remover técnica"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    placeholder="Descrição do efeito mecânico da técnica..."
                    value={tech.description}
                    onChange={(e) =>
                      handleUpdateTechnique(
                        tech.id,
                        "description",
                        e.target.value,
                      )
                    }
                    rows={2}
                    className="w-full px-2.5 py-1.5 text-xs rounded bg-[#1A1917] border border-[#3E3A34]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3E3A34]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#25221F] hover:bg-[#33302B] text-[#F3EFE6] font-bold text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isDuplicateStyle}
              className={`px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 ${
                !name.trim() || isDuplicateStyle
                  ? "bg-[#4A453E] text-white cursor-not-allowed opacity-60"
                  : "bg-[#E2A053] hover:bg-[#D48F42] text-[#1A1917]"
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Criar Utensílio & Equipar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
