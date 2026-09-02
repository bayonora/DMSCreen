import React from "react";
import { Character, NPC, Player } from "../types";
import { formatMod, cn } from "../lib/utils";
import { Copy, Edit2, Trash2 } from "lucide-react";

interface StatBlockProps {
  key?: React.Key;
  character: Character;
  onEdit?: (c: Character) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (c: Character) => void;
}

export const StatBlock: React.FC<StatBlockProps> = ({ character, onEdit, onDelete, onDuplicate }) => {
  const isPlayer = character.type === "player";
  const p = character as Player;
  const n = character as NPC;

  return (
    <div className="bg-[#1e1a17] border border-[#3a302a] border-l-4 border-l-[#c1a063] rounded-sm p-4 text-[#e6e2da] font-serif shadow-lg flex flex-col relative max-w-md w-full">
      <div className="absolute top-2 right-2 flex gap-1">
        {onDuplicate && (
          <button onClick={() => onDuplicate(character)} className="p-1 text-[#3a302a] hover:text-[#c1a063] transition-colors" title="Duplicar">
            <Copy size={16} />
          </button>
        )}
        {onEdit && (
          <button onClick={() => onEdit(character)} className="p-1 text-[#3a302a] hover:text-[#c1a063] transition-colors" title="Editar">
            <Edit2 size={16} />
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(character.id)} className="p-1 text-[#3a302a] hover:text-[#8a211b] transition-colors" title="Borrar">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <h1 className="text-2xl font-bold text-[#c1a063] font-sans pr-16">{character.name}</h1>
      <p className="italic text-sm opacity-70">
        {isPlayer ? `${p.race} • ${p.classAndLevel}` : n.race}
      </p>

      <div className="w-full h-px bg-[#3a302a] my-2" />

      <div className="space-y-1 text-sm">
        <div>
          <strong className="text-[#c1a063]">Clase de Armadura</strong> {character.ac}
        </div>
        <div>
          <strong className="text-[#c1a063]">Puntos de Vida</strong> {character.hpMax}
        </div>
      </div>

      <div className="w-full h-px bg-[#3a302a] my-2" />

      <div className="grid grid-cols-6 gap-2 text-center my-2 text-[11px] uppercase opacity-80">
        <Stat name="FUE" val={character.stats.STR} />
        <Stat name="DES" val={character.stats.DEX} />
        <Stat name="CON" val={character.stats.CON} />
        <Stat name="INT" val={character.stats.INT} />
        <Stat name="SAB" val={character.stats.WIS} />
        <Stat name="CAR" val={character.stats.CHA} />
      </div>

      <div className="w-full h-px bg-[#3a302a] my-2" />

      <div className="space-y-1 text-sm opacity-90">
        {!isPlayer && n.skills && (
          <div>
            <strong className="text-[#c1a063]">Habilidades</strong> {n.skills}
          </div>
        )}
        {!isPlayer && n.senses && (
          <div>
            <strong className="text-[#c1a063]">Sentidos</strong> {n.senses}
          </div>
        )}
        {isPlayer && (
          <div>
            <strong className="text-[#c1a063]">Percepción Pasiva</strong> {p.passivePerception}
          </div>
        )}
        {!isPlayer && n.languages && (
          <div>
            <strong className="text-[#c1a063]">Idiomas</strong> {n.languages}
          </div>
        )}
        {!isPlayer && n.cr && (
          <div>
            <strong className="text-[#c1a063]">Desafío</strong> {n.cr}
          </div>
        )}
      </div>

      {!isPlayer && (n.specialTraits || n.actions) && (
        <div className="w-full h-px bg-[#3a302a] my-2" />
      )}

      {!isPlayer && n.specialTraits && (
        <div className="mt-2 text-sm whitespace-pre-wrap opacity-90">
          {n.specialTraits}
        </div>
      )}

      {!isPlayer && n.actions && (
        <>
          <h2 className="text-lg font-bold text-[#c1a063] mt-4 mb-2 border-b border-[#3a302a]">Acciones</h2>
          <div className="text-sm whitespace-pre-wrap opacity-90">
            {n.actions}
          </div>
        </>
      )}
    </div>
  );
};

function Stat({ name, val }: { name: string; val: number }) {
  return (
    <div className="flex flex-col items-center bg-[#2a2420] p-1 rounded-sm border border-[#3a302a]">
      <div className="font-bold text-[#c1a063]">{name}</div>
      <div className="font-mono mt-0.5">
        {val} <span className="opacity-60 text-[9px]">({formatMod(val)})</span>
      </div>
    </div>
  );
}
