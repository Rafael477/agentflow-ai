import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const appointmentSchema = z.object({
  contactId: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  service: z.string().min(2).optional(),
  date: z.coerce.date().optional(),
  status: z.string().min(2).optional(),
  notes: z.string().optional().nullable()
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = appointmentSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const current = await prisma.appointment.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!current) return NextResponse.json({ error: "Agendamento não encontrado." }, { status: 404 });

  const appointment = await prisma.appointment.update({
    where: { id: current.id },
    data: payload.data
  });

  return NextResponse.json({ appointment });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const current = await prisma.appointment.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!current) return NextResponse.json({ error: "Agendamento não encontrado." }, { status: 404 });

  await prisma.appointment.delete({ where: { id: current.id } });
  return NextResponse.json({ ok: true });
}
