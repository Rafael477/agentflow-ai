import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const current = await prisma.apiKey.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!current) return NextResponse.json({ error: "Chave não encontrada." }, { status: 404 });

  await prisma.apiKey.update({
    where: { id: current.id },
    data: { revokedAt: new Date() }
  });

  return NextResponse.json({ ok: true });
}
