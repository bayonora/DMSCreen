const fs = require('fs');
const filePath = 'src/store/useStore.ts';
let code = fs.readFileSync(filePath, 'utf8');

const targetDeleteNPC = `  deleteNPC: (id: string) => {
    const state = store.getState();
    store.setState({ 
      npcs: state.npcs.filter((x) => x.id !== id),
      combatants: state.combatants.filter((c) => c.characterId !== id),
      graveyard: state.graveyard.filter((c) => c.characterId !== id),
    });
  },`;

const newCreatureActions = `  deleteNPC: (id: string) => {
    const state = store.getState();
    store.setState({ 
      npcs: state.npcs.filter((x) => x.id !== id),
      combatants: state.combatants.filter((c) => c.characterId !== id),
      graveyard: state.graveyard.filter((c) => c.characterId !== id),
    });
  },
  addCreature: (c: Omit<Creature, "id" | "type">) => {
    store.setState({ creatures: [...(store.getState().creatures || []), { ...c, id: uuidv4(), type: "creature" }] });
  },
  updateCreature: (id: string, c: Partial<Creature>) => {
    store.setState({
      creatures: (store.getState().creatures || []).map((x) => (x.id === id ? { ...x, ...c } : x)),
    });
  },
  deleteCreature: (id: string) => {
    const state = store.getState();
    store.setState({ 
      creatures: (state.creatures || []).filter((x) => x.id !== id),
      combatants: state.combatants.filter((c) => c.characterId !== id),
      graveyard: state.graveyard.filter((c) => c.characterId !== id),
    });
  },`;

code = code.replace(targetDeleteNPC, newCreatureActions);

const targetGetCharacter = `  getCharacter: (id: string): Character | undefined => {
    const state = store.getState();
    return state.players.find((p) => p.id === id) || state.npcs.find((n) => n.id === id);
  },`;

const newGetCharacter = `  getCharacter: (id: string): Character | undefined => {
    const state = store.getState();
    return state.players.find((p) => p.id === id) || state.npcs.find((n) => n.id === id) || (state.creatures || []).find((c) => c.id === id);
  },`;

code = code.replace(targetGetCharacter, newGetCharacter);

fs.writeFileSync(filePath, code);
console.log("Patched actions in useStore");
