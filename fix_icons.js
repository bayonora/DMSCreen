const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  // First, convert them to placeholders so they don't overwrite each other
  content = content.replace(/title="Importar Notas"\s*>\s*<Upload size=\{18\} \/>/g, 'title="Importar Notas">\n            <Download size={18} />');
  content = content.replace(/title="Exportar Notas"\s*>\s*<Download size=\{18\} \/>/g, 'title="Exportar Notas">\n            <Upload size={18} />');
  fs.writeFileSync(file, content);
}
fix('src/views/ViewNotes.tsx');
