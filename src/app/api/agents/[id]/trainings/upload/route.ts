import { NextResponse } from "next/server";
import { parseTrainingFile, previewTrainingFile } from "@/services/training/file-training-service";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

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

  const mode = new URL(request.url).searchParams.get("mode");
  if (mode === "preview") {
    const previews = await Promise.all(files.map(previewTrainingFile));
    return NextResponse.json({ previews });
  }

  const parsedFiles = await Promise.all(files.map(parseTrainingFile));
  const trainings = await Promise.all(parsedFiles.map(async (file) => prisma.agentTraining.create({
    data: {
      agentId: agent.id,
      title: file.title,
      type: file.type,
      content: file.content,
      status: "trained",
      fileName: file.fileName,
      fileMimeType: file.fileMimeType,
      fileSizeBytes: file.fileSizeBytes,
      fileUrl: file.fileUrl,
      uploadedAt: file.uploadedAt
    }
  })));

  return NextResponse.json({ trainings }, { status: 201 });
}
