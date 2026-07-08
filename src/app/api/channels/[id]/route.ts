import { NextResponse } from "next/server";
import { z } from "zod";
import { mapChannel } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const updateChannelSchema = z.object({
  name: z.string().min(2).optional(),
  type: z.string().min(2).optional(),
  identifier: z.string().optional(),
  department: z.string().min(2).optional(),
  status: z.enum(["CONNECTED", "DISCONNECTED", "PENDING"]).optional()
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = updateChannelSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const current = await prisma.channel.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!current) return NextResponse.json({ error: "Canal não encontrado." }, { status: 404 });

  const channel = await prisma.channel.update({
    where: { id: current.id },
    data: payload.data,
    include: { agent: { select: { name: true } } }
  });

  return NextResponse.json({ channel: mapChannel(channel) });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const current = await prisma.channel.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!current) return NextResponse.json({ error: "Canal não encontrado." }, { status: 404 });

  await prisma.channel.delete({ where: { id: current.id } });
  return NextResponse.json({ ok: true });
}
