import { NextResponse } from "next/server";
import { z } from "zod";
import { generateAgentAnswer } from "@/services/ai/agent-runtime";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const testSchema = z.object({
  message: z.string().min(1)
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = testSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Mensagem inválida." }, { status: 400 });

  const agent = await prisma.agent.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!agent) return NextResponse.json({ error: "Agente não encontrado." }, { status: 404 });

  const result = await generateAgentAnswer({
    agentId: agent.id,
    model: agent.model,
    message: payload.data.message,
    apiKey: process.env.OPENAI_API_KEY
  });

  return NextResponse.json({ answer: result.answer, provider: result.provider });
}
