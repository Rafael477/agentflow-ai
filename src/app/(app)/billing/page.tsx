import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { workspace } from "@/lib/mock-data";

const plans = ["Starter — 1 agente — 1 canal — 1.000 créditos", "Pro — 5 agentes — 5 canais — 10.000 créditos", "Business — agentes ilimitados — canais ilimitados — 50.000 créditos"];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Faturamento" subtitle="Controle planos, assinatura, créditos e histórico" actions={<Button>Comprar créditos</Button>} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card><p className="text-sm text-slate-400">Créditos disponíveis</p><p className="mt-3 text-4xl font-bold text-white">{workspace.credits}</p><Badge className="mt-4">Assinatura atual: Pro</Badge></Card>
        {plans.map((plan) => <Card key={plan}><h2 className="font-semibold text-white">{plan.split(" — ")[0]}</h2><p className="mt-2 text-sm text-slate-400">{plan}</p><Button className="mt-5 w-full">Selecionar plano</Button></Card>)}
      </div>
      <Card><h2 className="font-semibold text-white">Histórico de consumo</h2><p className="mt-3 text-sm text-slate-400">Uso do agente Jéssica Helen: -1 crédito por resposta simulada.</p></Card>
    </div>
  );
}
