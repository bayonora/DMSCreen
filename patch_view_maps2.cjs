const fs = require('fs');

let content = fs.readFileSync('src/views/ViewMaps.tsx', 'utf8');

// Replace aspect-square with aspect-[4/3] (a bit more rectangular) or aspect-video
content = content.replace(/aspect-square/g, 'aspect-[16/10]');

// Add map editing states
content = content.replace(
  'const [selectedMapId, setSelectedMapId] = useState<string | null>(null);\n  const [deleteId, setDeleteId] = useState<string | null>(null);',
  'const [selectedMapId, setSelectedMapId] = useState<string | null>(null);\n  const [editMapData, setEditMapData] = useState<any | null>(null);\n  const [deleteId, setDeleteId] = useState<string | null>(null);'
);

// Add edit button to maps
content = content.replace(
  '<span className="text-xs uppercase tracking-widest text-[#e6e2da] truncate">{m.name}</span>\n                    <button onClick={() => setDeleteId(m.id)} className="text-[#3a302a] hover:text-[#8a211b] p-1 transition-colors">\n                      <Trash2 size={16} />\n                    </button>',
  '<span className="text-xs uppercase tracking-widest text-[#e6e2da] truncate">{m.name}</span>\n                    <div className="flex gap-1">\n                      <button onClick={() => setEditMapData(m)} className="text-[#3a302a] hover:text-[#c1a063] p-1 transition-colors">\n                        <Edit2 size={16} />\n                      </button>\n                      <button onClick={() => setDeleteId(m.id)} className="text-[#3a302a] hover:text-[#8a211b] p-1 transition-colors">\n                        <Trash2 size={16} />\n                      </button>\n                    </div>'
);

// Update AddMapModal properties
content = content.replace(
  '<AddMapModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />',
  '<AddMapModal isOpen={isAddOpen || !!editMapData} onClose={() => { setIsAddOpen(false); setEditMapData(null); }} initialData={editMapData} />'
);

// Update AddMapModal implementation
content = content.replace(
  'function AddMapModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {',
  'function AddMapModal({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData?: any | null }) {'
);

const newHandleSubmitMap = `  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    setLoading(true);
    try {
      let base64 = initialData?.image;
      const file = fileRef.current?.files?.[0];
      if (file) {
        base64 = await compressImage(file, 2048); // max 2048px width
      } else if (!initialData) {
        setLoading(false);
        return; // require image only on creation
      }
      
      if (initialData) {
        actions.updateMap(initialData.id, { name, image: base64 });
      } else {
        actions.addMap({ name, image: base64 });
      }
      onClose();
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      alert("Error al procesar la imagen");
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(
  /const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?\};\n/,
  newHandleSubmitMap + '\\n'
);

// We also need to remove 'required' from the file input so it's optional during edit
content = content.replace(
  'ref={fileRef}\n            required\n            className="flex h-10 w-full',
  'ref={fileRef}\n            required={!initialData}\n            className="flex h-10 w-full'
);

content = content.replace(
  'title="Añadir Mapa"',
  'title={initialData ? "Editar Mapa" : "Añadir Mapa"}'
);

content = content.replace(
  '{loading ? "Procesando..." : "Añadir"}',
  '{loading ? "Procesando..." : (initialData ? "Guardar" : "Añadir")}'
);

content = content.replace(
  '<MapPin size={48} className="mb-4 text-[#c1a063]" />',
  '<ImageIcon size={48} className="mb-4 text-[#c1a063]" />'
);

fs.writeFileSync('src/views/ViewMaps.tsx', content);
console.log("Patched successfully");
