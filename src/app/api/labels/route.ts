import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const labelSchema = z.object({
  name: z.string().min(2),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#14B8A6")
});

export async function GET() {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const labels = await prisma.tag.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ labels });
}

export async function POST(request: Request) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = labelSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const label = await prisma.tag.create({
    data: {
      workspaceId: workspace.id,
      name: payload.data.name,
      color: payload.data.color
    }
  });

  return NextResponse.json({ label }, { status: 201 });
}
