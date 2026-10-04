import Link from "next/link";
import { Plus } from "lucide-react";
import { AgentCard } from "@/components/agents/agent-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { mapAgent } from "@/lib/mappers";
import { agents as mockAgents } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

type AgentStatusFilter = "all" | "active" | "inactive";

async function getAgents(status: AgentStatusFilter) {
  try {
    const workspace = await getCurrentUserWorkspace();
    if (!workspace) {
      if (status === "all") return mockAgents;
      return mockAgents.filter((agent) => agent.status === status);
    }

    const agents = await prisma.agent.findMany({
      where: {
        workspaceId: workspace.id,
        status: status === "all" ? undefined : status === "active" ? "ACTIVE" : "INACTIVE"
      },
      orderBy: { createdAt: "desc" }
    });
    return agents.map(mapAgent);
  } catch {
    if (status === "all") return mockAgents;
    return mockAgents.filter((agent) => agent.status === status);
  }
}

const tabs: Array<{ label: string; value: AgentStatusFilter; href: string }> = [
  { label: "Todos", value: "all", href: "/agents" },
  { label: "Ativos", value: "active", href: "/agents?status=active" },
  { label: "Inativos", value: "inactive", href: "/agents?status=inactive" }
];

export default async function AgentsPage({ searchParams }: { searchParams?: { status?: string } }) {
  const selectedStatus = searchParams?.status === "active" || searchParams?.status === "inactive" ? searchParams.status : "all";
  const agents = await getAgents(selectedStatus);

  return (
    <div className="space-y-6">
      <PageHeader title="Agentes" subtitle="Crie, treine e gerencie seus agentes de IA" actions={<Link href="/agents/new"><Button><Plus className="mr-2 h-4 w-4" />Criar agente</Button></Link>} />
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.href}
            className={selectedStatus === tab.value ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-slate-950" : "rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300"}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="space-y-4">
        {agents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
      </div>
    </div>
  );
}
