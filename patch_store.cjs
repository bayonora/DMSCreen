const fs = require('fs');
const filePath = 'src/store/useStore.ts';
let code = fs.readFileSync(filePath, 'utf8');

// Add Creature import
code = code.replace(/Player, NPC, Character/, "Player, NPC, Creature, Character");

// Add to StoreState
code = code.replace(/npcs: NPC\[\];/, "npcs: NPC[];\n  creatures: Creature[];");

// Add to DEFAULT_STATE
code = code.replace(/npcs: \[\],/, "npcs: [],\n  creatures: [],");

// Add Actions (find addNPC, updateNPC, removeNPC and duplicate for creatures)
const actionTargetStr = `  removeNPC: (id: string) => void;`;
const actionNewStr = `  removeNPC: (id: string) => void;
  addCreature: (creature: Creature) => void;
  updateCreature: (id: string, creature: Partial<Creature>) => void;
  removeCreature: (id: string) => void;`;
code = code.replace(actionTargetStr, actionNewStr);

const implTargetStr = `  removeNPC: (id) => set((state) => ({ npcs: state.npcs.filter((n) => n.id !== id) })),`;
const implNewStr = `  removeNPC: (id) => set((state) => ({ npcs: state.npcs.filter((n) => n.id !== id) })),
  addCreature: (creature) => set((state) => ({ creatures: [...state.creatures, creature] })),
  updateCreature: (id, updates) => set((state) => ({
    creatures: state.creatures.map((c) => (c.id === id ? { ...c, ...updates } : c)),
  })),
  removeCreature: (id) => set((state) => ({ creatures: state.creatures.filter((c) => c.id !== id) })),`;
code = code.replace(implTargetStr, implNewStr);

fs.writeFileSync(filePath, code);
console.log("Patched store");
