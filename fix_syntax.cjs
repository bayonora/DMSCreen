const fs = require('fs');
let c = fs.readFileSync('src/views/ViewMaps.tsx', 'utf8');
c = c.replace(/\\n\s*return \(/g, '\n  return (');
fs.writeFileSync('src/views/ViewMaps.tsx', c);
