import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const templateSchema = z.object({
  name: z.string().min(2).optional(),
  category: z.string().min(2).optional(),
  language: z.string().min(2).optional(),
  body: z.string().min(5).optional(),
  variables: z.array(z.string()).optional(),
  status: z.string().min(2).optional()
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = templateSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const current = await prisma.whatsappTemplate.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!current) return NextResponse.json({ error: "Template não encontrado." }, { status: 404 });

  const template = await prisma.whatsappTemplate.update({
    where: { id: current.id },
    data: payload.data
  });

  return NextResponse.json({ template });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const current = await prisma.whatsappTemplate.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!current) return NextResponse.json({ error: "Template não encontrado." }, { status: 404 });

  await prisma.whatsappTemplate.delete({ where: { id: current.id } });
  return NextResponse.json({ ok: true });
}
