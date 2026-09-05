const fs = require('fs');

function swap(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // App.tsx uses size=20
  // ViewNotes uses size=18
  // Other views use size=14
  
  if (file.includes('App.tsx')) {
    content = content.replace('<Upload size={20} className="text-[#8b7355] group-hover:text-[#c1a063]" />\n                <span className="uppercase tracking-wider text-sm">Exportar Todo</span>', 
                              '<Download size={20} className="text-[#8b7355] group-hover:text-[#c1a063]" />\n                <span className="uppercase tracking-wider text-sm">Exportar Todo</span>');
    content = content.replace('<Download size={20} className="text-[#8b7355] group-hover:text-[#c1a063]" />\n                <span className="uppercase tracking-wider text-sm">Importar Datos</span>',
                              '<Upload size={20} className="text-[#8b7355] group-hover:text-[#c1a063]" />\n                <span className="uppercase tracking-wider text-sm">Importar Datos</span>');
  } else {
    // This flips <Upload size={14} ...> Importar ... to Download
    content = content.replace(/<Upload size=\{14\} className="mr-1" \/> Importar/g, '<Download size={14} className="mr-1" /> Importar');
    content = content.replace(/<Download size=\{14\} className="mr-1" \/> Exportar/g, '<Upload size={14} className="mr-1" /> Exportar');
    
    // ViewParty uses mr-2
    content = content.replace(/<Upload size=\{14\} className="mr-2" \/> Importar/g, '<Download size={14} className="mr-2" /> Importar');
    content = content.replace(/<Download size=\{14\} className="mr-2" \/> Exportar/g, '<Upload size={14} className="mr-2" /> Exportar');
  }

  fs.writeFileSync(file, content);
}

swap('src/App.tsx');
swap('src/views/ViewParty.tsx');
swap('src/views/ViewShops.tsx');
swap('src/views/ViewQuests.tsx');
