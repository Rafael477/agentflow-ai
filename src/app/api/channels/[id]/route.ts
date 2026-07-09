import { NextResponse } from "next/server";
import { z } from "zod";
import { mapChannel } from "@/lib/mappers";
import { mergeSlaThresholdsIntoSettings, normalizeSlaThresholds } from "@/lib/sla";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";
import type { Prisma } from "@prisma/client";

const updateChannelSchema = z.object({
  name: z.string().min(2).optional(),
  type: z.string().min(2).optional(),
  identifier: z.string().optional(),
  department: z.string().min(2).optional(),
  status: z.enum(["CONNECTED", "DISCONNECTED", "PENDING"]).optional(),
  slaThresholds: z.object({
    warning: z.coerce.number().int().min(1),
    urgent: z.coerce.number().int().min(2),
    critical: z.coerce.number().int().min(3)
  }).optional()
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = updateChannelSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const current = await prisma.channel.findFirst({
    where: { id: params.id, workspaceId: workspace.id },
    include: { config: { select: { settings: true } } }
  });
  if (!current) return NextResponse.json({ error: "Canal não encontrado." }, { status: 404 });

  const { slaThresholds, ...channelData } = payload.data;
  const normalizedSlaThresholds = slaThresholds ? normalizeSlaThresholds(slaThresholds) : undefined;

  const channel = await prisma.channel.update({
    where: { id: current.id },
    data: {
      ...channelData,
      config: normalizedSlaThresholds
        ? {
            upsert: {
              create: {
                settings: mergeSlaThresholdsIntoSettings(null, normalizedSlaThresholds) as Prisma.InputJsonObject
              },
              update: {
                settings: mergeSlaThresholdsIntoSettings(current.config?.settings, normalizedSlaThresholds) as Prisma.InputJsonObject
              }
            }
          }
        : undefined
    },
    include: { agent: { select: { name: true } }, config: { select: { settings: true } } }
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
