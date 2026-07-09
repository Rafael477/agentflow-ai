import { ChatLayout } from "@/components/chat/chat-layout";
import { PageHeader } from "@/components/layout/page-header";
import { getWorkspaceConversations } from "@/lib/chat-conversations";
import { messages as mockMessages } from "@/lib/mock-data";
import { getCurrentUserWorkspace } from "@/lib/workspace";
import type { ConversationSummary } from "@/types/domain";

async function getConversations(): Promise<ConversationSummary[]> {
  try {
    const workspace = await getCurrentUserWorkspace();
    if (!workspace) return getMockConversations();

    const conversations = await getWorkspaceConversations(workspace.id);
    if (conversations.length === 0) return getMockConversations();
    return conversations;
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
