"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("agentflow-theme");
    setLight(saved === "light");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
    localStorage.setItem("agentflow-theme", light ? "light" : "dark");
  }, [light]);

  return (
    <Button variant="secondary" onClick={() => setLight((current) => !current)}>
      <Moon className="mr-2 h-4 w-4" />
      {light ? "Tema claro" : "Tema dark"}
      <Sun className={light ? "ml-2 h-4 w-4 text-primary" : "ml-2 h-4 w-4 text-slate-500"} />
    </Button>
  );
}
