const fs = require('fs');
const filePath = 'src/views/ViewInitiative.tsx';
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
  `{isActive ? "▶ TURNO ACTIVO" : (char.type === "player" ? "Jugador" : "NPC")}`,
  `{isActive ? "▶ TURNO ACTIVO" : (char.type === "player" ? "Jugador" : char.type === "creature" ? "Criatura" : "NPC")}`
);

fs.writeFileSync(filePath, code);
