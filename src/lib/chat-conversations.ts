import { prisma } from "@/lib/prisma";
import { mapConversation } from "@/lib/mappers";
import type { ConversationSummary } from "@/types/domain";

export async function getWorkspaceConversations(workspaceId: string): Promise<ConversationSummary[]> {
  const conversations = await prisma.conversation.findMany({
    where: { workspaceId },
    include: {
      contact: { select: { name: true } },
      channel: { select: { name: true, department: true, config: { select: { settings: true } } } },
      agent: { select: { name: true } },
      messages: { orderBy: { createdAt: "asc" } }
    },
    orderBy: { updatedAt: "desc" }
  });

  return conversations.map(mapConversation);
}

export function createConversationSignature(conversations: ConversationSummary[]): string {
  return conversations
    .map((conversation) => {
      const lastMessageId = conversation.messages.at(-1)?.id ?? "empty";
      const sla = conversation.slaThresholds;
      return `${conversation.id}:${conversation.status}:${conversation.assignedTo ?? ""}:${lastMessageId}:${conversation.messages.length}:${sla.warning}:${sla.urgent}:${sla.critical}`;
    })
    .join("|");
}
