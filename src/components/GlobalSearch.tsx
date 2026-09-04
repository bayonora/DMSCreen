import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Users, Swords, Target, Map as MapIcon, Store as StoreIcon, StickyNote, Package, User } from "lucide-react";
import { useStore, actions } from "../store/useStore";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "party" | "initiative" | "quests" | "maps" | "shops" | "notes" | "items";

interface SearchResult {
  id: string;
  type: string;
  label: string;
  subLabel?: string;
  tab: Tab;
  score: number;
  icon: React.ReactNode;
  action?: () => void;
}

export function GlobalSearch({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const storeState = useStore();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          setIsOpen(true);
          document.getElementById('global-search-input')?.focus();
        }
        return;
      }
      
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, query]);

  const scoreString = (q: string, text: string) => {
    if (!text || !q) return 0;
    const t = text.toLowerCase();
    
    // Direct matches
    if (t === q) return 100;
    if (t.startsWith(q)) return 50;
    if (t.includes(q)) return 10;
    
    // Fuzzy matching (subsequence)
    let qIdx = 0;
    for (let i = 0; i < t.length; i++) {
      if (t[i] === q[qIdx]) {
        qIdx++;
        if (qIdx === q.length) {
           return 5; // Probable match but scattered
        }
      }
    }
    return 0;
  };

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase().trim();
    let res: SearchResult[] = [];

    // Search Players
    storeState.players.forEach(p => {
      const score = Math.max(scoreString(q, p.name), scoreString(q, p.classAndLevel), scoreString(q, p.race));
      if (score > 0) res.push({ id: p.id, type: "Jugador", label: p.name, subLabel: `${p.race} - ${p.classAndLevel}`, tab: "party", score, icon: <User size={16} /> });
    });

    // Search NPCs
    storeState.npcs.forEach(n => {
      const score = Math.max(scoreString(q, n.name), scoreString(q, n.type || ""));
      if (score > 0) res.push({ id: n.id, type: "NPC", label: n.name, subLabel: n.type, tab: "party", score, icon: <Users size={16} /> });
    });

    // Search Combatants
    storeState.combatants.forEach(c => {
      let name = c.isTemp && c.tempData ? c.tempData.name : undefined;
      if (!name) {
         const p = storeState.players.find(x => x.id === c.characterId);
         const n = storeState.npcs.find(x => x.id === c.characterId);
         name = p ? p.name : n ? n.name : "Desconocido";
      }
      const score = scoreString(q, name);
      if (score > 0) res.push({ id: c.id, type: "Combate", label: name, tab: "initiative", score, icon: <Swords size={16} /> });
    });

    // Search Quests
    storeState.quests.forEach(qu => {
      const score = Math.max(scoreString(q, qu.title), scoreString(q, qu.description));
      if (score > 0) res.push({ id: qu.id, type: "Misión", label: qu.title, subLabel: qu.description, tab: "quests", score, icon: <Target size={16} /> });
    });

    // Search Maps
    storeState.maps.forEach(m => {
      const score = scoreString(q, m.name);
      if (score > 0) res.push({ id: m.id, type: "Mapa", label: m.name, tab: "maps", score, icon: <MapIcon size={16} /> });
    });

    // Search Locations
    storeState.locations.forEach(l => {
      const score = Math.max(scoreString(q, l.name), scoreString(q, l.description), scoreString(q, l.region || ""));
      if (score > 0) res.push({ id: l.id, type: "Lugar", label: l.name, subLabel: l.region, tab: "maps", score, icon: <MapIcon size={16} /> });
    });

    // Search Shops
    storeState.shops.forEach(s => {
      const score = Math.max(scoreString(q, s.name), scoreString(q, s.ownerName));
      if (score > 0) res.push({ id: s.id, type: "Tienda", label: s.name, subLabel: s.ownerName, tab: "shops", score, icon: <StoreIcon size={16} /> });
    });

    // Search Notes
    storeState.notes.forEach(n => {
      const score = Math.max(scoreString(q, n.title), scoreString(q, n.content));
      if (score > 0) res.push({ 
        id: n.id, 
        type: "Nota", 
        label: n.title, 
        tab: "notes", 
        score, 
        icon: <StickyNote size={16} />,
        action: () => actions.updateUI({ editingNoteId: n.id }) 
      });
    });

    // Search Items
    storeState.customItems.forEach(ci => {
      const score = Math.max(scoreString(q, ci.name), scoreString(q, ci.description || ""));
      if (score > 0) res.push({ id: ci.id, type: "Objeto", label: ci.name, subLabel: "Objeto Personalizado", tab: "items", score, icon: <Package size={16} /> });
    });

    return res.sort((a, b) => b.score - a.score).slice(0, 10);
  }, [query, storeState]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]);

  const handleSelect = (res: SearchResult) => {
    if (res.action) res.action();
    onNavigate(res.tab);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-[#8b7355]" />
        </div>
        <input
          id="global-search-input"
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-[#3a302a] rounded-md leading-5 bg-[#14110f] text-[#e6e2da] placeholder-[#8b7355] focus:outline-none focus:ring-1 focus:ring-[#c1a063] focus:border-[#c1a063] sm:text-sm transition-colors"
          placeholder="Buscar personajes, notas, mapas... (Ctrl+K)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      <AnimatePresence>
        {isOpen && query.trim().length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full bg-[#1e1a17] shadow-lg max-h-96 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto sm:text-sm border border-[#3a302a]"
          >
            {results.length === 0 ? (
              <div className="px-4 py-3 text-sm text-[#8b7355] text-center">
                No se encontraron resultados para "{query}"
              </div>
            ) : (
              <ul className="custom-scrollbar">
                {results.map((res, idx) => (
                  <li
                    key={`${res.type}-${res.id}`}
                    onClick={() => handleSelect(res)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      "cursor-pointer select-none relative py-2 pl-3 pr-9 border-l-2 transition-colors",
                      selectedIndex === idx
                        ? "bg-[#14110f] border-[#c1a063] text-white"
                        : "border-transparent text-[#e6e2da] hover:bg-[#1a1614] hover:border-[#8b7355]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("shrink-0", selectedIndex === idx ? "text-[#c1a063]" : "text-[#8b7355]")}>
                        {res.icon}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="font-medium truncate">{res.label}</span>
                        {(res.subLabel || res.type) && (
                          <span className="text-xs text-[#8b7355] truncate flex gap-2">
                            <span className="px-1.5 rounded-sm bg-[#14110f] border border-[#3a302a] text-[10px] uppercase tracking-wider">{res.type}</span>
                            {res.subLabel && <span>{res.subLabel}</span>}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
