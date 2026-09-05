import React from "react";
import { useState, useRef } from "react";
import { useStore, actions, store } from "../store/useStore";
import { Plus, X, Download, Upload, Image as ImageIcon, Hexagon, ChevronDown, ChevronUp } from "lucide-react";
import { CustomItem, LootTable } from "../types";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { ImportModal } from "../components/ImportModal";
import { cn, compressImage } from "../lib/utils";

export function ViewItems() {
  const { customItems, lootTables } = useStore();
  const [pendingImport, setPendingImport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"items" | "loot">("items");
  const [editingItem, setEditingItem] = useState<CustomItem | null>(null);
  const [editingTable, setEditingTable] = useState<{ id: string; name: string; rawText: string } | null>(null);
  const [deleteData, setDeleteData] = useState<{ type: "item" | "table"; id: string } | null>(null);

  const [rollingTable, setRollingTable] = useState<LootTable | null>(null);
  const [rollingState, setRollingState] = useState<'idle' | 'rolling' | 'result'>('idle');
  const [currentRollNumber, setCurrentRollNumber] = useState<number>(1);
  const [finalItem, setFinalItem] = useState<{ index: number, text: string } | null>(null);
  const [collapsedTables, setCollapsedTables] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string) => setCollapsedTables(prev => ({...prev, [id]: !prev[id]}));

  const startLootRoll = (table: LootTable) => {
    if (!table.items || table.items.length === 0) return;
    setRollingTable(table);
    setRollingState('rolling');
    setFinalItem(null);
    
    let ticks = 0;
    const maxTicks = 15;
    const interval = setInterval(() => {
      setCurrentRollNumber(Math.floor(Math.random() * table.items.length) + 1);
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * table.items.length);
        setCurrentRollNumber(finalIndex + 1);
        setFinalItem({ index: finalIndex + 1, text: table.items[finalIndex] });
        setRollingState('result');
      }
    }, 100);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name) return;
    if (editingItem.id) actions.updateCustomItem(editingItem.id, editingItem);
    else actions.addCustomItem(editingItem);
    setEditingItem(null);
  };

  const handleSaveTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable || !editingTable.name) return;
    
    // Parse text into lines (unlimited)
    const lines = editingTable.rawText
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0);
      
    const tableData: Omit<LootTable, "id"> | LootTable = {
      ...(editingTable.id ? { id: editingTable.id } : {}),
      name: editingTable.name,
      items: lines
    };

    if (editingTable.id) actions.updateLootTable(editingTable.id, tableData);
    else actions.addLootTable(tableData);
    setEditingTable(null);
  };

  const handleExport = () => {
    const data = activeTab === "items" ? (customItems || []) : (lootTables || []);
    const fileName = activeTab === "items" ? "ndms_objetos.json" : "ndms_tablas.json";
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          if (activeTab === "items") setPendingImport(imported);
          else setPendingImport(imported);
        } else if (imported && ((activeTab === "items" && imported.customItems) || (activeTab === "loot" && imported.lootTables))) {
          if (activeTab === "items") setPendingImport(imported.customItems);
          else setPendingImport(imported.lootTables);
        } else {
           alert("El archivo no parece contener datos válidos para esta sección.");
        }
      } catch (err) {
        alert("Archivo inválido.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmImport = (mode: "merge" | "overwrite") => {
    if (!pendingImport) return;
    if (activeTab === "items") {
      if (mode === "overwrite") {
        store.setState({ customItems: pendingImport });
      } else {
        store.setState({ customItems: [...(store.getState().customItems || []), ...pendingImport] });
      }
    } else {
      if (mode === "overwrite") {
        store.setState({ lootTables: pendingImport });
      } else {
        store.setState({ lootTables: [...(store.getState().lootTables || []), ...pendingImport] });
      }
    }
    setPendingImport(null);
  };


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;
    try {
      const base64 = await compressImage(file, 800);
      setEditingItem({ ...editingItem, image: base64 });
    } catch (err) {
      console.error("Error compressing image", err);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("items")}
            className={cn("text-xl tracking-widest uppercase font-light transition-colors pb-1 border-b-2", activeTab === "items" ? "text-[#c1a063] border-[#c1a063]" : "text-[#8b7355] border-transparent hover:text-white")}
          >
            Objetos Únicos
          </button>
          <button
            onClick={() => setActiveTab("loot")}
            className={cn("text-xl tracking-widest uppercase font-light transition-colors pb-1 border-b-2", activeTab === "loot" ? "text-[#c1a063] border-[#c1a063]" : "text-[#8b7355] border-transparent hover:text-white")}
          >
            Tablas de Botín
          </button>
        </div>
        
        <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          <button onClick={() => fileInputRef.current?.click()} className="p-2 border border-[#3a302a] text-[#8b7355] hover:border-[#c1a063] hover:text-[#c1a063] transition-colors shrink-0" title="Importar">
            <Download size={18} />
          </button>
          <button onClick={handleExport} className="p-2 border border-[#3a302a] text-[#8b7355] hover:border-[#c1a063] hover:text-[#c1a063] transition-colors shrink-0" title="Exportar">
            <Upload size={18} />
          </button>
          <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
          
          <button
            onClick={() => {
              if (activeTab === "items") setEditingItem({ id: "", name: "", description: "", value: "", image: "" });
              else setEditingTable({ id: "", name: "", rawText: "" });
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-[#c1a063] text-black hover:bg-white transition-colors uppercase tracking-wider text-sm font-semibold whitespace-nowrap shrink-0"
          >
            <Plus size={16} />
            <span>{activeTab === "items" ? "Nuevo Objeto" : "Nueva Tabla"}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "items" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(customItems || []).map((item) => (
              <div key={item.id} className="bg-[#161311] border border-[#3a302a] flex flex-col shadow-lg hover:border-[#c1a063] transition-colors group relative cursor-pointer" onClick={() => setEditingItem(item)}>
                {item.image ? (
                  <div className="h-40 w-full overflow-hidden border-b border-[#3a302a]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="h-2 bg-[#c1a063]" />
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg text-white font-bold pr-6">{item.name}</h3>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteData({ type: "item", id: item.id }); }}
                      className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">{item.description}</p>
                  {item.value && <div className="text-[#c1a063] font-mono text-sm self-end">{item.value}</div>}
                </div>
              </div>
            ))}
            {(!customItems || customItems.length === 0) && (
              <div className="col-span-full flex flex-col items-center justify-center h-64 text-[#8b7355] border-2 border-dashed border-[#3a302a]">
                <p>No hay objetos únicos guardados.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {(lootTables || []).map((table) => {
              const isCollapsed = collapsedTables[table.id] || false;
              return (
              <div key={table.id} className="bg-[#161311] border border-[#3a302a] p-4 flex flex-col shadow-lg">
                <div className={cn("flex justify-between items-center border-[#3a302a]", !isCollapsed ? "mb-4 border-b pb-2" : "")}>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleCollapse(table.id)} className="text-[#8b7355] hover:text-white transition-colors">
                      {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </button>
                    <h3 className="text-lg text-[#c1a063] font-bold">{table.name} <span className="text-sm font-normal text-[#8b7355]">({table.items.length})</span></h3>
                  </div>
                  <div className="flex space-x-3 items-center">
                    <button onClick={() => startLootRoll(table)} className="text-sm text-[#c1a063] hover:text-[#dfba76] uppercase tracking-wider flex items-center gap-1 font-bold" title={`Tirar d${table.items.length}`}>
                      <Hexagon size={16} /> Tirar
                    </button>
                    <div className="w-px h-4 bg-[#3a302a]"></div>
                    <button onClick={() => setEditingTable({ id: table.id, name: table.name, rawText: table.items.join("\n") })} className="text-sm text-[#8b7355] hover:text-white uppercase tracking-wider">Editar</button>
                    <button onClick={() => setDeleteData({ type: "table", id: table.id })} className="text-sm text-red-500 hover:text-red-400 uppercase tracking-wider">Borrar</button>
                  </div>
                </div>
                {!isCollapsed && (
                <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  <table className="w-full text-sm text-left">
                    <tbody>
                      {table.items.map((itemStr, idx) => (
                        <tr key={idx} className="border-b border-[#3a302a]/30 hover:bg-white/5">
                          <td className="py-2 text-[#8b7355] w-8 font-mono">{idx + 1}.</td>
                          <td className="py-2 text-gray-300">{itemStr}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
            )})}
            {(!lootTables || lootTables.length === 0) && (
              <div className="col-span-full flex flex-col items-center justify-center h-64 text-[#8b7355] border-2 border-dashed border-[#3a302a]">
                <p>No hay tablas de botín configuradas.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Editor Modal for Single Items */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-all">
          <form onSubmit={handleSaveItem} className="bg-[#161311] border border-[#3a302a] rounded-lg p-6 max-w-lg w-full relative shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col max-h-[90vh]">
            <button type="button" onClick={() => setEditingItem(null)} className="absolute top-4 right-4 text-[#8b7355] hover:text-white"><X size={20} /></button>
            <h2 className="text-xl text-[#c1a063] tracking-widest uppercase mb-6 font-light border-b border-[#3a302a] pb-2">
              {editingItem.id ? "Editar Objeto" : "Nuevo Objeto"}
            </h2>

            <div className="overflow-y-auto pr-2 custom-scrollbar">
              <label className="block text-xs uppercase tracking-widest text-[#8b7355] mb-1">Nombre (Obligatorio)</label>
              <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full bg-black/50 border border-[#3a302a] p-2 text-white mb-4 focus:border-[#c1a063] outline-none" required />

              <label className="block text-xs uppercase tracking-widest text-[#8b7355] mb-1">Valor (Ej. 500 po)</label>
              <input type="text" value={editingItem.value || ""} onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })} className="w-full bg-black/50 border border-[#3a302a] p-2 text-white mb-4 focus:border-[#c1a063] outline-none" />
              
              <label className="block text-xs uppercase tracking-widest text-[#8b7355] mb-1">Descripción</label>
              <textarea value={editingItem.description || ""} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} className="w-full bg-black/50 border border-[#3a302a] p-2 text-white mb-4 focus:border-[#c1a063] outline-none h-32 resize-none" />

              <label className="block text-xs uppercase tracking-widest text-[#8b7355] mb-1">Imagen (Opcional)</label>
              <div className="flex items-center space-x-4 mb-6">
                {editingItem.image ? (
                  <div className="w-16 h-16 border border-[#3a302a] relative overflow-hidden">
                    <img src={editingItem.image} alt="preview" className="object-cover w-full h-full" />
                    <button type="button" onClick={() => setEditingItem({...editingItem, image: undefined})} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100"><X size={16} className="text-red-500"/></button>
                  </div>
                ) : (
                  <label className="w-16 h-16 border border-[#3a302a] flex items-center justify-center text-[#8b7355] cursor-pointer hover:border-[#c1a063] hover:text-[#c1a063] transition-colors">
                    <ImageIcon size={20} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
                <span className="text-xs text-gray-500 flex-1">Sube una imagen representativa. Se guardará internamente (¡Cuidado con el peso!).</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#3a302a]">
              <button type="submit" className="px-6 py-2 bg-[#c1a063] text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">Guardar</button>
            </div>
          </form>
        </div>
      )}

      {/* Editor Modal for Loot Tables */}
      {editingTable && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-all">
          <form onSubmit={handleSaveTable} className="bg-[#161311] border border-[#3a302a] rounded-lg p-6 max-w-2xl w-full relative shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col h-[80vh]">
            <button type="button" onClick={() => setEditingTable(null)} className="absolute top-4 right-4 text-[#8b7355] hover:text-white"><X size={20} /></button>
            <h2 className="text-xl text-[#c1a063] tracking-widest uppercase mb-2 font-light">
              {editingTable.id ? "Editar Tabla de Botín" : "Nueva Tabla de Botín"}
            </h2>
            <p className="text-xs text-gray-400 mb-6 border-b border-[#3a302a] pb-2">Cada línea de texto será un posible resultado (Sin límite de líneas).</p>

            <label className="block text-xs uppercase tracking-widest text-[#8b7355] mb-1">Nombre de la Categoría/Tabla</label>
            <input type="text" placeholder="Ej. Tesoro de Dragón Adulto (CR 11-16)" value={editingTable.name} onChange={(e) => setEditingTable({ ...editingTable, name: e.target.value })} className="w-full bg-black/50 border border-[#3a302a] p-2 text-white mb-4 focus:border-[#c1a063] outline-none" required />

            <label className="block text-xs uppercase tracking-widest text-[#8b7355] mb-1 flex justify-between">
              <span>Objetos (1 por línea)</span>
              <span className="text-gray-500">{editingTable.rawText.split('\n').filter(l=>l.trim()).length} entradas</span>
            </label>
            <textarea 
              value={editingTable.rawText} 
              onChange={(e) => setEditingTable({ ...editingTable, rawText: e.target.value })} 
              className="w-full flex-1 bg-black/50 border border-[#3a302a] p-2 text-white mb-6 focus:border-[#c1a063] outline-none font-mono text-sm resize-none whitespace-pre" 
              placeholder={`1000 po\nPoción de Curación Mayor\nEspada Larga +1`}
              required 
            />

            <div className="flex justify-end pt-4 border-t border-[#3a302a]">
              <button type="submit" className="px-6 py-2 bg-[#c1a063] text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">Guardar Tabla</button>
            </div>
          </form>
        </div>
      )}

      
      {/* Loot Roll Modal */}
      {rollingTable && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm transition-all" onClick={() => setRollingTable(null)}>
          <div className="bg-[#161311] border border-[#3a302a] p-8 max-w-md w-full relative shadow-2xl shadow-black flex flex-col items-center text-center" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setRollingTable(null)} className="absolute top-4 right-4 text-[#8b7355] hover:text-white"><X size={20} /></button>
            <h2 className="text-xl text-[#c1a063] tracking-widest uppercase mb-8 font-light">Botín: {rollingTable.name}</h2>
            
            <div className="relative flex items-center justify-center mb-8">
               <Hexagon size={120} className={`text-[#c1a063] ${rollingState === 'rolling' ? 'animate-[spin_0.5s_linear_infinite]' : ''}`} strokeWidth={1} />
               <span className="absolute text-4xl font-bold text-white font-serif">{currentRollNumber}</span>
            </div>

            {rollingState === 'result' && finalItem && (
               <div className="animate-in zoom-in duration-300 flex flex-col items-center w-full">
                 <p className="text-[#8b7355] uppercase tracking-widest text-xs mb-2">Resultado: {finalItem.index} de {rollingTable.items.length}</p>
                 <div className="p-4 border border-[#c1a063] bg-[#c1a063]/10 rounded w-full">
                   <p className="text-lg text-[#e6e2da] font-serif font-bold">{finalItem.text}</p>
                 </div>
               </div>
            )}
            
            {rollingState === 'rolling' && (
               <p className="text-[#8b7355] italic animate-pulse">Lanzando d{rollingTable.items.length} virtual...</p>
            )}
            
            {rollingState === 'result' && (
               <button onClick={() => startLootRoll(rollingTable)} className="mt-8 px-6 py-2 bg-[#1a1614] border border-[#3a302a] text-[#8b7355] hover:border-[#c1a063] hover:text-[#c1a063] transition-colors uppercase tracking-widest text-sm font-bold flex items-center gap-2">
                 <Hexagon size={16} /> Volver a Tirar
               </button>
            )}
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteData}
        onClose={() => setDeleteData(null)}
        onConfirm={() => {
          if (!deleteData) return;
          if (deleteData.type === "item") actions.deleteCustomItem(deleteData.id);
          else actions.deleteLootTable(deleteData.id);
        }}
        title={`Eliminar ${deleteData?.type === "item" ? "Objeto" : "Tabla"}`}
        message="¿Estás seguro de que quieres eliminar esto? Esta acción no se puede deshacer."
      />
      <ImportModal
        isOpen={!!pendingImport}
        onClose={() => setPendingImport(null)}
        onMerge={() => confirmImport("merge")}
        onOverwrite={() => confirmImport("overwrite")}
      />
    </div>
  );
}
