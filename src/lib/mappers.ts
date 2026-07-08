import type { Agent as PrismaAgent, Channel as PrismaChannel, Contact as PrismaContact, Tag } from "@prisma/client";
import type { Agent, Channel, Contact } from "@/types/domain";

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
