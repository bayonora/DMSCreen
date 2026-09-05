const fs = require('fs');
const filePath = 'src/views/ViewParty.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const targetCondition = `{type === "npc" && (
            <Input label="Desafío (CR)" name="cr" defaultValue={(initialData as NPC)?.cr} />
          )}`;

const newCondition = `{(type === "npc" || type === "creature") && (
            <Input label="Desafío (CR)" name="cr" defaultValue={(initialData as NPC)?.cr} />
          )}`;

code = code.replace(targetCondition, newCondition);

const targetNpcFields = `{type === "npc" && (
          <div className="flex flex-col gap-4">
            <Input label="Habilidades" name="skills" defaultValue={(initialData as NPC)?.skills} />
            <Input label="Sentidos" name="senses" defaultValue={(initialData as NPC)?.senses} />
            <Input label="Idiomas" name="languages" defaultValue={(initialData as NPC)?.languages} />
            <Textarea label="Rasgos Especiales" name="specialTraits" defaultValue={(initialData as NPC)?.specialTraits} />
            <Textarea label="Acciones" name="actions" defaultValue={(initialData as NPC)?.actions} />
          </div>
        )}`;

const newNpcFields = `{(type === "npc" || type === "creature") && (
          <div className="flex flex-col gap-4">
            <Input label="Habilidades" name="skills" defaultValue={(initialData as NPC)?.skills} />
            <Input label="Sentidos" name="senses" defaultValue={(initialData as NPC)?.senses} />
            <Input label="Idiomas" name="languages" defaultValue={(initialData as NPC)?.languages} />
            <Textarea label="Rasgos Especiales" name="specialTraits" defaultValue={(initialData as NPC)?.specialTraits} />
            <Textarea label="Acciones" name="actions" defaultValue={(initialData as NPC)?.actions} />
          </div>
        )}`;

code = code.replace(targetNpcFields, newNpcFields);

fs.writeFileSync(filePath, code);
