import { Download, Filter, Tags } from "lucide-react";
import type { Contact } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ContactTable({ contacts }: { contacts: Contact[] }) {
  return (
    <Card className="p-0">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 md:flex-row md:items-center">
        <p className="font-semibold text-white">Total de contatos: {contacts.length}</p>
        <input className="min-w-0 flex-1 rounded-lg border border-white/10 bg-panel px-3 py-2 text-sm outline-none" placeholder="Buscar contatos" />
        <Button variant="secondary"><Filter className="mr-2 h-4 w-4" />Filtros</Button>
        <Button variant="secondary"><Tags className="mr-2 h-4 w-4" />Etiquetas</Button>
        <Button><Download className="mr-2 h-4 w-4" />Exportar contatos</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              {["Nome", "Telefone", "E-mail", "Canal", "Etiquetas", "Último atendimento", "Status", "Ações"].map((head) => (
                <th key={head} className="px-5 py-4 font-medium">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id} className="border-t border-white/10">
                <td className="px-5 py-4 font-semibold text-white">{contact.name}</td>
                <td className="px-5 py-4 text-slate-300">{contact.phone}</td>
                <td className="px-5 py-4 text-slate-400">{contact.email}</td>
                <td className="px-5 py-4 text-slate-300">{contact.channel}</td>
                <td className="px-5 py-4"><div className="flex flex-wrap gap-1">{contact.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div></td>
                <td className="px-5 py-4 text-slate-400">{contact.lastService}</td>
                <td className="px-5 py-4"><Badge className="border-primary/30 bg-primary/10 text-primary">{contact.status}</Badge></td>
                <td className="px-5 py-4"><Button variant="ghost">Editar</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
