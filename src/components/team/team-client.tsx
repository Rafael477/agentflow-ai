"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { Modal } from "@/components/modals/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface TeamMemberItem {
  id: string;
  name: string;
  email: string;
  role: string;
  permission: string;
  status: string;
  lastAccess?: string | Date | null;
}

const emptyForm = {
  name: "",
  email: "",
  role: "Atendimento",
  permission: "Atendente",
  status: "invited"
};

export function TeamClient({ members }: { members: TeamMemberItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMemberItem | null>(null);
  const [deleting, setDeleting] = useState<TeamMemberItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setOpen(true);
  }

  function openEdit(member: TeamMemberItem) {
    setEditing(member);
    setForm({
      name: member.name,
      email: member.email,
      role: member.role,
      permission: member.permission,
      status: member.status
    });
    setError("");
    setOpen(true);
  }

  async function saveMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch(editing ? `/api/team/${editing.id}` : "/api/team", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível salvar o membro.");
      return;
    }

    setOpen(false);
    router.refresh();
  }

  async function deleteMember() {
    if (!deleting) return;
    setLoading(true);
    const response = await fetch(`/api/team/${deleting.id}`, { method: "DELETE" });
    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível remover o membro.");
      return;
    }

    setDeleting(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Equipe" subtitle="Gerencie membros, funções e permissões" actions={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Convidar membro</Button>} />
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-white/5 text-slate-400"><tr>{["Nome", "E-mail", "Cargo", "Permissão", "Status", "Último acesso", "Ações"].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr></thead>
          <tbody>{members.map((member) => <tr key={member.id} className="border-t border-white/10"><td className="px-5 py-4 font-semibold text-white">{member.name}</td><td className="px-5 py-4 text-slate-400">{member.email}</td><td className="px-5 py-4">{member.role}</td><td className="px-5 py-4"><Badge>{member.permission}</Badge></td><td className="px-5 py-4 text-primary">{member.status}</td><td className="px-5 py-4 text-slate-400">{member.lastAccess ? new Date(member.lastAccess).toLocaleString("pt-BR") : "Nunca"}</td><td className="px-5 py-4"><div className="flex gap-2"><Button variant="ghost" className="px-3" onClick={() => openEdit(member)}><Pencil className="h-4 w-4" /></Button><Button variant="danger" className="px-3" onClick={() => setDeleting(member)}><Trash2 className="h-4 w-4" /></Button></div></td></tr>)}</tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Editar membro" : "Convidar membro"}>
        <form className="grid gap-4" onSubmit={saveMember}>
          <label className="grid gap-2 text-sm text-slate-300">Nome<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">E-mail<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Cargo<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Permissão<select className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.permission} onChange={(event) => setForm((current) => ({ ...current, permission: event.target.value }))}><option>Dono</option><option>Administrador</option><option>Atendente</option><option>Visualizador</option></select></label>
          <label className="grid gap-2 text-sm text-slate-300">Status<select className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}><option value="active">Ativo</option><option value="invited">Convidado</option><option value="inactive">Inativo</option></select></label>
          {error ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
          <Button className="justify-self-end" disabled={loading}>{loading ? "Salvando..." : "Salvar membro"}</Button>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} title={deleting ? `Remover ${deleting.name}?` : "Remover membro?"} onConfirm={deleteMember} loading={loading} />
    </div>
  );
}
