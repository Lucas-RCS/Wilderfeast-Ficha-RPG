import { useState } from "react";
import { useToast } from "./hooks/useToast";
import { RulesButton } from "./components/ui/RulesButton";
import RulesModal from "./components/ui/RulesModal";
import Hub from "./page/Hub";

export default function App() {
  const { showToast } = useToast();
  const [activeModule, setActiveModule] = useState<
    "hub" | "feral" | "creature"
  >("hub");
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const handleOpenRules = () => {
    setIsRulesOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#121110] text-[#F5EFEB] flex flex-col font-sans">
      {activeModule === "hub" && <Hub />}
      {activeModule === "feral" && <></>}
      {activeModule === "creature" && <></>}

      <RulesButton onOpen={handleOpenRules} />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}
