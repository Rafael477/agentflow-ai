import { PrismaClient } from "@prisma/client";
import { agentBehavior } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  const plan = await prisma.billingPlan.upsert({
    where: { name: "Pro" },
    update: {},
    create: { name: "Pro", priceCents: 9700, agentsLimit: 5, channelsLimit: 5, credits: 10000 }
  });

  const user = await prisma.user.upsert({
    where: { email: "rafael@agentflow.local" },
    update: {},
    create: { name: "Rafael", email: "rafael@agentflow.local", password: "dev-only" }
  });

  const workspace = await prisma.workspace.create({
    data: { name: "Meu Workspace", ownerId: user.id, credits: 2494, billingPlanId: plan.id }
  });

  const agent = await prisma.agent.create({
    data: {
      workspaceId: workspace.id,
      name: "Jéssica Helen",
      description: "Vendedora em Estúdio JH Fotografia & Gráfica",
      model: "GPT-5 Mini",
      behavior: agentBehavior
    }
  });

  const channel = await prisma.channel.create({
    data: {
      workspaceId: workspace.id,
      agentId: agent.id,
      name: "Estúdio JH",
      type: "WhatsApp",
      identifier: "Não definido",
      department: "Geral",
      config: { create: { sessionId: "mock-session", qrCode: "mock-qr" } }
    }
  });

  const contact = await prisma.contact.create({
    data: { workspaceId: workspace.id, name: "Rafael", phone: "+55 11 99999-1000", email: "rafael@email.com", channel: "WhatsApp", status: "Em andamento" }
  });

  const conversation = await prisma.conversation.create({
    data: { workspaceId: workspace.id, channelId: channel.id, agentId: agent.id, contactId: contact.id }
  });

  await prisma.message.createMany({
    data: [
      { conversationId: conversation.id, sender: "CUSTOMER", content: "Oi boa noite" },
      { conversationId: conversation.id, sender: "AGENT", content: "Boa noite! Eu sou a Jéssica da JH Fotografia & Gráfica. Qual seu nome?" },
      { conversationId: conversation.id, sender: "CUSTOMER", content: "Rafael" },
      { conversationId: conversation.id, sender: "AGENT", content: "Prazer, Rafael! Qual serviço você precisa: ensaio, cobertura de evento ou material gráfico?" }
    ]
  });

  await prisma.creditTransaction.create({
    data: { workspaceId: workspace.id, agentId: agent.id, amount: -6, type: "usage", description: "Respostas simuladas do agente Jéssica Helen" }
  });

  await prisma.teamMember.create({
    data: { workspaceId: workspace.id, userId: user.id, name: "Rafael", email: "rafael@agentflow.local", role: "Dono", permission: "Dono", status: "active" }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
