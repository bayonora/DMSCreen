import React, { useState, useEffect } from "react";
import { useStore, actions, store } from "../store/useStore";
import { StatBlock } from "../components/StatBlock";
import { Modal } from "../components/ui/Modal";
import { Input, Button, Textarea } from "../components/ui/Input";
import { Character, Player, NPC } from "../types";
import { Plus, Download, Upload } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";

export function ViewParty() {
  const { players, npcs } = useStore();
  const [tab, setTab] = useState<"players" | "npcs">("players");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChar, setEditingChar] = useState<Character | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => {
    setEditingChar(null);
    setIsModalOpen(true);
  };

  const handleEdit = (c: Character) => {
    setEditingChar(c);
    setIsModalOpen(true);
  };

  const handleDuplicate = (c: Character) => {
    if (c.type === "player") {
      actions.addPlayer({ ...c, name: `${c.name} (Copia)` } as Player);
    } else {
      actions.addNPC({ ...c, name: `${c.name} (Copia)` } as NPC);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    if (tab === "players") actions.deletePlayer(deleteId);
    else actions.deleteNPC(deleteId);
    setDeleteId(null);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        store.importData(result);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex-1 flex flex-col bg-transparent border-none rounded-none overflow-hidden">
      <div className="bg-[#1e1a17] px-6 py-4 border-b border-[#3a302a] flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant={tab === "players" ? "primary" : "secondary"} onClick={() => setTab("players")}>
            Jugadores ({players.length})
          </Button>
          <Button variant={tab === "npcs" ? "primary" : "secondary"} onClick={() => setTab("npcs")}>
            NPCs ({npcs.length})
          </Button>
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer px-4 py-2 bg-[#1a1614] border border-[#3a302a] text-[#8b7355] text-xs uppercase tracking-widest hover:bg-[#2a2420] hover:border-[#c1a063] hover:text-[#c1a063] inline-flex items-center justify-center transition-all shadow-sm rounded-none">
            <Upload size={14} className="mr-2" /> Importar
            <input type="file" accept=".json" className="hidden" onChange={importData} />
          </label>
          <Button variant="secondary" onClick={() => store.exportData()}>
            <Download size={14} className="mr-2" /> Exportar
          </Button>
          <Button onClick={openNew}>
            <Plus size={14} className="mr-2" /> Añadir
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="flex flex-wrap gap-6 items-start justify-center">
          <AnimatePresence mode="wait">
            {tab === "players" && players.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <StatBlock character={p} onEdit={handleEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} />
              </motion.div>
            ))}
            {tab === "npcs" && npcs.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <StatBlock character={n} onEdit={handleEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {tab === "players" && players.length === 0 && (
             <p className="text-[#e6e2da] opacity-50 w-full text-center py-10 font-serif">No hay jugadores. Añade uno para empezar.</p>
          )}
          {tab === "npcs" && npcs.length === 0 && (
             <p className="text-[#e6e2da] opacity-50 w-full text-center py-10 font-serif">No hay NPCs. Añade uno para empezar.</p>
          )}
        </div>
      </div>

      <CharacterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingChar}
        defaultType={tab}
      />
      <ConfirmDeleteModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={confirmDelete}
        title="Eliminar Personaje"
        message="¿Estás seguro de que quieres eliminar a este personaje de forma permanente?"
      />
    </div>
  );
}

