const fs = require('fs');
let c = fs.readFileSync('src/views/ViewNotes.tsx', 'utf8');

if (!c.includes('import remarkBreaks')) {
  c = c.replace('import remarkGfm from "remark-gfm";', 'import remarkGfm from "remark-gfm";\nimport remarkBreaks from "remark-breaks";');
}

c = c.replace('remarkPlugins={[remarkGfm]}', 'remarkPlugins={[remarkGfm, remarkBreaks]}');

fs.writeFileSync('src/views/ViewNotes.tsx', c);
console.log("Patched ViewNotes.tsx with remark-breaks");
