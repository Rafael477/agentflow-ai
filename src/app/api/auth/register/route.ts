import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { agentBehavior } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Informe um e-mail válido.").transform((email) => email.toLowerCase()),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres.")
});

export async function POST(request: Request) {
  const payload = registerSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: payload.error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: payload.data.email }
  });

  if (existingUser) {
    return NextResponse.json({ error: "Já existe uma conta com este e-mail." }, { status: 409 });
  }

  const password = await hash(payload.data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: payload.data.name,
      email: payload.data.email,
      password,
      workspaces: {
        create: {
          name: "Meu Workspace",
          credits: 2494,
          agents: {
            create: {
              name: "Jéssica Helen",
              description: "Vendedora em Estúdio JH Fotografia & Gráfica",
              model: "GPT-5 Mini",
              behavior: agentBehavior
            }
          }
        }
      }
    },
    include: { workspaces: true }
  });

  await prisma.teamMember.create({
    data: {
      workspaceId: user.workspaces[0].id,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: "Dono",
      permission: "Dono",
      status: "active"
    }
  });

  return NextResponse.json({ userId: user.id }, { status: 201 });
}
