const fs = require('fs');
const filePath = 'src/views/ViewParty.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const targetImport = `          if (parsed.players !== undefined || parsed.npcs !== undefined) {
            if (parsed.players !== undefined) store.setState({ players: parsed.players });
            if (parsed.npcs !== undefined) store.setState({ npcs: parsed.npcs.filter((n: any) => !n.isTemp) });
          } else {`;

const newImport = `          if (parsed.players !== undefined || parsed.npcs !== undefined || parsed.creatures !== undefined) {
            if (parsed.players !== undefined) store.setState({ players: parsed.players });
            if (parsed.npcs !== undefined) store.setState({ npcs: parsed.npcs.filter((n: any) => !n.isTemp) });
            if (parsed.creatures !== undefined) store.setState({ creatures: parsed.creatures.filter((c: any) => !c.isTemp) });
          } else {`;

code = code.replace(targetImport, newImport);

const targetExport = `  const exportData = () => {
    const data = { players, npcs };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));`;

const newExport = `  const exportData = () => {
    const data = { players, npcs, creatures };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));`;

code = code.replace(targetExport, newExport);

fs.writeFileSync(filePath, code);
