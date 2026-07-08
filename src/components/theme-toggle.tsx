"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  return (
    <Button variant="secondary">
      <Moon className="mr-2 h-4 w-4" />
      Tema dark
      <Sun className="ml-2 h-4 w-4 text-slate-500" />
    </Button>
  );
}
