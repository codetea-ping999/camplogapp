import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent focus:bg-white/8",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
