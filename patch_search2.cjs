const fs = require('fs');
let code = fs.readFileSync('src/components/GlobalSearch.tsx', 'utf8');

const oldScoreString = `  const scoreString = (q: string, text: string) => {
    if (!text) return 0;
    const t = text.toLowerCase();
    if (t === q) return 100;
    if (t.startsWith(q)) return 50;
    if (t.includes(q)) return 10;
    return 0;
  };`;

const newScoreString = `  const scoreString = (q: string, text: string) => {
    if (!text || !q) return 0;
    const t = text.toLowerCase();
    
    // Direct matches
    if (t === q) return 100;
    if (t.startsWith(q)) return 50;
    if (t.includes(q)) return 10;
    
    // Fuzzy matching (subsequence)
    let qIdx = 0;
    for (let i = 0; i < t.length; i++) {
      if (t[i] === q[qIdx]) {
        qIdx++;
        if (qIdx === q.length) {
           return 5; // Probable match but scattered
        }
      }
    }
    return 0;
  };`;

if (code.includes(oldScoreString)) {
  code = code.replace(oldScoreString, newScoreString);
  fs.writeFileSync('src/components/GlobalSearch.tsx', code);
  console.log('patched GlobalSearch with fuzzy');
} else {
  console.log('could not find oldScoreString');
}
