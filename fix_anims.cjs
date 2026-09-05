const fs = require('fs');
const initPath = 'src/views/ViewInitiative.tsx';
const partyPath = 'src/views/ViewParty.tsx';

// 1. Initiative Animations
let initCode = fs.readFileSync(initPath, 'utf8');
const initAnimateOld = `                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}`;
const initAnimateNew = `                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                  transition={{ duration: 0.3 }}`;
initCode = initCode.replace(initAnimateOld, initAnimateNew);
// add popLayout to AnimatePresence if not there
initCode = initCode.replace(/<AnimatePresence>/g, '<AnimatePresence mode="popLayout">');
fs.writeFileSync(initPath, initCode);

// 2. Party Tab Animations
let partyCode = fs.readFileSync(partyPath, 'utf8');

// Replace the AnimatePresence mapping
const oldPartyAnim = `<AnimatePresence>
            {tab === "players" && players.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <StatBlock character={p} onEdit={handleEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} />
              </motion.div>
            ))}
            {tab === "npcs" && npcs.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <StatBlock character={n} onEdit={handleEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} onConvertToCreature={handleConvertToCreature} />
              </motion.div>
            ))}
            {tab === "creatures" && creatures.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <StatBlock character={c} onEdit={handleEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} />
              </motion.div>
            ))}
          </AnimatePresence>`;

const newPartyAnim = `<AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap gap-6 items-start justify-center w-full"
            >
              {tab === "players" && players.map((p) => (
                  <StatBlock key={p.id} character={p} onEdit={handleEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} />
              ))}
              {tab === "npcs" && npcs.map((n) => (
                  <StatBlock key={n.id} character={n} onEdit={handleEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} onConvertToCreature={handleConvertToCreature} />
              ))}
              {tab === "creatures" && creatures.map((c) => (
                  <StatBlock key={c.id} character={c} onEdit={handleEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} />
              ))}
            </motion.div>
          </AnimatePresence>`;

// Also fix the wrapper flex because we moved it into motion.div
const oldWrapper = `<div className="flex flex-wrap gap-6 items-start justify-center">
          <AnimatePresence`;
const newWrapper = `<div className="w-full">
          <AnimatePresence`;

partyCode = partyCode.replace(oldPartyAnim, newPartyAnim);
partyCode = partyCode.replace(oldWrapper, newWrapper);

fs.writeFileSync(partyPath, partyCode);
