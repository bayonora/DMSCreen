const fs = require('fs');
const filePath = 'src/views/ViewItems.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const text1 = 'Cada línea de texto será un objeto numerado (Máximo 100 líneas).';
const newText1 = 'Cada línea de texto será un posible resultado (Sin límite de líneas).';

const text2 = `<span className="text-gray-500">{editingTable.rawText.split('\\n').filter(l=>l.trim()).length} / 100</span>`;
const newText2 = `<span className="text-gray-500">{editingTable.rawText.split('\\n').filter(l=>l.trim()).length} entradas</span>`;

if (code.includes(text1)) code = code.replace(text1, newText1);
if (code.includes(text2)) code = code.replace(text2, newText2);

fs.writeFileSync(filePath, code);
console.log('patched UI texts for loot tables');
