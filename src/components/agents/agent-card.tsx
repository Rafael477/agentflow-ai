import type { Agent } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AgentActions } from "@/components/agents/agent-actions";

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Card className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-xl font-black text-slate-950">JH</div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-semibold text-white">{agent.name}</h2>
          <Badge className={agent.status === "active" ? "border-primary/30 bg-primary/10 text-primary" : "border-slate-500/30 text-slate-400"}>
            {agent.status === "active" ? "Ativo" : "Inativo"}
          </Badge>
          <Badge>{agent.model}</Badge>
        </div>
        <p className="mt-1 text-sm text-slate-400">{agent.description}</p>
      </div>
      <AgentActions agent={agent} />
    </Card>
  );
}
