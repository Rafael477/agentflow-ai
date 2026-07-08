import { NextResponse } from "next/server";
import { z } from "zod";
import { mapAgent } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const updateAgentSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(3).optional(),
  model: z.string().min(2).optional(),
  behavior: z.string().min(10).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  communicationStyle: z.string().optional()
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const agent = await prisma.agent.findFirst({
    where: { id: params.id, workspaceId: workspace.id }
  });

  if (!agent) return NextResponse.json({ error: "Agente não encontrado." }, { status: 404 });
  return NextResponse.json({ agent: mapAgent(agent), behavior: agent.behavior });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = updateAgentSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const current = await prisma.agent.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!current) return NextResponse.json({ error: "Agente não encontrado." }, { status: 404 });

  const agent = await prisma.agent.update({
    where: { id: current.id },
    data: payload.data
  });

  return NextResponse.json({ agent: mapAgent(agent) });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const current = await prisma.agent.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!current) return NextResponse.json({ error: "Agente não encontrado." }, { status: 404 });

  await prisma.agent.delete({ where: { id: current.id } });
  return NextResponse.json({ ok: true });
}
