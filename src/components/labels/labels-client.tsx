"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { Modal } from "@/components/modals/modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface LabelItem {
  id: string;
  name: string;
  color: string;
}

const defaultForm = { name: "", color: "#14B8A6" };

export function LabelsClient({ labels }: { labels: LabelItem[] }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<LabelItem | null>(null);
  const [deleting, setDeleting] = useState<LabelItem | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function openEdit(label: LabelItem) {
    setEditing(label);
    setForm({ name: label.name, color: label.color });
    setError("");
  }

  function openCreate() {
    setForm(defaultForm);
    setError("");
    setCreateOpen(true);
  }

  async function saveLabel(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch(editing ? `/api/labels/${editing.id}` : "/api/labels", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível salvar a etiqueta.");
      return;
    }

    setCreateOpen(false);
    setEditing(null);
    router.refresh();
  }

  async function deleteLabel() {
    if (!deleting) return;

    setLoading(true);
    const response = await fetch(`/api/labels/${deleting.id}`, { method: "DELETE" });
    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível excluir a etiqueta.");
      return;
    }

    setDeleting(null);
    router.refresh();
  }

  const modalOpen = createOpen || Boolean(editing);

  return (
    <div className="space-y-6">
      <PageHeader title="Etiquetas" subtitle="Organize contatos e conversas por estágio" actions={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Criar etiqueta</Button>} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {labels.length === 0 ? <Card className="text-sm text-slate-400">Nenhuma etiqueta criada ainda.</Card> : null}
        {labels.map((label) => (
          <Card key={label.id} className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="h-4 w-4 rounded-full" style={{ backgroundColor: label.color }} />
              <span className="truncate font-medium text-white">{label.name}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" className="px-3" onClick={() => openEdit(label)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="danger" className="px-3" onClick={() => setDeleting(label)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => { setCreateOpen(false); setEditing(null); }} title={editing ? "Editar etiqueta" : "Criar etiqueta"}>
        <form className="grid gap-4" onSubmit={saveLabel}>
          <label className="grid gap-2 text-sm text-slate-300">
            Nome
            <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            Cor
            <input className="h-12 rounded-xl border border-white/10 bg-panel p-2 outline-none" type="color" value={form.color} onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))} />
          </label>
          {error ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
          <Button className="justify-self-end" disabled={loading}>{loading ? "Salvando..." : "Salvar etiqueta"}</Button>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} title={deleting ? `Excluir etiqueta ${deleting.name}?` : "Excluir etiqueta?"} onConfirm={deleteLabel} loading={loading} />
    </div>
  );
}
