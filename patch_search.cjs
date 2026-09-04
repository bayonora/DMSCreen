const fs = require('fs');
let code = fs.readFileSync('src/components/GlobalSearch.tsx', 'utf8');

code = code.replace('icon: JSX.Element;', 'icon: React.ReactNode;');

code = code.replace('scoreString(q, p.class)', 'scoreString(q, p.classAndLevel)');
code = code.replace('`${p.race} ${p.class}`', '`${p.race} - ${p.classAndLevel}`');

code = code.replace(
  'storeState.combatants.forEach(c => {\n      const score = scoreString(q, c.name);\n      if (score > 0) res.push({ id: c.id, type: "Combate", label: c.name, tab: "initiative", score, icon: <Swords size={16} /> });\n    });',
  `storeState.combatants.forEach(c => {
      let name = c.isTemp && c.tempData ? c.tempData.name : undefined;
      if (!name) {
         const p = storeState.players.find(x => x.id === c.characterId);
         const n = storeState.npcs.find(x => x.id === c.characterId);
         name = p ? p.name : n ? n.name : "Desconocido";
      }
      const score = scoreString(q, name);
      if (score > 0) res.push({ id: c.id, type: "Combate", label: name, tab: "initiative", score, icon: <Swords size={16} /> });
    });`
);

code = code.replace('scoreString(q, s.type)', 'scoreString(q, s.ownerName)');
code = code.replace('subLabel: s.type, tab: "shops"', 'subLabel: s.ownerName, tab: "shops"');

code = code.replace('scoreString(q, ci.type)', 'scoreString(q, ci.description || "")');
code = code.replace('subLabel: ci.type, tab: "items"', 'subLabel: "Objeto Personalizado", tab: "items"');

fs.writeFileSync('src/components/GlobalSearch.tsx', code);
console.log('patched GlobalSearch');
