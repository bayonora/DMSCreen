import React, { useState, useRef } from "react";
import { useStore, actions } from "../store/useStore";
import { Modal } from "../components/ui/Modal";
import { Button, Input, Textarea } from "../components/ui/Input";
import { Shop, ShopItem } from "../types";
import { Plus, Trash2, Edit2, Store as StoreIcon, EyeOff, Eye, Image as ImageIcon } from "lucide-react";
import { compressImage, cn } from "../lib/utils";

export function ViewShops() {
  const { shops } = useStore();
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editShopData, setEditShopData] = useState<Shop | null>(null);

  const selectedShop = shops.find((s) => s.id === selectedShopId);

  const handleEditShop = (s: Shop, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditShopData(s);
    setIsAddOpen(true);
  };

  const handleDeleteShop = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Borrar esta tienda?")) {
      actions.deleteShop(id);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#161311] border border-[#3a302a] rounded-lg overflow-hidden relative">
      <div className="bg-[#1e1a17] px-6 py-4 border-b border-[#3a302a] flex justify-between items-center z-10 relative">
        <h2 className="text-lg uppercase tracking-widest text-[#c1a063] font-light flex items-center gap-2">
          <StoreIcon className="text-[#c1a063]" size={20} /> Tiendas
        </h2>
        {!selectedShop && (
          <Button onClick={() => { setEditShopData(null); setIsAddOpen(true); }}>
            <Plus size={14} className="mr-1" /> Nueva Tienda
          </Button>
        )}
        {selectedShop && (
          <Button variant="secondary" onClick={() => setSelectedShopId(null)}>
            Volver a Tiendas
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar z-10 relative">
        {!selectedShop ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((s) => (
              <div 
                key={s.id} 
                className="bg-[#1e1a17] border border-[#3a302a] overflow-hidden cursor-pointer hover:border-[#c1a063] transition-colors flex items-center p-4 gap-4 shadow-lg shadow-black/50"
                onClick={() => setSelectedShopId(s.id)}
              >
                {s.ownerImage ? (
                  <img src={s.ownerImage} alt={s.ownerName} className="w-16 h-16 object-cover border-2 border-[#3a302a]" />
                ) : (
                  <div className="w-16 h-16 bg-[#0f0d0c] border-2 border-[#3a302a] flex items-center justify-center">
                    <StoreIcon className="text-[#c1a063] opacity-50" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-[#c1a063] truncate font-serif">{s.name}</h3>
                  <p className="text-xs uppercase tracking-widest text-[#e6e2da] opacity-70 truncate">{s.ownerName}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={(e) => handleEditShop(s, e)} className="text-[#3a302a] hover:text-[#c1a063] p-1"><Edit2 size={16}/></button>
                  <button onClick={(e) => handleDeleteShop(s.id, e)} className="text-[#3a302a] hover:text-[#8a211b] p-1"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
            {shops.length === 0 && (
              <p className="text-[#e6e2da] opacity-50 text-center py-10 col-span-full font-serif">No hay tiendas. Crea una para añadir objetos.</p>
            )}
          </div>
        ) : (
          <ShopInventory shop={selectedShop} />
        )}
      </div>

      {selectedShop && selectedShop.ownerImage && (
        <div className="absolute bottom-0 right-0 max-h-[80vh] max-w-[40vw] pointer-events-none z-0 opacity-80 mix-blend-screen mask-image-bottom">
          <img src={selectedShop.ownerImage} alt={selectedShop.ownerName} className="object-contain object-bottom w-full h-full max-h-[600px] drop-shadow-2xl" />
        </div>
      )}

      <AddShopModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} editData={editShopData} />
    </div>
  );
}

function ShopInventory({ shop }: { shop: Shop }) {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editItemData, setEditItemData] = useState<ShopItem | null>(null);
  const [viewItem, setViewItem] = useState<ShopItem | null>(null);

  const handleEdit = (item: ShopItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditItemData(item);
    setIsAddItemOpen(true);
  };

  const handleToggleHide = (item: ShopItem, e: React.MouseEvent) => {
    e.stopPropagation();
    actions.updateShopItem(shop.id, item.id, { hidden: !item.hidden });
  };

  const handleDelete = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Borrar este objeto?")) {
      actions.deleteShopItem(shop.id, itemId);
    }
  };

  return (
    <div className="max-w-3xl flex flex-col gap-6 relative z-10">
      <div className="flex justify-between items-center bg-[#1e1a17]/90 p-6 border border-[#3a302a] backdrop-blur-md shadow-lg shadow-black/50">
        <div>
          <h2 className="text-2xl font-serif text-[#c1a063] uppercase tracking-widest">{shop.name}</h2>
          <p className="text-xs uppercase tracking-widest text-[#e6e2da] opacity-70 mt-1">Mercader: {shop.ownerName}</p>
        </div>
        <Button onClick={() => { setEditItemData(null); setIsAddItemOpen(true); }}>
          <Plus size={14} className="mr-1" /> Añadir Objeto
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {shop.items.map((item) => (
          <div 
            key={item.id} 
            className={cn(
              "flex items-center justify-between p-4 border transition-all shadow-md shadow-black/30",
              item.hidden 
                ? "bg-[#000000] border-[#161311]" 
                : "bg-[#1e1a17]/90 border-[#3a302a] hover:border-[#c1a063] cursor-pointer backdrop-blur-sm"
            )}
            onClick={() => !item.hidden && setViewItem(item)}
          >
            {item.hidden ? (
              <div className="flex items-center gap-4 opacity-30">
                <div className="w-12 h-12 bg-black border border-[#161311] flex items-center justify-center">
                  <EyeOff size={20} className="text-[#3a302a]" />
                </div>
                <div>
                  <div className="font-bold text-[#e6e2da] flex items-center gap-2 font-serif text-lg">
                    Objeto Oculto
                  </div>
                  <div className="text-sm font-mono text-[#c1a063]">??? gp</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover border border-[#3a302a]" />
                ) : (
                  <div className="w-12 h-12 bg-[#0f0d0c] border border-[#3a302a] flex items-center justify-center">
                    <ImageIcon size={20} className="text-[#3a302a]" />
                  </div>
                )}
                <div>
                  <div className="font-bold text-[#e6e2da] flex items-center gap-2 font-serif text-lg">
                    {item.name}
                  </div>
                  <div className="text-sm font-mono text-[#c1a063]">{item.price}</div>
                </div>
              </div>
            )}
            
            <div className="flex gap-2 relative z-10" onClick={e => e.stopPropagation()}>
              <button onClick={(e) => handleToggleHide(item, e)} className="p-2 text-[#3a302a] hover:text-[#c1a063] transition-colors" title={item.hidden ? "Mostrar" : "Ocultar"}>
                {item.hidden ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              {!item.hidden && (
                <>
                  <button onClick={(e) => handleEdit(item, e)} className="p-2 text-[#3a302a] hover:text-[#c1a063] transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={(e) => handleDelete(item.id, e)} className="p-2 text-[#3a302a] hover:text-[#8a211b] transition-colors">
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {shop.items.length === 0 && (
          <p className="text-center text-[#e6e2da] opacity-50 py-10 bg-[#1e1a17]/50 border border-[#3a302a] backdrop-blur-sm font-serif">El inventario está vacío.</p>
        )}
      </div>

      <AddItemModal 
        isOpen={isAddItemOpen} 
        onClose={() => setIsAddItemOpen(false)} 
        shopId={shop.id} 
        editData={editItemData} 
      />

      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title="Detalles del Objeto">
        {viewItem && (
          <div className="flex flex-col md:flex-row gap-6">
            {viewItem.image && (
              <div className="md:w-1/3 flex-shrink-0">
                <img src={viewItem.image} alt={viewItem.name} className="w-full border border-[#3a302a] shadow-lg shadow-black object-contain" />
              </div>
            )}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-3xl font-serif text-[#c1a063]">{viewItem.name}</h3>
                <div className="text-xl font-mono text-[#c1a063] opacity-80 mt-1">{viewItem.price}</div>
              </div>
              <div className="w-full h-px bg-[#3a302a]" />
              <div className="text-[#e6e2da] opacity-90 whitespace-pre-wrap leading-relaxed font-serif">
                {viewItem.description}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function AddShopModal({ isOpen, onClose, editData }: { isOpen: boolean, onClose: () => void, editData: Shop | null }) {
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const ownerName = formData.get("ownerName") as string;
    
    setLoading(true);
    try {
      let image = editData?.ownerImage || "";
      const file = fileRef.current?.files?.[0];
      if (file) {
        image = await compressImage(file, 800);
      }

      if (editData) {
        actions.updateShop(editData.id, { name, ownerName, ownerImage: image });
      } else {
        actions.addShop({ name, ownerName, ownerImage: image });
      }
      onClose();
    } catch (e) {
      alert("Error al procesar la imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? "Editar Tienda" : "Nueva Tienda"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nombre de la Tienda" name="name" required defaultValue={editData?.name} />
        <Input label="Nombre del Mercader" name="ownerName" required defaultValue={editData?.ownerName} />
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[10px] font-bold text-[#c1a063] uppercase tracking-widest">Imagen del Mercader (Opcional)</label>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileRef}
            className="flex h-10 w-full bg-[#1e1a17] border border-[#3a302a] px-3 py-1 text-sm text-[#f5f2ed] file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-[#c1a063] cursor-pointer"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="submit" disabled={loading}>{loading ? "Procesando..." : "Guardar"}</Button>
        </div>
      </form>
    </Modal>
  );
}

function AddItemModal({ isOpen, onClose, shopId, editData }: { isOpen: boolean, onClose: () => void, shopId: string, editData: ShopItem | null }) {
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    
    setLoading(true);
    try {
      let image = editData?.image || "";
      const file = fileRef.current?.files?.[0];
      if (file) {
        image = await compressImage(file, 600);
      }

      if (editData) {
        actions.updateShopItem(shopId, editData.id, { name, description, price, image });
      } else {
        actions.addShopItem(shopId, { name, description, price, image, hidden: false });
      }
      onClose();
    } catch (e) {
      alert("Error al procesar la imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? "Editar Objeto" : "Nuevo Objeto"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nombre del Objeto" name="name" required defaultValue={editData?.name} />
        <Input label="Precio" name="price" required defaultValue={editData?.price} placeholder="Ej: 50 gp" />
        <Textarea label="Descripción" name="description" required defaultValue={editData?.description} />
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Imagen (Opcional)</label>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileRef}
            className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-orange-500"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="submit" disabled={loading}>{loading ? "Procesando..." : "Guardar"}</Button>
        </div>
      </form>
    </Modal>
  );
}
