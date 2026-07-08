import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { agentBehavior } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("123456", 12);

  const plan = await prisma.billingPlan.upsert({
    where: { name: "Pro" },
    update: {},
    create: { name: "Pro", priceCents: 9700, agentsLimit: 5, channelsLimit: 5, credits: 10000 }
  });

  const user = await prisma.user.upsert({
    where: { email: "rafael@agentflow.local" },
    update: { password },
    create: { name: "Rafael", email: "rafael@agentflow.local", password }
  });

  const workspace =
    (await prisma.workspace.findFirst({
      where: { ownerId: user.id, name: "Meu Workspace" }
    })) ??
    (await prisma.workspace.create({
      data: { name: "Meu Workspace", ownerId: user.id, credits: 2494, billingPlanId: plan.id }
    }));

  const agent =
    (await prisma.agent.findFirst({
      where: { workspaceId: workspace.id, name: "Jéssica Helen" }
    })) ??
    (await prisma.agent.create({
      data: {
        workspaceId: workspace.id,
        name: "Jéssica Helen",
        description: "Vendedora em Estúdio JH Fotografia & Gráfica",
        model: "GPT-5 Mini",
        behavior: agentBehavior
      }
    }));

  const channel =
    (await prisma.channel.findFirst({
      where: { workspaceId: workspace.id, name: "Estúdio JH" }
    })) ??
    (await prisma.channel.create({
      data: {
        workspaceId: workspace.id,
        agentId: agent.id,
        name: "Estúdio JH",
        type: "WhatsApp",
        identifier: "Não definido",
        department: "Geral",
        config: { create: { sessionId: "mock-session", qrCode: "mock-qr" } }
      }
    }));

  const contact =
    (await prisma.contact.findFirst({
      where: { workspaceId: workspace.id, email: "rafael@email.com" }
    })) ??
    (await prisma.contact.create({
      data: { workspaceId: workspace.id, name: "Rafael", phone: "+55 11 99999-1000", email: "rafael@email.com", channel: "WhatsApp", status: "Em andamento" }
    }));

  const conversation =
    (await prisma.conversation.findFirst({
      where: { workspaceId: workspace.id, channelId: channel.id, agentId: agent.id, contactId: contact.id }
    })) ??
    (await prisma.conversation.create({
      data: { workspaceId: workspace.id, channelId: channel.id, agentId: agent.id, contactId: contact.id }
    }));

  const messageCount = await prisma.message.count({ where: { conversationId: conversation.id } });
  if (messageCount === 0) {
    await prisma.message.createMany({
      data: [
        { conversationId: conversation.id, sender: "CUSTOMER", content: "Oi boa noite" },
        { conversationId: conversation.id, sender: "AGENT", content: "Boa noite! Eu sou a Jéssica da JH Fotografia & Gráfica. Qual seu nome?" },
        { conversationId: conversation.id, sender: "CUSTOMER", content: "Rafael" },
        { conversationId: conversation.id, sender: "AGENT", content: "Prazer, Rafael! Qual serviço você precisa: ensaio, cobertura de evento ou material gráfico?" }
      ]
    });
  }

  const initialCreditTransaction = await prisma.creditTransaction.findFirst({
    where: { workspaceId: workspace.id, agentId: agent.id, description: "Respostas simuladas do agente Jéssica Helen" }
  });
  if (!initialCreditTransaction) {
    await prisma.creditTransaction.create({
      data: { workspaceId: workspace.id, agentId: agent.id, amount: -6, type: "usage", description: "Respostas simuladas do agente Jéssica Helen" }
    });
  }

  const member = await prisma.teamMember.findFirst({
    where: { workspaceId: workspace.id, email: "rafael@agentflow.local" }
  });
  if (!member) {
    await prisma.teamMember.create({
      data: { workspaceId: workspace.id, userId: user.id, name: "Rafael", email: "rafael@agentflow.local", role: "Dono", permission: "Dono", status: "active" }
    });
  }
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
