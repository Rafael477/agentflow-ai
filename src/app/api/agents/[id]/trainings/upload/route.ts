import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const MAX_UPLOAD_SIZE = 2 * 1024 * 1024;

function fileTypeLabel(file: File): string {
  if (file.type.startsWith("image/")) return "Imagem";
  if (file.type === "application/pdf") return "Documento PDF";
  if (file.type.includes("word")) return "Documento Word";
  return "Documento";
}

async function readFileContent(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_SIZE) {
    return `Arquivo recebido: ${file.name}\nTipo: ${file.type || "desconhecido"}\nTamanho: ${file.size} bytes\n\nO arquivo foi registrado, mas excede o limite de leitura direta de 2MB.`;
  }

  if (file.type.startsWith("text/") || file.name.endsWith(".md") || file.name.endsWith(".csv")) {
    return await file.text();
  }

  if (file.type.startsWith("image/")) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return `Imagem recebida para treinamento: ${file.name}\nTipo: ${file.type}\nTamanho: ${file.size} bytes\nData URL: data:${file.type};base64,${buffer.toString("base64")}`;
  }

  return `Documento recebido para treinamento: ${file.name}\nTipo: ${file.type || "desconhecido"}\nTamanho: ${file.size} bytes\n\nConteúdo binário armazenado como referência. Para extração completa de PDF/DOCX, conecte um parser dedicado.`;
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const agent = await prisma.agent.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!agent) return NextResponse.json({ error: "Agente não encontrado." }, { status: 404 });

  const formData = await request.formData();
  const files = formData.getAll("files").filter((item): item is File => item instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "Envie ao menos um arquivo." }, { status: 400 });
  }

  const trainings = await Promise.all(files.map(async (file) => prisma.agentTraining.create({
    data: {
      agentId: agent.id,
      title: file.name,
      type: fileTypeLabel(file),
      content: await readFileContent(file),
      status: "trained"
    }
  })));

  return NextResponse.json({ trainings }, { status: 201 });
}
