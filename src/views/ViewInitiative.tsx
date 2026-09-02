import React, { useState } from "react";
import { useStore, actions } from "../store/useStore";
import { Combatant, StatusEffect } from "../types";
import { Input, Button, Textarea } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Play, SkipForward, Square, Plus, Shield, Heart, Trash2, Edit2, RotateCcw } from "lucide-react";
import { cn, formatMod } from "../lib/utils";
import { StatBlock } from "../components/StatBlock";
import { motion, AnimatePresence } from "motion/react";

export function ViewInitiative() {
  const { combatants, graveyard, players, npcs } = useStore();
  const [activeTurnIdx, setActiveTurnIdx] = useState<number>(-1);
  const [isCombatActive, setIsCombatActive] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGraveyardOpen, setIsGraveyardOpen] = useState(false);
  const [statusModal, setStatusModal] = useState<{ open: boolean; combatantId: string; effect?: StatusEffect }>({ open: false, combatantId: "" });
  const [viewCharModal, setViewCharModal] = useState<{ open: boolean; charId: string }>({ open: false, charId: "" });

  const handleStartCombat = () => {
    setIsCombatActive(true);
    setActiveTurnIdx(0);
  };

  const handleNextTurn = () => {
    if (combatants.length === 0) return;
    setActiveTurnIdx((prev) => (prev + 1) % combatants.length);
  };

  const handleEndCombat = () => {
    setIsCombatActive(false);
    setActiveTurnIdx(-1);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#161311] border border-[#3a302a] rounded-lg overflow-hidden">
      <div className="bg-[#1e1a17] px-6 py-4 border-b border-[#3a302a] flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-lg uppercase tracking-widest text-[#c1a063] font-light hidden sm:block">Iniciativa</h2>
          <div className="flex gap-2">
            {!isCombatActive ? (
              <Button onClick={handleStartCombat} className="bg-[#8a211b] text-white hover:bg-[#a52a23]">
                <Play size={14} className="mr-1" /> Iniciar Combate
              </Button>
            ) : (
              <>
                <Button onClick={handleNextTurn} variant="secondary" className="border-[#3a302a] text-[#c1a063]">
                  <SkipForward size={14} className="mr-1" /> Siguiente Turno
                </Button>
                <Button onClick={handleEndCombat} variant="danger">
                  <Square size={14} className="mr-1" /> Finalizar Combate
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setIsGraveyardOpen(true)} className="text-[#c1a063] flex items-center p-0 hover:bg-transparent hover:underline">
            <span className="mr-1">💀</span> Cementerio ({graveyard.length})
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus size={14} className="mr-1" /> Añadir
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex items-center px-6 py-2 border-b border-[#2a2420] text-[10px] uppercase tracking-wider text-[#c1a063] opacity-60">
          <div className="w-16">Inic.</div>
          <div className="flex-1">Personaje y Estados</div>
          <div className="w-48 hidden sm:block">Salud (HP)</div>
          <div className="w-20 hidden md:block">Armadura</div>
          <div className="w-16">Acciones</div>
        </div>

        <div className="flex flex-col">
          <AnimatePresence>
            {combatants.map((c, idx) => {
              const char = actions.getCharacter(c.characterId);
              if (!char) return null;
              const isActive = isCombatActive && idx === activeTurnIdx;
              
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={c.id} 
                  className={cn(
                    "flex items-center px-6 py-4 border-b border-[#2a2420] transition-colors",
                    isActive ? "bg-[#2a2420] relative shadow-[inset_4px_0_0_#c1a063]" : "hover:bg-[#1e1a17]"
                  )}
                >
                  <div className={cn("w-16 font-bold text-lg", isActive ? "" : "opacity-50")}>
                    <Input 
                      type="number" 
                      value={c.initiative} 
                      onChange={(e) => actions.updateCombatant(c.id, { initiative: Number(e.target.value) })}
                      className="w-12 text-center text-lg h-10 px-0 font-bold border-none bg-transparent focus:bg-[#3a302a] -ml-2"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col min-w-0 pr-4 gap-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <button 
                        onClick={() => setViewCharModal({ open: true, charId: c.characterId })}
                        className={cn("font-bold text-lg text-left truncate transition-colors", isActive ? "text-[#f5f2ed]" : "text-[#f5f2ed] opacity-80", "hover:text-[#c1a063]")}
                      >
                        {char.name}
                      </button>
                      
                      <div className="flex flex-wrap gap-1 items-center ml-2">
                        {c.statuses.map(s => (
                          <button 
                            key={s.id}
                            onClick={() => setStatusModal({ open: true, combatantId: c.id, effect: s })}
                            className="px-2 py-0.5 bg-[#8a211b]/20 text-[#ff8f8a] text-[11px] uppercase tracking-wider rounded-sm border border-[#8a211b]/50 cursor-pointer hover:bg-[#8a211b]/40 truncate max-w-[150px] font-bold"
                            title={s.description}
                          >
                            {s.name}
                          </button>
                        ))}
                        <button 
                          onClick={() => setStatusModal({ open: true, combatantId: c.id })}
                          className="w-5 h-5 rounded-sm border border-[#3a302a] flex items-center justify-center text-[12px] opacity-40 hover:opacity-100 hover:text-[#c1a063] hover:border-[#c1a063]"
                          title="Añadir Estado"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span className={cn("text-[10px] uppercase font-bold", isActive ? "opacity-100 text-[#c1a063]" : "opacity-30", char.type === "npc" && !isActive ? "text-red-400" : "")}>
                      {isActive ? "▶ TURNO ACTIVO" : (char.type === "player" ? "Jugador" : "NPC")}
                    </span>
                  </div>

                  <div className="w-48 hidden sm:flex flex-col justify-center">
                    <div className="flex justify-between items-center text-sm font-mono mb-1 w-32">
                        <Heart size={16} className={cn("mr-2", isActive ? "text-red-500" : "text-[#8a211b]")} />
                       <Input 
                          type="number" 
                          value={c.hpCurrent}
                          onChange={(e) => actions.updateCombatant(c.id, { hpCurrent: Number(e.target.value) })}
                          className="w-12 h-6 p-0 text-center border-none bg-transparent text-[#e6e2da] text-lg font-bold focus:bg-[#3a302a]"
                        />
                        <span className="opacity-50 text-base">/ {char.hpMax}</span>
                    </div>
                    <div className="w-32 h-2 bg-[#1a1614] rounded-full relative overflow-hidden border border-[#3a302a]">
                      <div 
                        className={cn("absolute inset-0 transition-all", char.type === "player" ? "bg-green-600" : "bg-red-800")} 
                        style={{ width: `${Math.max(0, Math.min(100, (c.hpCurrent / char.hpMax) * 100))}%` }} 
                      />
                    </div>
                  </div>

                  <div className="w-20 hidden md:flex items-center gap-2">
                    <div className="flex items-center justify-center p-1 relative" title="Clase de Armadura">
                      <Shield size={28} className={cn("opacity-80", isActive ? "text-[#c1a063]" : "text-[#3a302a]")} />
                      <span className="absolute text-[11px] font-bold mt-[-2px]">{char.ac}</span>
                    </div>
                  </div>

                  <div className="w-16 flex justify-end gap-2 items-center">
                    <button 
                      onClick={() => actions.killCombatant(c.id)}
                      className="p-2 text-[#3a302a] hover:text-[#8a211b] transition-colors"
                      title="Mandar al cementerio"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {combatants.length === 0 && (
            <p className="text-center opacity-50 py-10 font-mono text-sm">El tracker está vacío.</p>
          )}
        </div>
      </div>

      <AddCombatantModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <StatusModal 
        isOpen={statusModal.open} 
        onClose={() => setStatusModal({ open: false, combatantId: "" })} 
        combatantId={statusModal.combatantId}
        effect={statusModal.effect}
      />
      <GraveyardModal isOpen={isGraveyardOpen} onClose={() => setIsGraveyardOpen(false)} onViewChar={(id) => setViewCharModal({ open: true, charId: id })} />
      <Modal isOpen={viewCharModal.open} onClose={() => setViewCharModal({ open: false, charId: "" })} title="Ficha">
         {viewCharModal.charId && actions.getCharacter(viewCharModal.charId) && (
           <div className="flex justify-center">
             <StatBlock character={actions.getCharacter(viewCharModal.charId)!} />
           </div>
         )}
      </Modal>
    </div>
  );
}

function AddCombatantModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { players, npcs, combatants } = useStore();
  const [selectedId, setSelectedId] = useState("");
  const [initiative, setInitiative] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId && initiative) {
      actions.addCombatant(selectedId, Number(initiative));
      onClose();
      setSelectedId("");
      setInitiative("");
    }
  };

  const availablePlayers = players.filter(p => !combatants.some(c => c.characterId === p.id));
  const availableNpcs = npcs.filter(n => !combatants.some(c => c.characterId === n.id));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir a Iniciativa">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[10px] font-bold text-[#c1a063] uppercase tracking-widest">Personaje</label>
          <select 
            value={selectedId} 
            onChange={(e) => setSelectedId(e.target.value)}
            className="flex h-10 w-full bg-[#1e1a17] border border-[#3a302a] px-3 py-2 text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a063]"
            required
          >
            <option value="">Selecciona...</option>
            {availablePlayers.length > 0 && (
              <optgroup label="Jugadores">
                {availablePlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </optgroup>
            )}
            {availableNpcs.length > 0 && (
              <optgroup label="NPCs">
                {availableNpcs.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
              </optgroup>
            )}
          </select>
          {availablePlayers.length === 0 && availableNpcs.length === 0 && (
            <p className="text-xs text-[#8a211b] mt-1">Todos los personajes ya están en la iniciativa.</p>
          )}
        </div>
        <Input 
          label="Tirada de Iniciativa" 
          type="number" 
          required 
          value={initiative}
          onChange={(e) => setInitiative(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#3a302a]">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={!selectedId}>Añadir</Button>
        </div>
      </form>
    </Modal>
  );
}

function StatusModal({ isOpen, onClose, combatantId, effect }: { isOpen: boolean, onClose: () => void, combatantId: string, effect?: StatusEffect }) {
  const { combatants } = useStore();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const desc = formData.get("desc") as string;
    
    const c = combatants.find(x => x.id === combatantId);
    if (!c) return;

    let newStatuses = [...c.statuses];
    if (effect) {
      newStatuses = newStatuses.map(s => s.id === effect.id ? { ...s, name, description: desc } : s);
    } else {
      newStatuses.push({ id: Math.random().toString(), name, description: desc });
    }
    
    actions.updateCombatant(combatantId, { statuses: newStatuses });
    onClose();
  };

  const handleDelete = () => {
    const c = combatants.find(x => x.id === combatantId);
    if (!c || !effect) return;
    actions.updateCombatant(combatantId, { statuses: c.statuses.filter(s => s.id !== effect.id) });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={effect ? "Editar Estado" : "Nuevo Estado"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nombre del Estado" name="name" required defaultValue={effect?.name} />
        <Textarea label="Descripción" name="desc" defaultValue={effect?.description} />
        
        <div className="flex justify-between mt-4 pt-4 border-t border-[#3a302a]">
          {effect ? (
            <Button type="button" variant="danger" onClick={handleDelete}>Borrar Estado</Button>
          ) : <div></div>}
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function GraveyardModal({ isOpen, onClose, onViewChar }: { isOpen: boolean, onClose: () => void, onViewChar: (id: string) => void }) {
  const { graveyard } = useStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cementerio (Historial)">
      <div className="flex flex-col gap-2">
        {graveyard.map(c => {
          const char = actions.getCharacter(c.characterId);
          if (!char) return null;
          return (
            <div key={c.id} className="flex items-center justify-between p-3 bg-[#1e1a17] border border-[#3a302a] rounded-sm shadow-md">
              <div>
                <button onClick={() => { onViewChar(c.characterId); onClose(); }} className="font-bold hover:text-[#c1a063] truncate max-w-[200px] text-[#e6e2da]">
                  {char.name}
                </button>
                <div className="text-[10px] uppercase text-[#c1a063] opacity-60">HP al morir: {c.hpCurrent}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => actions.reviveCombatant(c.id)} title="Devolver a Iniciativa">
                  <RotateCcw size={14} />
                </Button>
                <Button variant="danger" onClick={() => actions.deleteFromGraveyard(c.id)} title="Borrar del historial">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          )
        })}
        {graveyard.length === 0 && <p className="text-[#e6e2da] opacity-50 text-center py-4 font-serif">El cementerio está vacío.</p>}
      </div>
    </Modal>
  );
}

