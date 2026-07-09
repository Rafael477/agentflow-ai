import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const trainingSchema = z.object({
  title: z.string().min(2),
  type: z.string().min(2).default("Texto"),
  content: z.string().min(3),
  status: z.string().min(2).default("trained")
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const agent = await prisma.agent.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!agent) return NextResponse.json({ error: "Agente não encontrado." }, { status: 404 });

  const payload = trainingSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const training = await prisma.agentTraining.create({
    data: {
      agentId: agent.id,
      title: payload.data.title,
      type: payload.data.type,
      content: payload.data.content,
      status: payload.data.status
    }
  });

  return NextResponse.json({ training }, { status: 201 });
}
