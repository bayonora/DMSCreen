import React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      <div 
        className={cn(
          "relative bg-[#0f0d0c] border border-[#3a302a] rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.4)] w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200",
          className
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#3a302a]">
          <h2 className="text-2xl font-display text-[#c1a063] uppercase tracking-widest">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-[#c1a063] hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto overflow-x-hidden flex-1 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
