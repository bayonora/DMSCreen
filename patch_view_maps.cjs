const fs = require('fs');

let content = fs.readFileSync('src/views/ViewMaps.tsx', 'utf8');

// Imports
content = content.replace(
  'import { Plus, Trash2, Maximize2, Image as ImageIcon } from "lucide-react";',
  'import { Plus, Trash2, Maximize2, Image as ImageIcon, MapPin, Edit2 } from "lucide-react";\nimport { LocationData } from "../types";\nimport { Textarea } from "../components/ui/Input";'
);

// Destructure locations from useStore
content = content.replace(
  'const { maps } = useStore();',
  'const { maps, locations } = useStore();\n  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);\n  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);\n  const [editLocationData, setEditLocationData] = useState<LocationData | null>(null);\n  const [deleteLocationId, setDeleteLocationId] = useState<string | null>(null);'
);

// Replace the main header and gallery view
const mainHeaderRegex = /<div className="bg-\[#1e1a17\] px-4 sm:px-6 py-4 border-b border-\[#3a302a\] flex justify-between items-center gap-4">[\s\S]*?<\/div>/;

const galleryRegex = /<div className="flex-1 overflow-y-auto p-6 custom-scrollbar">[\s\S]*?<\/div>\s*<\/div>\s*\)}/m;

const newGalleryView = `<div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#0a0a09]">
          {/* MAPS GALLERY */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar border-b md:border-b-0 md:border-r border-[#3a302a]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm uppercase tracking-widest text-[#c1a063] font-light flex items-center gap-2">
                <ImageIcon className="text-[#c1a063]" size={16} /> Mapas
              </h2>
              <Button onClick={() => setIsAddOpen(true)} size="sm" className="whitespace-nowrap">
                <Plus size={14} className="mr-1" /> Añadir
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {maps.map((m) => (
                <div key={m.id} className="bg-[#1e1a17] border border-[#3a302a] flex flex-col h-48 group shadow-lg shadow-black/50 relative">
                  <div 
                    className="flex-1 w-full h-full bg-cover bg-center cursor-pointer relative"
                    style={{ backgroundImage: \`url(\${m.image})\` }}
                    onClick={() => setSelectedMapId(m.id)}
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                       <Maximize2 size={32} className="text-[#c1a063] drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="p-3 bg-[#1e1a17] flex justify-between items-center border-t border-[#3a302a]">
                    <span className="text-xs uppercase tracking-widest text-[#e6e2da] truncate">{m.name}</span>
                    <button onClick={() => setDeleteId(m.id)} className="text-[#3a302a] hover:text-[#8a211b] p-1 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {maps.length === 0 && (
              <div className="text-center opacity-50 py-20 flex flex-col items-center">
                <ImageIcon size={48} className="mb-4 text-[#c1a063]" />
                <p>No hay mapas guardados.</p>
              </div>
            )}
          </div>

          {/* LOCATIONS GALLERY */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm uppercase tracking-widest text-[#c1a063] font-light flex items-center gap-2">
                <MapPin className="text-[#c1a063]" size={16} /> Lugares
              </h2>
              <Button onClick={() => setIsAddLocationOpen(true)} size="sm" className="whitespace-nowrap">
                <Plus size={14} className="mr-1" /> Añadir
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((loc) => (
                <div key={loc.id} className="bg-[#1e1a17] border border-[#3a302a] flex flex-col cursor-pointer shadow-lg shadow-black/50 hover:border-[#c1a063] transition-colors" onClick={() => setSelectedLocationId(loc.id)}>
                  {loc.image ? (
                    <div className="w-full aspect-square bg-cover bg-center border-b border-[#3a302a]" style={{ backgroundImage: \`url(\${loc.image})\` }} />
                  ) : (
                    <div className="w-full aspect-square bg-[#0f0d0c] border-b border-[#3a302a] flex items-center justify-center">
                      <MapPin size={32} className="text-[#3a302a]" />
                    </div>
                  )}
                  <div className="p-3">
                    <div className="text-xs text-[#e6e2da] uppercase tracking-widest truncate">{loc.name}</div>
                    {loc.region && <div className="text-[10px] text-[#8b7355] uppercase tracking-widest truncate mt-1">{loc.region}</div>}
                  </div>
                </div>
              ))}
            </div>
            {locations.length === 0 && (
              <div className="text-center opacity-50 py-20 flex flex-col items-center">
                <MapPin size={48} className="mb-4 text-[#c1a063]" />
                <p>No hay lugares guardados.</p>
              </div>
            )}
          </div>
        </div>
      )}`;

