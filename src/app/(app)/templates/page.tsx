import { TemplatesClient, type TemplateItem } from "@/components/templates/templates-client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

const fallbackTemplates: TemplateItem[] = [
  {
    id: "template-confirmacao",
    name: "Confirmação de agendamento",
    category: "Utilidade",
    language: "pt_BR",
    body: "Olá {{nome}}, seu agendamento foi confirmado para {{data}} às {{hora}}.",
    variables: ["nome", "data", "hora"],
    status: "approved"
  }
];

async function getTemplates(): Promise<TemplateItem[]> {
  try {
    const workspace = await getCurrentUserWorkspace();
    if (!workspace) return fallbackTemplates;

    const templates = await prisma.whatsappTemplate.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: "desc" }
    });

    return templates;
  } catch {
    return fallbackTemplates;
  }
}

export default async function TemplatesPage() {
  const templates = await getTemplates();
  return <TemplatesClient templates={templates} />;
}
