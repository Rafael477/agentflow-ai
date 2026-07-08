export interface TrainingSource {
  type: "text" | "website" | "video" | "document" | "knowledge-base";
  content: string;
}

export function normalizeTrainingSource(source: TrainingSource) {
  return {
    ...source,
    content: source.content.trim(),
    status: "queued" as const
  };
}
