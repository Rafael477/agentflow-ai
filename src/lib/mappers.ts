import type { Agent as PrismaAgent, Channel as PrismaChannel, Contact as PrismaContact, Conversation, Message as PrismaMessage, Tag } from "@prisma/client";
import type { Agent, Channel, Contact, ConversationSummary, Message } from "@/types/domain";

export function mapAgent(agent: PrismaAgent): Agent {
  return {
    id: agent.id,
    name: agent.name,
    description: agent.description,
    model: agent.model,
    status: agent.status === "ACTIVE" ? "active" : "inactive",
    communication: agent.communicationStyle === "Formal" || agent.communicationStyle === "Normal" ? agent.communicationStyle : "Descontraida"
  };
}

export function mapChannel(channel: PrismaChannel & { agent?: { name: string } | null }): Channel {
  return {
    id: channel.id,
    name: channel.name,
    type: channel.type,
    agent: channel.agent?.name ?? "Não definido",
    identifier: channel.identifier ?? "Não definido",
    department: channel.department,
    status: channel.status === "CONNECTED" ? "connected" : "disconnected"
  };
}

export function mapContact(contact: PrismaContact & { tags?: Tag[] }): Contact {
  return {
    id: contact.id,
    name: contact.name,
    phone: contact.phone ?? "Não informado",
    email: contact.email ?? "Não informado",
    channel: contact.channel ?? "Não definido",
    tags: contact.tags?.map((tag) => tag.name) ?? [],
    lastService: "Agora",
    status: contact.status
  };
}

export function mapMessage(message: PrismaMessage): Message {
  return {
    id: message.id,
    author: message.sender === "CUSTOMER" ? "Cliente" : "Agente",
    content: message.content,
    time: new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(message.createdAt)
  };
}

export function mapConversation(
  conversation: Conversation & {
    contact?: { name: string } | null;
    channel?: { name: string } | null;
    agent?: { name: string } | null;
    messages: PrismaMessage[];
  }
): ConversationSummary {
  const messages = conversation.messages.map(mapMessage);
  return {
    id: conversation.id,
    contactName: conversation.contact?.name ?? "Contato sem nome",
    channelName: conversation.channel?.name ?? "Canal não definido",
    agentName: conversation.agent?.name ?? "Agente não definido",
    status: conversation.status,
    assignedTo: conversation.assignedTo ?? undefined,
    lastMessage: messages.at(-1)?.content ?? "Sem mensagens ainda",
    messages
  };
}
