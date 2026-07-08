import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const labels = ["Novo lead", "Cliente fechado", "Orçamento enviado", "Aguardando pagamento", "Pós-venda"];

export default function LabelsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Etiquetas" subtitle="Organize contatos e conversas por estágio" actions={<Button>Criar etiqueta</Button>} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{labels.map((label, index) => <Card key={label} className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="h-4 w-4 rounded-full" style={{ backgroundColor: ["#14B8A6", "#A855F7", "#F59E0B", "#EF4444", "#38BDF8"][index] }} /><span className="font-medium text-white">{label}</span></div><Button variant="ghost">Editar</Button></Card>)}</div>
    </div>
  );
}
