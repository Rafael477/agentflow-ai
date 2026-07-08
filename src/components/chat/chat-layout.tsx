"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, SlidersHorizontal, UserCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConversationList } from "@/components/chat/conversation-list";
import { MessageBubble } from "@/components/chat/message-bubble";
import type { ConversationSummary, Message } from "@/types/domain";

export function ChatLayout({ conversations }: { conversations: ConversationSummary[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(conversations[0]?.id);
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0],
    [conversations, selectedId]
  );

  const messages = selectedConversation
    ? localMessages[selectedConversation.id] ?? selectedConversation.messages
    : [];

  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedConversation || !input.trim()) return;

    const content = input.trim();
    setInput("");
    setLoading(true);
    setError("");

    const optimisticMessage: Message = {
      id: `local-${Date.now()}`,
      author: "Cliente",
      content,
      time: new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date())
    };

    setLocalMessages((current) => ({
      ...current,
      [selectedConversation.id]: [...(current[selectedConversation.id] ?? selectedConversation.messages), optimisticMessage]
    }));

    const response = await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: selectedConversation.id, message: content })
    });

    const body = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(body?.error ?? "Não foi possível enviar a mensagem.");
      return;
    }

    setLocalMessages((current) => ({
      ...current,
      [selectedConversation.id]: [...(current[selectedConversation.id] ?? selectedConversation.messages), body.agentMessage]
    }));
    router.refresh();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card className="min-h-[660px]">
        <div className="flex gap-2">
          <input className="min-w-0 flex-1 rounded-lg border border-white/10 bg-panel px-3 py-2 text-sm outline-none" placeholder="Buscar por nome ou telefone" />
          <Button variant="secondary" className="px-3"><SlidersHorizontal className="h-4 w-4" /></Button>
        </div>
        <div className="my-4 flex gap-2 overflow-x-auto">
          {["Todos", "Em espera", "Andamento", "Meus"].map((tab, index) => (
            <button key={tab} className={index === 0 ? "rounded-full bg-primary px-3 py-1 text-sm font-semibold text-slate-950" : "rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300"}>{tab}</button>
          ))}
        </div>
        <ConversationList conversations={conversations} selectedId={selectedConversation?.id} onSelect={setSelectedId} />
      </Card>
      <Card className="flex min-h-[660px] flex-col p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
          <div>
            <p className="font-semibold text-white">{selectedConversation?.contactName ?? "Moderação de atendimentos"}</p>
            <p className="text-xs text-slate-400">{selectedConversation ? `${selectedConversation.channelName} • ${selectedConversation.agentName}` : "Selecione uma conversa"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary"><UserCheck className="mr-2 h-4 w-4" />Assumir atendimento</Button>
            <Button variant="ghost">Resolver</Button>
            <Button variant="danger"><XCircle className="mr-2 h-4 w-4" />Encerrar</Button>
          </div>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="text-lg font-semibold text-white">Moderação de atendimentos</p>
                <p className="mt-2 max-w-lg text-sm text-slate-400">Monitore em tempo real as respostas que seus agentes estão enviando aos seus clientes.</p>
              </div>
            </div>
          ) : null}
          {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
        </div>
        <div className="border-t border-white/10 p-4">
          {error ? <p className="mb-3 rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
          <form className="flex gap-2" onSubmit={handleSend}>
            <input
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-panel px-4 py-3 text-sm outline-none"
              placeholder={selectedConversation ? "Digite uma mensagem..." : "Selecione uma conversa para responder"}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={!selectedConversation || loading}
            />
            <Button disabled={!selectedConversation || loading || !input.trim()}>{loading ? "..." : <Send className="h-4 w-4" />}</Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
