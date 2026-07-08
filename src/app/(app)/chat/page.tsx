import { ChatLayout } from "@/components/chat/chat-layout";
import { PageHeader } from "@/components/layout/page-header";
import { mapConversation } from "@/lib/mappers";
import { messages as mockMessages } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";
import type { ConversationSummary } from "@/types/domain";

async function getConversations(): Promise<ConversationSummary[]> {
  try {
    const workspace = await getCurrentUserWorkspace();
    if (!workspace) return getMockConversations();

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

    if (conversations.length === 0) return getMockConversations();
    return conversations.map(mapConversation);
  } catch {
    return getMockConversations();
  }
}

function getMockConversations(): ConversationSummary[] {
  return [
    {
      id: "mock-conversation",
      contactName: "Rafael",
      channelName: "WhatsApp",
      agentName: "Jéssica Helen",
      status: "open",
      lastMessage: mockMessages.at(-1)?.content ?? "Sem mensagens",
      messages: mockMessages
    }
  ];
}

export default async function ChatPage() {
  const conversations = await getConversations();

  return (
    <div className="space-y-6">
      <PageHeader title="Chat" subtitle="Modere atendimentos em tempo real e assuma conversas quando necessário" />
      <ChatLayout conversations={conversations} />
    </div>
  );
}
