import { NextResponse } from "next/server";
import { z } from "zod";
import { agentBehavior } from "@/lib/constants";
import { mapAgent } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const createAgentSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(3),
  model: z.string().min(2).default("GPT-5 Mini"),
  behavior: z.string().optional()
});

export async function GET() {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const agents = await prisma.agent.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ agents: agents.map(mapAgent) });
}

export async function POST(request: Request) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = createAgentSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const agent = await prisma.agent.create({
    data: {
      workspaceId: workspace.id,
      name: payload.data.name,
      description: payload.data.description,
      model: payload.data.model,
      behavior: payload.data.behavior ?? agentBehavior
    }
  });

  return NextResponse.json({ agent: mapAgent(agent) }, { status: 201 });
}
