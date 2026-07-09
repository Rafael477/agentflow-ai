import { LabelsClient, type LabelItem } from "@/components/labels/labels-client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const fallbackLabels: LabelItem[] = [
  { id: "novo-lead", name: "Novo lead", color: "#14B8A6" },
  { id: "cliente-fechado", name: "Cliente fechado", color: "#A855F7" },
  { id: "orcamento-enviado", name: "Orçamento enviado", color: "#F59E0B" }
];

async function getLabels(): Promise<LabelItem[]> {
  try {
    const workspace = await getCurrentUserWorkspace();
    if (!workspace) return fallbackLabels;

    const labels = await prisma.tag.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: "desc" }
    });

    return labels;
  } catch {
    return fallbackLabels;
  }
}

export default async function LabelsPage() {
  const labels = await getLabels();
  return <LabelsClient labels={labels} />;
}
