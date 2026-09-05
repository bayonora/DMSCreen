const fs = require('fs');
const filePath = 'src/store/useStore.ts';
let code = fs.readFileSync(filePath, 'utf8');

const targetExport = `const stateToExport = { ...this.state, npcs: this.state.npcs.filter((n: any) => !n.isTemp) };`;
const newExport = `const stateToExport = { ...this.state, npcs: this.state.npcs.filter((n: any) => !n.isTemp), creatures: (this.state.creatures || []).filter((c: any) => !c.isTemp) };`;
if(code.includes(targetExport)) {
  code = code.replace(targetExport, newExport);
}

const targetImport = `      if (parsed.npcs) {
        parsed.npcs = parsed.npcs.filter((n: any) => !n.isTemp);
      }`;
const newImport = `      if (parsed.npcs) {
        parsed.npcs = parsed.npcs.filter((n: any) => !n.isTemp);
      }
      if (parsed.creatures) {
        parsed.creatures = parsed.creatures.filter((c: any) => !c.isTemp);
      }`;
if(code.includes(targetImport)) {
  code = code.replace(targetImport, newImport);
}

fs.writeFileSync(filePath, code);
console.log("Patched import/export");
