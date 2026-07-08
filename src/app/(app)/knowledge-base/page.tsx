import { Upload } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Base de conhecimento" subtitle="Crie categorias, perguntas, respostas e arquivos para treinamento" actions={<><Button>Criar base</Button><Button variant="secondary"><Upload className="mr-2 h-4 w-4" />Upload</Button></>} />
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card><h2 className="font-semibold text-white">Categorias</h2><div className="mt-4 space-y-2"><Badge>Serviços Fotográficos</Badge><Badge>Gráfica personalizada</Badge><Badge>Agendamentos</Badge></div></Card>
        <Card>
          <h2 className="font-semibold text-white">Perguntas e respostas</h2>
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Categoria: Serviços Fotográficos</p>
            <p className="mt-2 font-semibold text-white">Vocês fazem ensaio externo?</p>
            <p className="mt-2 text-sm text-slate-300">Sim, fazemos ensaios externos mediante agendamento prévio e análise do local.</p>
            <Badge className="mt-3 border-primary/30 bg-primary/10 text-primary">Treinado</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
