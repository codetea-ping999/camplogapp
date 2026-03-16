import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-32 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent focus:bg-white/8",
      className,
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
