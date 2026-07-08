import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Templates WhatsApp" subtitle="Gerencie modelos de mensagem e variáveis" actions={<Button><Plus className="mr-2 h-4 w-4" />Criar template</Button>} />
      <Card>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="font-semibold text-white">Confirmação de agendamento</h2><p className="text-sm text-slate-400">Categoria: Utilidade • Idioma: pt_BR</p></div>
            <Badge className="border-primary/30 bg-primary/10 text-primary">Aprovado</Badge>
          </div>
          <p className="mt-4 rounded-lg bg-panel p-3 text-sm text-slate-300">Olá {"{{nome}}"}, seu agendamento foi confirmado para {"{{data}}"} às {"{{hora}}"}.</p>
        </div>
      </Card>
    </div>
  );
}
