import { notFound } from "next/navigation";
import { AgentDetailClient, type AgentDetailView } from "@/components/agents/agent-detail-client";
import { agents as mockAgents } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

function getMockAgent(id: string): AgentDetailView {
  const agent = mockAgents[0];
  return {
    id,
    name: agent.name,
    description: agent.description,
    model: agent.model,
    communicationStyle: agent.communication,
    behavior: "Atenda clientes com simpatia e profissionalismo, apresentando serviços, valores e opções de agendamento.",
    status: "ACTIVE",
    trainings: [],
    intents: [],
    knowledgeBases: []
  };
}

async function getAgent(id: string): Promise<AgentDetailView | null> {
  try {
    const workspace = await getCurrentUserWorkspace();
    if (!workspace) return getMockAgent(id);

    const [agent, knowledgeBases] = await Promise.all([
      prisma.agent.findFirst({
        where: { id, workspaceId: workspace.id },
        include: {
          trainings: { orderBy: { createdAt: "desc" } },
          intents: { orderBy: { createdAt: "desc" } }
        }
      }),
      prisma.knowledgeBase.findMany({
        where: { workspaceId: workspace.id },
        include: { _count: { select: { items: true } } },
        orderBy: { createdAt: "desc" }
      })
    ]);

    if (!agent) return null;

    return {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      model: agent.model,
      communicationStyle: agent.communicationStyle,
      behavior: agent.behavior,
      status: agent.status,
      trainings: agent.trainings.map((training) => ({
        id: training.id,
        title: training.title,
        type: training.type,
        content: training.content,
        status: training.status
      })),
      intents: agent.intents.map((intent) => ({
        id: intent.id,
        name: intent.name,
        description: intent.description,
        triggers: intent.triggers,
        action: intent.action,
        webhookUrl: intent.webhookUrl,
        method: intent.method
      })),
      knowledgeBases: knowledgeBases.map((base) => ({
        id: base.id,
        name: base.name,
        itemsCount: base._count.items
      }))
    };
  } catch {
    return getMockAgent(id);
  }
}

export default async function AgentDetailPage({ params }: { params: { id: string } }) {
  const agent = await getAgent(params.id);
  if (!agent) notFound();

  return <AgentDetailClient agent={agent} />;
}
