const fs = require('fs');
let code = fs.readFileSync('src/components/GlobalSearch.tsx', 'utf8');

code = code.replace(
  'className="relative w-full max-w-md hidden md:block"',
  'className="relative w-full max-w-md"'
);

fs.writeFileSync('src/components/GlobalSearch.tsx', code);
console.log('patched GlobalSearch display block');
