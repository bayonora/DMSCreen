const fs = require('fs');
const filePath = 'src/views/ViewInitiative.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const targetStr = `<Modal isOpen={viewCharModal.open} onClose={() => setViewCharModal({ open: false })} title="Ficha">
         {viewCharModal.char && (
           <div className="flex justify-center">
             <StatBlock character={viewCharModal.char} />
           </div>
         )}
      </Modal>`;

const replacementStr = `<AnimatePresence>
        {viewCharModal.open && viewCharModal.char && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" 
            onClick={() => setViewCharModal({ open: false })}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} 
              className="max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar flex justify-center"
            >
              <StatBlock character={viewCharModal.char} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync(filePath, code);
