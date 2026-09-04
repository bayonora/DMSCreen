const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = '<span className="-rotate-45 font-bold text-xl text-[#c1a063] font-display">DM</span>\n          </div>\n        </div>\n        <div className="flex items-center space-x-2">';

if (code.includes(targetStr)) {
  const replacementStr = '<span className="-rotate-45 font-bold text-xl text-[#c1a063] font-display">DM</span>\n          </div>\n        </div>\n        <div className="flex-1 flex justify-center px-4 max-w-lg hidden sm:flex"><GlobalSearch onNavigate={setActiveTab} /></div>\n        <div className="flex items-center space-x-2">';
  code = code.replace(targetStr, replacementStr);
  fs.writeFileSync('src/App.tsx', code);
  console.log('patched App.tsx successfully');
} else {
  console.log('could not find target string');
}
