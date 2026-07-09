import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const createApiKeySchema = z.object({
  name: z.string().min(2).default("Chave principal")
});

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

function createPlainKey(): string {
  return `af_live_${randomBytes(24).toString("hex")}`;
}

export async function GET() {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const keys = await prisma.apiKey.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({
    keys: keys.map((key) => ({
      id: key.id,
      name: key.name,
      maskedKey: `af_live_${key.id.slice(-10)}`,
      revokedAt: key.revokedAt,
      createdAt: key.createdAt
    }))
  });
}

export async function POST(request: Request) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = createApiKeySchema.safeParse(await request.json().catch(() => ({})));
  if (!payload.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const plainKey = createPlainKey();
  const apiKey = await prisma.apiKey.create({
    data: {
      workspaceId: workspace.id,
      name: payload.data.name,
      keyHash: hashKey(plainKey)
    }
  });

  return NextResponse.json({
    key: {
      id: apiKey.id,
      name: apiKey.name,
      plainKey,
      maskedKey: `af_live_${apiKey.id.slice(-10)}`,
      createdAt: apiKey.createdAt
    }
  }, { status: 201 });
}
