const fs = require('fs');
const filePath = 'src/views/ViewParty.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const targetHandleDup = `  const handleDuplicate = (c: Character) => {
    if (c.type === "player") {
      actions.addPlayer({ ...c, name: \`\${c.name} (Copia)\` } as Player);
    } else if (c.type === "npc") {
      actions.addNPC({ ...c, name: \`\${c.name} (Copia)\` } as NPC);
    } else {
      actions.addCreature({ ...c, name: \`\${c.name} (Copia)\` } as any);
    }
  };`;

const newHandleDup = `  const handleDuplicate = (c: Character) => {
    if (c.type === "player") {
      actions.addPlayer({ ...c, name: \`\${c.name} (Copia)\` } as Player);
    } else if (c.type === "npc") {
      actions.addNPC({ ...c, name: \`\${c.name} (Copia)\` } as NPC);
    } else {
      actions.addCreature({ ...c, name: \`\${c.name} (Copia)\` } as any);
    }
  };

  const handleConvertToCreature = (c: Character) => {
    if (c.type === "npc") {
      actions.addCreature({ ...c, name: \`\${c.name} (Enemigo)\` } as any);
      alert(\`\${c.name} se ha copiado como Criatura enemiga.\`);
    }
  };`;

code = code.replace(targetHandleDup, newHandleDup);

code = code.replace(/<StatBlock character=\{n\} onEdit=\{handleEdit\} onDelete=\{handleDelete\} onDuplicate=\{handleDuplicate\} \/>/, 
  `<StatBlock character={n} onEdit={handleEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} onConvertToCreature={handleConvertToCreature} />`);

fs.writeFileSync(filePath, code);
