"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Modal } from "@/components/modals/modal";
import { Button } from "@/components/ui/button";
import type { Contact } from "@/types/domain";

export function ContactRowActions({ contact }: { contact: Contact }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: contact.name,
    phone: contact.phone === "Não informado" ? "" : contact.phone,
    email: contact.email === "Não informado" ? "" : contact.email,
    channel: contact.channel === "Não definido" ? "" : contact.channel,
    status: contact.status
  });

  async function updateContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch(`/api/contacts/${contact.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone || undefined,
        email: form.email || undefined,
        channel: form.channel || undefined,
        status: form.status
      })
    });

    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível atualizar o contato.");
      return;
    }

    setEditOpen(false);
    router.refresh();
  }

  async function deleteContact() {
    setLoading(true);
    const response = await fetch(`/api/contacts/${contact.id}`, { method: "DELETE" });
    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível excluir o contato.");
      return;
    }

    setDeleteOpen(false);
    router.refresh();
  }

  return (
    <>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => setEditOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Button>
        <Button variant="danger" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar contato">
        <form className="grid gap-4" onSubmit={updateContact}>
          <label className="grid gap-2 text-sm text-slate-300">Nome<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Telefone<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} /></label>
          <label className="grid gap-2 text-sm text-slate-300">E-mail<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></label>
          <label className="grid gap-2 text-sm text-slate-300">Canal<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.channel} onChange={(event) => setForm((current) => ({ ...current, channel: event.target.value }))} /></label>
          <label className="grid gap-2 text-sm text-slate-300">Status<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} required /></label>
          {error ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
          <Button className="justify-self-end" disabled={loading}>{loading ? "Salvando..." : "Salvar alterações"}</Button>
        </form>
      </Modal>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} title={`Excluir contato ${contact.name}?`} onConfirm={deleteContact} loading={loading} />
    </>
  );
}
