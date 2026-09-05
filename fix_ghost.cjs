const fs = require('fs');
const filePath = 'src/store/useStore.ts';
let code = fs.readFileSync(filePath, 'utf8');

const targetGhost = `        const isGhost = (c: any) => {
           if (c.isTemp && c.tempData) return false;
           return !this.state.players.some((p) => p.id === c.characterId) && 
                  !this.state.npcs.some((n) => n.id === c.characterId);
        };`;

const newGhost = `        const isGhost = (c: any) => {
           if (c.isTemp && c.tempData) return false;
           return !this.state.players.some((p) => p.id === c.characterId) && 
                  !this.state.npcs.some((n) => n.id === c.characterId) &&
                  !(this.state.creatures || []).some((cr) => cr.id === c.characterId);
        };`;

code = code.replace(targetGhost, newGhost);
fs.writeFileSync(filePath, code);
