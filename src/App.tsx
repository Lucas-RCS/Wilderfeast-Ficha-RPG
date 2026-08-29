import { useState } from "react";
import { useToast } from "./hooks/useToast";
import { RulesButton } from "./components/ui/RulesButton";
import RulesModal from "./components/ui/RulesModal";
import Hub from "./page/Hub";
import FeralSheet from "./components/layout/FeralSheet";
import CreatureSheet from "./components/layout/CreatureSheet";
import type { ID } from "./types/types";

// Um union discriminado guarda o módulo ativo junto com o ID relevante,
// então nunca existe um estado "feral" sem saber qual Feral abrir.
type ActiveModule =
  | { view: "hub" }
  | { view: "feral"; feralId: ID }
  | { view: "creature"; creatureId: ID };

export default function App() {
  const { showToast } = useToast();
  const [activeModule, setActiveModule] = useState<ActiveModule>({
    view: "hub",
  });
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const handleOpenRules = () => {
    setIsRulesOpen(true);
  };

  const goToHub = () => setActiveModule({ view: "hub" });

  return (
    <div className="w-full min-h-screen bg-[#121110] text-[#F5EFEB] flex flex-col font-sans">
      {activeModule.view === "hub" && (
        <Hub
          onOpenFeral={(feralId) => setActiveModule({ view: "feral", feralId })}
          onOpenCreature={(creatureId) =>
            setActiveModule({ view: "creature", creatureId })
          }
        />
      )}

      {activeModule.view === "feral" && (
        <FeralSheet
          feralId={activeModule.feralId}
          onBack={goToHub}
          onDeleted={goToHub}
        />
      )}

      {activeModule.view === "creature" && (
        <CreatureSheet
          creatureId={activeModule.creatureId}
          onBack={goToHub}
          onDeleted={goToHub}
        />
      )}

      <RulesButton onOpen={handleOpenRules} />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}
