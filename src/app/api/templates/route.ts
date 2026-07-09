import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const templateSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2).default("Utilidade"),
  language: z.string().min(2).default("pt_BR"),
  body: z.string().min(5),
  variables: z.array(z.string()).default([]),
  status: z.string().min(2).default("draft")
});

export async function GET() {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const templates = await prisma.whatsappTemplate.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ templates });
}

export async function POST(request: Request) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = templateSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const template = await prisma.whatsappTemplate.create({
    data: {
      workspaceId: workspace.id,
      ...payload.data
    }
  });

  return NextResponse.json({ template }, { status: 201 });
}
