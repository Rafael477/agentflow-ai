import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const styles = {
    primary: "bg-primary text-slate-950 hover:bg-teal-300",
    secondary: "bg-panel text-white hover:bg-white/10",
    ghost: "bg-transparent text-slate-200 hover:bg-white/10",
    danger: "bg-rose-500/15 text-rose-200 hover:bg-rose-500/25"
  };

  return (
    <button
      className={cn("inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition", styles[variant], className)}
      {...props}
    />
  );
}
