const fs = require('fs');
let code = fs.readFileSync('src/store/useStore.ts', 'utf8');

const targetStr = `      if (Array.isArray(parsed)) {
        alert("Parece que estás intentando importar un archivo de una sección específica (como Notas u Objetos) en el Importador Global. Ve a la sección correspondiente para importarlo.");
        return;
      }`;

const newStr = `      if (Array.isArray(parsed) || (parsed.players && parsed.npcs && !parsed.uiState)) {
        alert("Parece que estás intentando importar un archivo de una sección específica (como Notas o Grupo) en el Importador Global. Ve a la sección correspondiente para importarlo o usa un archivo de Exportación Total.");
        return;
      }`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('src/store/useStore.ts', code);
console.log('patched Global Import block');
