const fs = require('fs');
const filePath = 'src/store/useStore.ts';
let code = fs.readFileSync(filePath, 'utf8');

const targetTemp = `addTempCombatant: (npc: Omit<NPC, "id" | "type">, initiative: number) => {
    const state = store.getState();
    const id = uuidv4();
    const fullNpc = { ...npc, id, type: "creature" as const }; // Temporales se asumen criaturas`;

const newTemp = `addTempCombatant: (npc: Omit<NPC, "id" | "type">, initiative: number, isEnemy: boolean = true) => {
    const state = store.getState();
    const id = uuidv4();
    const fullNpc = { ...npc, id, type: (isEnemy ? "creature" : "npc") as any };`;

code = code.replace(targetTemp, newTemp);
fs.writeFileSync(filePath, code);
