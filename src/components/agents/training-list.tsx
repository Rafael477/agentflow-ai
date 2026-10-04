"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const trainings = [
  "ESCOLHA A MELHOR FORMA DE GUARDAR suas memórias PARA SEMPRE. PACOTE DIGITAL: Cobertura fotográfica completa...",
  "JH FOTOGRAFIA ESTÚDIO FOTOGRÁFICO & GRÁFICA PERSONALIZADOS do seu jeito..."
];

export function TrainingList() {
  const [copiedTraining, setCopiedTraining] = useState<string | null>(null);
  const [copyError, setCopyError] = useState("");

  async function copyTraining(content: string) {
    try {
      setCopyError("");
      await navigator.clipboard.writeText(content);
      setCopiedTraining(content);
      window.setTimeout(() => setCopiedTraining(null), 1500);
    } catch {
      setCopyError("Não foi possível copiar o conteúdo.");
    }
  }

  return (
    <div className="space-y-3">
      {copyError ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-2 text-xs text-rose-200">{copyError}</p> : null}
      {trainings.map((training) => (
        <div key={training} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{training}</p>
            <div className="mt-2 flex gap-2">
              <Badge>Texto</Badge>
              <Badge className="border-primary/30 bg-primary/10 text-primary">Treinado</Badge>
            </div>
          </div>
          <Button variant="ghost" className="px-3" onClick={() => copyTraining(training)} title={copiedTraining === training ? "Conteúdo copiado" : "Copiar conteúdo"}>
            {copiedTraining === training ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      ))}
    </div>
  );
}
