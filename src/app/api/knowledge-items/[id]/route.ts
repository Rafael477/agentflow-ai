import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const itemSchema = z.object({
  category: z.string().min(2).optional(),
  question: z.string().min(2).optional(),
  answer: z.string().min(2).optional(),
  status: z.string().min(2).optional()
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const current = await prisma.knowledgeItem.findFirst({
    where: { id: params.id, knowledgeBase: { workspaceId: workspace.id } }
  });
  if (!current) return NextResponse.json({ error: "Item não encontrado." }, { status: 404 });

  const payload = itemSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const item = await prisma.knowledgeItem.update({
    where: { id: current.id },
    data: payload.data
  });

  return NextResponse.json({ item });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const current = await prisma.knowledgeItem.findFirst({
    where: { id: params.id, knowledgeBase: { workspaceId: workspace.id } }
  });
  if (!current) return NextResponse.json({ error: "Item não encontrado." }, { status: 404 });

  await prisma.knowledgeItem.delete({ where: { id: current.id } });
  return NextResponse.json({ ok: true });
}
