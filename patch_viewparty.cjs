const fs = require('fs');
const filePath = 'src/views/ViewParty.tsx';
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
  `const { players, npcs: allNpcs } = useStore();`,
  `const { players, npcs: allNpcs, creatures: allCreatures } = useStore();\n  const creatures = (allCreatures || []).filter(c => !c.isTemp);`
);

code = code.replace(
  `const [tab, setTab] = useState<"players" | "npcs">("players");`,
  `const [tab, setTab] = useState<"players" | "npcs" | "creatures">("players");`
);

code = code.replace(
  `} else {
      actions.addNPC({ ...c, name: \`\${c.name} (Copia)\` } as NPC);
    }`,
  `} else if (c.type === "npc") {
      actions.addNPC({ ...c, name: \`\${c.name} (Copia)\` } as NPC);
    } else {
      actions.addCreature({ ...c, name: \`\${c.name} (Copia)\` } as any);
    }`
);

code = code.replace(
  `if (tab === "players") actions.deletePlayer(deleteId);
    else actions.deleteNPC(deleteId);`,
  `if (tab === "players") actions.deletePlayer(deleteId);
    else if (tab === "npcs") actions.deleteNPC(deleteId);
    else actions.deleteCreature(deleteId);`
);

code = code.replace(
  `          <Button variant={tab === "npcs" ? "primary" : "secondary"} onClick={() => setTab("npcs")} className="whitespace-nowrap">
            NPCs ({npcs.length})
          </Button>`,
  `          <Button variant={tab === "npcs" ? "primary" : "secondary"} onClick={() => setTab("npcs")} className="whitespace-nowrap">
            NPCs ({npcs.length})
          </Button>
          <Button variant={tab === "creatures" ? "primary" : "secondary"} onClick={() => setTab("creatures")} className="whitespace-nowrap">
            Criaturas ({creatures.length})
          </Button>`
);

const targetForm = `        <CharForm
          char={editingChar}
          isNpc={tab === "npcs"}
          onClose={() => setIsModalOpen(false)}
        />`;
const newForm = `        <CharForm
          char={editingChar}
          isNpc={tab === "npcs"}
          isCreature={tab === "creatures"}
          onClose={() => setIsModalOpen(false)}
        />`;
code = code.replace(targetForm, newForm);

const targetGrid = `      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0908]">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {(tab === "players" ? players : npcs).map((c) => (`;
const newGrid = `      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0908]">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {(tab === "players" ? players : tab === "npcs" ? npcs : creatures).map((c) => (`;
code = code.replace(targetGrid, newGrid);

const exportTarget = `const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ players, npcs }));`;
const exportNew = `const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ players, npcs, creatures }));`;
code = code.replace(exportTarget, exportNew);

const importTarget = `if (parsed.npcs) {
        parsed.npcs.forEach((n: any) => actions.addNPC(n));
      }`;
const importNew = `if (parsed.npcs) {
        parsed.npcs.forEach((n: any) => actions.addNPC(n));
      }
      if (parsed.creatures) {
        parsed.creatures.forEach((c: any) => actions.addCreature(c));
      }`;
code = code.replace(importTarget, importNew);

fs.writeFileSync(filePath, code);
console.log("Patched ViewParty core logic");
