import { MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const trainings = [
  "ESCOLHA A MELHOR FORMA DE GUARDAR suas memórias PARA SEMPRE. PACOTE DIGITAL: Cobertura fotográfica completa...",
  "JH FOTOGRAFIA ESTÚDIO FOTOGRÁFICO & GRÁFICA PERSONALIZADOS do seu jeito..."
];

export function TrainingList() {
  return (
    <div className="space-y-3">
      {trainings.map((training) => (
        <div key={training} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{training}</p>
            <div className="mt-2 flex gap-2">
              <Badge>Texto</Badge>
              <Badge className="border-primary/30 bg-primary/10 text-primary">Treinado</Badge>
            </div>
          </div>
          <Button variant="ghost" className="px-3">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
