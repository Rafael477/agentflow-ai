import { NextResponse } from "next/server";
import { z } from "zod";
import { mapContact } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const createContactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  channel: z.string().optional(),
  status: z.string().default("new")
});

export async function GET() {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const contacts = await prisma.contact.findMany({
    where: { workspaceId: workspace.id },
    include: { tags: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ contacts: contacts.map(mapContact) });
}

export async function POST(request: Request) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = createContactSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const contact = await prisma.contact.create({
    data: { workspaceId: workspace.id, ...payload.data },
    include: { tags: true }
  });

  return NextResponse.json({ contact: mapContact(contact) }, { status: 201 });
}
