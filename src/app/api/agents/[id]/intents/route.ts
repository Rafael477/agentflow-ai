import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const intentSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(3),
  triggers: z.array(z.string()).default([]),
  action: z.string().min(2),
  webhookUrl: z.string().url().optional().or(z.literal("")),
  method: z.string().optional()
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const agent = await prisma.agent.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!agent) return NextResponse.json({ error: "Agente não encontrado." }, { status: 404 });

  const payload = intentSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const intent = await prisma.agentIntent.create({
    data: {
      agentId: agent.id,
      name: payload.data.name,
      description: payload.data.description,
      triggers: payload.data.triggers,
      action: payload.data.action,
      webhookUrl: payload.data.webhookUrl || null,
      method: payload.data.method || "POST"
    }
  });

  return NextResponse.json({ intent }, { status: 201 });
}
