import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const creditSchema = z.object({
  amount: z.coerce.number().int().min(100).max(100000)
});

export async function POST(request: Request) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = creditSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Quantidade inválida." }, { status: 400 });

  const [updatedWorkspace] = await prisma.$transaction([
    prisma.workspace.update({
      where: { id: workspace.id },
      data: { credits: { increment: payload.data.amount } }
    }),
    prisma.creditTransaction.create({
      data: {
        workspaceId: workspace.id,
        amount: payload.data.amount,
        type: "purchase",
        description: "Compra manual de créditos"
      }
    })
  ]);

  return NextResponse.json({ credits: updatedWorkspace.credits });
}
