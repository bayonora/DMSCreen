const fs = require('fs');
const filePath = 'src/views/ViewParty.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const targetDef = `function CharacterModal({ isOpen, onClose, initialData, defaultType }: { isOpen: boolean, onClose: () => void, initialData: Character | null, defaultType: "players" | "npcs" }) {
  const isEditing = !!initialData;
  const [type, setType] = useState<"player" | "npc">(initialData?.type || (defaultType === "players" ? "player" : "npc"));`;

const newDef = `function CharacterModal({ isOpen, onClose, initialData, defaultType }: { isOpen: boolean, onClose: () => void, initialData: Character | null, defaultType: "players" | "npcs" | "creatures" }) {
  const isEditing = !!initialData;
  const [type, setType] = useState<"player" | "npc" | "creature">(initialData?.type || (defaultType === "players" ? "player" : defaultType === "npcs" ? "npc" : "creature"));`;

if(code.includes(targetDef)) {
  code = code.replace(targetDef, newDef);
}

const targetType = `      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isEditing && (
          <div className="flex gap-2 mb-2">
            <Button type="button" variant={type === "player" ? "primary" : "secondary"} onClick={() => setType("player")} className="flex-1">Player</Button>
            <Button type="button" variant={type === "npc" ? "primary" : "secondary"} onClick={() => setType("npc")} className="flex-1">NPC</Button>
          </div>
        )}`;

const newType = `      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isEditing && (
          <div className="flex gap-2 mb-2">
            <Button type="button" variant={type === "player" ? "primary" : "secondary"} onClick={() => setType("player")} className="flex-1">Player</Button>
            <Button type="button" variant={type === "npc" ? "primary" : "secondary"} onClick={() => setType("npc")} className="flex-1">NPC</Button>
            <Button type="button" variant={type === "creature" ? "primary" : "secondary"} onClick={() => setType("creature")} className="flex-1">Criatura</Button>
          </div>
        )}`;

if(code.includes(targetType)) {
  code = code.replace(targetType, newType);
}

const targetSave = `    if (isEditing) {
      if (type === "player") actions.updatePlayer(initialData.id, data);
      else actions.updateNPC(initialData.id, data);
    } else {
      if (type === "player") actions.addPlayer(data as any);
      else actions.addNPC(data as any);
    }`;

const newSave = `    if (isEditing) {
      if (type === "player") actions.updatePlayer(initialData.id, data);
      else if (type === "npc") actions.updateNPC(initialData.id, data);
      else actions.updateCreature(initialData.id, data);
    } else {
      if (type === "player") actions.addPlayer(data as any);
      else if (type === "npc") actions.addNPC(data as any);
      else actions.addCreature(data as any);
    }`;

if(code.includes(targetSave)) {
  code = code.replace(targetSave, newSave);
}

const targetFieldCheck = `        {type === "npc" && (
          <>
            <div className="grid grid-cols-2 gap-4">`;
const newFieldCheck = `        {(type === "npc" || type === "creature") && (
          <>
            <div className="grid grid-cols-2 gap-4">`;

if(code.includes(targetFieldCheck)) {
  code = code.replace(targetFieldCheck, newFieldCheck);
}

fs.writeFileSync(filePath, code);
console.log("Patched CharacterModal");
