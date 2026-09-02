const fs = require('fs');
let c = fs.readFileSync('src/views/ViewNotes.tsx', 'utf8');

const newRender = `
            <div className="flex-1 overflow-y-auto custom-scrollbar mt-2 pr-2">
              <div className="text-base text-gray-200 font-serif leading-relaxed opacity-90">
                {viewingNote.content.split('\\n').map((line, i) => (
                  <p key={i} className={\`\${line.trim() === '' ? 'h-4' : 'mb-3'}\`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
`;

c = c.replace(
  /<div className="flex-1 overflow-y-auto custom-scrollbar mt-2">[\s\S]*?<\/div>/,
  newRender.trim()
);

fs.writeFileSync('src/views/ViewNotes.tsx', c);
console.log("Patched ViewNotes.tsx");
