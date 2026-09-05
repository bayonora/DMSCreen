const fs = require('fs');
const filePath = 'src/components/StatBlock.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Imports
code = code.replace(/import \{ ([^}]+) \} from "lucide-react";/, (match, p1) => {
  if (!p1.includes('Skull')) p1 += ', Skull';
  if (!p1.includes('Swords')) p1 += ', Swords';
  if (!p1.includes('UserCheck')) p1 += ', UserCheck';
  return `import { ${p1} } from "lucide-react";`;
});

// Props
code = code.replace(/onDuplicate\?: \(c: Character\) => void;/, `onDuplicate?: (c: Character) => void;\n  onConvertToCreature?: (c: Character) => void;`);

// Component sig
code = code.replace(/export const StatBlock: React.FC<StatBlockProps> = \(\{ character, onEdit, onDelete, onDuplicate \}\) => \{/, 
  `export const StatBlock: React.FC<StatBlockProps> = ({ character, onEdit, onDelete, onDuplicate, onConvertToCreature }) => {`);

// Colors
const colorsInsertion = `
  const borderColor = character.type === "player" ? "border-l-[#c1a063]" : character.type === "npc" ? "border-l-slate-400" : "border-l-[#8a211b]";
  const titleColor = character.type === "player" ? "text-[#c1a063]" : character.type === "npc" ? "text-slate-400" : "text-[#8a211b]";
  const isPlayer = character.type === "player";`;
code = code.replace(/  const isPlayer = character.type === "player";/, colorsInsertion);

// Wrapper class
code = code.replace(/<div className="bg-\[#1e1a17\] border border-\[#3a302a\] border-l-4 border-l-\[#c1a063\] rounded-sm p-4 text-\[#e6e2da\] font-serif shadow-lg flex flex-col relative max-w-md w-full">/, 
  `<div className={\`bg-[#1e1a17] border border-[#3a302a] border-l-4 \${borderColor} rounded-sm p-4 text-[#e6e2da] font-serif shadow-lg flex flex-col relative max-w-md w-full\`}>`);

// Buttons
const btnBlock = `      <div className="absolute top-2 right-2 flex gap-1">
        {character.type === "npc" && onConvertToCreature && (
          <button onClick={() => onConvertToCreature(character)} className="p-1 text-[#3a302a] hover:text-[#8a211b] transition-colors" title="Convertir a Criatura Enemiga">
            <Swords size={16} />
          </button>
        )}
        {onDuplicate && (`;
code = code.replace(/      <div className="absolute top-2 right-2 flex gap-1">\n        \{onDuplicate && \(/, btnBlock);

// Title
const titleBlock = `<h1 className={\`text-2xl font-bold font-sans pr-24 \${titleColor}\`}>
        {character.type === "creature" && <Skull size={20} className="inline-block mr-2 -mt-1" />}
        {character.type === "npc" && <UserCheck size={20} className="inline-block mr-2 -mt-1" />}
        {character.name}
      </h1>`;
code = code.replace(/<h1 className="text-2xl font-bold text-\[#c1a063\] font-sans pr-16">\{character.name\}<\/h1>/, titleBlock);

fs.writeFileSync(filePath, code);
