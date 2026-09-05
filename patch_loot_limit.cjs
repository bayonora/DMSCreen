const fs = require('fs');
const filePath = 'src/views/ViewItems.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const targetStr = `    // Parse text into lines, max 100
    const lines = editingTable.rawText
      .split("\\n")
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .slice(0, 100);`;

const replacementStr = `    // Parse text into lines (unlimited)
    const lines = editingTable.rawText
      .split("\\n")
      .map(l => l.trim())
      .filter(l => l.length > 0);`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  fs.writeFileSync(filePath, code);
  console.log('patched loot table limit');
} else {
  console.log('could not find target string in ViewItems.tsx');
}
