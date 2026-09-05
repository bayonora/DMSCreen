const fs = require('fs');
const initPath = 'src/views/ViewInitiative.tsx';
let initCode = fs.readFileSync(initPath, 'utf8');

initCode = initCode.replace(
  /className="w-20 h-6 p-0 text-right border-none/g,
  'className="w-20 h-6 p-0 md:text-right text-left border-none'
);

// We should also adjust the bar itself, it has fixed w-32
initCode = initCode.replace(
  /<div className="w-32 h-1\.5 bg-\[#1a1614\]/g,
  '<div className="w-full md:w-32 h-1.5 bg-[#1a1614]'
);

fs.writeFileSync(initPath, initCode);
