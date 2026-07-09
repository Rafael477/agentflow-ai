"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("agentflow-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("agentflow-theme");
    const initialTheme = saved === "light" ? "light" : "dark";
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  function toggleTheme() {
    setTheme((current) => {
      const nextTheme = current === "light" ? "dark" : "light";
      applyTheme(nextTheme);
      return nextTheme;
    });
  }

  const light = theme === "light";

  return (
    <Button variant="secondary" onClick={toggleTheme} aria-pressed={light}>
      <Moon className="mr-2 h-4 w-4" />
      {light ? "Tema claro" : "Tema dark"}
      <Sun className={light ? "ml-2 h-4 w-4 text-primary" : "ml-2 h-4 w-4 text-slate-500"} />
    </Button>
  );
}
