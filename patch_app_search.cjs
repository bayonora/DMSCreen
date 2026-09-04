const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { GlobalSearch }')) {
  code = code.replace(
    'import { WelcomeModal, FullTutorialModal } from "./components/Tutorial";',
    'import { WelcomeModal, FullTutorialModal } from "./components/Tutorial";\nimport { GlobalSearch } from "./components/GlobalSearch";'
  );
}

// Find the header section:
// <h1 className="text-xl font-bold tracking-widest text-[#e6e2da] uppercase hidden sm:block">
//   DM Screen
// </h1>
// </div>

const targetStr = '<h1 className="text-xl font-bold tracking-widest text-[#e6e2da] uppercase hidden sm:block">\n            DM Screen\n          </h1>\n        </div>';

if (code.includes(targetStr)) {
  code = code.replace(targetStr, targetStr + '\n\n        <GlobalSearch onNavigate={setActiveTab} />');
}

fs.writeFileSync('src/App.tsx', code);
console.log('patched App.tsx for search');
