import React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label htmlFor={inputId} className="text-[10px] font-bold text-[#c1a063] uppercase tracking-widest">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "flex h-10 w-full bg-[#1e1a17] border border-[#3a302a] px-3 py-2 text-sm text-[#f5f2ed] placeholder-opacity-50 placeholder-white focus:outline-none focus:border-[#c1a063] disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label htmlFor={inputId} className="text-[10px] font-bold text-[#c1a063] uppercase tracking-widest">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            "flex min-h-[80px] w-full bg-[#1e1a17] border border-[#3a302a] px-3 py-2 text-sm text-[#f5f2ed] placeholder-opacity-50 placeholder-white focus:outline-none focus:border-[#c1a063] disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none text-xs uppercase tracking-tighter cursor-pointer",
          {
            "bg-[#c1a063] text-[#0f0d0c] hover:bg-[#d4b57a] px-4 py-1.5 font-bold": variant === "primary",
            "bg-transparent border border-[#c1a063] text-[#c1a063] hover:bg-[#c1a063] hover:text-[#0f0d0c] px-4 py-1.5": variant === "secondary",
            "bg-[#8a211b] text-white hover:bg-[#a52a23] px-3 py-1 font-bold": variant === "danger",
            "hover:bg-[#3a302a] text-[#c1a063] px-4 py-1.5": variant === "ghost",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
