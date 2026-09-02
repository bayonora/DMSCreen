const fs = require('fs');
let c = fs.readFileSync('src/views/ViewNotes.tsx', 'utf8');

if (!c.includes('import { Plus, X, Download, Upload, Palette, Edit2, Trash2 }')) {
  c = c.replace('import { Plus, X, Download, Upload, Palette }', 'import { Plus, X, Download, Upload, Palette, Edit2, Trash2 }');
}

if (!c.includes('const [viewingNote, setViewingNote]')) {
  c = c.replace(
    'const [deleteId, setDeleteId] = useState<string | null>(null);',
    'const [deleteId, setDeleteId] = useState<string | null>(null);\n  const [viewingNote, setViewingNote] = useState<Note | null>(null);'
  );
}

// Change onClick={() => setEditingNote(note)} to onClick={() => setViewingNote(note)}
c = c.replace(
  'onClick={() => setEditingNote(note)}',
  'onClick={() => setViewingNote(note)}'
);

// Add the viewing modal
const viewingModal = `
      {viewingNote && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm transition-all" onClick={() => setViewingNote(null)}>
          <div
            className={\`\${viewingNote.color || COLORS[0]} border border-[#3a302a] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl shadow-black custom-scrollbar flex flex-col\`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
               <h2 className="text-2xl text-[#c1a063] font-bold pr-4">{viewingNote.title || "Sin título"}</h2>
               <div className="flex gap-2 shrink-0">
                 <button onClick={() => { setEditingNote(viewingNote); setViewingNote(null); }} className="text-[#8b7355] hover:text-[#c1a063] transition-colors p-2 bg-black/20 rounded border border-transparent hover:border-[#3a302a]" title="Editar">
                   <Edit2 size={18} />
                 </button>
                 <button onClick={() => { setDeleteId(viewingNote.id); setViewingNote(null); }} className="text-[#8b7355] hover:text-[#8a211b] transition-colors p-2 bg-black/20 rounded border border-transparent hover:border-[#3a302a]" title="Eliminar">
                   <Trash2 size={18} />
                 </button>
                 <button onClick={() => setViewingNote(null)} className="text-[#8b7355] hover:text-white p-2 bg-black/20 rounded border border-transparent hover:border-[#3a302a]" title="Cerrar">
                   <X size={18} />
                 </button>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar mt-2">
              <p className="text-base text-gray-200 whitespace-pre-wrap font-serif leading-relaxed">{viewingNote.content}</p>
            </div>
          </div>
        </div>
      )}
`;

if (!c.includes('viewingNote && (')) {
  c = c.replace(
    '{editingNote && (',
    viewingModal + '\n      {editingNote && ('
  );
}

fs.writeFileSync('src/views/ViewNotes.tsx', c);
console.log("Patched ViewNotes.tsx");
