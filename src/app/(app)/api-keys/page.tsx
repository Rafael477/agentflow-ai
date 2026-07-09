import { ApiKeysClient, type ApiKeyItem } from "@/components/api-keys/api-keys-client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

async function getApiKeys(): Promise<ApiKeyItem[]> {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return [];

  const keys = await prisma.apiKey.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" }
  });

  return keys.map((key) => ({
    id: key.id,
    name: key.name,
    maskedKey: `af_live_${key.id.slice(-10)}`,
    revokedAt: key.revokedAt?.toISOString() ?? null,
    createdAt: key.createdAt.toISOString()
  }));
}

export default async function ApiKeysPage() {
  const apiKeys = await getApiKeys();
  return <ApiKeysClient apiKeys={apiKeys} />;
}
