const fs = require('fs');
const filePath = 'src/views/ViewParty.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const targetUseEffect = `  useEffect(() => {
    if (isOpen) {
      setType(initialData?.type || (defaultType === "players" ? "player" : "npc"));
    }
  }, [isOpen, initialData, defaultType]);`;

const newUseEffect = `  useEffect(() => {
    if (isOpen) {
      setType(initialData?.type || (defaultType === "players" ? "player" : defaultType === "npcs" ? "npc" : "creature"));
    }
  }, [isOpen, initialData, defaultType]);`;

code = code.replace(targetUseEffect, newUseEffect);

const targetHandleSubmit = `    if (type === "player") {
      const p: Omit<Player, "id" | "type"> = {
        name: getS("name"),
        classAndLevel: getS("classAndLevel"),
        race: getS("race"),
        hpMax: getNum("hpMax"),
        ac: getNum("ac"),
        passivePerception: getNum("passivePerception"),
        stats
      };
      if (isEditing && initialData) actions.updatePlayer(initialData.id, p);
      else actions.addPlayer(p);
    } else {
      const n: Omit<NPC, "id" | "type"> = {
        name: getS("name"),
        race: getS("race"),
        hpMax: getNum("hpMax"),
        ac: getNum("ac"),
        cr: getS("cr"),
        skills: getS("skills"),
        senses: getS("senses"),
        languages: getS("languages"),
        specialTraits: getS("specialTraits"),
        actions: getS("actions"),
        stats
      };
      if (isEditing && initialData) actions.updateNPC(initialData.id, n);
      else actions.addNPC(n);
    }`;

const newHandleSubmit = `    if (type === "player") {
      const p: Omit<Player, "id" | "type"> = {
        name: getS("name"),
        classAndLevel: getS("classAndLevel"),
        race: getS("race"),
        hpMax: getNum("hpMax"),
        ac: getNum("ac"),
        passivePerception: getNum("passivePerception"),
        stats
      };
      if (isEditing && initialData) actions.updatePlayer(initialData.id, p);
      else actions.addPlayer(p);
    } else if (type === "npc") {
      const n: Omit<NPC, "id" | "type"> = {
        name: getS("name"),
        race: getS("race"),
        hpMax: getNum("hpMax"),
        ac: getNum("ac"),
        cr: getS("cr"),
        skills: getS("skills"),
        senses: getS("senses"),
        languages: getS("languages"),
        specialTraits: getS("specialTraits"),
        actions: getS("actions"),
        stats
      };
      if (isEditing && initialData) actions.updateNPC(initialData.id, n);
      else actions.addNPC(n);
    } else {
      const c: Omit<NPC, "id" | "type"> = { // Using NPC type structure as requested
        name: getS("name"),
        race: getS("race"),
        hpMax: getNum("hpMax"),
        ac: getNum("ac"),
        cr: getS("cr"),
        skills: getS("skills"),
        senses: getS("senses"),
        languages: getS("languages"),
        specialTraits: getS("specialTraits"),
        actions: getS("actions"),
        stats
      };
      if (isEditing && initialData) actions.updateCreature(initialData.id, c as any);
      else actions.addCreature(c as any);
    }`;

code = code.replace(targetHandleSubmit, newHandleSubmit);

fs.writeFileSync(filePath, code);
console.log("Patched ViewParty CharModal");
