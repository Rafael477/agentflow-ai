"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { Modal } from "@/components/modals/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface KnowledgeItemView {
  id: string;
  category: string;
  question: string;
  answer: string;
  status: string;
}

export interface KnowledgeBaseView {
  id: string;
  name: string;
  description?: string | null;
  items: KnowledgeItemView[];
}

export function KnowledgeBaseClient({ bases }: { bases: KnowledgeBaseView[] }) {
  const router = useRouter();
  const [baseOpen, setBaseOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [selectedBaseId, setSelectedBaseId] = useState(bases[0]?.id ?? "");
  const [deleting, setDeleting] = useState<KnowledgeItemView | null>(null);
  const [baseForm, setBaseForm] = useState({ name: "", description: "" });
  const [itemForm, setItemForm] = useState({ category: "", question: "", answer: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedBase = bases.find((base) => base.id === selectedBaseId) ?? bases[0];

  async function createBase(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/knowledge-bases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(baseForm)
    });

    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível criar a base.");
      return;
    }

    setBaseOpen(false);
    router.refresh();
  }

  async function createItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedBase) return;

    setLoading(true);
    setError("");

    const response = await fetch(`/api/knowledge-bases/${selectedBase.id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...itemForm, status: "trained" })
    });

    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível criar o item.");
      return;
    }

    setItemOpen(false);
    setItemForm({ category: "", question: "", answer: "" });
    router.refresh();
  }

  async function deleteItem() {
    if (!deleting) return;
    setLoading(true);
    const response = await fetch(`/api/knowledge-items/${deleting.id}`, { method: "DELETE" });
    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível excluir o item.");
      return;
    }

    setDeleting(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Base de conhecimento" subtitle="Crie categorias, perguntas, respostas e arquivos para treinamento" actions={<><Button onClick={() => setBaseOpen(true)}>Criar base</Button><Button variant="secondary" onClick={() => setItemOpen(true)}><Upload className="mr-2 h-4 w-4" />Adicionar conteúdo</Button></>} />
      {error ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card><h2 className="font-semibold text-white">Bases</h2><div className="mt-4 space-y-2">{bases.length === 0 ? <p className="text-sm text-slate-400">Crie sua primeira base.</p> : null}{bases.map((base) => <button key={base.id} className={selectedBase?.id === base.id ? "block w-full rounded-lg bg-primary/15 px-3 py-2 text-left text-sm font-medium text-primary" : "block w-full rounded-lg bg-white/5 px-3 py-2 text-left text-sm text-slate-300"} onClick={() => setSelectedBaseId(base.id)} type="button">{base.name}</button>)}</div></Card>
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold text-white">{selectedBase?.name ?? "Perguntas e respostas"}</h2>
            <Button disabled={!selectedBase} onClick={() => setItemOpen(true)}><Plus className="mr-2 h-4 w-4" />Novo item</Button>
          </div>
          <div className="mt-4 space-y-4">
            {selectedBase?.items.length === 0 ? <p className="text-sm text-slate-400">Nenhuma pergunta cadastrada nesta base.</p> : null}
            {selectedBase?.items.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-400">Categoria: {item.category}</p>
                    <p className="mt-2 font-semibold text-white">{item.question}</p>
                  </div>
                  <Button variant="danger" className="px-3" onClick={() => setDeleting(item)}><Trash2 className="h-4 w-4" /></Button>
                </div>
                <p className="mt-2 text-sm text-slate-300">{item.answer}</p>
                <Badge className="mt-3 border-primary/30 bg-primary/10 text-primary">{item.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal open={baseOpen} onClose={() => setBaseOpen(false)} title="Criar base">
        <form className="grid gap-4" onSubmit={createBase}>
          <label className="grid gap-2 text-sm text-slate-300">Nome<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={baseForm.name} onChange={(event) => setBaseForm((current) => ({ ...current, name: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Descrição<textarea className="min-h-24 rounded-xl border border-white/10 bg-panel p-3 outline-none" value={baseForm.description} onChange={(event) => setBaseForm((current) => ({ ...current, description: event.target.value }))} /></label>
          <Button className="justify-self-end" disabled={loading}>{loading ? "Criando..." : "Salvar base"}</Button>
        </form>
      </Modal>

      <Modal open={itemOpen} onClose={() => setItemOpen(false)} title="Adicionar conteúdo">
        <form className="grid gap-4" onSubmit={createItem}>
          <label className="grid gap-2 text-sm text-slate-300">Categoria<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={itemForm.category} onChange={(event) => setItemForm((current) => ({ ...current, category: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Pergunta<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={itemForm.question} onChange={(event) => setItemForm((current) => ({ ...current, question: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Resposta<textarea className="min-h-32 rounded-xl border border-white/10 bg-panel p-3 outline-none" value={itemForm.answer} onChange={(event) => setItemForm((current) => ({ ...current, answer: event.target.value }))} required /></label>
          <Button className="justify-self-end" disabled={loading || !selectedBase}>{loading ? "Salvando..." : "Salvar conteúdo"}</Button>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} title={deleting ? `Excluir "${deleting.question}"?` : "Excluir item?"} onConfirm={deleteItem} loading={loading} />
    </div>
  );
}
