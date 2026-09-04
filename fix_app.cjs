const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import \{ WelcomeModal, FullTutorialModal \} from "\.\/components\/Tutorial";\nimport \{ Info \} from "lucide-react";\nimport \{ WelcomeModal, FullTutorialModal \} from "\.\/components\/Tutorial";\nimport \{ Info \} from "lucide-react";/g, 'import { WelcomeModal, FullTutorialModal } from "./components/Tutorial";\nimport { Info } from "lucide-react";');

code = code.replace(/const \[showTutorial, setShowTutorial\] = useState\(false\);\n  const \[showTutorial, setShowTutorial\] = useState\(false\);/g, 'const [showTutorial, setShowTutorial] = useState(false);');

// The button is duplicated? Let's check.
