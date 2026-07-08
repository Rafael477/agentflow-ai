"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Modal } from "@/components/modals/modal";
import { Button } from "@/components/ui/button";
import type { Channel } from "@/types/domain";

export function ChannelRowActions({ channel }: { channel: Channel }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: channel.name,
    type: channel.type,
    identifier: channel.identifier === "Não definido" ? "" : channel.identifier,
    department: channel.department
  });

  async function updateChannel(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch(`/api/channels/${channel.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        identifier: form.identifier || undefined
      })
    });

    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível atualizar o canal.");
      return;
    }

    setEditOpen(false);
    router.refresh();
  }

  async function deleteChannel() {
    setLoading(true);
    const response = await fetch(`/api/channels/${channel.id}`, { method: "DELETE" });
    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível excluir o canal.");
      return;
    }

    setDeleteOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setEditOpen(true)}>
        <Pencil className="mr-2 h-4 w-4" />
        Editar
      </Button>
      <Button variant="danger" onClick={() => setDeleteOpen(true)}>
        <Trash2 className="h-4 w-4" />
      </Button>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar canal">
        <form className="grid gap-4" onSubmit={updateChannel}>
          <label className="grid gap-2 text-sm text-slate-300">Nome<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Tipo<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Identificador<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.identifier} onChange={(event) => setForm((current) => ({ ...current, identifier: event.target.value }))} placeholder="Ex.: +55 11 99999-0000" /></label>
          <label className="grid gap-2 text-sm text-slate-300">Departamento<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))} required /></label>
          {error ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
          <Button className="justify-self-end" disabled={loading}>{loading ? "Salvando..." : "Salvar alterações"}</Button>
        </form>
      </Modal>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} title={`Excluir canal ${channel.name}?`} onConfirm={deleteChannel} loading={loading} />
    </>
  );
}
