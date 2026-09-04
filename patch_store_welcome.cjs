const fs = require('fs');
let code = fs.readFileSync('src/store/useStore.ts', 'utf8');

code = code.replace(
  'draftNote: Partial<Note> | null;',
  'draftNote: Partial<Note> | null;\n  hasSeenWelcome?: boolean;'
);

code = code.replace(
  'editingNoteId: null,',
  'editingNoteId: null,\n    hasSeenWelcome: false,'
);

fs.writeFileSync('src/store/useStore.ts', code);
console.log('patched store for welcome');
