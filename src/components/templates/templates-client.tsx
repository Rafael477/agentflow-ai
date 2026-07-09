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

export interface TemplateItem {
  id: string;
  name: string;
  category: string;
  language: string;
  body: string;
  variables: string[];
  status: string;
}

const emptyForm = {
  name: "",
  category: "Utilidade",
  language: "pt_BR",
  body: "",
  variablesText: "",
  status: "draft"
};

export function TemplatesClient({ templates }: { templates: TemplateItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateItem | null>(null);
  const [deleting, setDeleting] = useState<TemplateItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setOpen(true);
  }

  function openEdit(template: TemplateItem) {
    setEditing(template);
    setForm({
      name: template.name,
      category: template.category,
      language: template.language,
      body: template.body,
      variablesText: template.variables.join(", "),
      status: template.status
    });
    setError("");
    setOpen(true);
  }

  async function saveTemplate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: form.name,
      category: form.category,
      language: form.language,
      body: form.body,
      variables: form.variablesText.split(",").map((item) => item.trim()).filter(Boolean),
      status: form.status
    };

    const response = await fetch(editing ? `/api/templates/${editing.id}` : "/api/templates", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível salvar o template.");
      return;
    }

    setOpen(false);
    router.refresh();
  }

  async function deleteTemplate() {
    if (!deleting) return;
    setLoading(true);
    const response = await fetch(`/api/templates/${deleting.id}`, { method: "DELETE" });
    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível excluir o template.");
      return;
    }

    setDeleting(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Templates WhatsApp" subtitle="Gerencie modelos de mensagem e variáveis" actions={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Criar template</Button>} />
      <Card className="space-y-4">
        {templates.length === 0 ? <p className="text-sm text-slate-400">Nenhum template criado ainda.</p> : null}
        {templates.map((template) => (
          <div key={template.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="font-semibold text-white">{template.name}</h2><p className="text-sm text-slate-400">Categoria: {template.category} • Idioma: {template.language}</p></div>
              <div className="flex items-center gap-2">
                <Badge className="border-primary/30 bg-primary/10 text-primary">{template.status}</Badge>
                <Button variant="ghost" className="px-3" onClick={() => openEdit(template)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="danger" className="px-3" onClick={() => setDeleting(template)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <p className="mt-4 rounded-lg bg-panel p-3 text-sm text-slate-300">{template.body}</p>
          </div>
        ))}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Editar template" : "Criar template"}>
        <form className="grid gap-4" onSubmit={saveTemplate}>
          <label className="grid gap-2 text-sm text-slate-300">Nome<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required /></label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-300">Categoria<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} required /></label>
            <label className="grid gap-2 text-sm text-slate-300">Idioma<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.language} onChange={(event) => setForm((current) => ({ ...current, language: event.target.value }))} required /></label>
          </div>
          <label className="grid gap-2 text-sm text-slate-300">Mensagem<textarea className="min-h-32 rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.body} onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Variáveis<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.variablesText} onChange={(event) => setForm((current) => ({ ...current, variablesText: event.target.value }))} placeholder="nome, data, hora" /></label>
          <label className="grid gap-2 text-sm text-slate-300">Status<select className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}><option value="draft">Rascunho</option><option value="approved">Aprovado</option><option value="paused">Pausado</option></select></label>
          {error ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
          <Button className="justify-self-end" disabled={loading}>{loading ? "Salvando..." : "Salvar template"}</Button>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} title={deleting ? `Excluir template ${deleting.name}?` : "Excluir template?"} onConfirm={deleteTemplate} loading={loading} />
    </div>
  );
}
