import Link from "next/link";
import { Plus } from "lucide-react";
import { AgentCard } from "@/components/agents/agent-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { agents } from "@/lib/mock-data";

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Agentes" subtitle="Crie, treine e gerencie seus agentes de IA" actions={<Link href="/agents/new"><Button><Plus className="mr-2 h-4 w-4" />Criar agente</Button></Link>} />
      <div className="flex gap-2">
        {["Todos", "Ativos", "Inativos"].map((tab, index) => (
          <button key={tab} className={index === 0 ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-slate-950" : "rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300"}>{tab}</button>
        ))}
      </div>
      <div className="space-y-4">
        {agents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
      </div>
    </div>
  );
}
