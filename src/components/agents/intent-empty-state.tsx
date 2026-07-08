import { Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";

export function IntentEmptyState() {
  return (
    <div className="grid min-h-80 place-items-center rounded-xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-accent/15 text-accent">
          <Workflow className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white">Criar uma intenção</h3>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">
          Intenções são comandos personalizados que acionam ações específicas em serviços externos, como solicitar segunda via de um boleto.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button>Cadastrar primeira intenção</Button>
          <Button variant="secondary">Importar</Button>
        </div>
      </div>
    </div>
  );
}
