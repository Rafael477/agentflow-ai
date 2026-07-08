import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function IntegrationCard({ icon: Icon, name, description }: { icon: LucideIcon; name: string; description: string }) {
  return (
    <Card>
      <Icon className="h-7 w-7 text-accent" />
      <h3 className="mt-4 font-semibold text-white">{name}</h3>
      <p className="mt-2 min-h-12 text-sm text-slate-400">{description}</p>
      <Button className="mt-4 w-full">Ativar integração</Button>
    </Card>
  );
}
