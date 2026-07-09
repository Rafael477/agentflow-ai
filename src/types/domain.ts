export type AgentStatus = "active" | "inactive";
export type ChannelStatus = "connected" | "disconnected";
export type Permission = "Dono" | "Administrador" | "Atendente" | "Visualizador";

export interface SlaThresholds {
  warning: number;
  urgent: number;
  critical: number;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  status: AgentStatus;
  communication: "Formal" | "Normal" | "Descontraida";
}

export interface Channel {
  id: string;
  name: string;
  type: string;
  agent: string;
  identifier: string;
  department: string;
  status: ChannelStatus;
  slaThresholds: SlaThresholds;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  channel: string;
  tags: string[];
  lastService: string;
  status: string;
}

export interface Message {
  id: string;
  author: "Cliente" | "Agente";
  content: string;
  time: string;
}

export interface ConversationSummary {
  id: string;
  contactName: string;
  channelName: string;
  channelDepartment: string;
  agentName: string;
  status: string;
  assignedTo?: string;
  lastMessage: string;
  lastMessageAt?: string;
  updatedAt: string;
  slaThresholds: SlaThresholds;
  messages: Message[];
}
