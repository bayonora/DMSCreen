const fs = require('fs');

function force(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('const [pendingImport, setPendingImport]')) {
    content = content.replace(/const \[activeTab, setActiveTab\] = useState/, `const [pendingImport, setPendingImport] = useState<any>(null);\n  const [activeTab, setActiveTab] = useState`);
    content = content.replace(/const \[isAddOpen, setIsAddOpen\] = useState/, `const [pendingImport, setPendingImport] = useState<any>(null);\n  const [isAddOpen, setIsAddOpen] = useState`);
    content = content.replace(/const \[showActive, setShowActive\] = useState/, `const [pendingImport, setPendingImport] = useState<any>(null);\n  const [showActive, setShowActive] = useState`);
    
    // ViewQuests uses AnimatePresence, AnimatePresence has nothing to do with it but maybe quests is there
    content = content.replace(/const \[searchQuery, setSearchQuery\] = useState/, `const [pendingImport, setPendingImport] = useState<any>(null);\n  const [searchQuery, setSearchQuery] = useState`);
    
    fs.writeFileSync(file, content);
  }
}

force('src/views/ViewItems.tsx');
force('src/views/ViewQuests.tsx');