content = content.replace(mainHeaderRegex, ''); // Remove the top common header
content = content.replace(galleryRegex, newGalleryView);

// Add Location Modals at the end
const modals = `
      <AddLocationModal 
        isOpen={isAddLocationOpen || !!editLocationData} 
        onClose={() => { setIsAddLocationOpen(false); setEditLocationData(null); }} 
        initialData={editLocationData} 
      />
      <ViewLocationModal
        locationId={selectedLocationId}
        onClose={() => setSelectedLocationId(null)}
        onEdit={(loc) => { setSelectedLocationId(null); setEditLocationData(loc); }}
        onDelete={(id) => setDeleteLocationId(id)}
      />
      <ConfirmDeleteModal 
        isOpen={!!deleteLocationId} 
        onClose={() => setDeleteLocationId(null)} 
        onConfirm={() => { if (deleteLocationId) { actions.deleteLocation(deleteLocationId); setSelectedLocationId(null); } }}
        title="Eliminar Lugar"
        message="¿Estás seguro de que quieres eliminar este lugar de forma permanente?"
      />`;

content = content.replace(/<\/div>\s*<AddMapModal/, modals + '\n      <AddMapModal');

const newComponents = `

function AddLocationModal({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData: LocationData | null }) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRegion(initialData.region || "");
      setDescription(initialData.description);
    } else {
      setName("");
      setRegion("");
      setDescription("");
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
        base64 = await compressImage(file, 1024);
      }

      const locData = { name, region, description, image: base64 };
      if (initialData) {
        actions.updateLocation(initialData.id, locData);
      } else {
        actions.addLocation(locData);
      }
      
      onClose();
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      alert("Error al guardar el lugar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Lugar" : "Añadir Lugar"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nombre *" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Pertenencia (Región/Ciudad)" value={region} onChange={(e) => setRegion(e.target.value)} />
        <Textarea label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[10px] font-bold text-[#c1a063] uppercase tracking-widest">Imagen (Opcional)</label>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileRef}
            className="flex h-10 w-full bg-[#1e1a17] border border-[#3a302a] px-3 py-2 text-sm text-[#f5f2ed] file:border-0 file:bg-transparent file:text-[10px] file:uppercase file:tracking-widest file:font-bold file:text-[#c1a063] file:mr-4 file:cursor-pointer"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#3a302a]">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
        </div>
      </form>
    </Modal>
  );
}

function ViewLocationModal({ locationId, onClose, onEdit, onDelete }: { locationId: string | null, onClose: () => void, onEdit: (loc: LocationData) => void, onDelete: (id: string) => void }) {
  const { locations } = useStore();
  const loc = locations.find(l => l.id === locationId);

  if (!loc) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#1e1a17] border border-[#3a302a] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-black custom-scrollbar relative flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {loc.image && (
          <div className="w-full md:w-1/2 min-h-[250px] md:min-h-[400px] bg-cover bg-center border-b md:border-b-0 md:border-r border-[#3a302a]" style={{ backgroundImage: \`url(\${loc.image})\` }} />
        )}
        <div className={\`p-6 flex flex-col \${loc.image ? 'w-full md:w-1/2' : 'w-full'}\`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl text-[#c1a063] uppercase tracking-widest font-light">{loc.name}</h2>
              {loc.region && <p className="text-xs text-[#8b7355] uppercase tracking-widest mt-1">{loc.region}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => onEdit(loc)} className="text-[#3a302a] hover:text-[#c1a063] transition-colors p-1" title="Editar">
                <Edit2 size={16} />
              </button>
              <button onClick={() => onDelete(loc.id)} className="text-[#3a302a] hover:text-[#8a211b] transition-colors p-1" title="Eliminar">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar mt-4">
            {loc.description ? (
              <p className="text-sm text-[#e6e2da] whitespace-pre-wrap font-serif leading-relaxed opacity-90">{loc.description}</p>
            ) : (
              <p className="text-sm text-[#e6e2da] opacity-50 italic">Sin descripción.</p>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-[#3a302a] flex justify-end">
            <Button variant="ghost" onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

content = content + newComponents;

fs.writeFileSync('src/views/ViewMaps.tsx', content);
console.log("Patched successfully");
