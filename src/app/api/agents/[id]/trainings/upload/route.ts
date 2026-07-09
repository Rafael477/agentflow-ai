import { NextResponse } from "next/server";
import { parseTrainingFile, parseTrainingFileFromPreview, previewTrainingFile, type TrainingFilePreview } from "@/services/training/file-training-service";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

function getPreviewKey(preview: Pick<TrainingFilePreview, "fileName" | "fileSizeBytes">) {
  return `${preview.fileName}:${preview.fileSizeBytes}`;
}

function parseConfirmedPreviews(value: FormDataEntryValue | null): Map<string, TrainingFilePreview> {
  if (typeof value !== "string") return new Map();

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return new Map();

    const previews = parsed.filter((item): item is TrainingFilePreview => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<TrainingFilePreview>;
      return (
        typeof candidate.title === "string" &&
        typeof candidate.type === "string" &&
        typeof candidate.content === "string" &&
        typeof candidate.fileName === "string" &&
        typeof candidate.fileMimeType === "string" &&
        typeof candidate.fileSizeBytes === "number"
      );
    });

    return new Map(previews.map((preview) => [getPreviewKey(preview), preview]));
  } catch {
    return new Map();
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const agent = await prisma.agent.findFirst({ where: { id: params.id, workspaceId: workspace.id } });
  if (!agent) return NextResponse.json({ error: "Agente não encontrado." }, { status: 404 });

  const formData = await request.formData();
  const files = formData.getAll("files").filter((item): item is File => item instanceof File);
  const confirmedPreviews = parseConfirmedPreviews(formData.get("previews"));

  if (files.length === 0) {
    return NextResponse.json({ error: "Envie ao menos um arquivo." }, { status: 400 });
  }

  const mode = new URL(request.url).searchParams.get("mode");
  if (mode === "preview") {
    const previews = await Promise.all(files.map(previewTrainingFile));
    return NextResponse.json({ previews });
  }

  const parsedFiles = await Promise.all(files.map((file) => {
    const preview = confirmedPreviews.get(getPreviewKey({ fileName: file.name, fileSizeBytes: file.size }));
    return preview ? parseTrainingFileFromPreview(file, preview) : parseTrainingFile(file);
  }));
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
