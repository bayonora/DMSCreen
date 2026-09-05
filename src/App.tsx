/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { ViewParty } from "./views/ViewParty";
import { ViewInitiative } from "./views/ViewInitiative";
import { ViewMaps } from "./views/ViewMaps";
import { ViewShops } from "./views/ViewShops";
import { ViewNotes } from "./views/ViewNotes";
import { ViewQuests } from "./views/ViewQuests";
import { ViewItems } from "./views/ViewItems";
import { cn } from "./lib/utils";
import { Users, Swords, Map as MapIcon, Store as StoreIcon, Settings, Download, Upload, X, StickyNote, Backpack, Calculator, Target } from "lucide-react";
import { store } from "./store/useStore";
import { AnimatePresence, motion } from "framer-motion";
import { CalculatorModal } from "./components/CalculatorModal";
import { WelcomeModal, FullTutorialModal } from "./components/Tutorial";
import { GlobalSearch } from "./components/GlobalSearch";
import { Info } from "lucide-react";
import { TitleTorch } from "./components/TitleTorch";
import { ImportModal } from "./components/ImportModal";

type Tab = "party" | "initiative" | "quests" | "maps" | "shops" | "notes" | "items";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("party");
  const [showSettings, setShowSettings] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [pendingImport, setPendingImport] = useState<string | null>(null);
  const [saveIndicator, setSaveIndicator] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const unsubscribe = store.subscribe(() => {
      setSaveIndicator(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setSaveIndicator(false), 2000);
    });
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPendingImport(content);
        setShowSettings(false);
      }
    };
    reader.readAsText(file);
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const confirmImport = (mode: "merge" | "overwrite") => {
    if (pendingImport) {
      store.importData(pendingImport, mode);
      setPendingImport(null);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "party": return <ViewParty />;
      case "initiative": return <ViewInitiative />;
      case "quests": return <ViewQuests />;
      case "maps": return <ViewMaps />;
      case "shops": return <ViewShops />;
      case "notes": return <ViewNotes />;
      case "items": return <ViewItems />;
      default: return null;
    }
  };

  return (
    <div 
      className="flex flex-col h-screen w-full text-[#e6e2da] overflow-hidden font-sans select-none"
      style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1614 0%, #0f0d0c 100%)', backgroundColor: '#0f0d0c' }}
    >
      <header className="flex justify-between items-center px-4 sm:px-6 py-3 border-b border-[#3a302a] bg-[#161311]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 border-2 border-[#c1a063] rotate-45 flex items-center justify-center shrink-0">
            <span className="-rotate-45 font-bold text-xl text-[#c1a063] font-display">DM</span>
          </div>
          <TitleTorch />
        </div>
        <div className="flex-1 flex justify-center px-4 max-w-lg hidden sm:flex"><GlobalSearch onNavigate={setActiveTab} /></div>
        <div className="flex items-center space-x-2">
          {saveIndicator && (
            <span className="text-[10px] text-[#c1a063] uppercase tracking-widest animate-in fade-in mr-2 opacity-70">
              Guardado
            </span>
          )}
          <button 
            onClick={() => setShowCalculator(true)}
            className="p-2 text-[#8b7355] hover:text-[#c1a063] transition-colors"
            title="Calculadora"
          >
            <Calculator size={24} />
          </button>
          <button
            onClick={() => setShowTutorial(true)}
            className="p-2 text-[#8b7355] hover:text-[#c1a063] transition-colors"
            title="Ayuda / Tutorial"
          >
            <Info size={24} />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 text-[#8b7355] hover:text-[#c1a063] transition-colors"
            title="Ajustes y Datos"
          >
            <Settings size={24} />
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="flex-grow flex flex-col h-full w-full relative"
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="flex-none flex justify-start sm:justify-center bg-[#0a0a09] border-t border-[#3a302a] py-2 px-4 sm:px-6 pb-safe z-20 space-x-1 sm:space-x-4 overflow-x-auto custom-scrollbar">
        <NavButton active={activeTab === "party"} onClick={() => setActiveTab("party")} label="Grupo" icon={Users} />
        <NavButton active={activeTab === "initiative"} onClick={() => setActiveTab("initiative")} label="Iniciativa" icon={Swords} />
        <NavButton active={activeTab === "quests"} onClick={() => setActiveTab("quests")} label="Misiones" icon={Target} />
        <NavButton active={activeTab === "maps"} onClick={() => setActiveTab("maps")} label="Mapas" icon={MapIcon} />
        <NavButton active={activeTab === "shops"} onClick={() => setActiveTab("shops")} label="Tiendas" icon={StoreIcon} />
        <NavButton active={activeTab === "notes"} onClick={() => setActiveTab("notes")} label="Notas" icon={StickyNote} />
        <NavButton active={activeTab === "items"} onClick={() => setActiveTab("items")} label="Objetos" icon={Backpack} />
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#161311] border border-[#3a302a] p-6 max-w-sm w-full relative shadow-2xl">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-[#8b7355] hover:text-[#c1a063]"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl text-[#c1a063] tracking-widest uppercase mb-6 font-light border-b border-[#3a302a] pb-2">
              Ajustes de Datos
            </h2>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => { store.exportData(); setShowSettings(false); }}
                className="flex items-center justify-center space-x-3 w-full p-4 border border-[#3a302a] hover:border-[#c1a063] hover:text-[#c1a063] transition-colors group"
              >
                <Download size={20} className="text-[#8b7355] group-hover:text-[#c1a063]" />
                <span className="uppercase tracking-wider text-sm">Exportar Todo</span>
              </button>
              
              <button
                onClick={handleImportClick}
                className="flex items-center justify-center space-x-3 w-full p-4 border border-[#3a302a] hover:border-[#c1a063] hover:text-[#c1a063] transition-colors group"
              >
                <Upload size={20} className="text-[#8b7355] group-hover:text-[#c1a063]" />
                <span className="uppercase tracking-wider text-sm">Importar Datos</span>
              </button>
              <input 
                type="file" 
                accept=".json"
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
            <p className="text-xs text-center text-[#8b7355] mt-6 px-4">
              Importar sobrescribirá todos los datos actuales. Asegúrate de exportar primero si tienes información importante.
            </p>
          </div>
        </div>
      )}
      
      <CalculatorModal isOpen={showCalculator} onClose={() => setShowCalculator(false)} />
      <WelcomeModal />
      <FullTutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
      <ImportModal
        isOpen={!!pendingImport}
        onClose={() => setPendingImport(null)}
        onMerge={() => confirmImport("merge")}
        onOverwrite={() => confirmImport("overwrite")}
      />
    </div>
  );
}

function NavButton({
  active,
  onClick,
  label,
  icon: Icon
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 sm:px-8 py-3 flex flex-col items-center group relative",
        active ? "text-[#c1a063]" : "text-[#8b7355] hover:text-[#c1a063]"
      )}
    >
      <Icon 
        size={24}
        strokeWidth={active ? 2 : 1.5}
        className={cn(
          "mb-1 transition-all duration-300",
          active ? "drop-shadow-[0_0_8px_rgba(193,160,99,0.5)] scale-110" : ""
        )} 
      />
      <span 
        className={cn(
          "text-[10px] sm:text-xs uppercase tracking-widest transition-colors",
          active ? "" : ""
        )}
      >
        {label}
      </span>
      {active && (
        <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-[#c1a063] shadow-[0_0_8px_#c1a063]" />
      )}
    </button>
  );
}

