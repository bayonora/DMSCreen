const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<WelcomeModal \/>\n      <FullTutorialModal isOpen=\{showTutorial\} onClose=\{[^}]+\} \/>\n      <WelcomeModal \/>\n      <FullTutorialModal isOpen=\{showTutorial\} onClose=\{[^}]+\} \/>/g, '<WelcomeModal />\n      <FullTutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />');

fs.writeFileSync('src/App.tsx', code);
console.log('patched App.tsx 2');
