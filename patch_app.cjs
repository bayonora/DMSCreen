const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'import { CalculatorModal } from "./components/CalculatorModal";',
  'import { CalculatorModal } from "./components/CalculatorModal";\nimport { WelcomeModal, FullTutorialModal } from "./components/Tutorial";\nimport { Info } from "lucide-react";'
);

code = code.replace(
  'const [showCalculator, setShowCalculator] = useState(false);',
  'const [showCalculator, setShowCalculator] = useState(false);\n  const [showTutorial, setShowTutorial] = useState(false);'
);

code = code.replace(
  '<Calculator size={24} />\n          </button>\n          <button \n            onClick={() => setShowSettings(true)}',
  '<Calculator size={24} />\n          </button>\n          <button\n            onClick={() => setShowTutorial(true)}\n            className="p-2 text-[#8b7355] hover:text-[#c1a063] transition-colors"\n            title="Ayuda / Tutorial"\n          >\n            <Info size={24} />\n          </button>\n          <button \n            onClick={() => setShowSettings(true)}'
);

code = code.replace(
  '<CalculatorModal isOpen={showCalculator} onClose={() => setShowCalculator(false)} />',
  '<CalculatorModal isOpen={showCalculator} onClose={() => setShowCalculator(false)} />\n      <WelcomeModal />\n      <FullTutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />'
);

fs.writeFileSync('src/App.tsx', code);
console.log('patched App.tsx');
