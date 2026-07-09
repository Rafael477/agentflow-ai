import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

export async function POST(_: Request, { params }: { params: { id: string; knowledgeBaseId: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const [agent, knowledgeBase] = await Promise.all([
    prisma.agent.findFirst({ where: { id: params.id, workspaceId: workspace.id } }),
    prisma.knowledgeBase.findFirst({
      where: { id: params.knowledgeBaseId, workspaceId: workspace.id },
      include: { items: { orderBy: { createdAt: "asc" } } }
    })
  ]);

  if (!agent) return NextResponse.json({ error: "Agente não encontrado." }, { status: 404 });
  if (!knowledgeBase) return NextResponse.json({ error: "Base de conhecimento não encontrada." }, { status: 404 });

  const content = knowledgeBase.items.length > 0
    ? knowledgeBase.items.map((item) => [
        `Categoria: ${item.category}`,
        `Pergunta: ${item.question}`,
        `Resposta: ${item.answer}`
      ].join("\n")).join("\n\n---\n\n")
    : `Base de conhecimento: ${knowledgeBase.name}\n${knowledgeBase.description ?? ""}`;

  const training = await prisma.agentTraining.create({
    data: {
      agentId: agent.id,
      title: `Base: ${knowledgeBase.name}`,
      type: "Base de conhecimento",
      content,
      status: "trained"
    }
  });

  return NextResponse.json({ training }, { status: 201 });
}
