const fs = require('fs');
const filePath = 'src/views/ViewParty.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const targetStr = `{type === "npc" && (
          <>
            <Input label="Habilidades" name="skills" defaultValue={(initialData as NPC)?.skills} placeholder="ej. Percepción +2, Sigilo +4" />
            <Input label="Sentidos" name="senses" defaultValue={(initialData as NPC)?.senses} placeholder="ej. Visión en la oscuridad 120 pies, Percepción pasiva 12" />
            <Input label="Idiomas" name="languages" defaultValue={(initialData as NPC)?.languages} placeholder="ej. Común, élfico" />
            <Textarea label="Rasgos Especiales" name="specialTraits" defaultValue={(initialData as NPC)?.specialTraits} placeholder="ej. Sensibilidad a la Luz Solar: El drow tiene desventaja en las tiradas..." />
            <Textarea label="Acciones (Ataques, Hechizos)" name="actions" defaultValue={(initialData as NPC)?.actions} placeholder="ej. Espada corta. Ataque con arma cuerpo a cuerpo: +4 a impactar, alcance 5 pies..." />
          </>
        )}`;

const newStr = `{(type === "npc" || type === "creature") && (
          <>
            <Input label="Habilidades" name="skills" defaultValue={(initialData as NPC)?.skills} placeholder="ej. Percepción +2, Sigilo +4" />
            <Input label="Sentidos" name="senses" defaultValue={(initialData as NPC)?.senses} placeholder="ej. Visión en la oscuridad 120 pies, Percepción pasiva 12" />
            <Input label="Idiomas" name="languages" defaultValue={(initialData as NPC)?.languages} placeholder="ej. Común, élfico" />
            <Textarea label="Rasgos Especiales" name="specialTraits" defaultValue={(initialData as NPC)?.specialTraits} placeholder="ej. Sensibilidad a la Luz Solar: El drow tiene desventaja en las tiradas..." />
            <Textarea label="Acciones (Ataques, Hechizos)" name="actions" defaultValue={(initialData as NPC)?.actions} placeholder="ej. Espada corta. Ataque con arma cuerpo a cuerpo: +4 a impactar, alcance 5 pies..." />
          </>
        )}`;

code = code.replace(targetStr, newStr);
fs.writeFileSync(filePath, code);
