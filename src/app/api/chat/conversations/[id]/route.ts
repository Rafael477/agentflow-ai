import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getWorkspaceConversations } from "@/lib/chat-conversations";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const actionSchema = z.object({
  action: z.enum(["assign", "resolve", "close"])
});

const actionConfig = {
  assign: {
    status: "in_progress",
    message: "Atendimento assumido por humano."
  },
  resolve: {
    status: "resolved",
    message: "Atendimento marcado como resolvido."
  },
  close: {
    status: "closed",
    message: "Atendimento encerrado."
  }
} as const;

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = actionSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Ação inválida." }, { status: 400 });

  const conversation = await prisma.conversation.findFirst({
    where: { id: params.id, workspaceId: workspace.id }
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversa não encontrada." }, { status: 404 });
  }

  const session = await getServerSession(authOptions);
  const assignedTo = payload.data.action === "assign"
    ? session?.user?.name ?? session?.user?.email ?? "Atendente"
    : conversation.assignedTo;

  const config = actionConfig[payload.data.action];

  await prisma.$transaction([
    prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        status: config.status,
        assignedTo,
        updatedAt: new Date()
      }
    }),
    prisma.message.create({
      data: {
        conversationId: conversation.id,
        sender: "SYSTEM",
        content: config.message
      }
    })
  ]);

  const conversations = await getWorkspaceConversations(workspace.id);
  return NextResponse.json({ conversations });
}
