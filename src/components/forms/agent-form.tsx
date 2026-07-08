"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AgentForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState("GPT-5 Mini");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, model })
    });

    const body = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(body?.error ?? "Não foi possível criar o agente.");
      return;
    }

    router.push("/agents");
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm text-slate-300">
        Nome do agente
        <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="Ex.: Jéssica Helen" value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label className="grid gap-2 text-sm text-slate-300">
        Descrição
        <textarea className="min-h-28 rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="Descreva a função do agente" value={description} onChange={(event) => setDescription(event.target.value)} required />
      </label>
      <label className="grid gap-2 text-sm text-slate-300">
        Modelo
        <select className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={model} onChange={(event) => setModel(event.target.value)}>
          <option>GPT-5 Mini</option>
          <option>OpenRouter</option>
          <option>Groq</option>
          <option>Gemini</option>
        </select>
      </label>
      {error ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
      <Button className="justify-self-start" disabled={loading}>{loading ? "Salvando..." : "Salvar agente"}</Button>
    </form>
  );
}
