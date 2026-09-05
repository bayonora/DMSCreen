const fs = require('fs');
const filePath = 'src/types.ts';
let code = fs.readFileSync(filePath, 'utf8');

const targetStr = `export type Character = Player | NPC;`;
const newStr = `export type Creature = {
  isTemp?: boolean;
  id: string;
  type: "creature";
  name: string;
  race: string;
  ac: number;
  hpMax: number;
  stats: StatBlock;
  cr: string;
  skills: string;
  senses: string;
  languages: string;
  specialTraits: string;
  actions: string;
  tags?: CharacterTag[];
};

export type Character = Player | NPC | Creature;`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
  fs.writeFileSync(filePath, code);
  console.log("Patched types");
} else {
  console.log("Could not find Character type");
}
