"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
};

const styles = {
  primary:
    "bg-accent text-slate-950 hover:bg-accent-strong shadow-[0_12px_30px_rgba(109,184,141,0.25)]",
  secondary: "bg-panel-strong text-foreground hover:bg-[#1c342a]",
  outline: "border border-border bg-transparent text-foreground hover:bg-white/5",
  ghost: "bg-transparent text-muted hover:bg-white/5 hover:text-foreground",
  danger: "bg-danger/90 text-white hover:bg-danger",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
