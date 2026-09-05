const fs = require('fs');
const filePath = 'src/views/ViewInitiative.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const targetStr = `className={cn("text-[10px] uppercase font-bold", isActive ? "opacity-100 text-[#c1a063]" : "opacity-30", char.type === "npc" && !isActive ? "text-red-400" : "")}>`;
const newStr = `className={cn("text-[10px] uppercase font-bold", isActive ? "opacity-100 text-[#c1a063]" : "opacity-30")}>`;

code = code.replace(targetStr, newStr);

fs.writeFileSync(filePath, code);
