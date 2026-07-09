"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DashboardActions() {
  const [view, setView] = useState("Visão Geral");
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-2">
      {["Visão Geral", "Atendimento"].map((item) => (
        <Button key={item} variant={view === item ? "primary" : "secondary"} onClick={() => setView(item)}>{item}</Button>
      ))}
      <Button variant={filtersOpen ? "primary" : "secondary"} onClick={() => setFiltersOpen((current) => !current)}>{filtersOpen ? "Filtros ativos" : "Filtros"}</Button>
    </div>
  );
}
