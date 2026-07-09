import { NextResponse } from "next/server";
import { z } from "zod";
import { mapChannel } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const createChannelSchema = z.object({
  name: z.string().min(2),
  type: z.string().min(2),
  agentId: z.string().optional(),
  department: z.string().default("Geral")
});

export async function GET() {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const channels = await prisma.channel.findMany({
    where: { workspaceId: workspace.id },
    include: { agent: { select: { name: true } }, config: { select: { settings: true } } },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ channels: channels.map(mapChannel) });
}

export async function POST(request: Request) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = createChannelSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const channel = await prisma.channel.create({
    data: {
      workspaceId: workspace.id,
      agentId: payload.data.agentId,
      name: payload.data.name,
      type: payload.data.type,
      department: payload.data.department,
      config: { create: { sessionId: `session-${Date.now()}`, qrCode: `agentflow-qr-${Date.now()}` } }
    },
    include: { agent: { select: { name: true } }, config: { select: { settings: true } } }
  });

  return NextResponse.json({ channel: mapChannel(channel) }, { status: 201 });
}
