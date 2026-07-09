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

export interface AppointmentItem {
  id: string;
  contactId?: string | null;
  agentId?: string | null;
  contactName: string;
  service: string;
  date: string;
  status: string;
  notes?: string | null;
}

export interface SelectOption {
  id: string;
  name: string;
}

function toInputDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

const emptyForm = {
  contactId: "",
  agentId: "",
  service: "",
  date: "",
  status: "Agendado",
  notes: ""
};

export function AppointmentsClient({ appointments, contacts, agents }: { appointments: AppointmentItem[]; contacts: SelectOption[]; agents: SelectOption[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AppointmentItem | null>(null);
  const [deleting, setDeleting] = useState<AppointmentItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setOpen(true);
  }

  function openEdit(appointment: AppointmentItem) {
    setEditing(appointment);
    setForm({
      contactId: appointment.contactId ?? "",
      agentId: appointment.agentId ?? "",
      service: appointment.service,
      date: toInputDate(appointment.date),
      status: appointment.status,
      notes: appointment.notes ?? ""
    });
    setError("");
    setOpen(true);
  }

  async function saveAppointment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      contactId: form.contactId || undefined,
      agentId: form.agentId || undefined,
      notes: form.notes || undefined,
      date: new Date(form.date).toISOString()
    };

    const response = await fetch(editing ? `/api/appointments/${editing.id}` : "/api/appointments", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível salvar o agendamento.");
      return;
    }

    setOpen(false);
    router.refresh();
  }

  async function deleteAppointment() {
    if (!deleting) return;
    setLoading(true);
    const response = await fetch(`/api/appointments/${deleting.id}`, { method: "DELETE" });
    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível excluir o agendamento.");
      return;
    }

    setDeleting(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Atendimentos" subtitle="Agendamentos vinculados a contatos e agentes" actions={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Criar agendamento</Button>} />
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-white/5 text-slate-400"><tr>{["Cliente", "Serviço", "Data", "Hora", "Status", "Ações"].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr></thead>
          <tbody>
            {appointments.map((appointment) => {
              const date = new Date(appointment.date);
              return (
                <tr key={appointment.id} className="border-t border-white/10">
                  <td className="px-5 py-4 font-semibold text-white">{appointment.contactName}</td>
                  <td className="px-5 py-4">{appointment.service}</td>
                  <td className="px-5 py-4">{date.toLocaleDateString("pt-BR")}</td>
                  <td className="px-5 py-4">{date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="px-5 py-4"><Badge>{appointment.status}</Badge></td>
                  <td className="px-5 py-4"><div className="flex gap-2"><Button variant="ghost" className="px-3" onClick={() => openEdit(appointment)}><Pencil className="h-4 w-4" /></Button><Button variant="danger" className="px-3" onClick={() => setDeleting(appointment)}><Trash2 className="h-4 w-4" /></Button></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Editar agendamento" : "Criar agendamento"}>
        <form className="grid gap-4" onSubmit={saveAppointment}>
          <label className="grid gap-2 text-sm text-slate-300">Contato<select className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.contactId} onChange={(event) => setForm((current) => ({ ...current, contactId: event.target.value }))}><option value="">Sem contato</option>{contacts.map((contact) => <option key={contact.id} value={contact.id}>{contact.name}</option>)}</select></label>
          <label className="grid gap-2 text-sm text-slate-300">Agente<select className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.agentId} onChange={(event) => setForm((current) => ({ ...current, agentId: event.target.value }))}><option value="">Sem agente</option>{agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}</select></label>
          <label className="grid gap-2 text-sm text-slate-300">Serviço<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.service} onChange={(event) => setForm((current) => ({ ...current, service: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Data e hora<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" type="datetime-local" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Status<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Observações<textarea className="min-h-24 rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} /></label>
          {error ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
          <Button className="justify-self-end" disabled={loading}>{loading ? "Salvando..." : "Salvar agendamento"}</Button>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} title={deleting ? `Excluir agendamento de ${deleting.contactName}?` : "Excluir agendamento?"} onConfirm={deleteAppointment} loading={loading} />
    </div>
  );
}
