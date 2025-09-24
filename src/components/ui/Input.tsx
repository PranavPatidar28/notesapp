"use client";
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium">{label}</label>}
      <input className={`w-full border rounded-md px-3 py-2 bg-[#0f0f0f] text-[#e6e6e6] placeholder:text-[#6f6f6f] focus:outline-none focus:ring-2 focus:ring-[#3a3a3a] border-[#2a2a2a] ${className}`} {...props} />
      {error && <p className="text-xs text-[#ff6b6b]">{error}</p>}
    </div>
  );
}

export default Input;


