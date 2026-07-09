import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const labelSchema = z.object({
  name: z.string().min(2).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional()
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = labelSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const current = await prisma.tag.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!current) return NextResponse.json({ error: "Etiqueta não encontrada." }, { status: 404 });

  const label = await prisma.tag.update({
    where: { id: current.id },
    data: payload.data
  });

  return NextResponse.json({ label });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const current = await prisma.tag.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!current) return NextResponse.json({ error: "Etiqueta não encontrada." }, { status: 404 });

  await prisma.tag.delete({ where: { id: current.id } });
  return NextResponse.json({ ok: true });
}
