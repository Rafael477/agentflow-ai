import { NextResponse } from "next/server";
import { mapConversation } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

export async function GET() {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const conversations = await prisma.conversation.findMany({
    where: { workspaceId: workspace.id },
    include: {
      contact: { select: { name: true } },
      channel: { select: { name: true } },
      agent: { select: { name: true } },
      messages: { orderBy: { createdAt: "asc" } }
    },
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json({ conversations: conversations.map(mapConversation) });
}
