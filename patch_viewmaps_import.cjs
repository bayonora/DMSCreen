const fs = require('fs');
let c = fs.readFileSync('src/views/ViewMaps.tsx', 'utf8');

const handlers = `
  const importMapsRef = useRef<HTMLInputElement>(null);
  const importLocsRef = useRef<HTMLInputElement>(null);

  const exportMaps = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(maps));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mapas_dnd.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const exportLocations = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(locations));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "lugares_dnd.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportMaps = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          actions.importMaps(parsed);
        } else {
          alert("Formato de mapas incorrecto.");
        }
      } catch (err) {
        alert("Error leyendo el archivo.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleImportLocations = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          actions.importLocations(parsed);
        } else {
          alert("Formato de lugares incorrecto.");
        }
      } catch (err) {
        alert("Error leyendo el archivo.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };
`;

c = c.replace(
  'const selectedMap = maps.find((m) => m.id === selectedMapId);',
  handlers + '\n  const selectedMap = maps.find((m) => m.id === selectedMapId);'
);

const mapsHeader = `<Button onClick={() => setIsAddOpen(true)} size="sm" className="whitespace-nowrap">
                <Plus size={14} className="mr-1" /> Añadir
              </Button>`;
const mapsHeaderNew = `<div className="flex gap-2">
                <input type="file" accept=".json" ref={importMapsRef} style={{display: 'none'}} onChange={handleImportMaps} />
                <Button variant="ghost" size="sm" onClick={() => exportMaps()} title="Exportar Mapas" className="px-2">
                  <Download size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => importMapsRef.current?.click()} title="Importar Mapas" className="px-2">
                  <Upload size={16} />
                </Button>
                <Button onClick={() => setIsAddOpen(true)} size="sm" className="whitespace-nowrap">
                  <Plus size={14} className="mr-1" /> Añadir
                </Button>
              </div>`;

c = c.replace(mapsHeader, mapsHeaderNew);

const locsHeader = `<Button onClick={() => setIsAddLocationOpen(true)} size="sm" className="whitespace-nowrap">
                <Plus size={14} className="mr-1" /> Añadir
              </Button>`;
const locsHeaderNew = `<div className="flex gap-2">
                <input type="file" accept=".json" ref={importLocsRef} style={{display: 'none'}} onChange={handleImportLocations} />
                <Button variant="ghost" size="sm" onClick={() => exportLocations()} title="Exportar Lugares" className="px-2">
                  <Download size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => importLocsRef.current?.click()} title="Importar Lugares" className="px-2">
                  <Upload size={16} />
                </Button>
                <Button onClick={() => setIsAddLocationOpen(true)} size="sm" className="whitespace-nowrap">
                  <Plus size={14} className="mr-1" /> Añadir
                </Button>
              </div>`;

c = c.replace(locsHeader, locsHeaderNew);

fs.writeFileSync('src/views/ViewMaps.tsx', c);
console.log("Patched ViewMaps.tsx");
