import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const planSchema = z.object({
  name: z.enum(["Starter", "Pro", "Business"])
});

const planConfig = {
  Starter: { priceCents: 4900, agentsLimit: 1, channelsLimit: 1, credits: 1000 },
  Pro: { priceCents: 14900, agentsLimit: 5, channelsLimit: 5, credits: 10000 },
  Business: { priceCents: 39900, agentsLimit: null, channelsLimit: null, credits: 50000 }
} as const;

export async function POST(request: Request) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = planSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Plano inválido." }, { status: 400 });

  const config = planConfig[payload.data.name];
  const plan = await prisma.billingPlan.upsert({
    where: { name: payload.data.name },
    create: { name: payload.data.name, ...config },
    update: config
  });

  const updatedWorkspace = await prisma.workspace.update({
    where: { id: workspace.id },
    data: {
      billingPlanId: plan.id,
      credits: { increment: plan.credits }
    }
  });

  await prisma.creditTransaction.create({
    data: {
      workspaceId: workspace.id,
      amount: plan.credits,
      type: "purchase",
      description: `Créditos do plano ${plan.name}`
    }
  });

  return NextResponse.json({ plan, credits: updatedWorkspace.credits });
}
