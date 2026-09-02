const fs = require('fs');
let c = fs.readFileSync('src/views/ViewNotes.tsx', 'utf8');

if (!c.includes('import Markdown')) {
  c = c.replace('import React from "react";', 'import React from "react";\nimport Markdown from "react-markdown";\nimport remarkGfm from "remark-gfm";');
}

const markdownRender = `
            <div className="flex-1 overflow-y-auto custom-scrollbar mt-2 pr-4">
              <div className="text-base text-gray-200 font-serif leading-relaxed opacity-90 markdown-body">
                <Markdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-[#c1a063] mb-4 mt-6 first:mt-0 font-sans uppercase tracking-widest" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold text-[#c1a063] mb-3 mt-5 first:mt-0 font-sans uppercase tracking-widest" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold text-[#d4b57a] mb-3 mt-4 first:mt-0 font-sans" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-[#e6e2da]" {...props} />,
                    em: ({node, ...props}) => <em className="italic text-[#d4b57a]" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#c1a063] pl-4 py-1 mb-4 bg-black/20 italic" {...props} />,
                    a: ({node, ...props}) => <a className="text-[#c1a063] hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                  }}
                >
                  {viewingNote.content}
                </Markdown>
              </div>
            </div>
`;

c = c.replace(
  /<div className="flex-1 overflow-y-auto custom-scrollbar mt-2 pr-2">[\s\S]*?<\/div>\n            <\/div>/,
  markdownRender.trim()
);

fs.writeFileSync('src/views/ViewNotes.tsx', c);
console.log("Patched ViewNotes.tsx with react-markdown");
