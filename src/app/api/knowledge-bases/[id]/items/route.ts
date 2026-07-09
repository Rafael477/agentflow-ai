import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const itemSchema = z.object({
  category: z.string().min(2),
  question: z.string().min(2),
  answer: z.string().min(2),
  status: z.string().min(2).default("trained")
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const base = await prisma.knowledgeBase.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!base) return NextResponse.json({ error: "Base não encontrada." }, { status: 404 });

  const payload = itemSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const item = await prisma.knowledgeItem.create({
    data: {
      knowledgeBaseId: base.id,
      ...payload.data
    }
  });

  return NextResponse.json({ item }, { status: 201 });
}
