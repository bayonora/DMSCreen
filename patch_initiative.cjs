const fs = require('fs');
const filePath = 'src/views/ViewInitiative.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Imports
code = code.replace(
  `import { Plus, Trash2, Edit2, Shield, Heart, Skull, Play, Info } from "lucide-react";`,
  `import { Plus, Trash2, Edit2, Shield, Heart, Skull, Play, Info } from "lucide-react";`
);
if (!code.includes("Skull")) {
  code = code.replace(
    `import { Plus, Trash2, Edit2, Shield, Heart, Play, Info } from "lucide-react";`,
    `import { Plus, Trash2, Edit2, Shield, Heart, Play, Info, Skull } from "lucide-react";`
  );
}

// useStore AddCombatantModal
code = code.replace(
  `const { players, npcs, combatants } = useStore();`,
  `const { players, npcs, creatures, combatants } = useStore();`
);

const targetSelect = `const availablePlayers = players.filter(p => !combatants.some(c => c.characterId === p.id));
  const availableNpcs = npcs.filter(n => !combatants.some(c => c.characterId === n.id));`;

const newSelect = `const availablePlayers = players.filter(p => !combatants.some(c => c.characterId === p.id));
  const availableNpcs = npcs.filter(n => !combatants.some(c => c.characterId === n.id));
  const availableCreatures = (creatures || []).filter(cr => !combatants.some(c => c.characterId === cr.id));`;
code = code.replace(targetSelect, newSelect);

const targetOptgroup = `{availableNpcs.length > 0 && (
                <optgroup label="NPCs">
                  {availableNpcs.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                </optgroup>
              )}`;
const newOptgroup = `{availableNpcs.length > 0 && (
                <optgroup label="NPCs">
                  {availableNpcs.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                </optgroup>
              )}
              {availableCreatures.length > 0 && (
                <optgroup label="Criaturas">
                  {availableCreatures.map(cr => <option key={cr.id} value={cr.id}>{cr.name}</option>)}
                </optgroup>
              )}`;
code = code.replace(targetOptgroup, newOptgroup);

const targetEmpty = `{availablePlayers.length === 0 && availableNpcs.length === 0 && (
              <p className="text-xs text-[#8a211b] mt-1">Todos los personajes ya están en la iniciativa.</p>
            )}`;
const newEmpty = `{availablePlayers.length === 0 && availableNpcs.length === 0 && availableCreatures.length === 0 && (
              <p className="text-xs text-[#8a211b] mt-1">Todos los personajes ya están en la iniciativa.</p>
            )}`;
code = code.replace(targetEmpty, newEmpty);

const targetName = `{char.name}`;
// We only want to replace it in the active list button, let's find the exact block.
const blockTargetName = `<button 
                          onClick={() => setViewCharModal({ open: true, char })}
                          className={cn("font-bold text-lg text-left truncate transition-colors", isActive ? "text-[#f5f2ed]" : "text-[#f5f2ed] opacity-80", "hover:text-[#c1a063]")}
                        >
                          {char.name}
                        </button>`;
const blockNewName = `<button 
                          onClick={() => setViewCharModal({ open: true, char })}
                          className={cn("font-bold text-lg text-left truncate transition-colors", isActive ? "text-[#f5f2ed]" : "text-[#f5f2ed] opacity-80", "hover:text-[#c1a063]")}
                        >
                          {char.type === "creature" && <Skull size={16} className="inline-block mr-2 text-[#8a211b]" />}
                          {char.name}
                        </button>`;
if(code.includes(blockTargetName)) {
  code = code.replace(blockTargetName, blockNewName);
} else {
  // Try another replace strategy if the button has different formatting
  code = code.replace(`                          {char.name}\n                        </button>`, `                          {char?.type === "creature" && <Skull size={16} className="inline-block mr-2 text-[#8a211b]" />}\n                          {char?.name || "Desconocido"}\n                        </button>`);
}

fs.writeFileSync(filePath, code);
console.log("Patched ViewInitiative");
