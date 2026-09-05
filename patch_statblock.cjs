const fs = require('fs');
const filePath = 'src/components/StatBlock.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const targetLine = `<div className="bg-[#1e1a17] border border-[#3a302a] border-l-4 border-l-[#c1a063] rounded-sm p-4 text-[#e6e2da] font-serif shadow-lg flex flex-col relative max-w-md w-full">`;
const newLine = `  const borderColor = character.type === "player" ? "border-l-[#c1a063]" : character.type === "creature" ? "border-l-[#8a211b]" : "border-l-[#4a7298]";
  return (
    <div className={\`bg-[#1e1a17] border border-[#3a302a] border-l-4 \${borderColor} rounded-sm p-4 text-[#e6e2da] font-serif shadow-lg flex flex-col relative max-w-md w-full\`}>`;

if(code.includes(targetLine)) {
  code = code.replace("  return (\n" + targetLine, newLine);
  fs.writeFileSync(filePath, code);
  console.log("Patched StatBlock");
} else {
  console.log("Could not find target line in StatBlock");
}
