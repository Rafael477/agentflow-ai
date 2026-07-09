import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

export async function DELETE(_: Request, { params }: { params: { id: string; intentId: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const current = await prisma.agentIntent.findFirst({
    where: { id: params.intentId, agent: { id: params.id, workspaceId: workspace.id } }
  });
  if (!current) return NextResponse.json({ error: "Intenção não encontrada." }, { status: 404 });

  await prisma.agentIntent.delete({ where: { id: current.id } });
  return NextResponse.json({ ok: true });
}
