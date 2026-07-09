import { Bot, CalendarClock, CreditCard, KeyRound, MessageCircle, Settings, Tags, Users } from "lucide-react";
import { DEFAULT_SLA_THRESHOLDS } from "@/lib/sla";
import type { Agent, Channel, Contact, Message, Permission } from "@/types/domain";

export const workspace = {
  name: "Meu Workspace",
  credits: 2494,
  user: {
    name: "Rafael",
    email: "rafael@agentflow.local"
  }
};

export const agents: Agent[] = [
  {
    id: "jessica-helen",
    name: "Jéssica Helen",
    description: "Vendedora em Estúdio JH Fotografia & Gráfica",
    model: "GPT-5 Mini",
    status: "active",
    communication: "Descontraida"
  }
];

export const channels: Channel[] = [
  {
    id: "studio-jh",
    name: "Estúdio JH",
    type: "WhatsApp",
    agent: "Jéssica Helen",
    identifier: "Não definido",
    department: "Geral",
    status: "disconnected",
    slaThresholds: DEFAULT_SLA_THRESHOLDS
  }
];

export const contacts: Contact[] = [
  {
    id: "1",
    name: "Rafael",
    phone: "+55 11 99999-1000",
    email: "rafael@email.com",
    channel: "WhatsApp",
    tags: ["Novo lead", "Orçamento enviado"],
    lastService: "Hoje",
    status: "Em andamento"
  },
  {
    id: "2",
    name: "Marina Alves",
    phone: "+55 21 98888-2000",
    email: "marina@email.com",
    channel: "Instagram",
    tags: ["Cliente fechado"],
    lastService: "Ontem",
    status: "Resolvido"
  }
];

export const messages: Message[] = [
  { id: "m1", author: "Cliente", content: "Oi boa noite", time: "20:12" },
  {
    id: "m2",
    author: "Agente",
    content: "Boa noite! Eu sou a Jéssica da JH Fotografia & Gráfica. Qual seu nome?",
    time: "20:12"
  },
  { id: "m3", author: "Cliente", content: "Rafael", time: "20:13" },
  {
    id: "m4",
    author: "Agente",
    content: "Prazer, Rafael! Qual serviço você precisa: ensaio, cobertura de evento ou material gráfico?",
    time: "20:13"
  }
];

export const chartData = [
  { name: "Seg", creditos: 32, atendimentos: 18, contatos: 8, agendamentos: 2 },
  { name: "Ter", creditos: 44, atendimentos: 24, contatos: 12, agendamentos: 4 },
  { name: "Qua", creditos: 38, atendimentos: 21, contatos: 9, agendamentos: 3 },
  { name: "Qui", creditos: 61, atendimentos: 38, contatos: 17, agendamentos: 7 },
  { name: "Sex", creditos: 53, atendimentos: 31, contatos: 14, agendamentos: 5 }
];

export const team: Array<{ name: string; email: string; role: string; permission: Permission; status: string; lastAccess: string }> = [
  { name: "Rafael", email: "rafael@agentflow.local", role: "Dono", permission: "Dono", status: "Ativo", lastAccess: "Agora" },
  { name: "Camila Souza", email: "camila@agentflow.local", role: "Atendimento", permission: "Atendente", status: "Convidado", lastAccess: "Nunca" }
];

export const moreOptions = [
  { name: "Base de conhecimento", description: "Perguntas, respostas, categorias e arquivos.", href: "/knowledge-base", icon: Bot },
  { name: "Atendimentos", description: "Agenda e histórico de serviços.", href: "/appointments", icon: CalendarClock },
  { name: "Templates WhatsApp", description: "Modelos aprovados para campanhas.", href: "/templates", icon: MessageCircle },
  { name: "Etiquetas", description: "Classifique leads e clientes.", href: "/labels", icon: Tags },
  { name: "Chave de API", description: "Integre sistemas próprios.", href: "/api-keys", icon: KeyRound },
  { name: "Faturamento", description: "Planos, créditos e pagamentos.", href: "/billing", icon: CreditCard },
  { name: "Equipe", description: "Usuários, cargos e permissões.", href: "/team", icon: Users },
  { name: "Configurações", description: "Workspace, segurança e IA.", href: "/settings", icon: Settings }
];
