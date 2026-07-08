import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const rows = [
  ["Rafael", "Ensaio em estúdio", "12/07/2026", "15:00", "Confirmado"],
  ["Marina Alves", "Convites personalizados", "14/07/2026", "10:30", "Agendado"]
];

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Atendimentos" subtitle="Agendamentos vinculados a contatos e agentes" actions={<Button>Criar agendamento</Button>} />
      <Card className="overflow-x-auto p-0"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-white/5 text-slate-400"><tr>{["Cliente", "Serviço", "Data", "Hora", "Status", "Ações"].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.join("-")} className="border-t border-white/10">{row.map((cell, index) => <td key={cell} className="px-5 py-4">{index === 4 ? <Badge>{cell}</Badge> : cell}</td>)}<td className="px-5 py-4"><Button variant="ghost">Editar</Button></td></tr>)}</tbody></table></Card>
    </div>
  );
}
