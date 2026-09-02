import React, { useState, useRef } from "react";
import { useStore, actions } from "../store/useStore";
import { Modal } from "../components/ui/Modal";
import { Button, Input } from "../components/ui/Input";
import { compressImage } from "../lib/utils";
import { Plus, Trash2, Maximize2, Image as ImageIcon } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";

export function ViewMaps() {
  const { maps } = useStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const selectedMap = maps.find((m) => m.id === selectedMapId);

  return (
    <div className="flex-1 flex flex-col bg-transparent border-none rounded-none overflow-hidden">
      <div className="bg-[#1e1a17] px-6 py-4 border-b border-[#3a302a] flex justify-between items-center">
        <h2 className="text-lg uppercase tracking-widest text-[#c1a063] font-light flex items-center gap-2">
          <ImageIcon className="text-[#c1a063]" size={20} /> Galería de Mapas
        </h2>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus size={14} className="mr-1" /> Añadir Mapa
        </Button>
      </div>

      {selectedMap ? (
        <div className="flex-1 relative bg-[#0f0d0c] overflow-hidden flex flex-col">
          <div className="absolute top-4 left-4 z-10 bg-[#1e1a17]/90 backdrop-blur-sm p-3 border border-[#3a302a] flex items-center gap-4 shadow-lg shadow-black">
             <span className="font-bold text-[#c1a063] uppercase tracking-widest text-sm">{selectedMap.name}</span>
             <Button variant="secondary" onClick={() => setSelectedMapId(null)}>Volver a la galería</Button>
          </div>
          
          <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing">
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={3}
              limitToBounds={true}
              centerOnInit={true}
              wheel={{ step: 0.05 }}
            >
              <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                <img src={selectedMap.image} alt={selectedMap.name} className="pointer-events-none" />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {maps.map((m) => (
              <div key={m.id} className="bg-[#1e1a17] border border-[#3a302a] flex flex-col h-48 group shadow-lg shadow-black/50 relative">
                <div 
                  className="flex-1 w-full h-full bg-cover bg-center cursor-pointer relative"
                  style={{ backgroundImage: `url(${m.image})` }}
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
              <p className="font-serif">No hay mapas guardados.</p>
            </div>
          )}
        </div>
      )}

      <AddMapModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <ConfirmDeleteModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={() => { if (deleteId) actions.deleteMap(deleteId); }}
        title="Eliminar Mapa"
        message="¿Estás seguro de que quieres eliminar este mapa de forma permanente?"
      />
    </div>
  );
}

function AddMapModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !name) return;
    
    setLoading(true);
    try {
      const base64 = await compressImage(file, 2048); // max 2048px width
      actions.addMap({ name, image: base64 });
      onClose();
      setName("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      alert("Error al procesar la imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir Mapa">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nombre del Mapa" value={name} onChange={(e) => setName(e.target.value)} required />
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[10px] font-bold text-[#c1a063] uppercase tracking-widest">Archivo de Imagen</label>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileRef}
            required
            className="flex h-10 w-full bg-[#1e1a17] border border-[#3a302a] px-3 py-2 text-sm text-[#f5f2ed] file:border-0 file:bg-transparent file:text-[10px] file:uppercase file:tracking-widest file:font-bold file:text-[#c1a063] file:mr-4 file:cursor-pointer"
          />
        </div>
        <p className="text-[10px] uppercase text-[#e6e2da] opacity-50">
          Nota: Las imágenes se comprimirán automáticamente para la caché.
        </p>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#3a302a]">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="submit" disabled={loading}>{loading ? "Procesando..." : "Añadir"}</Button>
        </div>
      </form>
    </Modal>
  );
}
