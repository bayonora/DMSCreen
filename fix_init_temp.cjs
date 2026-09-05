const fs = require('fs');
const filePath = 'src/views/ViewInitiative.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// State
const stateTarget = `  const [tempAc, setTempAc] = useState("");`;
const stateNew = `  const [tempAc, setTempAc] = useState("");\n  const [isTempEnemy, setIsTempEnemy] = useState(true);`;
code = code.replace(stateTarget, stateNew);

// Function call
const callTarget = `actions.addTempCombatant(npc, Number(initiative) || 0);`;
const callNew = `actions.addTempCombatant(npc, Number(initiative) || 0, isTempEnemy);`;
code = code.replace(callTarget, callNew);

// Form UI
const uiTarget = `            <div className="grid grid-cols-2 gap-4">
              <Input label="Vida Máxima (HP)" type="number" value={tempHpMax} onChange={e => setTempHpMax(e.target.value)} required={mode === "temp"} />
              <Input label="Armadura (CA)" type="number" value={tempAc} onChange={e => setTempAc(e.target.value)} required={mode === "temp"} />
            </div>`;
const uiNew = `            <div className="grid grid-cols-2 gap-4">
              <Input label="Vida Máxima (HP)" type="number" value={tempHpMax} onChange={e => setTempHpMax(e.target.value)} required={mode === "temp"} />
              <Input label="Armadura (CA)" type="number" value={tempAc} onChange={e => setTempAc(e.target.value)} required={mode === "temp"} />
            </div>
            <div className="flex items-center gap-2 text-sm text-[#e6e2da] mt-2">
              <input type="checkbox" id="isTempEnemy" checked={isTempEnemy} onChange={(e) => setIsTempEnemy(e.target.checked)} className="w-4 h-4 rounded bg-[#0a0a09] border-[#3a302a] text-[#8a211b] focus:ring-[#8a211b]" />
              <label htmlFor="isTempEnemy">Es Enemigo (Criatura)</label>
            </div>`;
code = code.replace(uiTarget, uiNew);

fs.writeFileSync(filePath, code);
