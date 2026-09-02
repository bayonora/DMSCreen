import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Modal } from './ui/Modal';

export function CalculatorModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleInput = (val: string) => {
    setExpression(prev => prev + val);
    setResult(null);
  };

  const calculate = () => {
    try {
      if (!/^[0-9+\-*/.\s()]+$/.test(expression)) {
        setResult('Error');
        return;
      }
      // eslint-disable-next-line no-new-func
      const res = new Function(`return ${expression}`)();
      setResult(typeof res === 'number' ? res.toString() : 'Error');
    } catch {
      setResult('Error');
    }
  };

  const clear = () => {
    setExpression('');
    setResult(null);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Calculadora" className="max-w-xs">
      <div className="flex flex-col gap-2">
        <div className="bg-black/50 border border-[#3a302a] p-3 rounded-md text-right min-h-16 flex flex-col justify-center overflow-hidden">
          <div className="text-sm text-[#8b7355] truncate">{expression || '\u00A0'}</div>
          <div className="text-2xl text-[#e6e2da] truncate font-bold">{result !== null ? result : (expression || '0')}</div>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4 font-mono text-lg">
          <button onClick={clear} className="col-span-2 bg-[#8a211b] hover:bg-red-700 text-white p-3 rounded transition-colors font-bold">C</button>
          <button onClick={() => handleInput('/')} className="bg-[#3a302a] hover:bg-[#c1a063] hover:text-black p-3 rounded transition-colors text-[#c1a063]">÷</button>
          <button onClick={() => handleInput('*')} className="bg-[#3a302a] hover:bg-[#c1a063] hover:text-black p-3 rounded transition-colors text-[#c1a063]">×</button>
          
          <button onClick={() => handleInput('7')} className="bg-[#1a1614] hover:bg-[#3a302a] p-3 rounded transition-colors">7</button>
          <button onClick={() => handleInput('8')} className="bg-[#1a1614] hover:bg-[#3a302a] p-3 rounded transition-colors">8</button>
          <button onClick={() => handleInput('9')} className="bg-[#1a1614] hover:bg-[#3a302a] p-3 rounded transition-colors">9</button>
          <button onClick={() => handleInput('-')} className="bg-[#3a302a] hover:bg-[#c1a063] hover:text-black p-3 rounded transition-colors text-[#c1a063]">-</button>
          
          <button onClick={() => handleInput('4')} className="bg-[#1a1614] hover:bg-[#3a302a] p-3 rounded transition-colors">4</button>
          <button onClick={() => handleInput('5')} className="bg-[#1a1614] hover:bg-[#3a302a] p-3 rounded transition-colors">5</button>
          <button onClick={() => handleInput('6')} className="bg-[#1a1614] hover:bg-[#3a302a] p-3 rounded transition-colors">6</button>
          <button onClick={() => handleInput('+')} className="bg-[#3a302a] hover:bg-[#c1a063] hover:text-black p-3 rounded transition-colors text-[#c1a063]">+</button>
          
          <button onClick={() => handleInput('1')} className="bg-[#1a1614] hover:bg-[#3a302a] p-3 rounded transition-colors">1</button>
          <button onClick={() => handleInput('2')} className="bg-[#1a1614] hover:bg-[#3a302a] p-3 rounded transition-colors">2</button>
          <button onClick={() => handleInput('3')} className="bg-[#1a1614] hover:bg-[#3a302a] p-3 rounded transition-colors">3</button>
          <button onClick={calculate} className="row-span-2 bg-[#c1a063] hover:bg-[#dfba76] text-black p-3 rounded transition-colors font-bold">=</button>
          
          <button onClick={() => handleInput('0')} className="col-span-2 bg-[#1a1614] hover:bg-[#3a302a] p-3 rounded transition-colors">0</button>
          <button onClick={() => handleInput('.')} className="bg-[#1a1614] hover:bg-[#3a302a] p-3 rounded transition-colors">.</button>
        </div>
      </div>
    </Modal>
  );
}
