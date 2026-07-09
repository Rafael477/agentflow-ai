"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Modal } from "@/components/modals/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface BillingTransaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string | Date;
}

const plans = [
  { name: "Starter", description: "1 agente • 1 canal • 1.000 créditos" },
  { name: "Pro", description: "5 agentes • 5 canais • 10.000 créditos" },
  { name: "Business", description: "Agentes ilimitados • canais ilimitados • 50.000 créditos" }
] as const;

export function BillingClient({ credits, currentPlan, transactions }: { credits: number; currentPlan?: string | null; transactions: BillingTransaction[] }) {
  const router = useRouter();
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [amount, setAmount] = useState(1000);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  async function buyCredits(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading("credits");
    setError("");

    const response = await fetch("/api/billing/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });

    setLoading("");

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível comprar créditos.");
      return;
    }

    setCreditsOpen(false);
    router.refresh();
  }

  async function selectPlan(name: string) {
    setLoading(name);
    setError("");

    const response = await fetch("/api/billing/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    setLoading("");

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível selecionar o plano.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Faturamento" subtitle="Controle planos, assinatura, créditos e histórico" actions={<Button onClick={() => setCreditsOpen(true)}>Comprar créditos</Button>} />
      {error ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card><p className="text-sm text-slate-400">Créditos disponíveis</p><p className="mt-3 text-4xl font-bold text-white">{credits}</p><Badge className="mt-4">Assinatura atual: {currentPlan ?? "Sem plano"}</Badge></Card>
        {plans.map((plan) => <Card key={plan.name}><h2 className="font-semibold text-white">{plan.name}</h2><p className="mt-2 text-sm text-slate-400">{plan.description}</p><Button className="mt-5 w-full" disabled={Boolean(loading)} onClick={() => selectPlan(plan.name)}>{loading === plan.name ? "Selecionando..." : currentPlan === plan.name ? "Plano atual" : "Selecionar plano"}</Button></Card>)}
      </div>
      <Card><h2 className="font-semibold text-white">Histórico de consumo</h2><div className="mt-4 space-y-3">{transactions.length === 0 ? <p className="text-sm text-slate-400">Nenhuma transação ainda.</p> : null}{transactions.map((transaction) => <div key={transaction.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/5 p-3 text-sm"><span className="text-slate-300">{transaction.description}</span><span className={transaction.amount > 0 ? "text-primary" : "text-rose-200"}>{transaction.amount > 0 ? "+" : ""}{transaction.amount} créditos</span></div>)}</div></Card>

      <Modal open={creditsOpen} onClose={() => setCreditsOpen(false)} title="Comprar créditos">
        <form className="grid gap-4" onSubmit={buyCredits}>
          <label className="grid gap-2 text-sm text-slate-300">Quantidade<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" min={100} max={100000} type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} required /></label>
          <Button className="justify-self-end" disabled={loading === "credits"}>{loading === "credits" ? "Processando..." : "Adicionar créditos"}</Button>
        </form>
      </Modal>
    </div>
  );
}
