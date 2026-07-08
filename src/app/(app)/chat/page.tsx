import { ChatLayout } from "@/components/chat/chat-layout";
import { PageHeader } from "@/components/layout/page-header";

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Chat" subtitle="Modere atendimentos em tempo real e assuma conversas quando necessário" />
      <ChatLayout />
    </div>
  );
}
