"use client";

import { Send, SlidersHorizontal, UserCheck, XCircle } from "lucide-react";
import { messages } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConversationList } from "@/components/chat/conversation-list";
import { MessageBubble } from "@/components/chat/message-bubble";

export function ChatLayout() {
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
        <ConversationList />
      </Card>
      <Card className="flex min-h-[660px] flex-col p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
          <div>
            <p className="font-semibold text-white">Rafael</p>
            <p className="text-xs text-slate-400">WhatsApp • Jéssica Helen</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary"><UserCheck className="mr-2 h-4 w-4" />Assumir atendimento</Button>
            <Button variant="ghost">Resolver</Button>
            <Button variant="danger"><XCircle className="mr-2 h-4 w-4" />Encerrar</Button>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-4">
          {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
        </div>
        <div className="border-t border-white/10 p-4">
          <div className="flex gap-2">
            <input className="min-w-0 flex-1 rounded-xl border border-white/10 bg-panel px-4 py-3 text-sm outline-none" placeholder="Digite uma mensagem..." />
            <Button><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