function CharacterModal({ isOpen, onClose, initialData, defaultType }: { isOpen: boolean, onClose: () => void, initialData: Character | null, defaultType: "players" | "npcs" }) {
  const isEditing = !!initialData;
  const [type, setType] = useState<"player" | "npc">(initialData?.type || (defaultType === "players" ? "player" : "npc"));
  
  useEffect(() => {
    if (isOpen) {
      setType(initialData?.type || (defaultType === "players" ? "player" : "npc"));
    }
  }, [isOpen, initialData, defaultType]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const getS = (key: string) => (formData.get(key) as string) || "";
    const getNum = (key: string) => Number(formData.get(key)) || 0;
    
    const stats = {
      STR: getNum("str"), DEX: getNum("dex"), CON: getNum("con"), 
      INT: getNum("int"), WIS: getNum("wis"), CHA: getNum("cha")
    };

    if (type === "player") {
      const p: Omit<Player, "id" | "type"> = {
        name: getS("name"),
        classAndLevel: getS("classAndLevel"),
        race: getS("race"),
        hpMax: getNum("hpMax"),
        ac: getNum("ac"),
        passivePerception: getNum("passivePerception"),
        stats
      };
      if (isEditing && initialData) actions.updatePlayer(initialData.id, p);
      else actions.addPlayer(p);
    } else {
      const n: Omit<NPC, "id" | "type"> = {
        name: getS("name"),
        race: getS("race"),
        hpMax: getNum("hpMax"),
        ac: getNum("ac"),
        cr: getS("cr"),
        skills: getS("skills"),
        senses: getS("senses"),
        languages: getS("languages"),
        specialTraits: getS("specialTraits"),
        actions: getS("actions"),
        stats
      };
      if (isEditing && initialData) actions.updateNPC(initialData.id, n);
      else actions.addNPC(n);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Personaje" : "Nuevo Personaje"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isEditing && (
          <div className="flex gap-2 mb-2">
            <Button type="button" variant={type === "player" ? "primary" : "secondary"} onClick={() => setType("player")} className="flex-1">Player</Button>
            <Button type="button" variant={type === "npc" ? "primary" : "secondary"} onClick={() => setType("npc")} className="flex-1">NPC</Button>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre" name="name" required defaultValue={initialData?.name} />
          <Input label="Raza" name="race" defaultValue={initialData?.race} />
          {type === "player" && (
            <>
              <Input label="Clase y Nivel" name="classAndLevel" defaultValue={(initialData as Player)?.classAndLevel} />
              <Input label="Percepción Pasiva" name="passivePerception" type="number" defaultValue={(initialData as Player)?.passivePerception} />
            </>
          )}
          {type === "npc" && (
            <Input label="Desafío (CR)" name="cr" defaultValue={(initialData as NPC)?.cr} />
          )}
          <Input label="HP Máximo" name="hpMax" type="number" required defaultValue={initialData?.hpMax} />
          <Input label="Clase de Armadura (AC)" name="ac" type="number" required defaultValue={initialData?.ac} />
        </div>

        <div className="border border-[#3a302a] rounded-sm p-3 grid grid-cols-6 gap-2 bg-[#0a0a09]">
          <Input label="FUE" name="str" type="number" required defaultValue={initialData?.stats?.STR || 10} />
          <Input label="DEX" name="dex" type="number" required defaultValue={initialData?.stats?.DEX || 10} />
          <Input label="CON" name="con" type="number" required defaultValue={initialData?.stats?.CON || 10} />
          <Input label="INT" name="int" type="number" required defaultValue={initialData?.stats?.INT || 10} />
          <Input label="SAB" name="wis" type="number" required defaultValue={initialData?.stats?.WIS || 10} />
          <Input label="CAR" name="cha" type="number" required defaultValue={initialData?.stats?.CHA || 10} />
        </div>

        {type === "npc" && (
          <>
            <Input label="Habilidades" name="skills" defaultValue={(initialData as NPC)?.skills} placeholder="ej. Percepción +2, Sigilo +4" />
            <Input label="Sentidos" name="senses" defaultValue={(initialData as NPC)?.senses} placeholder="ej. Visión en la oscuridad 120 pies, Percepción pasiva 12" />
            <Input label="Idiomas" name="languages" defaultValue={(initialData as NPC)?.languages} placeholder="ej. Común, élfico" />
            <Textarea label="Rasgos Especiales" name="specialTraits" defaultValue={(initialData as NPC)?.specialTraits} placeholder="ej. Sensibilidad a la Luz Solar: El drow tiene desventaja en las tiradas..." />
            <Textarea label="Acciones (Ataques, Hechizos)" name="actions" defaultValue={(initialData as NPC)?.actions} placeholder="ej. Espada corta. Ataque con arma cuerpo a cuerpo: +4 a impactar, alcance 5 pies..." />
          </>
        )}

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#3a302a]">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Modal>
  );
}
