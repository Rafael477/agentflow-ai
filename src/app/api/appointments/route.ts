import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const appointmentSchema = z.object({
  contactId: z.string().optional(),
  agentId: z.string().optional(),
  service: z.string().min(2),
  date: z.coerce.date(),
  status: z.string().min(2).default("Agendado"),
  notes: z.string().optional()
});

export async function GET() {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const appointments = await prisma.appointment.findMany({
    where: { workspaceId: workspace.id },
    include: { contact: { select: { name: true } }, agent: { select: { name: true } } },
    orderBy: { date: "asc" }
  });

  return NextResponse.json({ appointments });
}

export async function POST(request: Request) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = appointmentSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const appointment = await prisma.appointment.create({
    data: {
      workspaceId: workspace.id,
      ...payload.data
    }
  });

  return NextResponse.json({ appointment }, { status: 201 });
}
