const fs = require('fs');
const filePath = 'src/views/ViewParty.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const targetTab = `{tab === "npcs" && npcs.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <StatBlock character={n} onEdit={handleEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} />
              </motion.div>
            ))}`;

const newTab = `{tab === "npcs" && npcs.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <StatBlock character={n} onEdit={handleEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} />
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
            ))}`;

code = code.replace(targetTab, newTab);

const targetEmpty = `{tab === "npcs" && npcs.length === 0 && (
             <p className="text-[#e6e2da] opacity-50 w-full text-center py-10 ">No hay NPCs. Añade uno para empezar.</p>
          )}`;

const newEmpty = `{tab === "npcs" && npcs.length === 0 && (
             <p className="text-[#e6e2da] opacity-50 w-full text-center py-10 ">No hay NPCs. Añade uno para empezar.</p>
          )}
          {tab === "creatures" && creatures.length === 0 && (
             <p className="text-[#e6e2da] opacity-50 w-full text-center py-10 ">No hay Criaturas. Añade una para empezar.</p>
          )}`;

code = code.replace(targetEmpty, newEmpty);

fs.writeFileSync(filePath, code);
