/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ViewParty } from "./views/ViewParty";
import { ViewInitiative } from "./views/ViewInitiative";
import { ViewMaps } from "./views/ViewMaps";
import { ViewShops } from "./views/ViewShops";
import { cn } from "./lib/utils";

type Tab = "party" | "initiative" | "maps" | "shops";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("party");

  return (
    <div 
      className="flex flex-col h-screen w-full text-[#e6e2da] overflow-hidden font-serif select-none"
      style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1614 0%, #0f0d0c 100%)', backgroundColor: '#0f0d0c' }}
    >
      <header className="flex justify-between items-center px-6 py-3 border-b border-[#3a302a] bg-[#161311]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 border-2 border-[#c1a063] rotate-45 flex items-center justify-center">
            <span className="-rotate-45 font-bold text-xl text-[#c1a063]">DM</span>
          </div>
          <h1 className="text-2xl tracking-widest uppercase font-light text-[#c1a063]">DM Screen 5e</h1>
        </div>
      </header>

      <main className="flex-grow flex overflow-hidden relative p-4 gap-4">
        {activeTab === "party" && <ViewParty />}
        {activeTab === "initiative" && <ViewInitiative />}
        {activeTab === "maps" && <ViewMaps />}
        {activeTab === "shops" && <ViewShops />}
      </main>

      <nav className="flex-none flex justify-center bg-[#0a0a09] border-t border-[#3a302a] py-2 px-6 pb-safe z-20 space-x-1">
        <NavButton
          active={activeTab === "party"}
          onClick={() => setActiveTab("party")}
          label="Grupo"
        />
        <NavButton
          active={activeTab === "initiative"}
          onClick={() => setActiveTab("initiative")}
          label="Iniciativa"
        />
        <NavButton
          active={activeTab === "maps"}
          onClick={() => setActiveTab("maps")}
          label="Mapas"
        />
        <NavButton
          active={activeTab === "shops"}
          onClick={() => setActiveTab("shops")}
          label="Tiendas"
        />
      </nav>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-8 py-3 flex flex-col items-center group",
        active ? "border-b-2 border-[#c1a063]" : ""
      )}
    >
      <div 
        className={cn(
          "w-6 h-6 border-2 mb-1 transition-colors",
          active ? "border-[#c1a063]" : "border-[#3a302a] group-hover:border-[#c1a063]"
        )} 
      />
      <span 
        className={cn(
          "text-[10px] uppercase tracking-widest transition-colors",
          active ? "text-[#c1a063]" : "text-[#3a302a] group-hover:text-[#c1a063]"
        )}
      >
        {label}
      </span>
    </button>
  );
}

