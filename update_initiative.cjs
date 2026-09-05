const fs = require('fs');
const filePath = 'src/views/ViewInitiative.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// HP Bar Color
const targetHpBar = `className={cn("absolute inset-0 transition-all duration-300", char.type === "player" ? "bg-green-600" : "bg-red-800")}`;
const newHpBar = `className={cn("absolute inset-0 transition-all duration-300", char.type === "player" ? "bg-green-600" : char.type === "npc" ? "bg-blue-600" : "bg-red-800")}`;
code = code.replace(targetHpBar, newHpBar);

// Title styling (maybe add UserCheck for NPC)
code = code.replace(/import \{ ([^}]+) \} from "lucide-react";/, (match, p1) => {
  if (!p1.includes('UserCheck')) p1 += ', UserCheck';
  return `import { ${p1} } from "lucide-react";`;
});

const titleTarget = `{char.type === "creature" && <Skull size={16} className="inline-block mr-2 text-[#8a211b]" />}`;
const titleNew = `{char.type === "creature" && <Skull size={16} className="inline-block mr-2 text-[#8a211b]" />}\n                          {char.type === "npc" && <UserCheck size={16} className="inline-block mr-2 text-blue-500" />}`;
code = code.replace(titleTarget, titleNew);

fs.writeFileSync(filePath, code);
