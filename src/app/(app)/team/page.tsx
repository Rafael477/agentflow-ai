import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { team } from "@/lib/mock-data";

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Equipe" subtitle="Gerencie membros, funções e permissões" actions={<Button><Plus className="mr-2 h-4 w-4" />Convidar membro</Button>} />
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-white/5 text-slate-400"><tr>{["Nome", "E-mail", "Cargo", "Permissão", "Status", "Último acesso", "Ações"].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr></thead>
          <tbody>{team.map((member) => <tr key={member.email} className="border-t border-white/10"><td className="px-5 py-4 font-semibold text-white">{member.name}</td><td className="px-5 py-4 text-slate-400">{member.email}</td><td className="px-5 py-4">{member.role}</td><td className="px-5 py-4"><Badge>{member.permission}</Badge></td><td className="px-5 py-4 text-primary">{member.status}</td><td className="px-5 py-4 text-slate-400">{member.lastAccess}</td><td className="px-5 py-4"><Button variant="ghost">Editar</Button></td></tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}
