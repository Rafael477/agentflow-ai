import { KnowledgeBaseClient, type KnowledgeBaseView } from "@/components/knowledge-base/knowledge-base-client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const fallbackBases: KnowledgeBaseView[] = [
  {
    id: "base-demo",
    name: "Serviços Fotográficos",
    description: "FAQ inicial",
    items: [
      {
        id: "item-demo",
        category: "Serviços Fotográficos",
        question: "Vocês fazem ensaio externo?",
        answer: "Sim, fazemos ensaios externos mediante agendamento prévio e análise do local.",
        status: "trained"
      }
    ]
  }
];

async function getBases(): Promise<KnowledgeBaseView[]> {
  try {
    const workspace = await getCurrentUserWorkspace();
    if (!workspace) return fallbackBases;

    const bases = await prisma.knowledgeBase.findMany({
      where: { workspaceId: workspace.id },
      include: { items: { orderBy: { createdAt: "desc" } } },
      orderBy: { createdAt: "desc" }
    });

    return bases;
  } catch {
    return fallbackBases;
  }
}

export default async function KnowledgeBasePage() {
  const bases = await getBases();
  return <KnowledgeBaseClient bases={bases} />;
}
