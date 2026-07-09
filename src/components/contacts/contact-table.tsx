"use client";

import { useMemo, useState } from "react";
import { Download, Filter, Tags } from "lucide-react";
import type { Contact } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContactRowActions } from "@/components/contacts/contact-row-actions";

export function ContactTable({ contacts }: { contacts: Contact[] }) {
  const [query, setQuery] = useState("");
  const [activeChannel, setActiveChannel] = useState("Todos");
  const [tagFilterOpen, setTagFilterOpen] = useState(false);
  const [activeTag, setActiveTag] = useState("Todas");

  const channels = useMemo(() => ["Todos", ...Array.from(new Set(contacts.map((contact) => contact.channel)))], [contacts]);
  const tags = useMemo(() => ["Todas", ...Array.from(new Set(contacts.flatMap((contact) => contact.tags)))], [contacts]);

  const filteredContacts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return contacts.filter((contact) => {
      const matchesSearch = !normalizedQuery || [
        contact.name,
        contact.phone,
        contact.email,
        contact.channel,
        contact.status,
        ...contact.tags
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesChannel = activeChannel === "Todos" || contact.channel === activeChannel;
      const matchesTag = activeTag === "Todas" || contact.tags.includes(activeTag);

      return matchesSearch && matchesChannel && matchesTag;
    });
  }, [activeChannel, activeTag, contacts, query]);

  function exportContacts() {
    const header = ["Nome", "Telefone", "Email", "Canal", "Etiquetas", "Status"];
    const rows = filteredContacts.map((contact) => [
      contact.name,
      contact.phone,
      contact.email,
      contact.channel,
      contact.tags.join("; "),
      contact.status
    ]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "contatos-agentflow.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card className="p-0">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 md:flex-row md:items-center">
        <p className="font-semibold text-white">Total de contatos: {filteredContacts.length}</p>
        <input className="min-w-0 flex-1 rounded-lg border border-white/10 bg-panel px-3 py-2 text-sm outline-none" placeholder="Buscar contatos" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="rounded-lg border border-white/10 bg-panel px-3 py-2 text-sm outline-none" value={activeChannel} onChange={(event) => setActiveChannel(event.target.value)}>
          {channels.map((channel) => <option key={channel}>{channel}</option>)}
        </select>
        <Button variant="secondary" onClick={() => setActiveChannel("Todos")}><Filter className="mr-2 h-4 w-4" />Limpar</Button>
        <Button variant="secondary" onClick={() => setTagFilterOpen((current) => !current)}><Tags className="mr-2 h-4 w-4" />Etiquetas</Button>
        <Button onClick={exportContacts}><Download className="mr-2 h-4 w-4" />Exportar contatos</Button>
      </div>
      {tagFilterOpen ? (
        <div className="flex flex-wrap gap-2 border-b border-white/10 p-4">
          {tags.map((tag) => (
            <button key={tag} className={activeTag === tag ? "rounded-full bg-primary px-3 py-1 text-sm font-semibold text-slate-950" : "rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300"} onClick={() => setActiveTag(tag)} type="button">{tag}</button>
          ))}
        </div>
      ) : null}
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
            {filteredContacts.map((contact) => (
              <tr key={contact.id} className="border-t border-white/10">
                <td className="px-5 py-4 font-semibold text-white">{contact.name}</td>
                <td className="px-5 py-4 text-slate-300">{contact.phone}</td>
                <td className="px-5 py-4 text-slate-400">{contact.email}</td>
                <td className="px-5 py-4 text-slate-300">{contact.channel}</td>
                <td className="px-5 py-4"><div className="flex flex-wrap gap-1">{contact.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div></td>
                <td className="px-5 py-4 text-slate-400">{contact.lastService}</td>
                <td className="px-5 py-4"><Badge className="border-primary/30 bg-primary/10 text-primary">{contact.status}</Badge></td>
                <td className="px-5 py-4"><ContactRowActions contact={contact} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
