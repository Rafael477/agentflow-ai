import { NextResponse } from "next/server";
import { z } from "zod";
import { mapContact } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const updateContactSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  channel: z.string().optional(),
  status: z.string().min(2).optional()
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = updateContactSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const current = await prisma.contact.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!current) return NextResponse.json({ error: "Contato não encontrado." }, { status: 404 });

  const contact = await prisma.contact.update({
    where: { id: current.id },
    data: payload.data,
    include: { tags: true }
  });

  return NextResponse.json({ contact: mapContact(contact) });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const current = await prisma.contact.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!current) return NextResponse.json({ error: "Contato não encontrado." }, { status: 404 });

  await prisma.contact.delete({ where: { id: current.id } });
  return NextResponse.json({ ok: true });
}
