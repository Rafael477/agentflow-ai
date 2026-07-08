export type AgentStatus = "active" | "inactive";
export type ChannelStatus = "connected" | "disconnected";
export type Permission = "Dono" | "Administrador" | "Atendente" | "Visualizador";

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
