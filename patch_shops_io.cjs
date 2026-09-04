const fs = require('fs');
let code = fs.readFileSync('src/views/ViewShops.tsx', 'utf8');

const targetImports = 'import { Plus, Trash2, Edit2, Store as StoreIcon, EyeOff, Eye, Image as ImageIcon } from "lucide-react";';
const newImports = 'import { Plus, Trash2, Edit2, Store as StoreIcon, EyeOff, Eye, Image as ImageIcon, Upload, Download } from "lucide-react";';

if (code.includes(targetImports)) {
  code = code.replace(targetImports, newImports);
} else if (code.includes('import { Plus, Trash2, Edit2, Store as StoreIcon, EyeOff, Eye, Image as ImageIcon')) {
  // alternative replace
}

const targetReturn = '  return (\n    <div className="flex-1 flex flex-col bg-transparent border-none rounded-none overflow-hidden relative">';
const newFunctions = `  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportShops = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(shops));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "dm_screen_shops.json");
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
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          store.setState({ shops: parsed });
        } else if (parsed && parsed.shops && Array.isArray(parsed.shops)) {
          store.setState({ shops: parsed.shops });
        } else {
          alert("El archivo no parece contener tiendas válidas.");
        }
      } catch (err) {
        alert("Archivo de tiendas inválido.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

`;

code = code.replace(targetReturn, newFunctions + targetReturn);

const targetButtons = `        {!selectedShop && (
          <Button onClick={() => { setEditShopData(null); setIsAddOpen(true); }} className="whitespace-nowrap shrink-0">
            <Plus size={14} className="mr-1" /> Nueva Tienda
          </Button>
        )}`;

const newButtons = `        {!selectedShop && (
          <div className="flex gap-2">
            <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
            <Button variant="ghost" onClick={() => fileInputRef.current?.click()} className="hidden sm:flex border border-[#3a302a]" title="Importar Tiendas">
              <Upload size={14} className="mr-1" /> Importar
            </Button>
            <Button variant="ghost" onClick={exportShops} className="hidden sm:flex border border-[#3a302a]" title="Exportar Tiendas">
              <Download size={14} className="mr-1" /> Exportar
            </Button>
            <Button onClick={() => { setEditShopData(null); setIsAddOpen(true); }} className="whitespace-nowrap shrink-0 bg-[#1a1614] border border-[#3a302a] text-[#8b7355] hover:border-[#c1a063] hover:text-[#c1a063]">
              <Plus size={14} className="mr-1" /> Nueva Tienda
            </Button>
          </div>
        )}`;

code = code.replace(targetButtons, newButtons);
fs.writeFileSync('src/views/ViewShops.tsx', code);
console.log('patched ViewShops');
