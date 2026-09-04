const fs = require('fs');
let code = fs.readFileSync('src/views/ViewQuests.tsx', 'utf8');

code = code.replace(
  'import { useStore, actions } from "../store/useStore";',
  'import { store, useStore, actions } from "../store/useStore";'
);

code = code.replace(
  'useStore.setState({ quests: parsed });',
  'store.setState({ quests: parsed });'
);

fs.writeFileSync('src/views/ViewQuests.tsx', code);
console.log('patched viewquests store');
