import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const baseSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional()
});

export async function POST(request: Request) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = baseSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const base = await prisma.knowledgeBase.create({
    data: {
      workspaceId: workspace.id,
      name: payload.data.name,
      description: payload.data.description
    }
  });

  return NextResponse.json({ base }, { status: 201 });
}
