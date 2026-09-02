const fs = require('fs');
let c = fs.readFileSync('src/views/ViewMaps.tsx', 'utf8');
c = c.replace(/<ImageIcon size=\{48\} className="mb-4 text-\\[#c1a063\\]" \/>\s*<p>No hay lugares guardados\.<\/p>/, '<MapPin size={48} className="mb-4 text-[#c1a063]" />\n                <p>No hay lugares guardados.</p>');
fs.writeFileSync('src/views/ViewMaps.tsx', c);
