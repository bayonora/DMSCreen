const fs = require('fs');
const filePath = 'src/views/ViewInitiative.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Add User to lucide-react imports if not there
code = code.replace(/import \{ ([^}]+) \} from "lucide-react";/, (match, p1) => {
  const parts = p1.split(',').map(s => s.trim());
  if (!parts.includes('User')) parts.push('User');
  return `import { ${parts.join(', ')} } from "lucide-react";`;
});

const titleTarget = `{char.type === "creature" && <Skull size={16} className="inline-block mr-2 text-[#8a211b]" />}
                          {char.type === "npc" && <UserCheck size={16} className="inline-block mr-2 text-blue-500" />}`;
const titleNew = `{char.type === "player" && <User size={16} className="inline-block mr-2 text-green-600" />}
                          {char.type === "creature" && <Skull size={16} className="inline-block mr-2 text-[#8a211b]" />}
                          {char.type === "npc" && <UserCheck size={16} className="inline-block mr-2 text-blue-500" />}`;

code = code.replace(titleTarget, titleNew);

fs.writeFileSync(filePath, code);
