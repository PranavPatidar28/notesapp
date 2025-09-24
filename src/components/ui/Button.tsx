"use client";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
};

const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-offset-[#121212]";
const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  // colored buttons on dark background
  default: "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500",
  secondary: "bg-cyan-600 text-white hover:bg-cyan-500 focus-visible:ring-cyan-500",
  destructive: "bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-500",
  outline: "border border-[#2a2a2a] bg-transparent text-[#e6e6e6] hover:bg-[#171717] focus-visible:ring-[#3a3a3a]",
  ghost: "hover:bg-[#171717] text-[#e6e6e6]",
};
const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export function Button({ variant = "default", size = "md", className = "", isLoading, children, ...props }: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {isLoading ? <span className="animate-pulse">...</span> : children}
    </button>
  );
}

export default Button;


