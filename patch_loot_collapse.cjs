const fs = require('fs');
const filePath = 'src/views/ViewItems.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Add ChevronDown, ChevronUp to imports
const targetImport = 'import { Plus, X, Download, Upload, Image as ImageIcon, Hexagon } from "lucide-react";';
const newImport = 'import { Plus, X, Download, Upload, Image as ImageIcon, Hexagon, ChevronDown, ChevronUp } from "lucide-react";';
if (code.includes(targetImport)) {
  code = code.replace(targetImport, newImport);
}

// 2. Add state
const targetState = '  const [finalItem, setFinalItem] = useState<{ index: number, text: string } | null>(null);';
const newState = targetState + '\n  const [collapsedTables, setCollapsedTables] = useState<Record<string, boolean>>({});\n\n  const toggleCollapse = (id: string) => setCollapsedTables(prev => ({...prev, [id]: !prev[id]}));';
if (code.includes(targetState)) {
  code = code.replace(targetState, newState);
}

// 3. Update the lootTables.map render
const targetMap = `            {(lootTables || []).map((table) => (
              <div key={table.id} className="bg-[#161311] border border-[#3a302a] p-4 flex flex-col shadow-lg">
                <div className="flex justify-between items-center mb-4 border-b border-[#3a302a] pb-2">
                  <h3 className="text-lg text-[#c1a063] font-bold">{table.name}</h3>
                  <div className="flex space-x-3 items-center">
                    <button onClick={() => startLootRoll(table)} className="text-sm text-[#c1a063] hover:text-[#dfba76] uppercase tracking-wider flex items-center gap-1 font-bold" title={\`Tirar d\${table.items.length}\`}>
                      <Hexagon size={16} /> Tirar
                    </button>
                    <div className="w-px h-4 bg-[#3a302a]"></div>
                    <button onClick={() => setEditingTable({ id: table.id, name: table.name, rawText: table.items.join("\\n") })} className="text-sm text-[#8b7355] hover:text-white uppercase tracking-wider">Editar</button>
                    <button onClick={() => setDeleteData({ type: "table", id: table.id })} className="text-sm text-red-500 hover:text-red-400 uppercase tracking-wider">Borrar</button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  <table className="w-full text-sm text-left">`;

const targetMapReplacement = `            {(lootTables || []).map((table) => {
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
                    <button onClick={() => startLootRoll(table)} className="text-sm text-[#c1a063] hover:text-[#dfba76] uppercase tracking-wider flex items-center gap-1 font-bold" title={\`Tirar d\${table.items.length}\`}>
                      <Hexagon size={16} /> Tirar
                    </button>
                    <div className="w-px h-4 bg-[#3a302a]"></div>
                    <button onClick={() => setEditingTable({ id: table.id, name: table.name, rawText: table.items.join("\\n") })} className="text-sm text-[#8b7355] hover:text-white uppercase tracking-wider">Editar</button>
                    <button onClick={() => setDeleteData({ type: "table", id: table.id })} className="text-sm text-red-500 hover:text-red-400 uppercase tracking-wider">Borrar</button>
                  </div>
                </div>
                {!isCollapsed && (
                <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  <table className="w-full text-sm text-left">`;

if (code.includes(targetMap)) {
  code = code.replace(targetMap, targetMapReplacement);
  
  // also need to close the `{!isCollapsed && (` at the end of the table
  const closeTarget = `                  </table>\n                </div>\n              </div>\n            ))}`;
  const closeReplacement = `                  </table>\n                </div>\n                )}\n              </div>\n            )})}`;
  code = code.replace(closeTarget, closeReplacement);
  
  fs.writeFileSync(filePath, code);
  console.log('patched view items for collapse');
} else {
  console.log('could not find target render code');
}
