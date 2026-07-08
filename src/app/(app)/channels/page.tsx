import { ChannelsClient } from "@/components/channels/channels-client";
import { mapChannel } from "@/lib/mappers";
import { channels as mockChannels } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

async function getChannels() {
  try {
    const workspace = await getCurrentUserWorkspace();
    if (!workspace) return mockChannels;
    const channels = await prisma.channel.findMany({
      where: { workspaceId: workspace.id },
      include: { agent: { select: { name: true } } },
      orderBy: { createdAt: "desc" }
    });
    return channels.map(mapChannel);
  } catch {
    return mockChannels;
  }
}

export default async function ChannelsPage() {
  const channels = await getChannels();
  return <ChannelsClient channels={channels} />;
}
