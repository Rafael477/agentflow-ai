"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, SlidersHorizontal, UserCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConversationList } from "@/components/chat/conversation-list";
import { MessageBubble } from "@/components/chat/message-bubble";
import type { ConversationSummary, Message } from "@/types/domain";

type ConversationFilter = "all" | "waiting" | "in_progress" | "mine";

interface ConversationsResponse {
  conversations: ConversationSummary[];
}

interface SendMessageResponse {
  customerMessage: Message;
  agentMessage: Message;
  creditsUsed: number;
}

interface ApiErrorResponse {
  error?: string;
}

const statusLabels: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em andamento",
  resolved: "Resolvido",
  closed: "Encerrado"
};

const filterLabels: Record<ConversationFilter, string> = {
  all: "Todos",
  waiting: "Em espera",
  in_progress: "Andamento",
  mine: "Meus"
};

export function ChatLayout({
  conversations,
  currentUserName,
  currentUserEmail
}: {
  conversations: ConversationSummary[];
  currentUserName?: string | null;
  currentUserEmail?: string | null;
}) {
  const router = useRouter();
  const [liveConversations, setLiveConversations] = useState(conversations);
  const [selectedId, setSelectedId] = useState<string | undefined>(conversations[0]?.id);
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  const currentAssignees = useMemo(
    () => [currentUserName, currentUserEmail].filter((value): value is string => Boolean(value?.trim())),
    [currentUserEmail, currentUserName]
  );

  useEffect(() => {
    setLiveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    const eventSource = new EventSource("/api/chat/stream");

    eventSource.addEventListener("conversations", (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data) as ConversationsResponse;
      setError("");
      setLiveConversations(payload.conversations);
    });

    eventSource.addEventListener("error", () => {
      setError("Conexão em tempo real instável. Tentando reconectar...");
    });

    return () => eventSource.close();
  }, []);

  useEffect(() => {
    if (!selectedId && liveConversations[0]?.id) {
      setSelectedId(liveConversations[0].id);
    }
  }, [liveConversations, selectedId]);

  const filterCounts = useMemo(() => {
    const isMine = (conversation: ConversationSummary) => (
      Boolean(conversation.assignedTo && currentAssignees.includes(conversation.assignedTo))
    );

    return {
      all: liveConversations.length,
      waiting: liveConversations.filter((conversation) => conversation.status === "open").length,
      in_progress: liveConversations.filter((conversation) => conversation.status === "in_progress").length,
      mine: liveConversations.filter(isMine).length
    } satisfies Record<ConversationFilter, number>;
  }, [currentAssignees, liveConversations]);

  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return liveConversations.filter((conversation) => {
      const matchesFilter =
        activeFilter === "all"
          || (activeFilter === "waiting" && conversation.status === "open")
          || (activeFilter === "in_progress" && conversation.status === "in_progress")
          || (
            activeFilter === "mine"
            && Boolean(conversation.assignedTo && currentAssignees.includes(conversation.assignedTo))
          );

      if (!matchesFilter) return false;
      if (!normalizedSearch) return true;

      return [
        conversation.contactName,
        conversation.channelName,
        conversation.agentName,
        conversation.assignedTo,
        conversation.lastMessage,
        statusLabels[conversation.status] ?? conversation.status
      ].some((value) => value?.toLowerCase().includes(normalizedSearch));
    });
  }, [activeFilter, currentAssignees, liveConversations, searchQuery]);

  useEffect(() => {
    if (filteredConversations.length === 0) {
      setSelectedId(undefined);
      return;
    }

    if (!filteredConversations.some((conversation) => conversation.id === selectedId)) {
      setSelectedId(filteredConversations[0].id);
    }
  }, [filteredConversations, selectedId]);

  const selectedConversation = useMemo(
    () => filteredConversations.find((conversation) => conversation.id === selectedId) ?? filteredConversations[0],
    [filteredConversations, selectedId]
  );

  const messages = selectedConversation?.messages ?? [];

  function updateConversation(conversationId: string, updater: (conversation: ConversationSummary) => ConversationSummary) {
    setLiveConversations((current) => current.map((conversation) => (
      conversation.id === conversationId ? updater(conversation) : conversation
    )));
  }

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

    updateConversation(selectedConversation.id, (conversation) => ({
      ...conversation,
      lastMessage: content,
      messages: [...conversation.messages, optimisticMessage]
    }));

    const response = await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: selectedConversation.id, message: content })
    });

    const body = await response.json().catch(() => null) as SendMessageResponse | ApiErrorResponse | null;
    setLoading(false);

    if (!response.ok) {
      setError((body as ApiErrorResponse | null)?.error ?? "Não foi possível enviar a mensagem.");
      return;
    }

    const result = body as SendMessageResponse;
    updateConversation(selectedConversation.id, (conversation) => ({
      ...conversation,
      lastMessage: result.agentMessage.content,
      messages: [
        ...conversation.messages.filter((message) => message.id !== optimisticMessage.id),
        result.customerMessage,
        result.agentMessage
      ]
    }));
    router.refresh();
  }

  async function handleConversationAction(action: "assign" | "resolve" | "close") {
    if (!selectedConversation) return;

    setActionLoading(action);
    setError("");

    const response = await fetch(`/api/chat/conversations/${selectedConversation.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });

    const body = await response.json().catch(() => null) as ConversationsResponse | ApiErrorResponse | null;
    setActionLoading("");

    if (!response.ok) {
      setError((body as ApiErrorResponse | null)?.error ?? "Não foi possível atualizar a conversa.");
      return;
    }

    setLiveConversations((body as ConversationsResponse).conversations);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card className="min-h-[660px]">
        <div className="flex gap-2">
          <input
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-panel px-3 py-2 text-sm outline-none"
            placeholder="Buscar por nome, canal ou mensagem"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <Button variant="secondary" className="px-3"><SlidersHorizontal className="h-4 w-4" /></Button>
        </div>
        <div className="my-4 flex gap-2 overflow-x-auto">
          {(Object.keys(filterLabels) as ConversationFilter[]).map((filter) => (
            <button
              key={filter}
              className={activeFilter === filter ? "rounded-full bg-primary px-3 py-1 text-sm font-semibold text-slate-950" : "rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300"}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filterLabels[filter]} <span className={activeFilter === filter ? "text-slate-800" : "text-slate-500"}>{filterCounts[filter]}</span>
            </button>
          ))}
        </div>
        <ConversationList conversations={filteredConversations} selectedId={selectedConversation?.id} onSelect={setSelectedId} />
      </Card>
      <Card className="flex min-h-[660px] flex-col p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
          <div>
            <p className="font-semibold text-white">{selectedConversation?.contactName ?? "Moderação de atendimentos"}</p>
            <p className="text-xs text-slate-400">{selectedConversation ? `${selectedConversation.channelName} • ${selectedConversation.agentName}` : "Selecione uma conversa"}</p>
            {selectedConversation?.assignedTo ? <p className="mt-1 text-xs text-primary">Responsável: {selectedConversation.assignedTo}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" disabled={!selectedConversation || Boolean(actionLoading)} onClick={() => handleConversationAction("assign")}><UserCheck className="mr-2 h-4 w-4" />{actionLoading === "assign" ? "Assumindo..." : "Assumir atendimento"}</Button>
            <Button variant="ghost" disabled={!selectedConversation || Boolean(actionLoading)} onClick={() => handleConversationAction("resolve")}>{actionLoading === "resolve" ? "Resolvendo..." : "Resolver"}</Button>
            <Button variant="danger" disabled={!selectedConversation || Boolean(actionLoading)} onClick={() => handleConversationAction("close")}><XCircle className="mr-2 h-4 w-4" />{actionLoading === "close" ? "Encerrando..." : "Encerrar"}</Button>
          </div>
        </div>
        {selectedConversation ? (
          <div className="border-b border-white/10 px-4 py-2 text-xs text-slate-400">
            Status: <span className="font-semibold text-white">{statusLabels[selectedConversation.status] ?? selectedConversation.status}</span>
          </div>
        ) : null}
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
