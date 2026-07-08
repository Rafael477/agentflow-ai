import { NextResponse } from "next/server";
import { z } from "zod";
import { generateAgentAnswer } from "@/services/ai/agent-runtime";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const sendMessageSchema = z.object({
  conversationId: z.string(),
  message: z.string().min(1)
});

export async function POST(request: Request) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = sendMessageSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const conversation = await prisma.conversation.findFirst({
    where: { id: payload.data.conversationId, workspaceId: workspace.id },
    include: { agent: true }
  });

  if (!conversation?.agent) {
    return NextResponse.json({ error: "Conversa ou agente não encontrado." }, { status: 404 });
  }

  const customerMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "CUSTOMER",
      content: payload.data.message
    }
  });

  const result = await generateAgentAnswer({
    agentId: conversation.agent.id,
    model: conversation.agent.model,
    message: payload.data.message,
    apiKey: process.env.OPENAI_API_KEY
  });

  const agentMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "AGENT",
      content: result.answer,
      metadata: { provider: result.provider }
    }
  });

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: { credits: { decrement: result.creditsUsed } }
  });

  await prisma.creditTransaction.create({
    data: {
      workspaceId: workspace.id,
      agentId: conversation.agent.id,
      amount: -result.creditsUsed,
      type: "usage",
      description: "Resposta do agente em conversa"
    }
  });

  return NextResponse.json({ customerMessage, agentMessage, creditsUsed: result.creditsUsed });
}
