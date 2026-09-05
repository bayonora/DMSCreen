const fs = require('fs');

function swap(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/<Upload size=\{14\} className="mr-1" \/> Importar/g, '<Download size={14} className="mr-1" /> Importar');
  content = content.replace(/<Download size=\{14\} className="mr-1" \/> Exportar/g, '<Upload size={14} className="mr-1" /> Exportar');
  
  content = content.replace(/<Upload size=\{18\} \/>/g, '<Download size={18} />');
  // the second replace is risky if there are other uploads.
  fs.writeFileSync(file, content);
}

// In ViewItems:
let file = 'src/views/ViewItems.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/<Upload size=\{14\} className="mr-1" \/> Importar/g, '<Download size={14} className="mr-1" /> Importar');
content = content.replace(/<Download size=\{14\} className="mr-1" \/> Exportar/g, '<Upload size={14} className="mr-1" /> Exportar');
fs.writeFileSync(file, content);

// In ViewMaps:
file = 'src/views/ViewMaps.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/<Upload size=\{14\} className="mr-1" \/> Importar/g, '<Download size={14} className="mr-1" /> Importar');
content = content.replace(/<Download size=\{14\} className="mr-1" \/> Exportar/g, '<Upload size={14} className="mr-1" /> Exportar');
fs.writeFileSync(file, content);

