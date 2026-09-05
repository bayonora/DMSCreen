const fs = require('fs');

function ensurePendingImport(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('const [pendingImport')) {
    // Find const [deleteId
    content = content.replace(/const \[deleteId, setDeleteId\] = useState<string \| null>\(null\);/, 
      `const [deleteId, setDeleteId] = useState<string | null>(null);\n  const [pendingImport, setPendingImport] = useState<any>(null);`
    );
    if (!content.includes('const [pendingImport')) {
      content = content.replace(/const \[isModalOpen, setIsModalOpen\] = useState\(false\);/, 
        `const [isModalOpen, setIsModalOpen] = useState(false);\n  const [pendingImport, setPendingImport] = useState<any>(null);`
      );
    }
  }
  
  if (file.includes('ViewMaps.tsx')) {
    if (!content.includes('import { store ')) {
      content = content.replace(/import \{ useStore, actions \}/, 'import { store, useStore, actions }');
    }
  }
  if (file.includes('ViewShops.tsx')) {
    if (!content.includes('import { store ')) {
      content = content.replace(/import \{ useStore, actions \}/, 'import { store, useStore, actions }');
    }
  }
  fs.writeFileSync(file, content);
}

ensurePendingImport('src/views/ViewItems.tsx');
ensurePendingImport('src/views/ViewMaps.tsx');
ensurePendingImport('src/views/ViewQuests.tsx');
ensurePendingImport('src/views/ViewShops.tsx');
