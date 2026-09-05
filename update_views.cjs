const fs = require('fs');

function updateView(file, collectionName) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('ImportModal')) {
    content = content.replace(/import \{ ConfirmDeleteModal \} from "\.\.\/components\/ConfirmDeleteModal";/,
      `import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";\nimport { ImportModal } from "../components/ImportModal";`
    );
  }
  
  if (!content.includes('pendingImport')) {
    // find setDeleteId or similar to insert state
    content = content.replace(/const \[deleteId, setDeleteId\] = useState<string \| null>\(null\);/, 
      `const [deleteId, setDeleteId] = useState<string | null>(null);\n  const [pendingImport, setPendingImport] = useState<any>(null);`
    );
    // If not found, look for another state
    if (!content.includes('pendingImport')) {
      content = content.replace(/const \[isModalOpen, setIsModalOpen\] = useState\(false\);/,
        `const [isModalOpen, setIsModalOpen] = useState(false);\n  const [pendingImport, setPendingImport] = useState<any>(null);`
      );
    }
  }

  // update handleImport
  content = content.replace(/store\.setState\(\{\s*([a-zA-Z]+):\s*parsed(\.[a-zA-Z]+)?\s*\}\);/g, `setPendingImport(parsed$2);`);
  content = content.replace(/store\.setState\(\{\s*([a-zA-Z]+):\s*imported(\.[a-zA-Z]+)?\s*\}\);/g, `setPendingImport(imported$2);`);

  // inject confirmImport
  if (!content.includes('confirmImport')) {
    let collectionKey = collectionName;
    const confirmImportStr = `
  const confirmImport = (mode: "merge" | "overwrite") => {
    if (!pendingImport) return;
    if (mode === "overwrite") {
      store.setState({ ${collectionKey}: pendingImport });
    } else {
      store.setState({ ${collectionKey}: [...(store.getState().${collectionKey} || []), ...pendingImport] });
    }
    setPendingImport(null);
  };
`;
    // find where handleImport ends to insert confirmImport
    content = content.replace(/if \(fileInputRef\.current\) fileInputRef\.current\.value = "";\n  \};/g, 
      `if (fileInputRef.current) fileInputRef.current.value = "";\n  };\n${confirmImportStr}`
    );
  }

  // insert modal at end
  if (!content.includes('<ImportModal')) {
    content = content.replace(/<\/div>\n\s*\);\n\}/g, 
      `  <ImportModal\n        isOpen={!!pendingImport}\n        onClose={() => setPendingImport(null)}\n        onMerge={() => confirmImport("merge")}\n        onOverwrite={() => confirmImport("overwrite")}\n      />\n    </div>\n  );\n}`
    );
  }

  fs.writeFileSync(file, content);
}

// Map files to their primary collection
updateView('src/views/ViewItems.tsx', 'customItems');
// Wait, ViewItems has customItems and lootTables... It might need special care. I'll do Quests and Maps manually.
