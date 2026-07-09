"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function IntegrationCard({ icon: Icon, name, description }: { icon: LucideIcon; name: string; description: string }) {
  const [active, setActive] = useState(false);

  return (
    <Card>
      <Icon className="h-7 w-7 text-accent" />
      <h3 className="mt-4 font-semibold text-white">{name}</h3>
      <p className="mt-2 min-h-12 text-sm text-slate-400">{description}</p>
      {active ? <p className="mt-3 rounded-lg border border-primary/20 bg-primary/10 p-2 text-center text-xs text-primary">Integração ativada neste workspace</p> : null}
      <Button className="mt-4 w-full" variant={active ? "secondary" : "primary"} onClick={() => setActive((current) => !current)}>{active ? "Desativar integração" : "Ativar integração"}</Button>
    </Card>
  );
}
