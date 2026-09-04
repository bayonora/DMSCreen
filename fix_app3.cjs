const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// fix imports
code = code.replace(/import \{ WelcomeModal, FullTutorialModal \} from "\.\/components\/Tutorial";\nimport \{ Info \} from "lucide-react";\nimport \{ WelcomeModal, FullTutorialModal \} from "\.\/components\/Tutorial";\nimport \{ Info \} from "lucide-react";/g, 'import { WelcomeModal, FullTutorialModal } from "./components/Tutorial";\nimport { Info } from "lucide-react";');

// it might have more than two duplicates, let's just make them unique
let lines = code.split('\n');
let newLines = [];
let seenImports = new Set();
let seenShowTutorial = false;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  if (line.includes('import { WelcomeModal, FullTutorialModal } from "./components/Tutorial";')) {
    if (seenImports.has('tutorial')) continue;
    seenImports.add('tutorial');
  }
  if (line.includes('import { Info } from "lucide-react";')) {
    if (seenImports.has('info')) continue;
    seenImports.add('info');
  }
  if (line.includes('const [showTutorial, setShowTutorial] = useState(false);')) {
    if (seenShowTutorial) continue;
    seenShowTutorial = true;
  }
  if (line.includes('<WelcomeModal />')) {
    if (seenImports.has('welcomemodal')) continue;
    seenImports.add('welcomemodal');
  }
  if (line.includes('<FullTutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />')) {
    if (seenImports.has('fulltutorial')) continue;
    seenImports.add('fulltutorial');
  }
  newLines.push(line);
}

fs.writeFileSync('src/App.tsx', newLines.join('\n'));
console.log('patched App.tsx 3');
