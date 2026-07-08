"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Power, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Modal } from "@/components/modals/modal";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/types/domain";

type AgentUpdatePayload = {
  name?: string;
  description?: string;
  model?: string;
  status?: "ACTIVE" | "INACTIVE";
};

export function AgentActions({ agent }: { agent: Agent }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: agent.name,
    description: agent.description,
    model: agent.model
  });

  async function updateAgent(payload: AgentUpdatePayload = form) {
    setLoading(true);
    setError("");

    const response = await fetch(`/api/agents/${agent.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível atualizar o agente.");
      return;
    }

    setEditOpen(false);
    router.refresh();
  }

  async function toggleStatus() {
    await updateAgent({ status: agent.status === "active" ? "INACTIVE" : "ACTIVE" });
  }

  async function deleteAgent() {
    setLoading(true);
    const response = await fetch(`/api/agents/${agent.id}`, { method: "DELETE" });
    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível excluir o agente.");
      return;
    }

    setDeleteOpen(false);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Link href={`/agents/${agent.id}`}>
          <Button variant="secondary">
            <Pencil className="mr-2 h-4 w-4" />
            Abrir
          </Button>
        </Link>
        <Button variant="ghost" onClick={() => setEditOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Button>
        <Button variant="ghost" onClick={toggleStatus} disabled={loading}>
          <Power className="mr-2 h-4 w-4" />
          {agent.status === "active" ? "Desativar" : "Ativar"}
        </Button>
        <Button variant="danger" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar agente">
        <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); void updateAgent(); }}>
          <label className="grid gap-2 text-sm text-slate-300">Nome<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Descrição<textarea className="min-h-28 rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Modelo<select className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.model} onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))}><option>GPT-5 Mini</option><option>OpenRouter</option><option>Groq</option><option>Gemini</option></select></label>
          {error ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
          <Button className="justify-self-end" disabled={loading}>{loading ? "Salvando..." : "Salvar alterações"}</Button>
        </form>
      </Modal>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} title={`Excluir agente ${agent.name}?`} onConfirm={deleteAgent} loading={loading} />
    </>
  );
}
