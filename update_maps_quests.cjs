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

  // update handleImport / importQuests / importMaps
  // Quests uses importQuests
  content = content.replace(/store\.setState\(\{\s*([a-zA-Z]+):\s*parsed(\.[a-zA-Z]+)?\s*\}\);/g, `setPendingImport(parsed$2);`);
  content = content.replace(/store\.setState\(\{\s*([a-zA-Z]+):\s*imported(\.[a-zA-Z]+)?\s*\}\);/g, `setPendingImport(imported$2);`);
  
  // Quests specific:
  content = content.replace(/store\.setState\(\{ quests: imported \}\);/g, `setPendingImport(imported);`);
  
  // Maps specific:
  content = content.replace(/actions\.importMaps\(imported\);/g, `setPendingImport(imported);`);
  content = content.replace(/actions\.importLocations\(imported\.locations\);/g, ``); // handled in confirm
  content = content.replace(/actions\.importMaps\(imported\.maps\);/g, `setPendingImport(imported);`);

  // inject confirmImport
  if (!content.includes('confirmImport')) {
    let collectionKey = collectionName;
    
    let confirmImportStr = `
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

    if (collectionName === 'maps') {
      confirmImportStr = `
  const confirmImport = (mode: "merge" | "overwrite") => {
    if (!pendingImport) return;
    if (Array.isArray(pendingImport)) {
      if (mode === "overwrite") store.setState({ maps: pendingImport });
      else store.setState({ maps: [...(store.getState().maps || []), ...pendingImport] });
    } else {
      if (mode === "overwrite") {
        store.setState({ maps: pendingImport.maps || [], locations: pendingImport.locations || [] });
      } else {
        store.setState({ 
          maps: [...(store.getState().maps || []), ...(pendingImport.maps || [])],
          locations: [...(store.getState().locations || []), ...(pendingImport.locations || [])]
        });
      }
    }
    setPendingImport(null);
  };
`;
    }

    // insert after fileInputRef.current.value = "";
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

updateView('src/views/ViewQuests.tsx', 'quests');
updateView('src/views/ViewMaps.tsx', 'maps');
