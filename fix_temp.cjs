const fs = require('fs');
const filePath = 'src/store/useStore.ts';
let code = fs.readFileSync(filePath, 'utf8');

const targetTemp = `  addTempCombatant: (npc: Omit<NPC, "id" | "type">, initiative: number) => {
    const state = store.getState();
    const id = uuidv4();
    const fullNpc: NPC = { ...npc, id, type: "npc" };
    store.setState({
      combatants: [
        ...state.combatants,
        { id, characterId: id, initiative, hpCurrent: fullNpc.hpMax, statuses: [], isTemp: true, tempData: fullNpc },
      ].sort((a, b) => b.initiative - a.initiative),
    });
  },`;

const newTemp = `  addTempCombatant: (npc: Omit<NPC, "id" | "type">, initiative: number) => {
    const state = store.getState();
    const id = uuidv4();
    const fullNpc = { ...npc, id, type: "creature" as const }; // Temporales se asumen criaturas
    store.setState({
      combatants: [
        ...state.combatants,
        { id, characterId: id, initiative, hpCurrent: fullNpc.hpMax, statuses: [], isTemp: true, tempData: fullNpc },
      ].sort((a, b) => b.initiative - a.initiative),
    });
  },`;

code = code.replace(targetTemp, newTemp);
fs.writeFileSync(filePath, code);
