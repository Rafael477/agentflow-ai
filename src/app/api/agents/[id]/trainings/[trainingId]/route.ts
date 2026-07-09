import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

export async function DELETE(_: Request, { params }: { params: { id: string; trainingId: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const current = await prisma.agentTraining.findFirst({
    where: { id: params.trainingId, agent: { id: params.id, workspaceId: workspace.id } }
  });
  if (!current) return NextResponse.json({ error: "Treinamento não encontrado." }, { status: 404 });

  await prisma.agentTraining.delete({ where: { id: current.id } });
  return NextResponse.json({ ok: true });
}
