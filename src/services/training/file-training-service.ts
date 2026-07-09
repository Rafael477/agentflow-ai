import { put } from "@vercel/blob";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

const MAX_STORED_TEXT_LENGTH = 80_000;

export interface ParsedTrainingFile {
  title: string;
  type: string;
  content: string;
  fileName: string;
  fileMimeType: string;
  fileSizeBytes: number;
  fileUrl: string | null;
  uploadedAt: Date;
}

function getFileExtension(fileName: string): string {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts.at(-1) ?? "" : "";
}

function getTrainingType(file: File): string {
  const extension = getFileExtension(file.name);

  if (file.type.startsWith("image/")) return "Imagem";
  if (file.type === "application/pdf" || extension === "pdf") return "Documento PDF";
  if (["doc", "docx"].includes(extension) || file.type.includes("word")) return "Documento Word";
  if (["txt", "md", "csv"].includes(extension) || file.type.startsWith("text/")) return "Texto";

  return "Documento";
}

function trimStoredText(value: string): string {
  if (value.length <= MAX_STORED_TEXT_LENGTH) return value;
  return `${value.slice(0, MAX_STORED_TEXT_LENGTH)}\n\n[Conteúdo truncado para manter o banco leve. Consulte o arquivo original no storage externo.]`;
}

async function uploadToBlob(file: File, buffer: Buffer): Promise<string | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const pathname = `agent-trainings/${Date.now()}-${safeName}`;
  const blob = await put(pathname, buffer, {
    access: "public",
    contentType: file.type || "application/octet-stream",
    token: process.env.BLOB_READ_WRITE_TOKEN
  });

  return blob.url;
}

async function extractText(file: File, buffer: Buffer): Promise<string> {
  const extension = getFileExtension(file.name);

  if (file.type.startsWith("text/") || ["txt", "md", "csv"].includes(extension)) {
    return buffer.toString("utf8");
  }

  if (file.type === "application/pdf" || extension === "pdf") {
    const parser = new PDFParse({ data: buffer });
    try {
      const parsed = await parser.getText();
      return parsed.text.trim();
    } finally {
      await parser.destroy();
    }
  }

  if (extension === "docx" || file.type.includes("wordprocessingml")) {
    const parsed = await mammoth.extractRawText({ buffer });
    return parsed.value.trim();
  }

  if (extension === "doc") {
    return "Documento .doc recebido. Para extração fiel, converta para .docx ou PDF antes do upload.";
  }

  if (file.type.startsWith("image/")) {
    return "Imagem enviada para treinamento. OCR ainda não está habilitado; o arquivo original foi preservado no storage externo quando configurado.";
  }

  return "Arquivo recebido. Extração automática de texto não disponível para este tipo.";
}

export async function parseTrainingFile(file: File): Promise<ParsedTrainingFile> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const storageUrl = await uploadToBlob(file, buffer);
  const extractedText = await extractText(file, buffer);
  const storageLine = storageUrl
    ? `Arquivo original: ${storageUrl}`
    : "Arquivo original: não enviado ao storage externo porque BLOB_READ_WRITE_TOKEN não está configurado.";

  return {
    title: file.name,
    type: getTrainingType(file),
    content: trimStoredText([
      `Nome do arquivo: ${file.name}`,
      `Tipo MIME: ${file.type || "desconhecido"}`,
      `Tamanho: ${file.size} bytes`,
      storageLine,
      "",
      "Conteúdo extraído:",
      extractedText || "Nenhum texto foi extraído deste arquivo."
    ].join("\n")),
    fileName: file.name,
    fileMimeType: file.type || "application/octet-stream",
    fileSizeBytes: file.size,
    fileUrl: storageUrl,
    uploadedAt: new Date()
  };
}
